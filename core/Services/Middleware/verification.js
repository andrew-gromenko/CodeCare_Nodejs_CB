const jwt = require('jsonwebtoken');

module.exports = verification;

function exist(string = '') {
	// Split string which should exist in headers Authorization
	// as Bearer <TOKEN>
	const authorization = string.split(' ');
	const type = authorization[0];
	const token = authorization[1];

	// If we get array less then 2
	// that mean we received wrong Authorization headers
	if (authorization.length !== 2) {
		throw new Error('Token is not provided');
	}

	// Type should be Bearer
	if (type !== 'Bearer') {
		throw new Error('Authorization type is not valid');
	}

	// Token should be provided
	if (!token) {
		throw new Error('Token is required');
	}

	return token;
}

function verification(request, response, next) {
	const {headers, app} = request;
	const secret = app.get('SECRET_TOKEN');

	try {
		const token = exist(headers['authorization']);

		request._user = jwt.verify(token, secret);

	} catch (error) {
		return response.send({status: 403, error: error.message});
	}

	next();
}