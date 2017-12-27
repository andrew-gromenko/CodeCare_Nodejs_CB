const User = require('../Services/User');

/**
 * =======
 * Exports
 * =======
 */

module.exports = {
	list,
	profile,
	projects,
	events,
	relationship,
	relationships,
	view
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
	const { query } = request;

	User.list(query)
		.then(result =>
			response.send(successHandler(result)))
		.catch(error =>
			response.send(errorHandler(error)));
}

function profile(request, response) {
	const { params: { username } } = request;

	User.profile(username)
		.then(user =>
			response.send(successHandler({ user })))
		.catch(error =>
			response.send(errorHandler(error)));
}

function events(request, response) {
	const { params: { user } } = request;

	User.events(user)
		.then(result =>
			response.send(successHandler(result)))
		.catch(error =>
			response.send(errorHandler(error)));
}

function projects(request, response) {
	const { params: { user } } = request;

	User.projects(user)
		.then(result =>
			response.send(successHandler(result)))
		.catch(error =>
			response.send(errorHandler(error)));
}

function relationship(request, response) {
	const {
		_user,
		body,
		params,
	} = request;

	switch (body.action) {
		case 'accept': {
			User.follow(_user.id, params.user)
				.then(user =>
					response.send(successHandler({ user })))
				.catch(error =>
					response.send(errorHandler(error)));

			break;
		}

		case 'follow': {
			User.follow(_user.id, params.user)
				.then(user =>
					response.send(successHandler({ user })))
				.catch(error =>
					response.send(errorHandler(error)));

			break;
		}

		case 'unfollow': {
			User.unfollow(_user.id, params.user)
				.then(user =>
					response.send(successHandler({ user })))
				.catch(error =>
					response.send(errorHandler(error)));

			break;
		}

		default: {
			const error = new Error('Wrong value of action. Should be one of ["follow", "unfollow", "accept"]');

			response.send(errorHandler(error));

			break;
		}
	}
}

function relationships(request, response) {
	const { params: { user } } = request;

	User
		.followers(user)
		.then(result =>
			response.send(successHandler(result)))
		.catch(error =>
			response.send(errorHandler(error)));
}

function view(request, response) {
	const { body: { id } } = request;
	User.view(id)
		.then(result =>
			response.send(successHandler(result)))
		.catch(error =>
			response.send(errorHandler(error)));
}