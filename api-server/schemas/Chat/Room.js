const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RoomSchema = new Schema({
	messages: [{
		type: Schema.ObjectId, ref: 'Message',
	}],

	participants: [{
		type: Schema.ObjectId, ref: 'User',
		require: true,
	}],

	createdAt: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model('Room', RoomSchema);