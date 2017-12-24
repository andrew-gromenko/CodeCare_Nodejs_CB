const Project = require('../Models/Project');
/**
 * =======
 * Exports
 * =======
 */

module.exports = {
	create,
	list,
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


/**
 * =======
 * Core
 * =======
 */

function create(request, response) {
	const {
		_user,
		body,
	} = request;
	Project.create({ creator: _user.id, ...body })
		.then(project => {
			return response.send(successHandler({ ...project }))
		})
		.catch(error =>
			response.send(errorHandler(error)));
}

function list(request, response) {
	const { _user } = request;

	Project.list(_user.id)
		.then(projects =>
			response.send(successHandler([...projects])))
		.catch(error =>
			response.send(errorHandler(error)));
}

function remove(request, response) {
	const {
		params: { project },
	} = request;

	Project.remove(project)
		.then(document =>
			response.send(successHandler(project)))
		.catch(error =>
			response.send(errorHandler(error)));
}