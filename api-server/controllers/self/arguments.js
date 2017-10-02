const Argument = require('../../services/Workspace/argument');

module.exports = {
	one,
	list,
	create,
	update,
	remove,

	react,
};

function one(request, response, next) {
	const {
		params: {argue},
	} = request;

	return Argument.one(argue)
		.then(argue =>
			response.send({status: 200, data: {argue}}))
		.catch(error =>
			response.send(error));
}

function list(request, response, next) {
	const {
		params: {workspace},
	} = request;

	return Argument.list(workspace, {})
		.then(argues =>
			response.send({status: 200, data: {argues}}))
		.catch(error =>
			response.send(error));
}

function create(request, response, next) {
	const {
		body: {issuer, body, media},
		params: {workspace},
	} = request;

	return Argument.create({issuer, body, media, workspace})
		.then(argue =>
			response.send({status: 200, data: {argue}}))
		.catch(error =>
			response.send({status: 400, error: {message: error.message}}));
}

function update(request, response, next) {
	const {
		body: {body, media},
		params: {argue},
	} = request;

	return Argument.update(argue, {body, media})
		.then(argue =>
			response.send({status: 200, data: {argue}}))
		.catch(error =>
			response.send(error));
}

function remove(request, response, next) {
	const {
		params: {argue},
	} = request;

	return Argument.remove(argue)
		.then(argue =>
			response.send({status: 200, data: {argue}}))
		.catch(error =>
			response.send(error));
}

function react(request, response, next) {
	const {
		body: {issuer, type, value},
		params: {argue},
	} = request;

	return Argument.react(argue, {issuer, type, value})
		.then(argue =>
			response.send({status: 200, data: {argue}}))
		.catch(error =>
			response.send(error));
}
