const Repo = require('../../repository');

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
	return Repo.user.noPopulate(id)
		.then(socketSelector);
}

module.exports = {
	self,
	list,
	socket,
	create,
	profile,
	publicProfile,
};