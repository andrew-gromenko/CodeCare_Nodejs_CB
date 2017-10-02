const Workspace = require('../Bundles/Workspace/services/workspace');

function one(request, response, next) {
	const {params: {workspace}} = request;

	// TODO: Should return workspace with: 10 arguments > 5 comments > 0 replies
	Workspace.one(workspace)
		.then(workspace =>
			response.send({status: 200, data: {workspace}}))
		.catch(error =>
			response.send(error));
}

function list(request, response, next) {
	const {
		_user,
	} = request;

	// TODO: should can take `query` and return list base on it (filter/sort/limit)
	Workspace.list(_user.id)
		.then(workspaces =>
			response.send({status: 200, data: {workspaces}}))
		.catch(error =>
			response.send(error));
}

/**
 * Create Workspace
 *
 * */
function create(request, response, next) {
	const {
		_user,
		body: {title, description, start, end, participants},
	} = request;

	Workspace.create({creator: _user.id, title, description, start, end})
		.then(workspace =>
			response.send({status: 200, data: {workspace}}))
		.catch(error =>
			response.send(error));
}

function update(request, response, next) {
	const {
		body: {title, description, start, end},
		params: {workspace},
	} = request;

	// TODO: should update only 'title', 'description', 'start', 'end'
	// TODO: Send from application all this fields
	Workspace.update(workspace, {title, description, start, end})
		.then(workspace =>
			response.send({status: 200, data: {workspace}}))
		.catch(error =>
			response.send(error));
}

function remove(request, response, next) {
	const {
		params: {workspace},
	} = request;

	// TODO: Should not totally remove argument. Set flag deleted
	Workspace.remove(workspace)
		.then(workspace =>
			response.send({status: 200, data: {workspace}}))
		.catch(error =>
			response.send(error));
}

function archive(request, response, next) {
	const {
		body: {archive},
		params: {workspace},
	} = request;

	Workspace.archive(workspace, archive)
		.then(workspace =>
			response.send({status: 200, data: {workspace}}))
		.catch(error =>
			response.send(error));
}

module.exports = {
	one,
	list,
	create,
	update,
	remove,
	archive,
};