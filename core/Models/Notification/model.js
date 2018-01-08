const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Notification = new Schema({
	type: {
		type: String,
		required: true,
		lowercase: true,
		enum: ['chat', 'workspace', 'common', 'invite', 'drop', 'leave', 'argues-comment', 'argues', 'reply'],
	},

	issuer: {
		type: Schema.ObjectId, ref: 'User',
		required: true,
	},

	recipient: {
		type: Schema.ObjectId, ref: 'User',
		required: true,
	},

	text: {
		type: String,
		default: ''
	},

	data: {
		type: Object,
		default: {}
	},

	pristine: {
		type: Boolean,
		default: true,
	},

	created_at: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model('Notification', Notification);