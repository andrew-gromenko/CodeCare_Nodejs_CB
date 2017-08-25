const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const NotificationSchema = new Schema({
	type: {
		type: String,
		required: true,
		lowercase: true,
		enum: ['chat', 'workspace', 'common'],
	},

	issuer: {
		type: Schema.ObjectId, ref: 'User',
		required: true,
	},

	text: {
		type: String,
		required: true,
	},

	recipient: {
		type: Schema.ObjectId, ref: 'User',
		required: true,
	},

	pristine: {
		type: Boolean,
		required: true,
		default: true,
	},

	createdAt: {
		type: Date,
		default: Date.now,
	},

	__v: {
		type: Number,
		select: false,
	}
});

module.exports = mongoose.model('Notification', NotificationSchema);