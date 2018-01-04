const mongoose = require('mongoose');
const Workspace = mongoose.model('Workspace');
const Notification = require('../Notification');
const ObjectId = mongoose.Types.ObjectId;
const Socket = require('../../Services/Socket')

const {
	exist,
	prettify,
	populate,
	byAction,
} = require('../utils');

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
	edit,

	tiny,
	archive,
	participant,
	participants,
};

/**
 * =======
 * Helpers
 * =======
 */

function prepare(model, values) {
	const object = prettify(model);
	// const creator = prettify(object.creator);
	// const participants = object.participants.map(user => prettify(user));

	return {
		...object,
		// participants,
	}
}

/**
 * =======
 * Core
 * =======
 */

function one(id) {
	return Workspace
		.findById(ObjectId(id))
		.populate(populate('user', 'creator'))
		.populate(populate('user', 'participants'))
		.then(workspace => {
			exist(workspace);

			return prepare(workspace);
		});
}

function list(userId, query = {}) {
	const user = ObjectId(userId);
	const criteria = {
		...query,
		'$or': [
			{creator: user},
			{participants: {'$all': [user]}},
		],
	};

	return Workspace
		.find(criteria)
		.sort({modified_at: -1})
		// .populate(populate('user', 'creator'))
		// .populate(populate('user', 'participants'))
		.then(workspaces => workspaces.map(workspace => prepare(workspace)));
}

function create({creator, title, description, start, end, participants}) {
	const object = {
		creator,
		title,
		description,
		starts_at: start,
		ends_at: end,
		participants
	};
	
	return new Workspace(object)
		.save()
		.then(workspace => {
			return prepare(workspace);
		});
}

function update(id, options) {
	const instructions = {'new': true, runValidators: true};
	const query = {
		...options,
		starts_at: options.start,
		ends_at: options.end,
		'$currentDate': {modified_at: true},
	};
	
	return Workspace
		.findOneAndUpdate({_id: ObjectId(id)}, query, instructions)
		.then(model => {
			Socket.updateWorkspacesList(options.oldParticipants)
			exist(model);
			
			return prepare(model);
		});
}

function remove(id) {
	return Workspace
		.findOneAndRemove({_id: ObjectId(id)})
		// .populate(populate('user', 'creator'))
		// .populate(populate('user', 'participants'))
		.then(model => {
			exist(model);
			Socket.updateWorkspacesList(model.participants)
			return prepare(model);
		});
}

function edit(id, fields) {
	const options = {'$set': fields};

	return update(id, options);
}

function tiny(userId) {
	const user = ObjectId(userId);
	const criteria = {'$or': [
		{creator: user},
		{participants: {'$all': [user]}},
	]};

	return Workspace
		.find(criteria)
		.select('id')
		.then(workspaces => workspaces.map(({_id}) => _id.toString()));
}

function archive(id, archived) {
	return edit(id, {archived});
}

function participant(id, participant, action) {
	return update(id, byAction(action, {participants: participant}));
}

// TODO: Do i need this?
function participants(id) {
	return Workspace
		.findById(ObjectId(id))
		.select('id creator participants')
		// .populate(populate('user', 'creator'))
		// .populate(populate('user', 'participants'))
		.then(workspace => {
			exist(workspace);

			return prepare(workspace);
		});
}