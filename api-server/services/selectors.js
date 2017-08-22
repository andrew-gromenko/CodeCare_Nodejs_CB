/*===== Selectors =====*/
function selfSelector(user) {
	return {
		id: user.id,
		name: user.profile.name,
		username: user.username,
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

function contactsSelector(user) {
	return {
		followers: user.followers,
		following: user.following,
	}
}

function profileSelector(user) {
	return {};
}
function publicProfileSelector(user) {
	return {};
}

module.exports = {
	selfSelector,
	socketSelector,
	contactsSelector,
	profileSelector,
	publicProfileSelector,
};