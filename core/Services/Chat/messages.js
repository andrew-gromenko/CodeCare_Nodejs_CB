
// Models
const Message = require('../../Models/Message');

// Services
const Socket = require('../Socket');

/**
 * =======
 * Exports
 * =======
 */

module.exports = {
	list,
	last,

	create,
	remove,
	edit,
	pristine,
};

/**
 * =======
 * Core
 * =======
 */

function list(room) {
	return Message
		.list(room);
}

function last(room) {
	return Message
		.list(room);
}

function create(room, issuer, {body, media}) {
	return Message
		.create({room, issuer, body, media})
		.then(message => {
			Socket.chatMessages({room, issuer, messages: [message]}, 'push');

			return message;
		});
}

function remove(room, issuer, list) {
	return Message
		.remove(list)
		.then(messages => {
			Socket.chatMessages({room, issuer, messages}, 'pull');

			return messages;
		});
}

function edit(room, issuer, message, {body, media}) {
	return Message
		.edit(message, {body, media})
		.then(message => {
			Socket.chatMessages({room, issuer, messages: [message]}, 'update');

			return message;
		});
}

function pristine(room, issuer, list) {
	return Message
		.pristine(list)
		.then(messages => {
			Socket.chatMessages({room, issuer, messages}, 'pristine');

			return messages;
		});
}