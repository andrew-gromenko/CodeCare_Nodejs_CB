
// Models
const User = require('../../Models/User');
const Room = require('../../Models/Room');
const Project = require('../../Models/Project');
const Workspace = require('../../Models/Workspace');


// Services
const Socket = require('../Socket');
const Promise = require('bluebird');

const {
	userSelector,
	selfSelector,
	profileSelector,
	contactsSelector,
} = require('../../Models/User/selectors');

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
	discard,

	self,
	profile,
	events,
	projects,

	follow,
	unfollow,
	followers,

	socket,
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

function list(query) {
	return User.list(query)
		.then(users => ({
			users: users.map(profileSelector),
			total: 0,
			next: '',
		}));
}

function create({email, username, password}) {
	return User.create({email, username, password})
		.then(selfSelector);
}

function update(user, options) {
	const socketUserId = options.socketUserId;
	return User.edit(user, options)
		.then((res)=>{
			if(socketUserId){
				Socket.updateBlackList(socketUserId)
			}
			return selfSelector(res)
		});
}

function remove(user) {
	return User.edit(user, {__removed: true})
		.then(selfSelector);
}

function discard(user) {
	return User.edit(user, {__removed: false})
		.then(selfSelector);
}

function self(id) {
	return User.oneById(id)
		.then(selfSelector);
}

function profile(username) {
	return User.oneByUsername(username)
		.then(profileSelector);
}

// TODO: should be the list of events
function events(id) {
	return Promise.resolve({
		id,
		events: [],
		count: 0,
		// TODO: should generate link to get next chunk
		next: '',
	});
}

// TODO: should be the list of events
function projects(id) {
	return Promise.resolve({
		id,
		projects: [],
		count: 0,
		// TODO: should generate link to get next chunk
		next: '',
	});
}

function follow(follower, following) {
	return User.follow(follower, following)
		.then(users => {
			const [follower, following] = users;

			Socket.updateContacts([
				contactsSelector(follower),
				contactsSelector(following),
			]);

			return selfSelector(follower);
		});
}

function unfollow(follower, following) {
	return User.unfollow(follower, following)
		.then(users => {
			const [follower, following] = users;

			Socket.updateContacts([
				contactsSelector(follower),
				contactsSelector(following),
			]);

			return selfSelector(follower);
		});
}

function followers(userId) {
	return User.oneById(userId)
		.then(user => ({
			...contactsSelector(user),
			count: 0,
			// TODO: should generate link to get next chunk
			next: '',
		}));
}

function socket(userId) {
	return Promise.all([
		User.oneById(userId),
		Room.tiny(userId),
		Workspace.tiny(userId),
	])
		.then(result => {
			const [user, rooms, workspaces] = result;

			return {
				...contactsSelector(user),
				rooms,
				workspaces,
			};
		});
}

