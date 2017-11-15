const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Comment = new Schema({
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

	belongs_to: {
		type: Schema.ObjectId,
	},

	replied_to: {
		type: Schema.ObjectId, ref: 'Comment',
	},

	likes: [{
		type: Schema.ObjectId, ref: 'User',
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

module.exports = mongoose.model('Comment', Comment);