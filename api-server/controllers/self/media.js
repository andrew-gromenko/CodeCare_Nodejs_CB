const Media = require('../../services/Media');
const Bucket = require('../../services/Bucket');

module.exports = {
	list,
	create,
	update,
	remove,
};

function list(request, response) {
	const {id} = request._user;

	Media.list(id)
		.then(objects =>
			response.send({status: 200, data: objects}))
		.catch(error =>
			response.send({status: 400, error: {message: error.message}}));
}

function create(request, response) {
	const {id} = request._user;

	Bucket.uploader(request)
		.then();


	Media.create(request, id)
		.then(object =>
			response.send({status: 200, data: object}))
		.catch(error =>
			response.send({status: 400, error: {message: error.message}}));
}

function update(request, response) {
	const {
		body: {name},
		params: {media},
	} = request;

	Media.update(media, name)
		.then(object =>
			response.send({status: 200, data: object}))
		.catch(error =>
			response.send({status: 400, error: {message: error.message}}));
}

function remove(request, response) {
	const {
		params: {media},
	} = request;

	Media.remove(media)
		.then(object =>
			response.send({status: 200, data: object}))
		.catch(error =>
			response.send({status: 400, error: {message: error.message}}));
}