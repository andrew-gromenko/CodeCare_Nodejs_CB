const Profile = require('mongoose').model('Profile');

class ProfileRepository {
	constructor() {
		this.model = Profile;
	}

	_prepare(profile, param) {
		const profileObject = profile.toObject();
		profileObject.id = profileObject._id;

		delete profileObject.__v;

		if (param) {
			delete profileObject[param];
		}

		return JSON.parse(JSON.stringify(profileObject));
	}

	create(username) {
		return new this.model({name: username})
			.save()
			.then(profile => this._prepare(profile));
	}

	update(id, options) {
		const instructions = {'new': true, runValidators: true};

		return this.model
			.findOneAndUpdate({_id: id}, options, instructions)
			.then(profile => this._prepare(profile));
	}
}

module.exports = new ProfileRepository();