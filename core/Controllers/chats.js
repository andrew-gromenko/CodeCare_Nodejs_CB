const Chat = require('../Services/Chat');

/**
 * =======
 * Exports
 * =======
 */

module.exports = {
	one,
	list,

	create,
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

function one(request, response) {
	const {params: {room}} = request;

	Chat.one(room)
		.then(chat =>
			response.send(successHandler({chat})))
		.catch(error =>
			response.send(errorHandler(error)));
}

function list(request, response) {
	const {_user} = request;

	Chat.list(_user.id)
		.then(chats =>
			response.send(successHandler({chats})))
		.catch(error =>
			response.send(errorHandler(error)));
}

function create(request, response) {
	const {_user, body: {participant}} = request;
	const participants = [_user.id];

	if (!participant) {
		participants.push(_user.id);
	} else {
		participants.push(participant);
	}

	Chat.find(participants)
		.then(room => {
			if (!room) return Chat.create(participants);

			return room;
		})
		.then(chat =>
			response.send(successHandler({chat})))
		.catch(error =>
			response.send(errorHandler(error)));

}

// TODO: implement remove/discard room logic