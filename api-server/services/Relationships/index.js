const Repo = require('../../repository');
const Socket = require('../Socket/service');

/*===== Selectors =====*/
const {
	selfSelector,
	socketSelector,
	contactsSelector,
} = require('../selectors');

function list(userId) {
	return Repo.user.noPopulate(userId)
		.then(contactsSelector);
}

function follow(follower, following) {
	return Repo.user.follow(follower, following)
		.then(users => {
			const [follower, following] = users;

			Socket.updateContacts([
				socketSelector(follower),
				socketSelector(following),
			]);

			return selfSelector(follower);
		});
}

function unfollow(follower, following) {
	return Repo.user.unfollow(follower, following)
		.then(users => {
			const [follower, following] = users;

			Socket.updateContacts([
				socketSelector(follower),
				socketSelector(following),
			]);

			return selfSelector(follower);
		});
}

module.exports = {
	list,
	follow,
	unfollow,
};