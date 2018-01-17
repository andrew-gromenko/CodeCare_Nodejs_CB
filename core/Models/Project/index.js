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
    listById,
    react,
    view
};

/**
 * =======
 * Helpers
 * =======
 */

function byAction(action, query) {
    const options = {};

    switch (action) {
        case 'push': {
            options['$addToSet'] = query;

            return options;
        }

        case 'pull': {
            options['$pull'] = query;

            return options;
        }

        default: {
            throw new Error(`Action should be one of the ["push", "pull"]. Given ${action}`);
        }
    }
}

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

function create({ creator, title, description, tag, genre, file, privacy, url, cover }) {
    const object = {
        creator,
        title,
        description,
        tag,
        genre,
        file,
        privacy,
        url,
        cover
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

function update(id, options, modified = true) {
    const instructions = { 'new': true, runValidators: true };
    const query = modified ?
        {
            ...options,
            '$currentDate': modified ? { modified_at: true } : {},
        } :
        {
            ...options,
        }
    return Project
        .findOneAndUpdate({ _id: ObjectId(id) }, query, instructions)
        .then(project => {
            exist(project);

            return prettify(project);
        });
}

function listById(userId) {
    const ids = userId.map(id => ObjectId(id))

    return Project
        .find({ creator: { '$in': ids } })
        .then(projects => projects.filter(project => !project.privacy).map(project => prettify(project)));
}

function react(id, { issuer, type, value }) {
    const action = Object.is(parseInt(value), 1) ? 'push' : 'pull';

    switch (type) {
        case 'like': {
            return update(id, byAction(action, { likes: issuer }), false);
        }
        default: {
            throw new Error(`Type should be one of the ["like"]. Given ${type}`);
        }
    }
}

function view(id) {
    return Project.findOneAndUpdate({ _id: ObjectId(id) }, { '$inc': { "plays": 1 } })
        .then(model => {
            return model
        });
}