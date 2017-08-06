const repo = require('../../repository');
const Socket = require('../Socket/service');

function create(participants) {
	return repo.room
		.create(participants);
}

function list(userId) {
	return repo.room
		.all(userId);
}

function find(participants) {
	return repo.room
		.findByParticipants(participants);
}

function findById(id) {
	return repo.room
		.find(id);
}


module.exports = {
	create,
	list,
	find,
	findById,
};