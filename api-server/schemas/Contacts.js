const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ContactsSchema = new Schema({
	city: {
		type: String,
		default: '',
	},

	country: {
		type: String,
		default: '',
	},

	email: {
		type: String,
		default: '',
	},

	phone: {
		type: String,
		default: '',
	},

	secure: [{
		phone: {
			type: String,
			enum: ['private', 'friends', 'public'],
			default: 'private',
		},
		email: {
			type: String,
			enum: ['private', 'friends', 'public'],
			default: 'private',
		},
	}]
});

module.exports = mongoose.model('Contacts', ContactsSchema);