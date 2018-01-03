const Notification = require('mongoose').model('Notification');
const ObjectId = require('mongoose').Types.ObjectId;

const {
	exist,
    prettify,
} = require('../utils');

/**
 * =======
 * Exports
 * =======
 */

module.exports = {
    list,
    create,
    removeMany,
    remove
};

/**
 * =======
 * Helpers
 * =======
 */


/**
 * ====
 * Core
 * ====
 */

function list(userId) {
    return Notification
        .find({ recipient: ObjectId(userId) })
        .then(notifications => {
            return notifications.map(notification => prettify(notification))
        });
}

function create({ type, issuer, recipient, text, data }) {
    const object = {
        type,
        issuer,
        recipient,
        text,
        data
    };
    return new Notification(object)
        .save()
        .then(notification => {
            return prettify(notification)
        });
}

function removeMany(id, type) {
    return Notification
        .deleteMany({ recipient: ObjectId(id), type })
        .then(() => type);
}

function remove(notification) {
    return Notification
        .deleteMany({ _id: ObjectId(notification) })
        .then(notification => notification)
}