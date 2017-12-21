const Argument = require('mongoose').model('Argument');
const Comment = require('mongoose').model('Comment');
const ObjectId = require('mongoose').Types.ObjectId;

const {
	exist,
	prettify,
	byAction,
} = require('../utils');

/**
 * =======
 * Exports
 * =======
 */

module.exports = {
	one,
	list,
	owned,

	addComment,
	removeComment,
	create,
	update,
	remove,
	edit,

	count,

	react,
	comments,
};

/**
 * =======
 * Helpers
 * =======
 */

/**
 * =======
 * Core
 * =======
 */
function one(id) {
	return Argument
		.findOne({ _id: ObjectId(id) })
		.then(argue => {
			exist(argue);

			return prettify(argue);
		});
}

function owned(issuerId, query = {}) {
	const criteria = {
		...query,
		issuer: ObjectId(issuerId),
	};

	return Argument
		.find(criteria)
		.sort({ created_at: -1 })
		.then(argues => {
			if (!argues) return [];

			return argues.map(argue => prettify(argue));
		});
}

function addComment(argueId, comment) {
	return new Promise(resolve => {
		Argument.findOne({ _id: ObjectId(argueId) })
			.then(argument => {
				if (!argument)
					return reject(new Error('No argument.'));

				if (argument.comments.length >= 5)
					argument.comments.splice(0, 1);

				argument.comments.push(comment.id);
				argument.commentsCount += 1;
				argument.save()
					.then(_ => resolve(comment));
			});
	});
}

function removeComment(argueId, comments) {
	return new Promise(resolve => {
		Argument.findOne({ _id: ObjectId(argueId) })
			.then(argument => {
				if (!argument)
					return reject(new Error('No argument.'));
					
				argument.comments = comments.map(comment => comment.id).slice(comments.length - 5, comments.length)
				argument.commentsCount -= 1;
				argument.save()
					.then(_ => {
						return resolve('updated')
					});
			});
	});
}

function list(workspaceId, query = {}) {
	const criteria = {
		...query,
		workspace: ObjectId(workspaceId),
	};

	return Argument
		.find(criteria)
		.sort({ created_at: -1 })
		.populate({
			path: 'comments',
			populate: {
				path: 'replied_to'
			}
		})
		.then(argues => {
			if (!argues) return [];

			return argues
				.map(argue => {
					argue = prettify(argue);
					argue.comments = argue.comments.map(c => {
						c = prettify(c);

						if (c.replied_to)
							c.replied_to = prettify(c.replied_to);

						return c;
					});

					return argue;
				});
		});
}

function create({ issuer, workspace, body, media }) {
	const object = {
		issuer,
		workspace,
		body,
		media,
	};

	return new Argument(object)
		.save()
		.then(model => {
			// const handler = (resolve, reject) => {
			// 	model
			// 		.populate(populate('workspace', 'workspace'), (error, document) => {
			// 			if (error) reject(error);
			//
			// 			resolve(prettify(document));
			// 		});
			// };
			//
			// return new Promise(handler);

			// TODO: Should I need to populate?

			return prettify(model);
		});
}

function update(id, options) {
	const instructions = { 'new': true, runValidators: true };
	const query = {
		...options,
		'$currentDate': { modified_at: true },
	};

	return Argument
		.findOneAndUpdate({ _id: ObjectId(id) }, query, instructions)
		.then(model => {
			exist(model);

			return prettify(model);
		});
}

function remove(id) {
	return Argument
		.findOneAndRemove({ _id: ObjectId(id) })
		.then(model => {
			exist(model);

			return prettify(model);
		});
}

function edit(id, { body, media }) {
	return update(id, { body, media });
}

/**
 * Beware!
 *
 * https://docs.mongodb.com/manual/faq/concurrency/#which-operations-lock-the-database
 * */
function count(list) {
	const workspaces = list.map(id => ObjectId(id));
	const aggregate = [
		{
			"$project": {
				_id: 1,
				workspace: 1,
				likes: { "$size": "$likes" },
				votes: { "$size": "$votes" },
			}
		},
		{
			"$match": {
				workspace: { "$in": workspaces },
			}
		},
		{
			"$group": {
				_id: "$workspace",
				likes: { "$sum": "$likes" },
				votes: { "$sum": "$votes" },
				argues: { "$sum": 1 },
			}
		}
	];

	console.time('===== Aggregate ____count(workspaces)____ =====');

	return Argument
		.aggregate(aggregate)
		.then(argues => argues.map(argue => prettify(argue)))
		.finally(() => console.timeEnd('===== Aggregate ____count(workspaces)____ ====='));
}

function react(id, { issuer, type, value }) {
	const action = Object.is(parseInt(value), 1) ? 'push' : 'pull';

	switch (type) {
		case 'like': {
			return update(id, byAction(action, { likes: issuer }));
		}
		case 'vote': {
			return update(id, byAction(action, { votes: issuer }));
		}
		default: {
			throw new Error(`Type should be one of the ["like", "vote"]. Given ${type}`);
		}
	}
}

function comments(id, comment, action) {
	return update(id, byAction(action, { comments: comment }));
}