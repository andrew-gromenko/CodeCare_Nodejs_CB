const Notification = require('../../services/Notification');

function list(request, response, next) {
	const {id, email, username} = request._user;

	Notification.list(id)
		.then(notifications =>
			response.send({status: 200, data: {notifications}}))
		.catch(error =>
			response.send({status: 400, error: {message: error.message}}));
}

// function notifications(request, response, next) {
// 	const {_user} = request;
//
// 	return repo.notification.find({recipient: _user.id})
// 		.then(notifications =>
// 			response.send({status: 200, data: {notifications}}))
// 		.catch(error =>
// 			response.send({status: 400, error: {message: error.message}}));
// }
//
// function notificationsUpdate(request, response, next) {
// 	const {_user, params} = request;
//
// 	if (params.id === 'all') {
// 		return Notification.pristineAll(_user.id)
// 			.then(notifications =>
// 				response.send({status: 200, data: {notifications}}))
// 			.catch(error =>
// 				response.send({status: 400, error: {message: error.message}}));
// 	}
//
// 	return Notification.pristine(params.id)
// 		.then(notifications =>
// 			response.send({status: 200, data: {notifications}}))
// 		.catch(error =>
// 			response.send({status: 400, error: {message: error.message}}));
// }

module.exports = {
	list,
};