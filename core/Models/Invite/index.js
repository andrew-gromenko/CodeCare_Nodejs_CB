const Invite = require('mongoose').model('Invite');
const ObjectId = require('mongoose').Types.ObjectId;

const {
	exist,
	populate,
	prettify,
} = require('../utils');

/**
 * =======
 * Exports
 * =======
 */

module.exports = {
	create,
	update,
	remove,
	edit,

	workspace,
	recipient,
	issuer,
};

/**
 * =======
 * Helpers
 * =======
 */

function prepare(model, values = []) {
	const object = prettify(model);
	const issuer = prettify(object.issuer);
	const recipient = prettify(object.recipient);
	const workspace = prettify(object.workspace);

	return {
		...object,
		issuer,
		recipient,
		workspace,
	}
}


/**
 * ====
 * Core
 * ====
 */

function create({issuer, recipient, workspace}) {
	return new Invite({issuer, recipient, workspace})
		.save()
		.then(model => byField({_id: model._id}));
}

function update(id, options) {
	const instructions = {'new': true, runValidators: true};
	const query = {
		...options,
		'$currentDate': {modified_at: true},
	};

	return Invite
		.findOneAndUpdate({_id: ObjectId(id)}, query, instructions)
		.populate(populate('user', 'issuer'))
		.populate(populate('user', 'recipient'))
		.populate(populate('workspace', 'workspace', ['id', 'title', 'description']))
		.then(model => {
			exist(model);

			return prepare(model);
		});
}

function edit(id, fields) {
	return update(id, {'$set': fields});
}

function remove(id) {
	return Invite
		.findOneAndRemove({_id: ObjectId(id)})
		.populate(populate('user', 'issuer'))
		.populate(populate('user', 'recipient'))
		.populate(populate('workspace', 'workspace', ['id', 'title', 'description']))
		.then(model => {
			exist(model);

			return prepare(model);
		});
}

function byField(criteria) {
	return Invite
		.find(criteria)
		.populate(populate('user', 'issuer'))
		.populate(populate('user', 'recipient'))
		.populate(populate('workspace', 'workspace', ['id', 'title', 'description']))
		.then(invites => {
			exist(invites);

			return invites.map(invite => prepare(invite));
		});
}

function workspace(workspace) {
	return byField({workspace: ObjectId(workspace)});
}

function recipient(recipient) {
	return byField({recipient: ObjectId(recipient)});
}

function issuer(issuer) {
	return byField({issuer: ObjectId(issuer)});
}