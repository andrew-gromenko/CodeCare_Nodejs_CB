const Message = require('mongoose').model('Message');
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
	list,

	create,
	update,
	remove,
	edit,
	pristine,
};

/**
 * =======
 * Helpers
 * =======
 */

function prepare(model) {
	return {
		...prettify(model),
		room: model.room.toString(),
		issuer: model.issuer.toString(),
	};
}


/**
 * ====
 * Core
 * ====
 */

// TODO: should support query
function list(roomId) {
	return Message
		.find({room: ObjectId(roomId)})
		.then(messages => messages.map(message => prepare(message)));
}

function create({issuer, room, body, media}) {
	const object = {
		issuer,
		room,
		body,
		media,
	};

	return new Message(object)
		.save()
		.then(prepare);
}

function update(id, options) {
	const instructions = {'new': true, runValidators: true};
	const query = {
		...options,
		'$currentDate': {modified_at: true},
	};

	return Message
		.findOneAndUpdate({_id: ObjectId(id)}, query, instructions)
		.then(model => {
			exist(model);

			return prepare(model);
		});
}

// TODO: should return documents which was removed
// currently it's return array with messages that are supposedly deleted
function remove(list) {
	return Message
		.deleteMany({_id: {'$in': list.map(id => ObjectId(id))}})
		.then(() => list);
}

function pristine(list) {
	const instructions = {'new': true, runValidators: true};
	const query = {
		'$set': {pristine: false},
		'$currentDate': {modified_at: true},
	};

	return Message
		.update({_id: {'$in': list.map(id => ObjectId(id))}}, query, instructions)
		.then(() => list);
}

function edit(id, fields) {
	return update(id, {'$set': fields});
}