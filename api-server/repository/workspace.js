const Workspace = require('mongoose').model('Workspace');

class WorkspaceRepository {
	constructor() {
		this.model = Workspace;
	}

	_prepare(workspace, param) {
		const result = Object.assign({}, JSON.parse(JSON.stringify(workspace)), {
			id: `${workspace._id}`,
		});

		delete result._id;
		delete result.__v;

		if (param) {
			delete result[param];
		}

		return result;
	}

	_populate(action = 'arguments') {
		const populate = {
			arguments: {},
		};

		return populate[action];
	}

	one(id) {
		return this.model
			.findById(id)
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
			.then(workspaces => workspaces.map(this._prepare));
	}

	create({creator, title, description, start, end, participants}) {
		return new this.model({
			creator,
			title,
			description,
			starts_at: start,
			ends_at: end,
			participants,
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
			.populate(this._populate())
			.lean(true)
			.then(workspace => {
				if (!workspace) throw new Error('Workspace not found');

				return this._prepare(workspace);
			});
	}

	noPopulate(userId) {
		return this.model
			.find({creator: userId})
			.select('id')
			.lean(true)
			.then(workspaces => workspaces.map(workspace => workspace._id.toString()));
	}

	// TODO: On remove should delete all arguments and their comments
	remove(id) {
		this.model
			.findOneAndRemove({_id: id});
	}

	archive(id, {archived = true}) {
		const options = {'$set': {archived}};

		return this.update(id, options);
	}

	participants({workspace, participants}, action) {
		const options = {};

		switch (action) {
			case 'push': {
				options['$addToSet'] = {participants};
				break;
			}

			case 'pull': {
				options['$pull'] = {participants};
				break;
			}

			default: {
				throw new Error(`Action should be one of the ["push", "pull"]. Given ${action}`);
			}
		}

		return this.update(workspace, options);
	}
}

module.exports = new WorkspaceRepository();