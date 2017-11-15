const Comment = require('mongoose').model('Comment');
const ObjectId = require('mongoose').Types.ObjectId;

const {
	exist,
	prettify,
	byAction,
} = require('../utils');

/**
 * =======
 * Exports
 * =======
 */

module.exports = {
	list,
	owned,
	create,
	update,
	remove,
	edit,
};

/**
 * =======
 * Helpers
 * =======
 */

/**
 * =======
 * Core
 * =======
 */

function list(modelId, query) {
	// TODO: should support query

	return Comment
		.find({belongs_to: modelId})
		.then(models =>
			models.map(model =>
				prettify(model)));
}

function owned(issuerId, query = {}) {
	const criteria = {
		...query,
		issuer: ObjectId(issuerId),
	};

	return Comment
		.find(criteria)
		.sort({created_at: -1})
		.then(models => {
			if (!models) return [];

			return models.map(model => prettify(model));
		});
}

function create({issuer, body, media, belongs_to, replied_to}) {
	const object = {
		issuer,
		body,
		media,
		belongs_to,
		replied_to,
	};

	return new Comment(object).save()
		.then(comment => prettify(comment));
}

function update(id, options) {
	const instructions = {'new': true, runValidators: true};
	const query = {
		...options,
		'$currentDate': {modified_at: true},
	};

	return Comment
		.findOneAndUpdate({_id: ObjectId(id)}, query, instructions)
		.then(model => {
			exist(model);

			return prettify(model);
		});
}

// TODO: perhaps should use deleteMany
function remove(id) {
	return Comment
		.findOneAndRemove({_id: ObjectId(id)})
		.then(model => {
			exist(model);

			return prettify(model);
		});
}

function edit({id, body, media}) {
	const options = {'$set': {body, media}};

	return update(id, options);
}