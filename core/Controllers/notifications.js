const Notification = require('../Models/Notification');
/**
 * =======
 * Exports
 * =======
 */

module.exports = {
    list,
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
    const { _user } = request;

    Notification.list(_user.id)
        .then(notifications => {
            console.log('NOTIFATIONS', notifications)
            return response.send(successHandler(notifications))
        })
        .catch(error =>
            response.send(errorHandler(error)));
}