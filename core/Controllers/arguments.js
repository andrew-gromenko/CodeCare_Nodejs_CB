const Argument = require('../Models/Argument');
const Socket = require('../Services/Socket/index');

/**
 * =======
 * Exports
 * =======
 */

module.exports = {
	one,
	list,

	create,
	update,
	remove,

	react,
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
	const {
		params: { argue },
	} = request;

	// TODO: Should return Argument with: 50 comments > 5 replies
	Argument.one(argue)
		.then(argue =>
			response.send(successHandler({ argue })))
		.catch(error =>
			response.send(errorHandler(error)));
}

function list(request, response) {
	const {
		params: { workspace },
	} = request;

	// TODO: should can take `query` and return list base on it (filter/sort/limit)
	// TODO: should can return list of media files (select)
	Argument.list(workspace)
		.then(argues =>
			response.send(successHandler({ workspace, argues })))
		.catch(error =>
			response.send(errorHandler(error)));
}

function create(request, response) {
	const {
		_user,
		body: { body, media },
		params: { workspace },
	} = request;
	Argument.create({ issuer: _user.id, workspace, body, media })
		.then(argue => {
			Socket.updateArguesList(workspace, _user.id)
			response.send(successHandler({ argue }))
		}).catch(error =>
			response.send(errorHandler(error)));
}

function update(request, response) {
	const {
		_user,
		body: { body, media, workspace },
		params: { argue },
	} = request;

	Argument.edit(argue, { body, media })
		.then(argue => {
			Socket.updateArguesList(workspace, _user.id)
			response.send(successHandler({ argue }))
		})
		.catch(error =>
			response.send(errorHandler(error)));
}

function remove(request, response) {
	const {
		_user,
		params: { argue },
	} = request;

	// TODO: should remove all comments
	Argument.remove(argue)
		.then(argue => {
			Socket.updateArguesList(argue.workspace, _user.id)
			return response.send(successHandler({ argue }))
		})
		.catch(error =>
			response.send(errorHandler(error)));
}

function react(request, response) {
	const {
		_user,
		body: { workspace, type, value }, // Action should be `{type: 'like/vote', value: 1/-1}`
		params: { argue },
	} = request;

	// TODO: Should send notification to creator of this argument if like
	// TODO: Should send notification to all participants if vote
	Argument.react(argue, { issuer: _user.id, type, value })
		.then(argue => {
			Socket.updateArguesList(argue.workspace, _user.id)
			return response.send(successHandler({ argue }))
		})
		.catch(error =>
			response.send(errorHandler(error)));
}