const repo = require('../../repository');
const Socket = require('../Socket/service');

// {type, issuer, text, recipient}
// 'chat', 'workspace', 'common'

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

function pristine(notification) {
	return repo.notification
		.update(notification, true);
}

function pristineAll(user) {
	return repo.notification
		.updateAll(user);
}

module.exports = {
	follow,
	pristine,
	pristineAll
};