const Media = require('mongoose').model('Media');
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
	create,
	remove,
	update,
	edit,
};

/**
 * =======
 * Helpers
 * =======
 */


/**
 * ====
 * Core
 * ====
 */

function one(id) {
	return Media
		.findOne({_id: ObjectId(id)})
		.then(prettify(media));
}

function list(userId, query = {}) {
	return Media
		.find({owner: ObjectId(userId)})
		.then(medias => medias.map(media => prettify(media)));
}

function create({owner, entity, type, file_name, size, tag}) {
	const object = {
		owner,
		entity,
		type,
		file_name,
		size,
		tag
	};

	return new Media(object)
		.save()
		.then(prettify);
}

// TODO: should return documents which was removed
// currently it's return array with messages that are supposedly deleted
function remove(list) {
	return Media
		.deleteMany({_id: {'$in': list.map(id => ObjectId(id))}})
		.then(response => list);
}

function update(id, options) {
	const instructions = {'new': true, runValidators: true};
	const query = {
		...options,
		'$currentDate': {modified_at: true},
	};
	return Media
		.findOneAndUpdate({_id: ObjectId(id)}, query, instructions)
		.then(model => {
			exist(model);

			return prettify(model);
		});
}

function edit(id, {name}) {
	return update(id, {'$set': {file_name: name}});
}