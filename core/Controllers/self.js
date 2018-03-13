const User = require('../Services/User');
const Token = require('../Services/Token');

/**
 * =======
 * Exports
 * =======
 */

module.exports = {
	self,
	update,
	remove,
	discard,
	relationships,
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

function self(request, response) {
	const { _user } = request;
	
	User.self(_user.id)
		.then(user => {
			return response.send(successHandler({ user }))
		})
		.catch(error =>
			response.send(errorHandler(error)));
}

function update(request, response) {
	const { _user, body, app } = request;

	const secret = app.get('SECRET_TOKEN');

	if (body.username !== _user.username) {
		User.profile(body.username).then(profile => {
      response.status(403).send({ status: 403 });
    }).catch(err => {
      User.update(_user.id, body)
        .then(user => {
        	const { id, email } = _user;
          response.send({ ...successHandler({ user }), token: Token.assign({ id, email, username: body.username }, secret)})
        })
        .catch(error =>
          response.send(errorHandler(error)));
    });
  } else {
    User.update(_user.id, body)
      .then(user => {
        response.send(successHandler({ user }))
      })
      .catch(error =>
        response.send(errorHandler(error)));
	}
}

function remove(request, response) {
	const { _user } = request;

	User.remove(_user.id)
		.then(user =>
			response.send(successHandler({ user, message: 'User was successfully removed' })))
		.catch(error =>
			response.send(errorHandler(error)));
}

function discard(request, response) {
	const { _user } = request;

	User.discard(_user.id)
		.then(user =>
			response.send(successHandler({ user, message: 'User was successfully restored' })))
		.catch(error =>
			response.send(errorHandler(error)));
}

function relationships(request, response) {
	const { _user } = request;

	User.followers(_user.id)
		.then(result =>
			response.send(successHandler(result)))
		.catch(error =>
			response.send(errorHandler(error)));
}