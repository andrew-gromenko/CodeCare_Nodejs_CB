const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MediaSchema = new Schema({
	owner: {
		type: Schema.ObjectId, ref: 'User',
		required: true,
	},

	type: {
		type: String,
		required: true,
		lowercase: true,
		enum: ['image', 'video', 'audio'],
	},

	entity: {
		type: Schema.Types.Mixed,
		required: true,
	},

	file_name: {
		type: String,
		required: true,
	},

	extension: {
		type: String,
		required: true,
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

module.exports = mongoose.model('Media', MediaSchema);