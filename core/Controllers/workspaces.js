const _ = require('lodash');

const Workspace = require('../Models/Workspace');
const Argument = require('../Models/Argument');
const Invite = require('../Models/Invite');
const Socket = require('../Services/Socket');
const Notification = require('../Models/Notification');
const User = require('../Models/User');
const { send } = require('../Services/Email')

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

const sendEmailForWorkspaceInvite = (user, _user, workspaceLink, title) => {
  const mailOptions = {
    to: user.email,
    subject: 'Clockbeats',
    body: `You were invited by ${_user.username} to a new workspace <a href="${workspaceLink}">${title}</a>`,
  };
  send(mailOptions)
};

/**
 * Create Workspace
 *
 * */

function create(request, response) {
  const {
    _user,
    body: { title, description, start, end, participants },
  } = request;

  Workspace.create({ creator: _user.id, title, description, start, end, participants })
    .then(document => {
      const workspace = { workspace: { ...document, counts: { likes: 0, votes: 0, argues: 0 } } };
      const workspaceLink = `https://clb-staging.herokuapp.com/you/workspace/${workspace.workspace.title}`;

      Socket.updateWorkspacesList(participants, workspace);

      if (document.participants.length > 0) {
        document.participants.forEach(participant => {
          User.oneById(participant).then(user => {
            if (user.blacklist.find(userId => userId.toString() === _user.id)) return;

            return Notification.create({
              issuer: document.creator,
              recipient: participant,
              type: 'invite',
              data: {
                id: document.id,
                title: document.title,
              }
            }).then((notification) => {
              console.log('sendEmail', workspaceLink, title);
              sendEmailForWorkspaceInvite(user, _user, workspaceLink, title);
              Socket.notify(notification);
            });
          });
        });
      }

      return response.send(successHandler(workspace))
    })
    .catch(error =>
      response.send(errorHandler(error)));
}

function update(request, response) {
  const {
    body: { title, oldParticipants },
    params: { workspace },
    _user
  } = request;

  const workspaceLink = `https://clb-staging.herokuapp.com/you/workspace/${workspace}`;

  Workspace.update(workspace, { ...request.body })
    .then(document => {
      return Argument.count([document.id])
        .then(counts => {
          const count = counts.find(argue => document.id === argue.id);
          if (count) {
            delete count.id;
            return { ...document, counts: count };
          }
          return { ...document, counts: { likes: 0, votes: 0, argues: 0 } };
        })
    })
    .then(document => {
      const isCreator = document.creator === _user.id;
      const stringParticipants = document.participants.map(participant => participant.toString());
      const newParticipants = _.difference(stringParticipants, oldParticipants);
      const droppedParticipants = _.difference(oldParticipants, stringParticipants);
      Socket.updateWorkspacesList(isCreator ? document.participants : [...document.participants, document.creator], { workspace: document });

      droppedParticipants.forEach(participant => {
        User.oneById(participant).then(user => {
          if (user.blacklist.find(userId => userId.toString() === _user.id)) return;

          return Notification.create({
            issuer: document.creator,
            recipient: participant,
            type: 'drop',
            data: {
              id: document.id,
              title: document.title,
            }
          }).then(notification => {
            Socket.notify(notification);
          })
        });

        Socket.droppedFromWorkspace(participant, document.id);
      });

      if (document.participants.length) {
        newParticipants.forEach(participant => {
          User.oneById(participant).then(user => {
            if (user.blacklist.find(userId => userId.toString() === _user.id)) return;

            return Notification.create({
              issuer: document.creator,
              recipient: participant,
              type: 'invite',
              data: {
                id: document.id,
                title: document.title,
              }
            }).then(notification => {
              sendEmailForWorkspaceInvite(user, _user, workspaceLink, title);
              Socket.notify(notification);
            })
          });
        });
      }

      if (!isCreator) {
        Notification.create({
          issuer: _user.id,
          recipient: document.creator,
          type: 'leave',
          data: {
            id: document.id,
            title: document.title,
          }
        }).then(notification => {
          Socket.notify(notification);
        })
      }

      return response.send(successHandler({ workspace: document }));
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