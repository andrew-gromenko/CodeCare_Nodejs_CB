const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const GigSchema = new Schema({
	cover: {
		type: Schema.ObjectId, ref: 'Media',
	},

	title: {
		type: String,
		required: true,
	},

	description: {
		type: String,
		default: '',
	},

	starts_at: {
		type: Date,
		required: true,
	},

	ends_at: {
		type: Date,
		required: true,
	},

	created_at: {
		type: Date,
		default: Date.now,
	},

	modified_at: {
		type: Date,
	},
});

module.exports = mongoose.model('Gig', GigSchema);