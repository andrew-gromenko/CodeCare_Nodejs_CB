const Argument = require('../Models/Argument');
const Comment = require('../Models/Comment');

/**
 * =======
 * Exports
 * =======
 */

module.exports = {
};


/**
 * =======
 * Helpers
 * =======
 */

function errorHandler(error) {
	return {
		status: 400,
		error: {
			message: error.message,
		},
	};
}

function successHandler(data) {
	return {
		status: 200,
		data,
	};
}


/**
 * =======
 * Core
 * =======
 */