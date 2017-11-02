const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Room = new Schema({
	participants: [{
		type: Schema.ObjectId, ref: 'User',
		require: true,
	}],

	created_at: {
		type: Date,
		default: Date.now,
	},

	modified_at: {
		type: Date,
		default: Date.now,
	},

	__removed_for: [{
		type: Schema.ObjectId, ref: 'User',
	}],
});

module.exports = mongoose.model('Room', Room);