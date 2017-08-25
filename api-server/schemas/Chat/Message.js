const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
	issuer: {
		type: Schema.ObjectId, ref: 'User',
		required: true,
	},

	body: {
		type: String,
		required: true,
	},

	additionally: {
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
});

module.exports = mongoose.model('Message', MessageSchema);