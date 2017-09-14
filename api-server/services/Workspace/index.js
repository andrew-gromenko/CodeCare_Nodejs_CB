const Repo = require('../../repository');
const Promise = require('bluebird');
const Notification = require('../Notification');

function list(userId) {
	return Repo.workspace
		.all(userId);
}

function detail(workspace) {
	return Repo.workspace
		.one(workspace);
}


// TODO: Create socket notification to all participants

function create({creator, title, description, start, end, participants}) {
	return Repo.workspace
		.create({creator, title, description, start, end, participants})
		.then(workspace => {
			// TODO: should add to workspace only if user accept invitation
			// should pass workspace and participant separately
			Notification.invite(workspace);

			return workspace;
		});
}

function comment() {}

function archive(workspace, action = 'archive') {
	const archive = action === 'archive';

	return Repo.workspace
		.archive(workspace, archive);
}

function participants(workspace, participants, action) {
	return Repo.workspace
		.participants({workspace, participants}, action);
}

module.exports = {
	list,
	detail,
	create,
	archive,
	comment,
	participants,
};