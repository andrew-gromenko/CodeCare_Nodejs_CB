const Relationships = require('../../services/Relationships');

function list(request, response, next) {
	const {id} = request._user;

	Relationships.list(id)
		.then(contacts =>
			response.send({status: 200, data: contacts}))
		.catch(error =>
			response.send({status: 400, error: {message: error.message}}));
}

module.exports = {
	list,
};