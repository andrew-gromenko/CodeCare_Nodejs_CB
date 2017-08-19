const uniq = require('lodash/uniq');
const head = require('lodash/head');
const compact = require('lodash/compact');
const findIndex = require('lodash/findIndex');

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

	set list(clients) {
		this._clients = clients;
	}

	findByUser(userId) {
		const result = this.list
			.filter(client => client.user.id === userId);

		return head(result);
	}

	findBySocket(socketId) {
		const result = this.list
			.map(client => {
				const match = client.sockets
					.filter(socket => socket.id === socketId);

				if (match.length > 0) {
					return client;
				}
			});

		return head(compact(result));
	}

	jointo(user, socket) {
		try {
			const client = this.findByUser(user.id);

			if (client) {
				const index = findIndex(this.list, client);
				const updated = {
					user,
					sockets: [...client.sockets, socket],
				};

				this.list = [
					...this.list.slice(0, index),
					updated,
					...this.list.slice(index + 1),
				];
			} else {
				const created = {
					user,
					sockets: [socket],
				};

				this.list = [
					...this.list,
					created,
				];
			}

			return this.friends(user);
		} catch(error) {
			console.log(error);
		}
	}

	leave(socketId) {
		try {
			const client = this.findBySocket(socketId);

			if (client) {
				const index = findIndex(this.list, client);
				const {user, sockets} = client;

				if (sockets.length > 1) {
					const updated = {
						user,
						sockets: sockets.filter(socket => socket.id !== socketId),
					};

					this.list = [
						...this.list.slice(0, index),
						updated,
						...this.list.slice(index + 1),
					];
				} else {
					this.list = [
						...this.list.slice(0, index),
						...this.list.slice(index + 1),
					];
				}

				return this.friends(user);
			}
		} catch (error) {
			console.log(error);
		}
	}

	update(user) {
		try {
			const client = this.findByUser(user.id);

			if (client) {
				const index = findIndex(this.list, client);
				const {sockets} = client;
				const updated = {
					user,
					sockets,
				};

				this.list = [
					...this.list.slice(0, index),
					updated,
					...this.list.slice(index + 1),
				];

				return updated;
			}
		} catch (error) {
			console.log(error);
		}
	}

	friends({following, followers}, type = 'deep') {
		try {
			const persons = uniq([...following, ...followers]);
			const friends = persons.map(person => this.findByUser(person));

			return compact(friends);
		} catch (error) {
			console.log(error);
		}
	}
}

module.exports = Clients;