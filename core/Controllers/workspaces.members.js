const Workspace = require('../Models/Workspace');

/**
 * =======
 * Exports
 * =======
 */

module.exports = {
	list,
	push,
	pull,
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

function list(request, response) {
	const {
		params: {workspace},
	} = request;

	Workspace.participants(workspace)
		.then(document =>
			response.send(successHandler({workspace: document})))
		.catch(error =>
			response.send(errorHandler(error)));
}

function push(request, response) {
	const {
		body: {participant},
		params: {workspace},
	} = request;

	Workspace.participant('push', workspace, participant)
		.then(document =>
			response.send(successHandler({workspace: document})))
		.catch(error =>
			response.send(errorHandler(error)));
}

function pull(request, response) {
	const {
		body: {participant},
		params: {workspace},
	} = request;

	Workspace.participant('pull', workspace, participant)
		.then(document =>
			response.send(successHandler({workspace: document})))
		.catch(error =>
			response.send(errorHandler(error)));
}