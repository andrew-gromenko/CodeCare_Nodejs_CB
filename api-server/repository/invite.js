const Promise = require('bluebird');
const ObjectId = require('mongoose').Types.ObjectId;
const Invite = require('mongoose').model('Invite');


/**
 * Exports
 */
module.exports = {
	list,

	create,
	update,
	remove,

	react,
};

// TODO: should support query filtering
function list(recipientId) {
	return Invite
		.find({_id: ObjectId(recipientId)})
		.populate(_populate())
		.lean(true)
		.then(invites => invites.map(invite => _prepare(invite)));
}

function create({recipient, workspace}) {
	return new Invite({recipient, workspace})
		.save()
		.then(invite => {
			const handler = (resolve, reject) => {
				invite
					.populate(_populate(), (error, document) => {
						if (error) reject(error);

						resolve(_prepare(document));
					});
			};

			return new Promise(handler);
		});
}

function update(id, options) {
	const modifier = {'$currentDate': {modified_at: true}};
	const instructions = {'new': true, runValidators: true};
	const query = Object.assign({}, modifier, options);

	return Invite
		.findOneAndUpdate({_id: ObjectId(id)}, query, instructions)
		.lean(true)
		.then(model => {
			_exist(model);

			return _prepare(model);
		});
}

function remove(inviteId) {
	return Invite
		.findOneAndRemove({_id: ObjectId(inviteId)})
}

function react(inviteId, status) {
	return update(inviteId, {'$set': status});
}

/**
 * Helpers
 */
function _exist(model) {
	if (!model) throw new Error('Argument not found.');
}

function _populate() {
	return {
		path: 'workspace',
		select: '_id title description creator',

		populate: {
			path: 'creator',
			select: '_id name username',
		},
	};
}

function _prepare(model) {
	const result = Object.assign({}, JSON.parse(JSON.stringify(model)), {
		id: `${model._id}`,
		workspace: Object.assign({}, model.workspace, {
			id: `${model.workspace._id}`,
			creator: Object.assign({}, model.workspace.creator, {
				id: `${model.workspace.creator._id}`,
			})
		}),
	});

	delete result._id;
	delete result.__v;

	return result;
}