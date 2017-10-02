const Argument = require('../_Bundles/Workspace/services/argument');

function one(request, response, next) {
	const {
		params: {argue},
	} = request;

	// TODO: Should return Argument with: 50 comments > 5 replies
	Argument.one(argue)
		.then(argue =>
			response.send({status: 200, data: {argue}}))
		.catch(error =>
			response.send(error));
}

function list(request, response, next) {
	const {
		params: {workspace},
	} = request;

	// TODO: should can take `query` and return list base on it (filter/sort/limit)
	// TODO: should can return list of media files (select)
	Argument.list(workspace)
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

	Argument.create(workspace, {issuer, body, media})
		.then(argue =>
			response.send({status: 200, data: {argue}}))
		.catch(error =>
			response.send(error));
}

function update(request, response, next) {
	const {
		body: {issuer, body, media},
		params: {workspace, argue},
	} = request;

	Argument.update(workspace, argue, {issuer, body, media})
		.then(argue =>
			response.send({status: 200, data: {argue}}))
		.catch(error =>
			response.send(error));
}

function remove(request, response, next) {
	const {
		params: {argue},
	} = request;

	// TODO: should remove all comments
	Argument.remove(argue)
		.then(argue =>
			response.send({status: 200, data: {argue}}))
		.catch(error =>
			response.send(error));
}

function react(request, response, next) {
	const {
		body: {action}, // Action should be `{type: 'like/vote', value: 1/-1}`
		params: {argue},
	} = request;

	Argument.react(argue, action)
		.then(argue =>
			response.send({status: 200, data: {argue}}))
		.catch(error =>
			response.send(error));
}


module.exports = {
	one,
	list,

	create,
	update,
	remove,

	react,
};