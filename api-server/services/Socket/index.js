const service = require('./service');
const User = require('../User');

function handler(socket) {
	const {user: userId} = socket.handshake.query;

	console.log(`++++ New socket ${socket.id} with userId ${userId} ++++`);

	User.socket(userId)
		.then(user => {
			service.subscribe(user, socket)
				.then(result => socket.emit('subscribe_succeeded', result))
				.catch(error => socket.emit('subscribe_failed', error.message));
		})
		.catch(error => socket.emit('subscribe_error', error.message));

	socket.on('unsubscribe', (user, callback) => {
		console.log(`===== User ${user.username} with SOCKET ${socket.id} unsubscribed =====`);

		service.unsubscribe(socket.id)
			.then(result => callback({status: 200, result}))
			.catch(error => callback({status: 400, error: error.message}));
	});

	socket.on('disconnect', () => {
		console.log(`===== Socket ${socket.id} disconnect =====`);

		service.unsubscribe(socket.id)
			.then(result => ({status: 200, result}))
			.catch(error => ({status: 400, error: error.message}));
	});

}

module.exports = {handler};