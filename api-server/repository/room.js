const Room = require('mongoose').model('Room');
const Promise = require('bluebird');

class RoomRepository {
	constructor() {
		this.model = Room;
	}

	_prepare(room, param) {
		const result = Object.assign({}, JSON.parse(JSON.stringify(room)), {
			id: room._id,
			messages: room.messages.map(message => {
				const result = Object.assign({}, message, {
					id: message._id
				});

				delete result._id;

				return result;
			})
		});

		delete result.__v;
		delete result._id;

		if (param && typeof param !== 'number') {
			delete result[param];
		}

		// What a story, Mark?
		return result;
	}

	_populate(type = 'messages') {
		const populate = {
			participants: {},

			messages: {
				path: 'messages',
				select: 'id body issuer created_at pristine',
			},
		};

		return populate[type];
	}

	create(participants) {
		return new this.model({participants})
			.save()
			.then(chat => {
				const handler = (resolve, reject) => {
					chat
						.populate(this._populate('messages'), (error, document) => {
							if (error) {
								reject(error);
							}

							resolve(this._prepare(document));
						});
				};

				return new Promise(handler);
			});
	}

	noPopulate(issuer) {
		return this.model
			.find({participants: {'$all': [issuer]}})
			.select('id')
			.sort({modified_at: -1})
			.lean(true)
			.then(rooms => rooms.map(room => room._id.toString()));
	}

	all(issuer) {
		return this.model
			.find({participants: {'$all': [issuer]}})
			.sort({modified_at: -1})
			.populate(this._populate('messages'))
			.lean(true)
			.then(rooms => rooms.map(this._prepare));
	}

	findByParticipants(participants) {
		return this.model
			.findOne({participants: {'$all': participants, '$size': 2}})
			.populate(this._populate('messages'))
			.lean(true)
			.then(chat => {
				if (!chat) {
					return [];
				}

				return this._prepare(chat);
			});
	}

	find(room) {
		return this.model
			.findOne({_id: room})
			.populate(this._populate('messages'))
			.lean(true)
			.then(this._prepare);
	}

	pushMessage(room, message) {
		const query = {
			'$addToSet': {messages: message},
			'$currentDate': {modified_at: true},
		};
		return this.model
			.findOneAndUpdate({_id: room}, query);
	}

	pullMessage(room, message) {
		const query = {
			'$pull': {messages: message},
			'$currentDate': {modified_at: true},
		};
		return this.model
			.findOneAndUpdate({_id: room}, query);
	}
}

module.exports = new RoomRepository();