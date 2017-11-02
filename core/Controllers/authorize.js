const User = require('../Models/User');
const Token = require('../Services/Token');

function authorize(request, response) {
	const {app, body} = request;
	const secret = app.get('SECRET_TOKEN');

	User.create(body)
		.then(user =>
			response.send({status: 200, data: {token: Token.assign(user, secret)}}))
		.catch(error =>
			response.send({
				status: 400,
				error: {
					message: `Passed data to create new user not acceptable. ${error.message}`},
			}));
}

module.exports = authorize;