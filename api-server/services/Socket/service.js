const Clients = require('./clients');

class SocketService {
	constructor() {
		this.clients = new Clients();

		this.emitFriendsOnline = this.emitFriendsOnline.bind(this);
	}

	subscribe(user, socket) {
		const handler = (resolve, reject) => {
			try {
				const friends = this.clients.jointo(user, socket);
				console.log(friends);
				const response = {
					message: `Client ${user.username}. ID: ${user.id} SOCKET: ${socket.id} subscribed`,
					friendsOnline: friends,
				};

				resolve(response);
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
				this.clients.leave(socketId)
					.forEach(this.emitFriendsOnline);
			} catch (error) {
				reject(error);
			}
		};

		return new Promise(handler);
	}

	update(users) {
		users.forEach(user => {
			const client = this.clients.update(user);

			if (!Object.is(client, null)) {
				client.sockets
					.forEach(socket => socket.emit('self_update', client.user));

				this.emitFriendsOnline(client);
			}
		});
	}

	emitFriendsOnline(client) {
		const online = this.clients
			.friendsOnline(client.user.id)
			.map(friend => {
				return friend.user.id;
			});

		client.sockets
			.forEach(socket => socket.emit('friends_online', online));

		return client.user.id;
	}

	notify(notification) {
		const {recipient} = notification;
		const client = this.clients.findByUser(recipient._id);

		if (!Object.is(client, null)) {
			client.sockets
				.forEach(socket => socket.emit('notification', notification));
		}
	}

}

module.exports = new SocketService();