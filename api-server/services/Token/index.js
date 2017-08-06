const jwt = require('jsonwebtoken');

function exist(string) {
	// Split string which should exist in headers Authorization
	// as Bearer <TOKEN>
	const authorization = string.split(' ');
	const type = authorization[0];
	const token = authorization[1];

	// If we get array less then 2
	// that mean we received wrong Authorization headers
	if (authorization.length !== 2) {
		return {
			error: {
				message: 'Token is not provided',
			}
		};
	}

	// Type should be Bearer
	if (type !== 'Bearer') {
		return {
			error: {
				message: 'Authorization type is not valid',
			}
		}
	}

	// Token should be provided
	if (!token) {
		return {
			error: {
				message: 'Token is required',
			}
		};
	}

	return {token};
}

// TODO: implement options!
function verify(token, secret, options = {}) {
	try {
		return jwt.verify(token, secret);
	} catch (error) {
		return {
			error: {
				message: 'Invalid signature',
			}
		}
	}
}

function assign({id, email, username}, secret) {
	return jwt.sign({
		id,
		email,
		username,
	}, secret, {expiresIn: '1y'});
}

module.exports = {
	assign,
	exist,
	verify,
};