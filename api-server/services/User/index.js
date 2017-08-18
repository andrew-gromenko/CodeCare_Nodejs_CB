const Repo = require('../../repository');
const Socket = require('../Socket/service');

/*===== Selectors =====*/
function selfSelector(user) {
	return {
		id: user.id,
		name: user.profile.name,
		username: user.username,
		followers: user.followers.length,
		following: user.following.length,
		projects: user.projects.length,
		gigs: user.gigs.length,
		picture: user.profile.picture || '',
	}
}

function socketSelector(user) {
	return {
		id: user.id,
		followers: user.followers,
		following: user.following,
	}
}

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

function list() {
	return Repo.user.all()
		.then(users => users.map(selfSelector));
}

function follow(follower, following) {
	return Repo.user.follow(follower, following)
		.then(users => {
			const [follower, following] = users;

			Socket.update([
				socketSelector(follower),
				socketSelector(following)
			]);

			return selfSelector(follower);
		});
}

function unfollow(follower, following) {
	return Repo.user
		.unfollow(follower, following)
		.then(users => {
			const [follower, following] = users;

			Socket.update([
				socketSelector(follower),
				socketSelector(following)
			]);

			return selfSelector(follower);
		});
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
	follow,
	unfollow,
};