const Media = require('../../repository/media');

module.exports = {
	list,
	create,
	update,
	remove,
};

// TODO: should generate link to next chain
// TODO: should support query filtering
function list(user, query) {
	return Media.list(user, query);
}

function create(user) {}

function update(media, options) {}

function remove(media) {}