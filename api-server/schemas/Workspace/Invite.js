const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const InviteSchema = new Schema({
	recipient: {
		type: Schema.ObjectId, ref: 'User',
		required: true,
	},

	workspace: {
		type: Schema.ObjectId, ref: 'Workspace',
		required: true,
	},

	status: {
		type: String,
		required: true,
		lowercase: true,
		enum: ['accepted', 'declined', 'pending'],
		default: 'pending',
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

module.exports = mongoose.model('Invite', InviteSchema);