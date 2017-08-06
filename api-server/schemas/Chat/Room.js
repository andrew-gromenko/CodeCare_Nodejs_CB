const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RoomSchema = new Schema({
	messages: [{
		type: Schema.ObjectId, ref: 'Message',
	}],

	participants: [{
		type: Schema.ObjectId, ref: 'User',
		require: true,
	}],

	createdAt: {
		type: Date,
		default: Date.now,
	},

	__v: {
		type: Number,
		select: false,
	}
});

function populate(next) {
	this
		.populate({
			path: 'messages',

			populate: {
				path: 'issuer',
				select: 'id username picture',
			},
		})
		.populate({
			path: 'messages',

			populate: {
				path: 'recipient',
				select: 'id username picture',
			},
		})
		.populate({
			path: 'participants',
			select: 'id username picture',
		});

	next();
}

RoomSchema
	.pre('find', populate)
	.pre('findOne', populate);

module.exports = mongoose.model('Room', RoomSchema);