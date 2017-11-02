const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// examples of `entity`
// const image = {
// 	low: {
// 		src: '',
// 		width: '',
// 		height: '',
// 	},
//
// 	standard: {
// 		src: '',
// 		width: '',
// 		height: '',
// 	},
// };
//
// const audio = {
// 	src: '',
// 	samples: [],

// 	?image,  // image can be send if we will implement this future on front-end side. but i'm not sure
// };
//
// const video = {
// 	src: '',

// 	?image, // image can be send if we will implement this future on front-end side. but i'm not sure
// };


const Media = new Schema({
	owner: {
		type: Schema.ObjectId, ref: 'User',
		required: true,
	},

	type: {
		type: String,
		required: true,
		lowercase: true,
		enum: ['image', 'video', 'audio'],
	},

	entity: {
		type: Schema.Types.Mixed,
		required: true,
	},

	file_name: {
		type: String,
		required: true,
	},

	size: {
		type: Number,
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

module.exports = mongoose.model('Media', Media);