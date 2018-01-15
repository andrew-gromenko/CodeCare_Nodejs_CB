const Project = require('../Models/Project');
const Notification = require('../Models/Notification');
const Socket = require('../Services/Socket');
/**
 * =======
 * Exports
 * =======
 */

module.exports = {
	create,
	list,
	remove,
	update,
	listById,
	react,
	listByIds,
	view
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

function update(request, response) {
	const {
		params: { project },
		body
	} = request

	Project.update(project, body)
		.then(project => response.send(successHandler(project)))
		.catch(error => response.send(errorHandler(error)));
}

function listById(request, response) {
	const { params: { user } } = request;
	Project.listById([user])
		.then(projects =>
			response.send(successHandler({ user, projects: [...projects] })))
		.catch(error =>
			response.send(errorHandler(error)));
}

function listByIds(request, response) {
	const { body: { users } } = request
	Project.listById(users)
		.then(projects =>
			response.send(successHandler({ projects: [...projects] })))
		.catch(error =>
			response.send(errorHandler(error)));
}


function react(request, response) {
	const {
		_user,
		body: { type, value }, // Action should be `{type: 'like', value: 1/-1}`
		params: { project },
	} = request;

	Project.react(project, { issuer: _user.id, type, value })
		.then(project => {
			if (value == 1 && _user.id != project.creator) {
				return Notification.create({
					issuer: _user.id,
					recipient: project.creator,
					type: 'like',
					data: {
						project: project.title
					}
				}).then(notification => {
					Socket.notify(notification)
					return response.send(successHandler({ project }))
				})
			} else {
				return response.send(successHandler({ project }))
			}

		})
		.catch(error =>
			response.send(errorHandler(error)));
}

function view(request, response) {
	const {
		params: { project }
	} = request;

	Project.view(project)
		.then(project => response.send(successHandler({ project })))
		.catch(error => response.send(errorHandler(error)))
}