const repo = require('../../repository');
const Socket = require('../Socket/service');

// {type, issuer, text, recipient}
// 'chat', 'workspace', 'common'

function list(userId) {
	return repo.notification
		.find({recipient: userId});
}

function follow(follower, following) {
	return repo.notification
		.create({
			type: 'common',
			text: 'start following you',
			issuer: follower,
			recipient: following,
		})
		.then(notification => Socket.notify(notification))
}

function message() {}

function like() {}

function pristine(notification) {
	return repo.notification
		.update(notification, false);
}

function pristineAll(user) {
	return repo.notification
		.updateAll(user);
}

module.exports = {
	list,
	follow,
	pristine,
	pristineAll,
};