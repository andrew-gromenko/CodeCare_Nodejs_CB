const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProjectSchema = new Schema({
	title: {
		type: String,
		required: true,
	},

	cover: {
		type: Schema.ObjectId, ref: 'Media',
	},

	media: {
		type: Schema.ObjectId, ref: 'Media',
	},

	likes: [{
		type: Schema.ObjectId, ref: 'User',
	}],

	comments: [{
		type: Schema.ObjectId, ref: 'Comment',
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

module.exports = mongoose.model('Project', ProjectSchema);