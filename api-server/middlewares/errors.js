function errorHandler(error, request, response, next) {
	console.log('errorHandler ======================');
	console.log(error);

	next();
}

module.exports = errorHandler;