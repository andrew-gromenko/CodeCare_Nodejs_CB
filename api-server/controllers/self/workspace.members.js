const Workspace = require('../../services/Workspace');

function list(request, response, next) {
	const {
		params: {workspace},
	} = request;

	Workspace.participants(workspace)
		.then(participants =>
			response.send({status: 200, data: {participants}}))
		.catch(error =>
			response.send(error));
}

function push(request, response, next) {
	const {
		body: {participant},
		params: {workspace},
	} = request;

	Workspace.participant('push', workspace, participant)
		.then(participants =>
			response.send({status: 200, data: {participants}}))
		.catch(error =>
			response.send(error));
}

function pull(request, response, next) {
	const {
		body: {participant},
		params: {workspace},
	} = request;

	Workspace.participant('pull', workspace, participant)
		.then(participants =>
			response.send({status: 200, data: {participants}}))
		.catch(error =>
			response.send(error));
}

module.exports = {
	list,
	push,
	pull,
};