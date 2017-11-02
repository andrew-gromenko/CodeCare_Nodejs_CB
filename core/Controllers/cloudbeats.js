const Media = require('../Models/Media');
const Bucket = require('../Services/Bucket');

/**
 * =======
 * Exports
 * =======
 */

module.exports = {
	list,
	create,
};

/**
 * =======
 * Helpers
 * =======
 */

function errorHandler(error) {
	return {
		status: 400,
		error: {
			message: error.message,
		},
	};
}

function successHandler(data) {
	return {
		status: 200,
		data,
	};
}

/**
 * =======
 * Core
 * =======
 */

function list(request, response) {
	const {_user} = request;

	Media.list(_user.id)
		.then(medias =>
			response.send(successHandler({medias})))
		.catch(error =>
			response.send(errorHandler(error)));
}

function create(request, response) {
	const {_user} = request;

	// TODO: depend on file type should generate different entity
	Bucket.uploader(request)
		.then((result) => {
			const {file: {size, type, file_name, key, src, bucket}} = result;
			const [file_type, extension] = type.split('/');

			return Media.create({
				owner: _user.id,
				size,
				type: file_type,
				file_name,
				extension,
				entity: {
					standard: {
						src,
						key,
						bucket,
					},
				}
			})
				.then(media => response.send(successHandler({media})))
		})
		.catch(error =>
			response.send(errorHandler(error)));
}