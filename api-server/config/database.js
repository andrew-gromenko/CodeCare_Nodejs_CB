const mongoose = require('mongoose');
const Promise = require('bluebird');

const {db} = require('../../config');

// Setup mongoose use bluebird promises
mongoose.Promise = Promise;

// Create the database connection
mongoose.connect(db.url, {
	useMongoClient: true,
});

// When successfully connected
mongoose.connection.on('connected', () => {
	console.info(`Mongoose connection open`);
});

// If the connection throws an error
mongoose.connection.on('error', error => {
	console.error(error);
});

// When the connection is disconnected
mongoose.connection.on('disconnected', () => {
	console.info('Mongoose default connection disconnected');
});

// If the Node process ends, close the Mongoose connection
process.on('SIGINT', () => {
	mongoose.connection.close(() => {
		console.info('Mongoose default connection disconnected through app termination');
		process.exit(0);
	});
});

require('../schemas');

module.exports = mongoose;