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
    readMany,
    read
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

function readMany(id, type) {
    return Notification
        .update({ recipient: ObjectId(id), type }, { pristine: false }, { multi: true })
        .then(_ => type);
}

function read(notification) {
    return Notification
        .findOneAndUpdate({ _id: ObjectId(notification) }, { pristine: false })
        .then(_ => notification)
}