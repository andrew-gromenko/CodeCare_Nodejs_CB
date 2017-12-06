const Media = require('../Models/Media');
const Bucket = require('../Services/Bucket');
const User = require('../Models/User');
/**
 * =======
 * Exports
 * =======
 */

module.exports = {
	list,
	create,
	update,
	remove

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

// TODO: should support uploading small image
function imageHandler(file) {
	const { key, src, bucket } = file;

	return {
		small: {
			src,
			key,
			bucket,
		},
		standard: {
			src,
			key,
			bucket,
		},
	};
}

// TODO: should support `samples`
function audioHandler(file) {
	const { key, src, bucket } = file;

	return {
		src,
		key,
		bucket,
	};
}

function videoHandler(file) {
	const { key, src, bucket } = file;

	return {
		src,
		key,
		bucket,
	};
}

function otherHandler(file) {
	const { key, src, bucket } = file;

	return {
		src,
		key,
		bucket,
	};
}

function fileHandler({ file, fields }) {
	const { name, tag } = fields;
	const { size, type } = file;
	const [file_type, extension] = type.split('/');

	const common = {
		size,
		tag,
		file_name: name,
		extension,
	};

	switch (file_type) {
		case 'image': {
			return {
				...common,
				type: 'image',
				entity: imageHandler(file),
			};
		}

		case 'audio': {
			const { samples = [] } = fields;
			return {
				...common,
				type: 'audio',
				entity: {
					samples,
					...audioHandler(file),
				},
			};
		}

		case 'video': {
			return {
				...common,
				type: 'video',
				entity: videoHandler(file),
			};
		}

		default: {
			return {
				...common,
				type: 'other',
				entity: otherHandler(file),
			};
		}
	}
}

/**
 * =======
 * Core
 * =======
 */

function list(request, response) {
	const { _user } = request;

	Media.list(_user.id)
		.then(medias =>
			response.send(successHandler({ medias })))
		.catch(error =>
			response.send(errorHandler(error)));
}

function create(request, response) {
	const { _user } = request;

	Bucket.uploader(request)
		.then(result => {
			const object = fileHandler(result);

			return Media.create({ owner: _user.id, ...object })
				.then(media => response.send(successHandler({ media })));
		})
		.catch(error =>
			response.send(errorHandler(error)));
}

function update(request, response) {
	Media.update(request.params.userId, request.body)
		.then((res) => {
			response.send(successHandler(res))
		})
}

function remove (request, response) {
	Media.remove(request.params.userId)
		.then((res)=>{
			Bucket.remove([res])
			.then((res)=> response.send(res.Deleted))
		})
}