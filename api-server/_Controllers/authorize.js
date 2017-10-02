const User = require('../Bundles/User/services');

function authorize(request, response, next) {
	const {
		body: {username, email, password},
	} = request;

	User.create();
}

module.exports = authorize;