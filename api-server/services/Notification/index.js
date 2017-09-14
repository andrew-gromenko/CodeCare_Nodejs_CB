const repo = require('../../repository');
const Socket = require('../Socket/service');
const Promise = require('bluebird');

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

function invite({creator, participants, title}) {
	const promises = participants.map(member => {
		return repo.notification
			.create({
				type: 'workspace',
				text: `invite you to join to workspace ${title}`,
				issuer: creator,
				recipient: member,
			})
	});

	return Promise.all(promises)
		.then(notifications => notifications.forEach(notification => Socket.notify(notification)));
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
	invite,
	pristine,
	pristineAll,
};