const Workspace = require('../Models/Workspace');
const Argument = require('../Models/Argument');
const Invite = require('../Models/Invite');

/**
 * =======
 * Exports
 * =======
 */

module.exports = {
	one,
	list,

	create,
	update,
	remove,

	archive,
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

function one(request, response) {
	const { params: { workspace } } = request;

	// TODO: Should return workspace with: 10 arguments > 5 comments > 0 replies
	Workspace.one(workspace)
		.then(document =>
			response.send(successHandler({ workspace: document })))
		.catch(error =>
			response.send(errorHandler(error)));
}

function list(request, response) {
	const {
		_user,
		query,
	} = request;

	// TODO: should can take `query` (filter/sort/limit)
	Workspace.list(_user.id)
		.then(documents => {
			const list = documents.map(workspace => workspace.id);

			return Argument.count(list)
				.then(counts => {
					return documents.map(workspace => {
						const count = counts.find(argue => workspace.id === argue.id);

						if (count) {
							delete count.id;
							return {
								...workspace,
								counts: count,
							};
						}

						return {
							...workspace,
							counts: { likes: 0, votes: 0, argues: 0 },
						};
					});
				});
		})
		.then(documents =>
			response.send(successHandler({ workspaces: documents })))
		.catch(error =>
			response.send(errorHandler(error)));
}

/**
 * Create Workspace
 *
 * */
function create(request, response) {
	const {
		_user,
		body: { title, description, start, end, participants },
	} = request;
	// TODO: should create invite to each participant
	Workspace.create({ creator: _user.id, title, description, start, end, participants })
		.then(document => {
			return response.send(successHandler({ workspace: { ...document, counts: { likes: 0, votes: 0, argues: 0 } } }))
		})
		.catch(error =>
			response.send(errorHandler(error)));
}

function update(request, response) {
	const {
		body: { title, description, start, end, participants, oldParticipants },
		params: { workspace },
	} = request;
	console.log(request.body)
	Workspace.update(workspace, { title, description, start, end, participants, oldParticipants })
		.then(document =>
			response.send(successHandler({ workspace: document })))
		.catch(error =>
			response.send(errorHandler(error)));
}

function remove(request, response) {
	const {
		params: { workspace },
	} = request;

	Workspace.remove(workspace)
		.then(document =>
			response.send(successHandler({ workspace: document })))
		.catch(error =>
			response.send(errorHandler(error)));
}

function archive(request, response) {
	const {
		body: { archive },
		params: { workspace },
	} = request;

	Workspace.archive(workspace, archive)
		.then(document =>
			response.send(successHandler({ workspace: document })))
		.catch(error =>
			response.send(errorHandler(error)));
}