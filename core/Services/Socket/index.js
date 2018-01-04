const Clients = require('./repository');

const _push = (array, item) => [...array, item];
const _pull = (array, item) => array.filter(value => value !== item);

function updateUser(client, options) {
	const { sockets, user } = client;

	return {
		sockets: [...sockets],
		user: {
			...user,
			...options,
		},
	};
}

function updateUserContacts(client, followers, following) {
	return updateUser(client, {
		followers: [...followers],
		following: [...following],
	});
}

function updateUserRooms(client, room, action = 'push') {

	const { user: { rooms } } = client;

	return updateUser(client, {
		rooms: action === 'push' ? _push(rooms, room) : _pull(rooms, room),
	});
}

function updateUserWorkspace(client, workspace, action = 'push') {
	const { user: { workspaces } } = client;

	return updateUser(client, {
		workspaces: action === 'push' ? _push(workspaces, workspace) : _pull(workspaces, workspace),
	});
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
		users.forEach(({ id, followers, following }) => {
			const client = this.clients.findByUser(id);

			if (client) {
				const updated = updateUserContacts(client, followers, following);
				this.clients.update(client, updated);

				client.sockets
					.forEach(socket => socket.emit('followers_updated', { id, followers, following }));
			}
		});
	}

	updateRooms(users, action = 'push') {
		users.forEach(({ id, chat }) => {
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
		const { recipient } = notification;
		const client = this.clients.findByUser(recipient.toString());

		if (client) {
			client.sockets
				.forEach(socket => socket.emit('notification', notification));
		}
	}

	invite(invite) {
		const { recipient } = invite;
		const client = this.clients.findByUser(recipient);

		if (client) {
			client.sockets
				.forEach(socket => socket.emit('invite', invite));
		}
	}

	chatMessages({ room, issuer, messages }, action) {
		const client = this.clients.findByUser(issuer);

		if (client) {

			client.sockets
				.forEach(socket => {
					switch (action) {
						case 'push': socket.to(room).emit('chat_message_push', { room, messages }); break;
						case 'pull': socket.to(room).emit('chat_message_pull', { room, messages }); break;
						case 'update': socket.to(room).emit('chat_message_update', { room, messages }); break;
						case 'pristine': socket.to(room).emit('chat_message_pristine', { room, messages }); break;

						default: socket.to(room).emit('chat_message_error', 'Wrong type of action.'); break;
					}
				});
		}
	}

	updateBlackList(userId) {
		const client = this.clients.findByUser(userId)
		if (client) client.sockets.forEach(socket => socket.emit('blacklist_update'));
	}

	updateWorkspacesList(participants, workspace) {
		participants.forEach((participant) => {
			const client = this.clients.findByUser(participant.toString());
			if (client) client.sockets.forEach(socket => socket.emit('workpaces_list_update', { ...workspace }))
		})
	}

	droppedFromWorkspace(participant, id) {
		const client = this.clients.findByUser(participant.toString());
		if (client) client.sockets.forEach(socket => socket.emit('dropped_from_workspace', id))
	}

	updateArguesList(workspace, issuer) {
		const client = this.clients.findByUser(issuer);
		if (client) client.sockets.forEach(socket => socket.to(workspace).emit('workspace_argues_update', { workspace }));
	}

	updateArgueComments(workspace, issuer) {
		const client = this.clients.findByUser(issuer.toString());
		if (client) client.sockets.forEach(socket => socket.to(workspace).emit('argument_comments_update', { workspace }));
	}
}

module.exports = new SocketService();