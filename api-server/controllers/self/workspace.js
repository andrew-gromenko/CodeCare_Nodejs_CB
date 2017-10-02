const Workspace = require('../../services/Workspace');

function one(request, response, next) {
	const {params} = request;

	response.send({status: 200, data: {message: 'Should be workspace! :)'}});
}

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

	return response.send({status: 200, data: {message: 'Should remove workspace'}});
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

	return response.send({status: 200, data: {message: 'Should update workspace'}});
}

function archive(request, response, next) {
	const {params} = request;

	return response.send({status: 200, data: {message: 'Should archive workspace'}});
}

function invite(request, response, next) {
	const {params} = request;

	return response.send({status: 200, data: {message: 'Should send invites to users'}});
}

module.exports = {
	one,
	list,
	create,
	remove,
	update,
	detail,
	archive,
	invite,
};