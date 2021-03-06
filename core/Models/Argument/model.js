const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Argument = new Schema({
	issuer: {
		type: Schema.ObjectId, ref: 'User',
		required: true,
	},

	workspace: {
		type: Schema.ObjectId, ref: 'Workspace',
		required: true,
	},

	body: {
		type: String,
	},

	likes: [{
		type: Schema.ObjectId, ref: 'User',
	}],

	votes: [{
		type: Schema.ObjectId, ref: 'User',
	}],

	media: {
		type: Object,
		ref: 'Media',
		default: {}
	},

	commentsCount: {
		type: Number,
		default: 0
	},

	created_at: {
		type: Date,
		default: Date.now,
	},

	modified_at: {
		type: Date,
		default: Date.now,
	},
}, { usePushEach: true });

module.exports = mongoose.model('Argument', Argument);