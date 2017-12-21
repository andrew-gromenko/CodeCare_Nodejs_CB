const Argument = require('../Models/Argument');
const Comment = require('../Models/Comment');
const Socket = require('../Services/Socket')

const {
	exist,
	prettify,
	byAction,
} = require('../Models/utils');

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
			params: { comment },
	} = request;

	Comment.one(comment)
		.then(comment =>
			response.send(successHandler({ comment })))
		.catch(error =>
			response.send(errorHandler(error)));
}

function list(request, response) {
	const {
			params: { id },
	} = request;

	// TODO: should can take `query` and return list base on it (filter/sort/limit)
	// TODO: should can return list of media files (select)
	Comment.list(id)
		.then(comments =>
			response.send(successHandler({ id, comments })))
		.catch(error =>
			response.send(errorHandler(error)));
}

function create(request, response) {
	const {
			_user,
		body: { body, replied_to, belongs_to, workspace },
	} = request;
	Comment.create({ issuer: _user.id, belongs_to, replied_to, body, workspace })
		.then(comment => {
			Argument.addComment(belongs_to, comment)
				.then(_ => {
					Socket.updateArgueComments(workspace, _user.id)
					return response.send(successHandler({ comment })
					)
				});
		})
		.catch(error =>
			response.send(errorHandler(error)));
}

function update(request, response) {
	const {
			body: { body, media },
		params: { comment },
	} = request;

	Comment.edit(comment, { body, media })
		.then(comment =>
			response.send(successHandler({ comment })))
		.catch(error =>
			response.send(errorHandler(error)));
}

function remove(request, response) {
	const {
			_user,
		params: { comment },
		body
	} = request;

	// TODO: should remove all comments
	Comment.remove(body)
		.then(comment => {
			Comment.list(body.argue)
				.then(comments => {
					Argument.removeComment(body.argue, comments)
						.then(_ => {
							console.log('~~~~~~~~~~~~~~~~~~~~~~!!!!!!!!!!!!!!!!!!!!123!!!!!!!!!!!!!!!!!!!!~~~~~~~~~~~~~~~~~~~~~')
							Socket.updateArgueComments(body.workspace, _user.id)
							return response.send(successHandler({ comment }))
						})
				})
		})
		.catch(error =>
			response.send(errorHandler(error)));
}

function react(request, response) {
	const {
			_user,
		body: { type, value }, // Action should be `{type: 'like/vote', value: 1/-1}`
		params: { comment },
	} = request;

	// TODO: Should send notification to creator of this argument if like
	// TODO: Should send notification to all participants if vote
	Comment.react(comment, { issuer: _user.id, type, value })
		.then(comment =>
			response.send(successHandler({ comment })))
		.catch(error =>
			response.send(errorHandler(error)));
}