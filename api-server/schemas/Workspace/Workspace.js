const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WorkspaceSchema = new Schema({
	creator: {
		type: Schema.ObjectId, ref: 'User',
		required: true,
	},

	title: {
		type: String,
		required: true,
	},

	description: {
		type: String,
	},

	participants: [{
		type: Schema.ObjectId, ref: 'User',
	}],

	archived: {
		type: Boolean,
		default: false,
	},

	starts_at: {
		type: Date,
		default: Date.now,
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
		default: Date.now,
	},
});

module.exports = mongoose.model('Workspace', WorkspaceSchema);