// Init .env variables
require('dotenv').config();

// Third party libs
const Promise = require('bluebird');

// Connection to the database
const DB = require('../config/database');

// Models
const User = require('../core/Models/User');

DB.connection.dropDatabase((error) => {
	if (error) throw error;

	console.log('============= Database is dropped =============');
});

const users = [...new Array(25).keys()]
	.map(key => {
		const number = key + 1;
		const user = {
			email: `user_${number}@gmail.com`,
			username: `user_${number}`,
			password: 'password',
		};
		const profile = {
			name: `Awesome User ${number}`,
			city: 'Brescia',
			country: 'Italy',
			phone: '3480058753',
			categories: [],
			skills: ['DoubleBass', 'Mixing', 'Mastering', 'Composing', 'Sound', 'Design', 'Logic X', 'Soundtrack', 'Piano', 'Ciao'],
			summary: `Awesome User ${number} is a musician, poli-intrumentalist and music producer.
					He has a degree in double bass from the Conservatory of Brescia (Italy), and a professional certificate in
					electronic music composition from Berklee College of Music (Boston, MA).
					He is one of the Clockbeats Founder. He has an extensive network of professionals in the music industry worldwide.`,
		};

		return User.create(user)
			.then(model => {
				console.log('=============');
				console.log('User created', model.email);

				return model;
			})
			// TODO: split to the separate functions
			// TODO: add creating `workspace (with few arguments)`
			.then(model => User.update(model.id, profile));
	});

Promise.all(users)
	.then(result =>
		console.log(`============= ${result.length} Users created =============`))
	.catch(console.log)
	.finally(() =>
		DB.connection.close(() => {
			console.log('============= Database connection is closed =============');
			process.exit(0);
		}));