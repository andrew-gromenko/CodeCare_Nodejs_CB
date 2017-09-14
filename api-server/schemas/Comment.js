const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
	issuer: {
		type: Schema.ObjectId, ref: 'User',
		required: true,
	},

	body: {
		type: String,
		default: '',
	},

	media: {
		type: Schema.ObjectId, ref: 'Media',
	},

	tags: [{
		type: String,
	}],

	created_at: {
		type: Date,
		default: Date.now,
	},

	modified_at: {
		type: Date,
		default: Date.now,
	},
});

module.exports = mongoose.model('Comment', CommentSchema);