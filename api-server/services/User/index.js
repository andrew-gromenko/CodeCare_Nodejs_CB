const repo = require('../../repository');
const Socket = require('../Socket/service');
const Promise = require('bluebird');

function self(id) {
	const User = repo.user.findById(id);
	const Notifications = repo.notification.find({recipient: id, pristine: false});

	return Promise.all([User, Notifications])
		.then(result => {
			const [user, notifications] = result;

			return Object.assign({}, user, {
				notifications,
				followers: user.followers.length,
				following: user.following.length,
			});
		});
}

function list() {
	return repo.user.all()
		.then(users => {
			return users.map(user => Object.assign({}, user, {
				followers: user.followers.length,
				following: user.following.length
			}));
		});
}

function follow(follower, following) {
	const Follower = repo.user.findById(follower);
	const Following = repo.user.findById(following);

	return Promise.all([Follower, Following])
		.then(result => {
			const [follower, following] = result;

			return repo.user
				.follow(follower.id, following.id)
				.then(users => {
					const [follower, following] = users;

					Socket.update([follower, following]);

					return follower;
				});
		});
}

function unfollow(follower, following) {
	const Follower = repo.user.findById(follower);
	const Following = repo.user.findById(following);

	return Promise.all([Follower, Following])
		.then(result => {
			const [follower, following] = result;

			return repo.user
				.unfollow(follower.id, following.id)
				.then(users => {
					const [follower, following] = users;

					Socket.update([follower, following]);

					return follower;
				});
		});
}

module.exports = {
	self,
	list,
	follow,
	unfollow,
};