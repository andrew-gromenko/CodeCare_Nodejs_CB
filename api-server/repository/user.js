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
		delete userObject.createdAt;
		delete userObject.password;

		if (param) {
			delete userObject[param];
		}

		// What a story, Mark?
		return JSON.parse(JSON.stringify(userObject));
	}

	create({email, username, password}) {
		return new this.model({email, username, password})
			.save()
			.then(user => this._prepare(user));
	}

	update(id, options) {
	}

	remove(id) {
	}

	verify({email, password}) {
		return this.model
			.findOne({email})
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
			.find({})
			.then(users => {
				if (users.length <= 0) throw new Error('Sorry, but DB is empty');

				return users.map(user => this._prepare(user));
			});
	}

	findById(id) {
		return this.model
			.findById(id)
			.then(user => {
				if (!user) throw new Error('User not found');

				return this._prepare(user);
			});
	}

	follow(follower, following) {
		const userFollower = this.model.findOneAndUpdate({_id: follower}, {$addToSet: {'following': following}}, {
			'new': true,
			runValidators: true
		})
			.then(user => {
				if (!user) throw new Error('User not found');

				return this._prepare(user);
			});

		const userFollowing = this.model.findOneAndUpdate({_id: following}, {$addToSet: {'followers': follower}}, {
			'new': true,
			runValidators: true
		})
			.then(user => {
				if (!user) throw new Error('User not found');

				return this._prepare(user);
			});

		return Promise.all([userFollower, userFollowing]);
	}

	unfollow(follower, following) {
		const userFollower = this.model.findOneAndUpdate({_id: follower}, {$pull: {'following': following}}, {
			'new': true,
			runValidators: true
		})
			.then(user => {
				if (!user) throw new Error('User not found');

				return this._prepare(user);
			});

		const userFollowing = this.model.findOneAndUpdate({_id: following}, {$pull: {'followers': follower}}, {
			'new': true,
			runValidators: true
		})
			.then(user => {
				if (!user) throw new Error('User not found');

				return this._prepare(user);
			});

		return Promise.all([userFollower, userFollowing]);
	}
}

module.exports = new UserRepository();