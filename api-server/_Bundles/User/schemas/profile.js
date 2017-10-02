const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
	name: {
		type: String,
		default: '',
	},

	categories: [{
		type: Schema.ObjectId, ref: 'Category',
	}],

	contacts: {
		type: Schema.ObjectId, ref: 'Contacts',
	},

	cover: {
		type: Schema.ObjectId, ref: 'Media',
	},

	picture: {
		type: Schema.ObjectId, ref: 'Media',
	},

	skills: [{
		_id: false,
		type: String,
	}],

	summary: {
		type: String,
		default: '',
	},
});

module.exports = mongoose.model('Profile', ProfileSchema);