const jwt = require('jsonwebtoken');

function assign({id, email, username}, secret, options = {}) {
	const params = {
		expiresIn: '1y',
		...options,
	};

	return jwt.sign({
		id,
		email,
		username,
	}, secret, params);
}

module.exports = {
	assign,
};