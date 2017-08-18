const User = require('../api-server/services/User');
const promises = [];

for (let i = 0; i < 25; i++) {
	const user = {
		email: `user_${i}@gmail.com`,
		username: `user_${i}`,
		password: 'password',
	};

	promises.push(User.create(user));
}

module.exports = promises;