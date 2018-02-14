const _ = require('lodash');

const Workspace = require('../Models/Workspace');
const Argument = require('../Models/Argument');
const Invite = require('../Models/Invite');
const Socket = require('../Services/Socket');
const Notification = require('../Models/Notification');
const User = require('../Models/User');
const { mail } = require('../../config/mail');
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
	service: mail.service,
	auth: {
		user: mail.user,
		pass: mail.password
	}
});

/**
 * =======
 * Exports
 * =======
 */

module.exports = {
	one,
	list,

	create,
	update,
	remove,

	archive,
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

function one(request, response) {
	const { params: { workspace } } = request;

	// TODO: Should return workspace with: 10 arguments > 5 comments > 0 replies
	Workspace.one(workspace)
		.then(document =>
			response.send(successHandler({ workspace: document })))
		.catch(error =>
			response.send(errorHandler(error)));
}

function list(request, response) {
	const {
		_user,
		query,
	} = request;

	// TODO: should can take `query` (filter/sort/limit)
	Workspace.list(_user.id)
		.then(documents => {
			const list = documents.map(workspace => workspace.id);

			return Argument.count(list)
				.then(counts => {
					return documents.map(workspace => {
						const count = counts.find(argue => workspace.id === argue.id);

						if (count) {
							delete count.id;
							return {
								...workspace,
								counts: count,
							};
						}

						return {
							...workspace,
							counts: { likes: 0, votes: 0, argues: 0 },
						};
					});
				});
		})
		.then(documents =>
			response.send(successHandler({ workspaces: documents })))
		.catch(error =>
			response.send(errorHandler(error)));
}

/**
 * Create Workspace
 *
 * */
function create(request, response) {
	const {
		_user,
		body: { title, description, start, end, participants },
	} = request;
	// TODO: should create invite to each participant
	Workspace.create({ creator: _user.id, title, description, start, end, participants })
		.then(document => {
			const workspace = { workspace: { ...document, counts: { likes: 0, votes: 0, argues: 0 } } }
			Socket.updateWorkspacesList(participants, workspace);
			if (document.participants.length > 0) {
				document.participants.forEach(participant => Notification.create({
					issuer: document.creator,
					recipient: participant,
					type: 'invite',
					data: {
						id: document.id,
						title: document.title
					}
				}).then(notification => {
          const workspaceLink = `https://clb-staging.herokuapp.com/you/workspace/${workspace}`;

					document.participants.forEach((participant) => {
						User.oneById(participant)
							.then(user => {
								const mailOptions = {
									from: 'hello@clockbeats.com',
									to: user.email,
									subject: 'Clockbeats',
                  html: `You were invited by ${_user.username} to a new workspace <a href="${workspaceLink}">${title}</a>`,
								};

								transporter.sendMail(mailOptions,
									(error, info) => { })
							})
					});
					Socket.notify(notification)
				}))
			}
			return response.send(successHandler(workspace))
		})
		.catch(error =>
			response.send(errorHandler(error)));
}

function update(request, response) {
	const {
		body: { title, description, start, end, participants, oldParticipants },
		params: { workspace },
		_user
	} = request;

	Workspace.update(workspace, { ...request.body, title, description, start, end, participants, oldParticipants })
		.then(document => {
			return Argument.count([document.id])
				.then(counts => {
					const count = counts.find(argue => document.id === argue.id);
					if (count) {
						delete count.id;
						return { ...document, counts: count }
					}
					return { ...document, counts: { likes: 0, votes: 0, argues: 0 } }
				})
		})
		.then(document => {
			const isCreator = document.creator === _user.id;
			const stringParticipants = document.participants.map(participant => participant.toString());
			const newParticipants = _.difference(stringParticipants, oldParticipants);
			const droppedParticipants = _.difference(oldParticipants, stringParticipants);
			Socket.updateWorkspacesList(isCreator ? document.participants : [...document.participants, document.creator], { workspace: document });

			droppedParticipants.forEach(participant => {
				Socket.droppedFromWorkspace(participant, document.id);
				Notification.create({
					issuer: document.creator,
					recipient: participant,
					type: 'drop',
					data: {
						id: document.id,
						title: document.title
					}
				}).then(notification => {
					Socket.notify(notification)
				})
			});

			if (document.participants.length > 0) {
				newParticipants.forEach(participant => Notification.create({
					issuer: document.creator,
					recipient: participant,
					type: 'invite',
					data: {
						id: document.id,
						title: document.title
					}
				}).then(notification => {
					const workspaceLink = `https://clb-staging.herokuapp.com/you/workspace/${workspace}`;

					newParticipants.forEach((participant) => {
						User.oneById(participant)
							.then(user => {
								const mailOptions = {
									from: 'hello@clockbeats.com',
									to: user.email,
									subject: 'Clockbeats',
									html: `You were invited by ${_user.username} to a new workspace <a href="${workspaceLink}">${title}</a>`,
								};

								transporter.sendMail(mailOptions,
									(error, info) => { })
							})
					});
					Socket.notify(notification)
				}))
			}

			if (!isCreator) {
				Notification.create({
					issuer: _user.id,
					recipient: document.creator,
					type: 'leave',
					data: {
						id: document.id,
						title: document.title
					}
				}).then(notification => {
					Socket.notify(notification)
				})
			}

			return response.send(successHandler({ workspace: document }))
		})
		.catch(error =>
			response.send(errorHandler(error)));
}

function remove(request, response) {
	const {
		params: { workspace },
	} = request;

	Workspace.remove(workspace)
		.then(document => {
			document.participants.forEach(participant => Socket.droppedFromWorkspace(participant, document.id));
			return response.send(successHandler({ workspace: document }))
		})
		.catch(error =>
			response.send(errorHandler(error)));
}

function archive(request, response) {
	const {
		body: { archive },
		params: { workspace },
	} = request;

	Workspace.archive(workspace, archive)
		.then(document =>
			response.send(successHandler({ workspace: document })))
		.catch(error =>
			response.send(errorHandler(error)));
}