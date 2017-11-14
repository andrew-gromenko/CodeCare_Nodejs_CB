const Argument = require('../Models/Argument');
const Comment = require('../Models/Comment');

/**
 * =======
 * Exports
 * =======
 */

module.exports = {
	list,
	create,
	update,
	react,
	remove,
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

function list(request, response) {
	return Promise.resolve(successHandler({comments: [], next: '', count: 0 }));
}

function create(request, response) {
	return Promise.resolve(successHandler({comments: [], next: '', count: 0 }));
}

function update(request, response) {
	return Promise.resolve(successHandler({comments: [], next: '', count: 0 }));
}

function react(request, response) {
	return Promise.resolve(successHandler({comments: [], next: '', count: 0 }));
}

function remove(request, response) {
	return Promise.resolve(successHandler({comments: [], next: '', count: 0 }));
}
