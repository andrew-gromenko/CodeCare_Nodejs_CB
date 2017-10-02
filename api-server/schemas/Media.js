const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MediaSchema = new Schema({
	type: {
		type: String,
		required: true,
		lowercase: true,
		enum: ['image', 'video', 'audio'],
	},

	image: {
		small: {
			src: {type: String, required: true},
			width: {type: Number, required: true},
			height: {type: Number, required: true},
		},

		original: {
			src: {type: String, required: true},
			width: {type: Number, required: true},
			height: {type: Number, required: true},
		},
	},

	source: {
		type: String,
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