const mongoose = require('mongoose');
const User = mongoose.model('User');
const ObjectId = mongoose.Types.ObjectId;
const Promise = require('bluebird');

const {
	exist,
	prettify,
	populate,
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
	edit,
	verify,

	oneById,
	oneByEmail,
	oneByUsername,

	follow,
	unfollow,
	followers,
};

/**
 * =======
 * Helpers
 * =======
 */

function byField(criteria) {
	return User
		.findOne(criteria)
		.then(user => {
			exist(user);

			return prepare(user);
		});
}

// @param values - Values which should be omitted
function prepare(model, values = []) {
	return prettify(model, [
		'password',
		'created_at',
		'modified_at',
		'__removed',
		'__public',
		...values,
	]);
}

/**
 * =======
 * Core
 * =======
 */

// TODO: Should support limit, skip, and generate the next link in controller
// TODO: Depends on `__public` flag should omit fields like `city, categories etc.`
function list(query) {
	const criteria = {
		...query,
		__removed: false,
	};

	return User
		.find(criteria)
		.then(users =>
			users.map(user => prepare(user)));
}

function create({email, username, password}) {
	const object = {
		email,
		name: username,
		username,
		password,
	};

	return new User(object)
		.save()
		.then(prepare)
		.catch(error => {
			if (error.code === 11000) {
				throw new Error('User already exists');
			}

			throw error;
		});
}

function update(id, options) {
	const instructions = {'new': true, runValidators: true};
	const query = {
		...options,
		'$currentDate': {modified_at: true},
	};
	return User
		.findOneAndUpdate({_id: ObjectId(id)}, query, instructions)
		.then(model => {
			exist(model);

			return prepare(model);
		});
}

// TODO: should hash password if changed
function edit(id, fields) {
	const options = {'$set': fields};

	return update(id, options);
}

function verify({email, password}) {
	return User
		.findOne({email})
		.then(user => {
			exist(user);

			if (password) {
				return user.comparePassword(password)
					.then(valid => {
						if (!valid) throw new Error('Bad credentials');

						return prepare(user);
					});
			}

			return prepare(user);
		});
}

function oneById(id) {
	return byField({_id: ObjectId(id)});
}

function oneByEmail(email) {
	return byField({email});
}

function oneByUsername(username) {
	return byField({username});
}

function follow(follower, following) {
	return Promise.all([
		update(follower, {'$addToSet': {following: following}}),
		update(following, {'$addToSet': {followers: follower}}),
	]);
}

function unfollow(follower, following) {
	return Promise.all([
		update(follower, {'$pull': {following: following}}),
		update(following, {'$pull': {followers: follower}}),
	]);
}

function followers(id) {
	return User
		.findById(ObjectId(id))
		.select('id followers following')
		.then(user => {
			exist(user);

			const {id, followers, following} = prepare(user);

			return {id, followers, following};
		})
}


// function followers(id) {
// 	return User
// 		.findById(ObjectId(id))
// 		.select('id followers following')
// 		.populate(populate('user', 'followers'))
// 		.populate(populate('user', 'following'))
// 		.then(user => {
// 			exist(user);
//
// 			const {id, followers, following} = prepare(user);
//
// 			return {
// 				id,
// 				followers: followers.map(person => prepare(person)),
// 				following: following.map(person => prepare(person)),
// 			}
// 		})
// }
