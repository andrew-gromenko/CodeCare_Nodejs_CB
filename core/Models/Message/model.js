const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Message = new Schema({
	issuer: {
		type: Schema.ObjectId, ref: 'User',
		required: true,
	},

	room: {
		type: Schema.ObjectId, ref: 'Room',
		required: true,
	},

	body: {
		type: String,
		required: true,
	},

	media: {
		type: Schema.ObjectId, ref: 'Media',
	},

	pristine: {
		type: Boolean,
		default: true,
	},

	created_at: {
		type: Date,
		default: Date.now,
	},

	modified_at: {
		type: Date,
	},
});

module.exports = mongoose.model('Message', Message);