const User = require('../services/User');
const Notification = require('../services/Notification');
const Relationships = require('../services/Relationships');

function list(request, response, next) {
	User.list()
		.then(users =>
			response.send({status: 200, data: {users}}))
		.catch(error =>
			response.send({status: 400, error: {message: error.message}}));
}

function relationships(request, response, next) {
	const {user} = request.params;

	Relationships.list(user)
		.then(contacts =>
			response.send({status: 200, data: {contacts}}))
		.catch(error =>
			response.send({status: 400, error: {message: error.message}}));
}

function relationship(request, response, next) {
	const {_user, body, params} = request;

	switch (body.action) {
		case 'accept': {
			Relationships.follow(_user.id, params.user)
				.then(user => {
					// TODO: Should be Notification.accept
					return Notification.follow(_user.id, params.user)
						.then(() => response.send({status: 200, data: {user}}));
				})
				.catch(error =>
					response.send({status: 400, error: {message: error.message}}));

			break;
		}

		case 'follow': {
			Relationships.follow(_user.id, params.user)
				.then(user => {
					return Notification.follow(_user.id, params.user)
						.then(() => response.send({status: 200, data: {user}}));
				})
				.catch(error =>
					response.send({status: 400, error: {message: error.message}}));

			break;
		}

		case 'unfollow': {
			Relationships.unfollow(_user.id, params.user)
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

function profile(request, response, next) {
	const {params} = request;

	User.publicProfile(params.user)
		.then(user =>
			response.send({status: 200, data: {user}}))
		.catch(error =>
			response.send({status: 400, error: {message: error.message}}));
}

function find(request, response, next) {
}

module.exports = {
	list,
	find,
	profile,
	relationship,
	relationships,
};