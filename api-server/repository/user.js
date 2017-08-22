const User = require('mongoose').model('User');

class UserRepository {
	constructor() {
		this.model = User;
	}

	_prepare(user, param) {
		const userObject = user.toObject();
		userObject.id = userObject._id;

		delete userObject.__v;
		delete userObject._id;
		delete userObject.config;
		delete userObject.created_at;
		delete userObject.modified_at;
		delete userObject.password;

		if (param) {
			delete userObject[param];
		}

		return JSON.parse(JSON.stringify(userObject));
	}

	_populate(key = 'user') {
		const populate = {
			user: {
				path: 'profile',
				select: '-_id -__v',

				populate: {
					path: 'picture',
				},
			},

			profile: {
				path: 'profile',
				select: '-_id -__v',

				populate: {
					path: 'categories contacts cover picture',
					select: 'contacts.city contacts.country',
				},
			},
		};

		return populate[key];
	}

	create({email, username, password, profile}) {
		return new this.model({email, username, password, profile})
			.save()
			.then(user => this._prepare(user));
	}

	remove(id) {
		return this.update(id, {'$set': {'config.removed': true}});
	}

	update(id, options) {
		const instructions = {'new': true, runValidators: true};
		const query = Object.assign({'$currentDate': {modified_at: true}}, options);

		return this.model
			.findOneAndUpdate({_id: id}, query, instructions)
			.populate(this._populate('user'))
			.then(user => this._prepare(user));
	}

	verify({email, password}) {
		return this.model
			.findOne({email})
			.populate(this._populate('user'))
			.then(user => {
				if (!user) throw new Error('User not found');

				if (password) {
					return user.comparePassword(password)
						.then(valid => {
							if (!valid) throw new Error('Bad credentials');

							return this._prepare(user);
						});
				}

				return this._prepare(user);
			});
	}

	all() {
		return this.model
			.find({'config.removed': false})
			.populate(this._populate('profile'))
			.then(users => {
				if (!(!!users.length)) throw new Error('Sorry, but DB is empty');

				return users.map(user => this._prepare(user));
			});
	}

	noPopulate(id) {
		return this.model
			.findById(id)
			.then(user => {
				if (!user) throw new Error('User not found');

				return this._prepare(user);
			});
	}

	findById(id) {
		return this.model
			.findById(id)
			.populate(this._populate('profile'))
			.then(user => {
				if (!user) throw new Error('User not found');

				return this._prepare(user);
			});
	}

	findByUsername(username) {
		return this.model
			.findOne({username})
			.populate(this._populate('profile'))
			.then(user => {
				if (!user) throw new Error('User not found');

				return this._prepare(user);
			});
	}

	follow(follower, following) {
		return Promise.all([
			this.update(follower, {'$addToSet': {following: following}}),
			this.update(following, {'$addToSet': {followers: follower}}),
		]);
	}

	unfollow(follower, following) {
		return Promise.all([
			this.update(follower, {'$pull': {following: following}}),
			this.update(following, {'$pull': {followers: follower}}),
		]);
	}

	projects(userId, projectId, action) {
		switch (action) {
			case 'create': {
				return this.update(userId, {'$addToSet': {projects: projectId}});
			}

			case 'remove': {
				return this.update(userId, {'$pull': {projects: projectId}});
			}

			default: {
				throw new Error(`Action you passed in should be one of ['remove', 'create']. Passed ${action}`);
			}
		}
	}

	gigs(userId, gigId, action) {
		switch (action) {
			case 'create': {
				return this.update(userId, {'$addToSet': {gigs: gigId}});
			}

			case 'remove': {
				return this.update(userId, {'$pull': {gigs: gigId}});
			}

			default: {
				throw new Error(`Action you passed in should be one of ['remove', 'create']. Passed ${action}`);
			}
		}
	}
}

module.exports = new UserRepository();