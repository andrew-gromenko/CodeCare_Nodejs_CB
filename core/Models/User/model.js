const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const isEmail = require('validator/lib/isEmail');
const Schema = mongoose.Schema;

const User = new Schema({
	email: {
		type: String,
		unique: true,
		required: true,
	},

	password: {
		type: String,
		required: true,
	},

	username: {
		type: String,
		unique: true,
		required: true,
	},

	name: {
		type: String,
		default: ''
	},

	city: {
		type: String,
		default: ''
	},

	country: {
		type: String,
		default: ''
	},

	phone: {
		type: String,
		default: ''
	},

	cover: {
		type: Schema.ObjectId, ref: 'Media',
	},

	picture: {
		type: Schema.ObjectId, ref: 'Media',
	},

	categories: [{
		type: String,
		default: []
	}],

	skills: [{
		type: String,
		default: []
	}],

	summary: {
		type: String,
		default: ''
	},

	followers: [{
		type: Schema.ObjectId, ref: 'User',
	}],

	following: [{
		type: Schema.ObjectId, ref: 'User',
	}],

	created_at: {
		type: Date,
		default: Date.now,
	},

	modified_at: {
		type: Date,
		default: Date.now,
	},

	__removed: {
		type: Boolean,
		default: false,
	},

	__public: {
		type: Boolean,
		default: true,
	},
	avatar: {
		type: String,
		default: ''
	},
	background: {
		type: String,
		default: ''
	},
	events: {
		type: Array,
		default: []
	},
	projects: {
		type: Array,
		default: []
	},
	blacklist: [{
		type: Schema.ObjectId, ref: 'User',
	}],
	views: {
		type: Number,
		default: 0
	},
	paymentToken: {
		type: 'String'

	},
	paidFor: {
		type: Boolean,
		default: true,
		required: true
	},
	verified: {
		type: Boolean,
		default: false
	},

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

function comparePassword(candidatePassword) {
	return bcrypt.compare(candidatePassword, this.password);
}

// TODO: Prevent creation of users with a username like 'admin' and so.
User
	.path('email')
	.validate(value => isEmail(value), 'Invalid email');

User
	.pre('save', true, encryptPassword);

User.methods
	.comparePassword = comparePassword;

module.exports = mongoose.model('User', User);