const Clients = require('./clients');

class SocketService {
	constructor() {
		this.clients = new Clients();

		this.emitOnline = this.emitOnline.bind(this);
	}

	subscribe(user, socket) {
		const handler = (resolve, reject) => {
			const clientExists = this.clients.list
				.filter(client => client.user.id === user.id)
				.map(client => {
					reject(`User ${client.user.username} ID: ${client.user.id} Socket: ${client.socket.id} already exists.`);

					return client;
				});

			if (clientExists.length === 0) {
				const friends = this.clients.jointo(user, socket)
					.map(this.emitOnline);

				resolve({
					message: `Client ${user.username}. ID: ${user.id} SOCKET: ${socket.id} subscribed`,
					friendsOnline: friends,
				});
			}
		};

		return new Promise(handler);
	}

	unsubscribe(user, socket) {
		const handler = (resolve, reject) => {
			this.clients.list
				.forEach(client => {

					if (!Object.is(user, null) && user.id === client.user.id) {
						this.clients.leave(client.socket.id)
							.forEach(this.emitOnline);

						return resolve(`Client ${user.username}. ID: ${user.id} SOCKET: ${socket.id} unsubscribed`);
					}

					if (Object.is(user, null) && socket.id === client.socket.id) {
						this.clients.leave(client.socket.id)
							.forEach(this.emitOnline);

						return resolve(`Client ${client.user.username}. ID: ${client.user.id} SOCKET: ${socket.id} unsubscribed`);
					}

					// reject({client, message: `User with SOCKET ${socket.id} not listed as client`});
				});
		};

		return new Promise(handler);
	}

	update(users) {
		this.clients
			.update(users)
			.map(client => {
				client.socket.emit('self_update', client.user);

				return client;
			})
			.forEach(this.emitOnline);
	}

	emitOnline(client) {
		const online = this.clients.onlineFriends(client.socket.id).map(friend => friend.user.id);

		client.socket.emit('online_friends', online);

		return client.user.id;
	}

	notify(notification) {
		const {recipient} = notification;
		const Client = this.clients.list.filter(client => client.user.id === recipient._id);

		Client.forEach(client => {
			client.socket.emit('notification', notification);
		});
	}

}

module.exports = new SocketService();