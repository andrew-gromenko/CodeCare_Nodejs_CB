const service = require('./service');

function handler(socket) {
	console.log(`++++ New socket ${socket.id} ++++`);

	socket.on('subscribe', (user, callback) => {
		console.log(`===== User ${user.username} with SOCKET ${socket.id} subscribed =====`);

		service.subscribe(user, socket)
			.then(result => callback({status: 200, result}))
			.catch(error => callback({status: 400, error}));
	});

	socket.on('unsubscribe', (user, callback) => {
		console.log(`===== User ${user.username} with SOCKET ${socket.id} unsubscribed =====`);

		service.unsubscribe(user, socket)
			.then(result => callback({status: 200, result}))
			.catch(error => callback({status: 400, error}));
	});

	socket.on('disconnect', () => {
		console.log(`===== Socket ${socket.id} disconnect =====`);

		service.unsubscribe(null, socket)
			.then(result => ({status: 200, result}))
			.catch(error => ({status: 400, error}));
	});

}

module.exports = {handler};