const User = require('../Models/User');
const Token = require('../Services/Token');
const jwt = require('jsonwebtoken');


function authenticate(request, response) {
	const {app, body} = request;
	const {token, email, password} = body;
	const secret = app.get('SECRET_TOKEN');

	let credentials = {};

	if (!token && !email && !password) {
		return response.send({status: 401, error: {message: 'Forbidden. Invalid credentials'}});
	}

	if (token) {
		const decoded = jwt.verify(token, secret);

		if (decoded.error) {
			return response.send({status: 401, error: {message: 'Forbidden. Invalid token'}});
		}

		credentials = decoded;

	} else if (email && password) {
		credentials = {email, password};
	} else {
		return response.send({status: 401, error: {message: 'Forbidden. Invalid credentials'}});
	}

	User.verify(credentials)
		.then(user =>
			response.send({status: 200, data: {token: Token.assign(user, secret)}}))
		.catch(error =>
			response.send({status: 400, error: {message: error.message}}));
}

module.exports = authenticate;