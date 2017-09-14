const Message = require('mongoose').model('Message');

class MessageRepository {
	constructor() {
		this.model = Message;
	}

	_prepare(message, param) {
		const result = Object.assign({}, JSON.parse(JSON.stringify(message)), {
			id: message._id,
		});

		delete result._id;
		delete result.__v;

		if (param) {
			delete result[param];
		}

		return result;
	}

	_populate() {
		return {
			path: 'additionally',
			select: 'type sources',
		};
	}

	create({issuer, body, additionally}) {
		return new this.model({issuer, body, additionally})
			.save()
			.then(message => {
				const handler = (resolve, reject) => {
					message
						.populate(this._populate(), (error, document) => {
							if (error) reject(error);

							resolve(this._prepare(document));
						});
				};

				return new Promise(handler);
			});
	}

	remove(message) {
		return this.model
			.findOneAndRemove({_id: message});
	}

	update({body, removed, pristine}) {
	}
}

module.exports = new MessageRepository();