const mongoose = require('../api-server/config/database');
const users = require('./Users');
const Promise = require('bluebird');

require('mongoose').model('User').collection.drop();
require('mongoose').model('Profile').collection.drop();
require('mongoose').model('Notification').collection.drop();
require('mongoose').model('Room').collection.drop();

Promise.all(users)
	.then(result => {
		console.log(`${result.length} Users created`);
		console.log('====================================================');
	})
	.catch(console.log)
	.finally(() => mongoose.connection.close());
