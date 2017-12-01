const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Media = new Schema({
	owner: {
		type: Schema.ObjectId, ref: 'User',
		required: true,
	},

	type: {
		type: String,
		required: true,
		lowercase: true,
		enum: ['image', 'video', 'audio', 'other'],
	},

	extension: {
		type: String,
		lowercase: true,
	},

	entity: {
		type: Schema.Types.Mixed,
		required: true,
	},

	file_name: {
		type: String,
		required: true,
	},

	tag: {
		type: String,
		default: ''
	},

	size: {
		type: Number,
		required: true,
	},

	created_at: {
		type: Date,
		default: Date.now,
	},

	modified_at: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model('Media', Media);