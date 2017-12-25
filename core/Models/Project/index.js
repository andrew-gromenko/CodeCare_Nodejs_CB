const Project = require('mongoose').model('Project');
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
    remove,
    update,
    listById
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

// function one(id) {
// 	return Media
// 		.findOne({ _id: ObjectId(id) })
// 		.then(prettify(media));
// }

function list(userId) {
    return Project
        .find({ creator: ObjectId(userId) })
        .then(projects => projects.map(project => prettify(project)));
}

function create({ creator, title, description, tag, genre, file, privacy, url }) {
    const object = {
        creator,
        title,
        description,
        tag,
        genre,
        file,
        privacy,
        url
    };

    return new Project(object)
        .save()
        .then(project => {
            return prettify(project)
        });
}

function remove(id) {
    return Project
        .findByIdAndRemove(ObjectId(id))
        .then(project => prettify(project));
}

function update(id, options) {
    const instructions = { 'new': true, runValidators: true };
    const query = {
        ...options,
        '$currentDate': { modified_at: true },
    };
    return Project
        .findOneAndUpdate({ _id: ObjectId(id) }, query, instructions)
        .then(project => {
            exist(project);

            return prettify(project);
        });
}

function listById(userId) {
    return Project
        .find({ creator: ObjectId(userId) })
        .then(projects => projects.filter(project => !project.privacy).map(project => prettify(project)));
}