const _ = require('lodash');

Array.prototype.concatAll = function concatAll() {
	const result = [];
	this.forEach(subArray => subArray.forEach(item => result.push(item)));
	return result;
};

Array.prototype.unique = function unique() {
	return this.filter((value, index, self) => self.indexOf(value) === index);
};


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

	jointo(user, socket) {
		this._clients.push({user, socket});

		return this.onlineFriends(socket.id);
	}

	update(users) {
		const updated = [];

		this._clients = this._clients.map(client => {
			const filtered = users.filter(updatedUser => updatedUser.id === client.user.id)
				.map(user => {
					const newClient = Object.assign({}, {user}, {socket: client.socket});

					updated.push(newClient);

					return newClient;
				});

			if (filtered.length === 0) {
				return [client];
			}

			return filtered;
		}).concatAll();

		return updated;
	}

	online(list) {
		return list.map(user =>
			this._clients
				.filter(client => client.user.id === user.id)
				.map(client => client.user.id))
			.concatAll();
	}

	onlineFriends(socketId) {
		const Client = this._clients.filter(client => client.socket.id === socketId);

		return Client.map(client => {
			const {user} = client;

			const persons = [
				...user.following,
				...user.followers
			].unique();

			return persons.map(person =>
				this._clients.filter(match => person === match.user.id)
			).concatAll();

		}).concatAll();
	}

	leave(socketId) {
		const friends = this.onlineFriends(socketId);

		this._clients = this._clients.filter(client => client.socket.id !== socketId);

		return friends;
	}
}

module.exports = Clients;