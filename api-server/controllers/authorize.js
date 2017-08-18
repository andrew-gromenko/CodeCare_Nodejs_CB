const User = require('../services/User');
const Token = require('../services/Token');

// TODO: Perhaps need to move logic into service
function authorize(request, response, next) {
	const {app, body} = request;
	const secret = app.get('SECRET_TOKEN');

	User.create(body)
		.then(user =>
			response.send({status: 200, data: {token: Token.assign(user, secret)}}))
		.catch(error => {
			let message = '';

			if (error.code === 11000) {
				message = 'User already exists';
			} else {
				message = error.message;
			}

			response.send({status: 400, error: {message: `Passed data to create new user not acceptable. ${message}`}});
		})
}

module.exports = authorize;