const Clients = require('./clients');

class SocketService {
	constructor() {
		this.clients = new Clients();

		this.emitFriendsOnline = this.emitFriendsOnline.bind(this);
	}

	subscribe(user, socket) {
		const handler = (resolve, reject) => {
			try {
				const friends = this.clients
					.jointo(user, socket)
					.map(this.emitFriendsOnline);

				resolve(friends);
			} catch (error) {
				console.log(error);
				reject(error);
			}
		};

		return new Promise(handler);
	}

	unsubscribe(socketId) {
		const handler = (resolve, reject) => {
			try {
				const friends = this.clients
					.leave(socketId)
					.map(this.emitFriendsOnline);

				resolve(friends);
			} catch (error) {
				reject(error);
			}
		};

		return new Promise(handler);
	}

	update(users) {
		users.forEach(user => {
			const client = this.clients.update(user);

			if (client) {
				client.sockets
					.forEach(socket => socket.emit('self_update', client.user));

				this.emitFriendsOnline(client);
			}
		});
	}

	emitFriendsOnline({user, sockets}) {
		const friends = this.clients
			.friends(user)
			.map(friend => friend.user.id);

		sockets
			.forEach(socket =>
				socket.emit('friends_online', friends));

		return user.id;
	}

	notify(notification) {
		const {recipient} = notification;
		const client = this.clients.findByUser(recipient._id);

		if (client) {
			client.sockets
				.forEach(socket => socket.emit('notification', notification));
		}
	}

}

module.exports = new SocketService();