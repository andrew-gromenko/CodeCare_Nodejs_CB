const compact = require('lodash/compact');
const unique = require('lodash/uniq');
const xor = require('lodash/xor');
const head = require('lodash/head');

/**
 * Socket clients storage
 * */

class Clients {
	constructor() {
		this._clients = [];
	}

	get list() {
		return this._clients;
	}

	findByUser(userId) {
		const result = this._clients
			.filter(client => client.user.id === userId);

		return head(result);
	}

	findBySocket(socketId) {
		let result = null;

		this._clients
			.forEach(client => {
				result = head(client.sockets.filter(socket => socket.id === socketId));
			});

		return result;
	}

	jointo(user, socket) {
		const client = this.findByUser(user.id);

		if (!Object.is(client, null)) {
			client.sockets.push(socket);

			return [];
		}

		this._clients.push({user, sockets: [socket]});
		return this.friendsOnline(user.id);
	}

	update({id, followers, following, username}) {
		let result = null;

		this._clients = this._clients
			.map(client => {
				if (client.user.id === id) {
					const user = {id, followers, following, username};
					const updated = Object.assign({}, client, {user});

					result = updated;

					return updated;
				}

				return client;
			});

		return result;
	}

	// online(list) {
	// 	return list.map(user =>
	// 		this._clients
	// 			.filter(client => client.user.id === user.id)
	// 			.map(client => client.user.id)
	// 	).concatAll();
	// }

	friendsOnline(userId) {
		const client = this.findByUser(userId);

		if (Object.is(client, null)) {
			return [];
		}

		const {user} = client;
		const persons = xor(user.following, user.followers);

		return persons.map(person => this.findByUser(person));
	}

	leave(socketId) {
		const {user, sockets} = this.findBySocket(socketId);

		if (sockets.length === 1) {
			const friends = this.friendsOnline(user.id);
			this._clients = this._clients.filter(client => client.user.id !== user.id);

			return friends;
		}

		this._clients = this._clients
			.map(client => {
				if (client.user.id === user.id) {
					return {
						user,
						sockets: sockets.filter(socket => socket.id !== socketId),
					};
				}

				return client;
			});

		return [];
	}
}

module.exports = Clients;