const Room = require('mongoose').model('Room');
const ObjectId = require('mongoose').Types.ObjectId;

const {
	exist,
	prettify,
} = require('../utils');

/**
 * =======
 * Exports
 * =======
 */

module.exports = {
	one,
	list,
	Room,
	create,
	update,
	remove,
	discard,

	participants,
	tiny,
};

/**
 * =======
 * Helpers
 * =======
 */

function prepare(model) {
	const object = prettify(model, ['__removed_for']);
	const participants = model.participants.map(id => id.toString());

	return {
		...object,
		messages: [],
		participants,
	};
}

/**
 * ====
 * Core
 * ====
 */

function one(id) {
	return Room
		.findOne({_id: ObjectId(id)})
		.then(model => {
			exist(model);

			return prepare(model);
		});
}

function list(issuer) {
	return Room
		.find({participants: {'$all': [issuer]}})
		.sort({modified_at: -1})
		.then(rooms => {
			if (!rooms) return [];

			return rooms.map(room => prepare(room));
		});
}

function create(participants) {
	return new Room({participants})
		.save()
		.then(prepare);
}

function update(id, options) {
	const instructions = {'new': true, runValidators: true};
	const query = {
		...options,
		'$currentDate': {modified_at: true},
	};

	return Room
		.findOneAndUpdate({_id: ObjectId(id)}, query, instructions)
		.then(model => {
			exist(model);

			return prepare(model);
		});
}

// TODO: implement approach remove/discard users from chat
// 1. user can leave room and should remove all message
// 2. user can see new messages if they are was sending
// 3. user should not see room if there no new messages after his leaving
// 4. should not create new room instead use this room
function remove(room, participant) {
	return update(room, {'$addToSet': {__removed_for: ObjectId(participant)}});
}

function discard(room, participant) {
	return update(room, {'$pull': {__removed_for: ObjectId(participant)}});
}

function participants(participants) {
	return Room
		.findOne({participants: {'$eq': participants.map(id => ObjectId(id)), '$size': 2}})
		.then(room => {
			if (!room) return [];

			return prepare(room);
		});
}

function tiny(issuer) {
	return Room
		.find({participants: {'$all': [issuer]}})
		.sort({modified_at: -1})
		.select('id')
		.then(rooms => {
			if (!rooms) return [];

			return rooms.map(({_id}) => _id.toString());
		});
}