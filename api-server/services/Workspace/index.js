const ObjectId = require('mongoose').Types.ObjectId;
const Argument = require('../../repository/argument');
const Workspace = require('../../repository/workspace');

module.exports = {
	list,
	detail,
	create,
	remove,
	archive,
	participant,
	participants,
};

function list(userId) {
	return Workspace
		.all(userId)
		.then(workspaces => {
			const list = workspaces.map(workspace => workspace.id);

			return Argument.count(list)
				.then(counts => {
					return workspaces.map(workspace => {
						const count = counts.find(argue => workspace.id === argue.id);

						if (count) {
							delete count._id;
							return Object.assign({}, workspace, {counts: count});
						}

						return Object.assign({}, workspace, {counts: {likes: 0, votes: 0, argues: 0}});
					});
				});
		});
}

function detail(workspaceId) {
	return Workspace
		.one(workspaceId);
}

function create({creator, title, description, start, end, participants}) {
	return Workspace
		.create({creator, title, description, start, end, participants});
}

// TODO: On remove should delete all arguments and their comments
function remove(workspaceId) {
	return Workspace
		.remove(workspaceId);
}

function archive(workspaceId, action = 'archive') {
	const archive = action === 'archive';

	return Workspace
		.archive(workspaceId, archive);
}

function participant(workspaceId, participant, action) {
	return Workspace
		.participant(workspaceId, participant, action);
}

function participants(workspaceId) {
	return Workspace
		.participants(workspaceId);
}