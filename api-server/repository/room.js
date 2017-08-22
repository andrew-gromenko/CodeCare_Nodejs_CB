const Room = require('mongoose').model('Room');
const Promise = require('bluebird');

class RoomRepository {
	constructor() {
		this.model = Room;
	}

	_prepare(room, param) {
		const result = Object.assign({}, JSON.parse(JSON.stringify(room)), {
			id: room._id
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

				populate: {
          path: 'issuer',
					select: 'id username profile',

					populate: {
          	path: 'profile',
						select: 'name picture',
					},
        },
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

							console.log('======= Chat document created =======');
							console.log(this._prepare(document));
							console.log('');

							resolve(this._prepare(document));
						});
				};

				return new Promise(handler);
			});
	}

	all(issuer) {
		return this.model
			.find({participants: {'$all': [issuer]}})
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

	find(id) {
		return this.model
			.findOne({_id: id})
			.populate(this._populate('messages'))
			.lean(true)
			.then(this._prepare);
	}

	update(id, {}) {
	}

	message(id, message) {
	}
}

module.exports = new RoomRepository();