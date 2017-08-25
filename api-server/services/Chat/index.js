const repo = require('../../repository');
const Socket = require('../Socket/service');

function create(participants) {
	return repo.room
		.create(participants)
		.then(chat => {
			const users = chat.participants
				.map(user => ({id: user, chat}));

			Socket.updateRooms(users, 'push');
			return chat;
		});
}

function list(userId) {
	return repo.room
		.all(userId);
}

function find(participants) {
	return repo.room
		.findByParticipants(participants);
}

function findById(id) {
	return repo.room
		.find(id);
}

function pushMessage(roomId, {issuer, body, additionally}) {
	return repo.message
		.create({issuer, body, additionally})
		.then(message => {
			Socket.chatMessage({room: roomId, issuer, message}, 'push');

			return repo.room
				.pushMessage(roomId, message.id)
				.then(() => message);
		});
}

function pullMessage(roomId, messageId) {
	return repo.message
		.remove(messageId)
		.then(() => {
			Socket.chatMessage({room: roomId, message: messageId}, 'pull');

			return repo.room
				.pullMessage(roomId, messageId);
		});
}

module.exports = {
	create,
	list,
	find,
	findById,
	pushMessage,
	pullMessage,
};