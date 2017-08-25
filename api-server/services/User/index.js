const Repo = require('../../repository');
const Promise = require('bluebird');

/*===== Selectors =====*/
const {
	selfSelector,
	socketSelector,
	profileSelector,
	publicProfileSelector,
} = require('../selectors');

/*===== Service =====*/
function create({email, password, username}) {
	return Repo.profile
		.create(username)
		.then(profile => {
			const user = {
				email,
				password,
				username,
				profile: profile.id,
			};

			return Repo.user.create(user);
		});
}

function self(id) {
	return Repo.user.findById(id)
		.then(selfSelector);
}

function profile(id) {
	return Repo.user.findById(id)
		.then(profileSelector);
}

function publicProfile(username) {
	return Repo.user.findByUsername(username)
		.then(publicProfileSelector);
}

function list() {
	return Repo.user.all()
		.then(users => users.map(selfSelector));
}

function socket(id) {
	const user = Repo.user.noPopulate(id);
	const rooms = Repo.room.noPopulate(id);

	return Promise.all([user, rooms])
		.then(result => {
			const [user, rooms] = result;

			return Object.assign({}, socketSelector(user), {rooms});
		});
}

module.exports = {
	self,
	list,
	socket,
	create,
	profile,
	publicProfile,
};