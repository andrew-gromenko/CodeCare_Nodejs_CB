const Notification = require('mongoose').model('Notification');
const Promise = require('bluebird');

class NotificationRepository {
	constructor() {
		this.model = Notification;
	}

	_prepare(notification, param) {
		const result = Object.assign({}, JSON.parse(JSON.stringify(notification)), {
			id: `${notification._id}`,
			issuer: {
				id: `${notification.issuer._id}`,
				name: notification.issuer.profile.name,
				username: notification.issuer.username,
				picture: notification.issuer.picture,
			},
			recipient: `${notification.recipient._id}`,
		});

		delete result._id;
		delete result.__v;

		if (param) {
			delete result[param];
		}

		return result;
	}

	_populate(type = 'issuer') {
		const populate = {
			issuer: {
				path: 'issuer',
				select: 'id username profile',

				populate: {
					path: 'profile',
					select: '-_id name picture',

					populate: {
						path: 'picture',
					},
				}
			},

			recipient: {
				path: 'recipient',
				select: 'id username picture',
			},
		};

		return populate[type];
	}

	create({type, issuer, text, recipient}) {
		return new this.model({type, issuer, text, recipient})
			.save()
			.then(notification => {
				const handler = (resolve, reject) => {
					notification
						.populate(this._populate('issuer'))
						.populate(this._populate('recipient'), (error, document) => {
							if (error) {
								reject(error);
							}

							resolve(this._prepare(document));
						});
				};

				return new Promise(handler);
			});
	}

	update(id, pristine) {
		return this.model
			.findByIdAndUpdate(id, {pristine}, {'new': true, runValidators: true})
			.populate(this._populate('issuer'))
			.populate(this._populate('recipient'))
			.lean(true)
			.then(notifications => notifications.map(notification => this._prepare(notification)));
	}

	updateAll(user) {
		return this.model
			.updateMany({recipient: user, pristine: false}, {pristine: true}, {'new': true, runValidators: true})
			.lean(true);
	}

	find({recipient, pristine = false}) {
		return this.model
			.find({recipient, pristine})
			.populate(this._populate('issuer'))
			.populate(this._populate('recipient'))
			.lean(true)
			.then(notifications => notifications.map(notification => this._prepare(notification)));
	}

	one(id) {
		return this.model
			.findById(id)
			.lean(true)
			.then(this._prepare);
	}
}

module.exports = new NotificationRepository();