const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MediaSchema = new Schema({
	type: {
		type: String,
		enum: ['image', 'video', 'sound'],
		required: true,
	},

	sources: {
		small: {type: String},
		source: {type: String},
	},

	created_at: {
		type: Date,
		default: Date.now,
	},

	modified_at: {
		type: Date,
	},
});

module.exports = mongoose.model('Media', MediaSchema);