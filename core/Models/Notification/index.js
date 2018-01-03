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
        .then(noitifications => {
            console.log(noitifications);
            return noitifications.map(noitification => prettify(noitification))
        });
}

// function create({ creator, title, description, tag, genre, file, privacy, url }) {
//     const object = {
//         creator,
//         title,
//         description,
//         tag,
//         genre,
//         file,
//         privacy,
//         url
//     };

//     return new Project(object)
//         .save()
//         .then(project => {
//             return prettify(project)
//         });
// }