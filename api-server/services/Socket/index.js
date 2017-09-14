const service = require('./service');
const User = require('../User');

const DEFAULT_ROOM = 'clockbeats';

function handler(socket) {
	const {user: userId} = socket.handshake.query;

	console.log(`++++ New socket ${socket.id} with userId ${userId} ++++`);

	const subscribeHandler = ([user, online]) => {
		user.rooms.forEach(room => socket.join(room));
		user.workspaces.forEach(workspace => socket.join(workspace));
		socket.join(DEFAULT_ROOM);
		socket.emit('subscribe_succeeded', online);
		socket.to(DEFAULT_ROOM).emit('online', online);
	};

	const unsubscribeHandler = online => {
		socket.emit('subscribe_succeeded', online);
		socket.to(DEFAULT_ROOM).emit('online', online);
	};

	User.socket(userId)
		.then(user => {
			service.subscribe(user, socket)
				.then(subscribeHandler)
				.catch(error => socket.emit('subscribe_failed', error.message));
		})
		.catch(error => socket.emit('subscribe_error', error.message));

	socket.on('disconnect', () => {
		console.log(`===== Socket ${socket.id} disconnect =====`);

		service.unsubscribe(socket.id)
			.then(unsubscribeHandler)
			.catch(error => console.log('Error occurs while socket disconnect:', error.message));
	});
}

module.exports = {handler};