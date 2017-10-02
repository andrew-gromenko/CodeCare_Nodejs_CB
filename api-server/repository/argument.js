const ObjectId = require('mongoose').Types.ObjectId;
const Argument = require('mongoose').model('Argument');

/**
 * Exports
 */
module.exports = {
	one,
	list,

	create,
	update,
	remove,
	edit,

	count,

	likes,
	votes,
	comments,
};

/**
 * Core
 */
function one(id) {
	return Argument
		.findOne({_id: ObjectId(id)})
		.lean(true)
		// .populate(_populate())
		.then(argue => _prepare(argue));
}

function owned(issuerId) {
	return Argument
		.find({issuer: ObjectId(issuerId)})
		.sort({created_at: -1})
		.limit(10)
		.lean(true)
		// .populate(_populate())
		.then(argues => argues.map(argue => _prepare(argue)));
}

function list(workspaceId, query) {
	return Argument
		.find({workspace: ObjectId(workspaceId)})
		.sort({created_at: -1})
		.limit(10)
		.lean(true)
		// .populate(_populate())
		.then(argues => argues.map(argue => _prepare(argue)));
}

function create({issuer, body, media, workspace}) {
	return new Argument({
		issuer,
		body,
		media,
		workspace,
	}).save()
		.then(model => {
			// TODO: should populate before prepare
			return _prepare(model);
		});
}

function update(id, options) {
	const modifier = {'$currentDate': {modified_at: true}};
	const instructions = {'new': true, runValidators: true};
	const query = Object.assign({}, modifier, options);

	return Argument
		.findOneAndUpdate({_id: ObjectId(id)}, query, instructions)
		// .populate(_populate())
		.lean(true)
		.then(model => {
			_exist(model);

			return _prepare(model);
		});
}

function remove(id) {
	return Argument
		.findOneAndRemove({_id: ObjectId(id)})
		.then(model => {
			_exist(model);

			return _prepare(model);
		});
}

function edit(id, {body, media}) {
	return update(id, {body, media});
}

/**
 * Beware!
 *
 * https://docs.mongodb.com/manual/faq/concurrency/#which-operations-lock-the-database
 * */
function count(list) {
	const workspaces = list.map(id => ObjectId(id));
	const aggregate = [
		{"$project": {
			_id: 1,
			workspace: 1,
			likes: {"$size": "$likes"},
			votes: {"$size": "$votes"},
		}},
		{"$match": {
			workspace: {"$in": workspaces},
		}},
		{"$group": {
			_id: "$workspace",
			likes: {"$sum": "$likes"},
			votes: {"$sum": "$votes"},
			argues: {"$sum": 1},
		}}
	];

	console.time('===== Aggregate ____count(workspaces)____ =====');

	return Argument
		.aggregate(aggregate)
		.then(counts => counts.map(count => _prepare(count)))
		.finally(() => console.timeEnd('===== Aggregate ____count(workspaces)____ ====='));
}

function likes(id, issuer, action) {
	return update(id, _byAction(action, {likes: issuer}));
}

function votes(id, issuer, action) {
	return update(id, _byAction(action, {votes: issuer}));
}

function comments(id, comment, action) {
	return update(id, _byAction(action, {comments: comment}));
}


/**
 * Helpers
 */
function _exist(model) {
	if (!model) throw new Error('Argument not found.');
}

function _prepare(model) {
	const result = Object.assign({}, JSON.parse(JSON.stringify(model)), {
		id: `${model._id}`,
	});

	delete result._id;
	delete result.__v;

	return result;
}

function _populate(field = 'workspace') {
	const object = {
		workspace: {
			path: 'workspace',
			select: '-_id -__v title description',
		}
	};

	return object[field];
}

function _byAction(action, query) {
	const options = {};

	switch(action) {
		case 'push': {
			options['$addToSet'] = query;

			return options;
		}

		case 'pull': {
			options['$pull'] = query;

			return options;
		}

		default: {
			throw new Error(`Action should be one of the ["push", "pull"]. Given ${action}`);
		}
	}
}