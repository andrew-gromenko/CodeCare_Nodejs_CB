const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
	issuer: {
		type: Schema.ObjectId, ref: 'User',
	},

	recipient: {
		type: Schema.ObjectId, ref: 'Room',
	},

	text: {
		type: String,
	},

	removed: {
		type: Boolean,
		default: false,
	},

	pristine: {
		type: Boolean,
		default: false,
	},

	createdAt: {
		type: Date,
		default: Date.now,
	},

	__v: {
		type: Number,
		select: false,
	},
});

module.exports = mongoose.model('Message', MessageSchema);