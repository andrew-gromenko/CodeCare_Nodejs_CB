const Clients = require('./clients');

function updateUserContacts(client, followers, following) {
	const {sockets, user} = client;
	return {
		sockets: [...sockets],
		user: Object.assign({}, user, {
			followers: [...followers],
			following: [...following],
		}),
	};
}

function updateUserRooms(client, room, action = 'push') {
	const {sockets, user} = client;
	const {rooms} = user;

	const push = room => ([...rooms, room]);
	const pull = room => rooms.filter(item => item !== room);

	return {
		sockets: [...sockets],
		user: Object.assign({}, user, {
			rooms: action === 'push' ? push(room) : pull(room),
		}),
	};
}

class SocketService {
	constructor() {
		this.clients = new Clients();
	}

	subscribe(user, socket) {
		const handler = (resolve, reject) => {
			try {
				const online = this.clients.jointo(user, socket);

				return resolve([user, online]);
			} catch (error) {
				return reject(error);
			}
		};

		return new Promise(handler);
	}

	unsubscribe(socketId) {
		const handler = (resolve, reject) => {
			try {
				const online = this.clients.leave(socketId);

				return resolve(online);
			} catch (error) {
				return reject(error);
			}
		};

		return new Promise(handler);
	}

	updateContacts(users) {
		users.forEach(({id, followers, following}) => {
			const client = this.clients.findByUser(id);

			if (client) {
				const updated = updateUserContacts(client, followers, following);
				this.clients.update(client, updated);

				client.sockets
					.forEach(socket => socket.emit('followers_updated', {id, followers, following}));
			}
		});
	}

	updateRooms(users, action = 'push') {
		users.forEach(({id, chat}) => {
			const client = this.clients.findByUser(id);

			if (client) {
				const updated = updateUserRooms(client, chat.id, action);
				this.clients.update(client, updated);

				client.sockets
					.forEach(socket => {
						if (action === 'push') {
							socket.join(chat.id);
							socket.emit('chat_join', chat);
						} else {
							socket.emit('chat_leave', chat);
							socket.leave(chat.id);
						}
					});
			}
		})
	}

	notify(notification) {
		const {recipient} = notification;
		const client = this.clients.findByUser(recipient);

		if (client) {
			client.sockets
				.forEach(socket => socket.emit('notification', notification));
		}
	}

	chatMessage({issuer, room, message}, action = 'push') {
		const client = this.clients.findByUser(issuer);

		if (client) {
			client.sockets
				.forEach(socket => socket.to(room).emit('chat_message', {room, message}));
		}
	}
}

module.exports = new SocketService();