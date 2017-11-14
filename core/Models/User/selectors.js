const {pick, omit} = require('lodash');

module.exports = {
	userSelector,
	selfSelector,
	profileSelector,
	contactsSelector,
};

/*===== Selectors =====*/
function userSelector(user) {
	return pick(user, [
		'id',
		'name',
		'username',
		'picture',
	]);
}

function selfSelector(user) {
	const picked = omit(user, ['followers', 'following']);

	return {
		...picked,
		counts: {
			followers: user.followers.length,
			following: user.following.length,
		},
	};
}

function profileSelector(user) {
	const omitted = omit(user, [
		'email',
		'phone',
		'followers',
		'following'
	]);
	
	return {
		...omitted,
		counts: {
			followers: user.followers.length,
			following: user.following.length,
		},
	};
}

function contactsSelector(user) {
	return pick(user, [
		'id',
		'followers',
		'following',
	]);
}