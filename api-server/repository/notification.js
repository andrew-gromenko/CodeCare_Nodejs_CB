const Notification = require('mongoose').model('Notification');

class NotificationRepository {
	constructor() {
		this.model = Notification;
	}

	_prepare(notification, param) {
		notification.id = notification._id;

		delete notification.__v;
		delete notification._id;

		if (param) {
			delete notification[param];
		}

		// What a story, Mark?
		return JSON.parse(JSON.stringify(notification));
	}

	create({type, issuer, text, recipient}) {
		return new this.model({type, issuer, text, recipient})
			.save()
			.then(notification => {
				return this.model
					.findOne({_id: notification._id})
					.lean(true)
					.then(this._prepare);
			});
	}

	update(id, pristine) {
		return this.model
			.findByIdAndUpdate(id, {pristine}, {'new': true, runValidators: true})
			.lean(true)
			.then(result => {
				return this.model
					.find({recipient: result.recipient, pristine: false})
					.lean(true)
					.then(notifications => notifications.map(this._prepare));
			});
	}

	updateAll(user) {
		return this.model
			.updateMany({recipient: user, pristine: false}, {pristine: true}, {'new': true, runValidators: true})
			.lean(true);
	}

	find({recipient, pristine = false}) {
		return this.model
			.find({recipient, pristine})
			.lean(true)
			.then(notifications => notifications.map(this._prepare));
	}

	one(id) {
		return this.model
			.findById(id)
			.lean(true)
			.then(this._prepare);
	}
}

module.exports = new NotificationRepository();