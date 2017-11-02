
// Models
const Room = require('../../Models/Room');

// Services
const Socket = require('../Socket');
const Message = require('./messages');
const Promise = require('bluebird');


/**
 * =======
 * Exports
 * =======
 */

module.exports = {
	one,
	list,
	find,

	create,
};

/**
 * =======
 * Core
 * =======
 */

function list(user) {
	return Room.list(user)
		.then(rooms => {
			const chats = rooms.map(room =>
				// TODO: should return 1 message and count unread (pristine:true) messages
				Message.last(room.id)
					.then(messages => ({...room, messages})));

			return Promise.all(chats);
		});
}

function one(id) {
	return Promise.all([
		Room.one(id),
		Message.list(id),
	]).spread((chat, messages) => ({...chat, messages}));
}

function find(participants) {
	return Room.participants(participants)
		.then(rooms => {
			if (rooms.length === 0) return void(0);

			return rooms;
		});
}

function create(participants) {
	return Room.create(participants)
		.then(room => {
			const users = room.participants
				.map(user => ({id: user, room}));

			Socket.updateRooms(users, 'push');

			return room;
		});
}