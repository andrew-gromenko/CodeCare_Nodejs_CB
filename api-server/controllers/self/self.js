const User = require('../../services/User');

function self(request, response, next) {
	const {id, email, username} = request._user;

	User.self(id)
		.then(user =>
			response.send({status: 200, data: {user}}))
		.catch(error =>
			response.send({status: 400, error: {message: error.message}}));
}

// update
// remove
// ...

module.exports = {
	self,
};