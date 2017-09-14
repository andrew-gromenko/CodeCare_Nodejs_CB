const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MediaSchema = new Schema({
	type: {
		type: String,
		enum: ['image', 'video', 'audio'],
		required: true,
	},

	sources: {
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