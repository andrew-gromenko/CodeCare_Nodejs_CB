const Workspace = require('../../services/Workspace');

function list(request, response, next) {
	const {_user} = request;

	Workspace.list(_user.id)
		.then(workspaces =>
			response.send({status: 200, data: {workspaces}}))
		.catch(error =>
			response.send({status: 400, error: {message: error.message}}));
}

function create(request, response, next) {
	const {_user, body} = request;
	const item = Object.assign({}, body, {creator: _user.id});

	Workspace.create(item)
		.then(workspace =>
			response.send({status: 200, data: {workspace}}))
		.catch(error =>
			response.send({status: 400, error: {message: error.message}}));
}

function remove(request, response, next) {
	const {params} = request;
}

function detail(request, response, next) {
	const {params} = request;

	Workspace.detail(params.workspace)
		.then(workspace =>
			response.send({status: 200, data: {workspace}}))
		.catch(error =>
			response.send({status: 400, error: {message: error.message}}));
}

function update(request, response, next) {
	const {params} = request;
}

function archive(request, response, next) {}

function argument(request, response, next) {}

function participants(request, response, next) {
	const {
		body: {participants, action = 'push'},
		params: {workspace: workspaceId},
	} = request;

	Workspace.participants(workspaceId, participants, action)
		.then(workspace =>
			response.send({status: 200, data: {workspace}}))
		.catch(error =>
			response.send({status: 400, error: {message: error.message}}));
}

module.exports = {
	list,
	create,
	remove,
	update,
	detail,
	archive,
	argument,
	participants,
};