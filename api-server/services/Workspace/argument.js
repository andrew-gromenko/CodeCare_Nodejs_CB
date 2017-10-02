const Argument = require('../../repository/argument');
const Workspace = require('../../repository/workspace');

module.exports = {
	one,
	list,
	create,
	update,
	remove,
	react,
};

// TODO: Should return Argument with: 50 comments > 5 replies
function one(argumentId) {
	return Argument.one(argumentId);
}

// TODO: should can take `query` and return list base on it (filter/sort/limit)
// TODO: should can return list of media files (select)
function list(workspaceId, query) {
	return Argument.list(workspaceId, query);
}

function owned(creatorId) {

}

// TODO: Should send notification to all participants
function create({issuer, body, media, workspace}) {
	return Argument.create({issuer, body, media, workspace});
}

function update(argumentId, {body, media}) {
	return Argument.edit(argumentId, {body, media});
}

// TODO: should remove all comments
function remove(argumentId) {
	return Argument.remove(argumentId);
}

// TODO: Should send notification to creator of this argument if like
// TODO: Should send notification to all participants if vote
function react(argumentId, {issuer, type, value}) {
	const action = Object.is(value, 1) ? 'push' : 'pull';

	switch (type) {
		case 'like': {
			return Argument.likes(argumentId, issuer, action);
		}
		case 'vote': {
			return Argument.votes(argumentId, issuer, action);
		}

		default: {
			throw new Error('');
		}
	}
}