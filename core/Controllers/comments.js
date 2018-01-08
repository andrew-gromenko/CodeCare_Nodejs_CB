const Argument = require('../Models/Argument');
const Comment = require('../Models/Comment');
const Notification = require('../Models/Notification')
const Workspace = require('../Models/Workspace')
const Socket = require('../Services/Socket');

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
	Workspace.one(workspace)
		.then(workspace => {
			return Comment.create({ issuer: _user.id, belongs_to, replied_to, body, workspace: workspace.id })
				.then(comment => {
					console.log('comment', comment)
					return Argument.addComment(belongs_to, comment)
						.then(argument => {
							if (replied_to) {
								Notification.create({
									issuer: comment.issuer,
									recipient: comment.replied_to.issuer,
									type: 'reply',
									data: {
										id: workspace.id,
										title: argument.body
									}
								}).then(notification => {
									console.log('NOTIFICATION', notification)
									Socket.notify(notification)
								})
							}
							Socket.updateArgueComments(workspace, _user.id)
							return response.send(successHandler({ comment }))

							// if ((workspace.creator._id != replied_to) && (_user.id != workspace.creator._id)) {
							// 	const body = belongs_to === workspace.creator._id ?
							// 		{
							// 			issuer: _user.id,
							// 			recipient: workspace.creator._id,
							// 			type: 'argues-comment',
							// 			data: {
							// 				id: workspace.id,
							// 				title: argue.body
							// 			}
							// 		} :
							// 		{
							// 			issuer: _user.id,
							// 			recipient: workspace.creator._id,
							// 			type: 'comment',
							// 			data: {
							// 				id: workspace.id,
							// 				title: argue.body
							// 			}
							// 		}
							// 	Notification.create({
							// 		issuer: _user.id,
							// 		recipient: workspace.creator._id,
							// 		type: 'comment',
							// 		data: {
							// 			id: workspace.id,
							// 			title: argue.body
							// 		}
							// 	}).then(notification => {
							// 		Socket.notify(notification)
							// 		Socket.updateArgueComments(workspace, _user.id)
							// 		return response.send(successHandler({ comment }))
							// 	})
							// } else {

							// }
						})
				})
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