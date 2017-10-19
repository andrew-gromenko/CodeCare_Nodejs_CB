const ObjectId = require('mongoose').Types.ObjectId;
const Media = require('mongoose').model('Media');

module.exports = {
	one,
	list,
	create,
	update,
	remove,
};

function one(media) {
	return Media
		.find({_id: ObjectId(media)})
		.lean(true)
		.then(model => {
			_exist(model);

			return _prepare(model);
		});
}

// TODO: should support query filtering
function list(user, query) {
	return Media
		.find({owner: ObjectId(user)})
		.lean(true)
		.then(model => {
			_exist(model);

			return _prepare(model);
		});
}

function create(user, entity, {name, type, extension, size}) {
	const object = {
		owner: ObjectId(user),
		type,
		size,
		entity,
		extension,
		file_name: name,
	};

	return new Media(object)
		.save()
		.lean(true)
		.then(model => _prepare(model));
}

function update(media, options) {
	const modifier = {'$currentDate': {modified_at: true}};
	const instructions = {'new': true, runValidators: true};
	const query = Object.assign({}, modifier, options);

	return Media
		.findOneAndUpdate({_id: ObjectId(media)}, query, instructions)
		.lean(true)
		.then(model => {
			_exist(model);

			return _prepare(model);
		});
}

function remove(media) {
	return Media
		.findOneAndRemove({_id: ObjectId(media)})
		.then(model => {
			_exist(model);

			return _prepare(model);
		});
}


/**
 * Helpers
 */
function _exist(model) {
	if (!model) throw new Error('Media object not found.');
}

function _prepare(model) {
	const result = Object.assign({}, JSON.parse(JSON.stringify(model)), {
		id: `${model._id}`,
	});

	delete result._id;
	delete result.__v;

	return result;
}