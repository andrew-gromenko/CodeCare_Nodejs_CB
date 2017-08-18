const repo = require('../repository');
const User = require('../services/User');
const Chat = require('../services/Chat');
const Notification = require('../services/Notification');

function self(request, response, next) {
	const {id, email, username} = request._user;

	User.self(id)
		.then(user =>
			response.send({status: 200, data: {user}}))
		.catch(error =>
			response.send({status: 400, error: {message: error.message}}));
}

function list(request, response, next) {
	User.list()
		.then(users =>
			response.send({status: 200, data: {users}}))
		.catch(error =>
			response.send({status: 400, error: {message: error.message}}));
}

function relationship(request, response, next) {
	const {_user, body, params} = request;

	switch (body.action) {
		case 'accept':
		case 'follow': {
			User.follow(_user.id, params.user)
				.then(user => {
					return Notification.follow(_user.id, params.user)
						.then(() => response.send({status: 200, data: {user}}));
				})
				.catch(error => {
					console.log(error);
					response.send({status: 400, error: {message: error.message}})
				});

			break;
		}

		case 'unfollow': {
			User.unfollow(_user.id, params.user)
				.then(user =>
					response.send({status: 200, data: {user}}))
				.catch(error =>
					response.send({status: 400, error: {message: error.message}}));

			break;
		}

		default: {
			response.send({
				status: 400,
				error: {message: 'Wrong value of action. Should be one of ["follow", "unfollow", "accept"]'}
			});
			break;
		}
	}
}

function relationships(request, response, next) {

}

function notifications(request, response, next) {
	const {_user} = request;

	return repo.notification.find({recipient: _user.id})
		.then(notifications =>
			response.send({status: 200, data: {notifications}}))
		.catch(error =>
			response.send({status: 400, error: {message: error.message}}));
}

function notificationsUpdate(request, response, next) {
	const {_user, params} = request;

	if (params.id === 'all') {
		return Notification.pristineAll(_user.id)
			.then(notifications =>
				response.send({status: 200, data: {notifications}}))
			.catch(error =>
				response.send({status: 400, error: {message: error.message}}));
	}

	return Notification.pristine(params.id)
		.then(notifications =>
			response.send({status: 200, data: {notifications}}))
		.catch(error =>
			response.send({status: 400, error: {message: error.message}}));
}

function chat(request, response, next) {
	const {_user, params} = request;

	Chat.findById(params.id)
		.then(chat =>
			response.send({status: 200, data: {chat}}))
		.catch(error =>
			response.send({status: 400, error: {message: error.message}}));
}

function chats(request, response, next) {
	const {_user} = request;

	Chat.list(_user.id)
		.then(chats =>
			response.send({status: 200, data: {chats}}))
		.catch(error =>
			response.send({status: 400, error: {message: error.message}}));
}

function chatCrate(request, response, next) {
	const {_user, body} = request;

	Chat.find([_user.id, body.participants])
		.then(chat => {

			if (chat.length === 0) {
				return Chat.create([_user.id, body.participants]);
			}

			return chat;
		})
		.then(chat =>
			response.send({status: 200, data: {chat}}))
		.catch(error =>
			response.send({status: 400, error: {message: error.message}}));
}

function find(request, response, next) {
}

function remove(request, response, next) {
}

function update(request, response, next) {
}

module.exports = {
	self,
	list,
	find,
	remove,
	update,
	relationship,
	relationships,
	notifications,
	notificationsUpdate,
	chat,
	chats,
	chatCrate,
};