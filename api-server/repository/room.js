const Room = require('mongoose').model('Room');

class RoomRepository {
	constructor() {
		this.model = Room;
	}

	_prepare(room, param) {
		room.id = room._id;

		delete room.__v;
		delete room._id;

		if (param && typeof param !== 'number') {
			delete room[param];
		}

		// What a story, Mark?
		return JSON.parse(JSON.stringify(room));
	}

	create(participants) {
		return new this.model({participants})
			.save()
			.then(result =>
				this.model.findOne({_id: result._id})
					.lean(true)
					.then(this._prepare));
	}

	all(issuer) {
		return this.model
			.find({participants: {'$all': [issuer]}})
			.lean(true)
			.then(rooms => rooms.map(this._prepare));
	}

	findByParticipants(participants) {
		return this.model
			.findOne({participants: {'$all': participants, '$size': 2}})
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
			.lean(true)
			.then(this._prepare);
	}

	update(id, {}) {
	}

	message(id, message) {
	}
}

module.exports = new RoomRepository();