const Token = require('../services/Token');

function checkToken(request, response, next) {
	const {headers} = request;
	const secret = request.app.get('SECRET_TOKEN');
	let token = '';

	if (headers['authorization']) {
		const result = Token.exist(headers['authorization']);

		if (result.error) {
			return response.send({
				status: 403,
				error: result.error
			})
		}

		token = result.token;
	} else {
		return response.send({
			status: 403,
			error: {
				message: 'Forbidden. Token should be provided',
			}
		})
	}

	const verified = Token.verify(token, secret);

	if (verified.error) {
		return response.send({
			status: 403,
			error: {
				message: 'Forbidden. Invalid token',
			}
		});
	}

	request._user = verified;

	next();
}

module.exports = checkToken;