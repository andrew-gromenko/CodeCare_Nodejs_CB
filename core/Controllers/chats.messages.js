const Message = require('../Services/Chat/messages');

/**
 * =======
 * Exports
 * =======
 */

module.exports = {
	list,

	create,
	remove,
	edit,

	pristine,
};

/**
 * =======
 * Helpers
 * =======
 */

function errorHandler(error) {
	return {
		status: 400,
		error: {
			message: error.message,
		},
	};
}

function successHandler(data) {
	return {
		status: 200,
		data,
	};
}

/**
 * =======
 * Core
 * =======
 */

// TODO: should support query
function list(request, response) {
	const {params: {room}, query} = request;

	Message
		.list(room, query)
		.then(messages =>
			response.send(successHandler({messages})))
		.catch(error =>
			response.send(errorHandler(error)));
}

function create(request, response) {
	const {_user, params: {room}, body} = request;

	Message
		.create(room, _user.id, body)
		.then(message =>
			response.send(successHandler({message})))
		.catch(error =>
			response.send(errorHandler(error)));
}

function remove(request, response) {
	const {_user, params: {room}, body: {messages}} = request;

	Message
		.remove(room, _user.id, messages)
		.then(messages =>
			response.send(successHandler({messages})))
		.catch(error =>
			response.send(errorHandler(error)));
}

function edit(request, response) {
	const {_user, params: {room, message}, body} = request;

	Message
		.edit(room, _user.id, message, body)
		.then(message =>
			response.send(successHandler({message})))
		.catch(error =>
			response.send(errorHandler(error)));
}

function pristine(request, response) {
	const {_user, params: {room}, body: {messages}} = request;

	Message
		.pristine(room, _user.id, messages)
		.then(messages =>
			response.send(successHandler({messages})))
		.catch(error =>
			response.send(errorHandler(error)));
}