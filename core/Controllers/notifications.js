const Notification = require('../Models/Notification');

/**
 * =======
 * Exports
 * =======
 */

module.exports = {
  list,
  readMany,
  read,
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
      return response.send(successHandler(notifications))
    })
    .catch(error =>
      response.send(errorHandler(error)));
}

function readMany(request, response) {
  const {
    _user,
    params: { type },
  } = request;

  Notification.readMany(_user.id, type)
    .then(_ => {
      return response.send(successHandler(type))
    })
    .catch(error =>
      response.send(errorHandler(error)));
}

function read(request, response) {
  const {
    params: { notification }
  } = request;

  Notification.read(notification)
    .then(notifications => {
      return response.send(successHandler(notifications))
    })
    .catch(error =>
      response.send(errorHandler(error)));
}
