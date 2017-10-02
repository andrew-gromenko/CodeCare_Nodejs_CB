const Workspace = require('mongoose').model('Workspace');

class WorkspaceRepository {
	constructor() {
		this.model = Workspace;
	}

	_prepare(workspace, param) {
		const result = Object.assign({}, JSON.parse(JSON.stringify(workspace)), {
			id: `${workspace._id}`,
			counts: {
				likes: 0,
				votes: 0,
				argues: 0,
			},
		});

		delete result._id;
		delete result.__v;

		if (param && typeof param !== 'number') {
			delete result[param];
		}

		return result;
	}

	_populate(action = 'arguments') {
		const populate = {
			arguments: {
				path: 'arguments',
				select: '-__v',
			},
		};

		return populate[action];
	}

	one(id) {
		return this.model
			.findById(id)
			// .populate(this._populate())
			.lean(true)
			.then(workspace => {
				if (!workspace) throw new Error('Workspace not found');

				return this._prepare(workspace);
			});
	}

	all(userId) {
		return this.model
			.find({'$or': [{creator: userId}, {participants: {'$all': [userId]}}]})
			.sort({modified_at: -1})
			.lean(true)
			.then(workspaces =>
				workspaces.map(workspace =>
					this._prepare(workspace)));
	}

	create({creator, title, description, start, end}) {
		return new this.model({
			creator,
			title,
			description,
			starts_at: start,
			ends_at: end,
		}).save()
			.then(workspace => this._prepare(workspace));
	}

	update(id, options) {
		const modifier = {
			'$currentDate': {
				modified_at: true,
			},
		};
		const instructions = {
			'new': true,
			runValidators: true,
		};
		const query = Object.assign({}, modifier, options);

		return this.model
			.findOneAndUpdate({_id: id}, query, instructions)
			.lean(true)
			.then(workspace => {
				if (!workspace) throw new Error('Workspace not found');

				return this._prepare(workspace);
			});
	}

	noPopulate(userId) {
		const query = {
			'$or': [
				{creator: userId},
				{participants: {
					'$all': [userId],
				}},
			],
		};

		return this.model
			.find(query)
			.select('id')
			.lean(true)
			.then(workspaces => workspaces.map(workspace => workspace._id.toString()));
	}

	remove(id) {
		return this.model
			.findOneAndRemove({_id: id})
			.then(workspace => this._prepare(workspace));
	}

	archive(id, archived) {
		return this.update(id, {'$set': {archived}});
	}

	participant(id, participant, action) {
		return this.update(id, byAction(action, {participants: participant}));
	}

	participants(workspaceId) {
		return this.model
			.findOne({_id: workspaceId});
			// .populate(this._populate('participants'));

		// TODO: create _prepare for participants
	}
}

function byAction(action, options) {
	const query = {};

	switch (action) {
		case 'push': {
			query['$addToSet'] = options;

			return query;
		}

		case 'pull': {
			query['$pull'] = options;

			return query;
		}

		default: {
			throw new Error(`Action should be one of the ["push", "pull"]. Given ${action}`);
		}
	}
}

module.exports = new WorkspaceRepository();