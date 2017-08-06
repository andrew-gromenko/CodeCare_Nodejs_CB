const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const isEmail = require('validator/lib/isEmail');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
	email: {
		type: String,
		unique: true,
		required: true
	},

	password: {
		type: String,
		required: true,
	},

	username: {
		type: String,
		required: true,
	},

	picture: {
		type: String,
		default: '',
	},

	followers: [{
		type: Schema.ObjectId, ref: 'User',
	}],

	following: [{
		type: Schema.ObjectId, ref: 'User',
	}],

	createdAt: {
		type: Date,
		default: Date.now,
	},

	__v: {
		type: Number,
		select: false,
	}
});

function encryptPassword(next, done) {
	if (!this.isModified('password')) {
		done();
		return next();
	}

	bcrypt.hash(this.password, 10)
		.then(hash => {
			this.password = hash;
			done();
		});

	next();
}

UserSchema
	.path('email')
	.validate(value => isEmail(value), 'Invalid email');

UserSchema
	.pre('save', true, encryptPassword);

UserSchema.methods.comparePassword = function (candidatePassword) {
	const handler = (resolve, reject) => {
		bcrypt.compare(candidatePassword, this.password, (error, result) => {
			if (error) reject(error);
			resolve(result);
		});
	};

	return new Promise(handler);
};

module.exports = mongoose.model('User', UserSchema);