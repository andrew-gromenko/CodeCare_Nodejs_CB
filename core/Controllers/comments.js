const Argument = require('../Models/Argument');
const Comment = require('../Models/Comment');
const Notification = require('../Models/Notification')
const Workspace = require('../Models/Workspace')
const Socket = require('../Services/Socket');

const {
  exist,
  prettify,
  byAction,
} = require('../Models/utils');

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

  react,
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
  const {
    params: { comment },
  } = request;

  Comment.one(comment)
    .then(comment =>
      response.send(successHandler({ comment })))
    .catch(error =>
      response.send(errorHandler(error)));
}

function list(request, response) {
  const {
    params: { id },
    query
  } = request;

  // TODO: should can take `query` and return list base on it (filter/sort/limit)
  // TODO: should can return list of media files (select)
  Comment.list(id, query)
    .then(comments =>
      response.send(successHandler({ id, comments })))
    .catch(error =>
      response.send(errorHandler(error)));
}

function create(request, response) {
  const {
    _user,
    body: { body, replied_to, belongs_to, workspace },
  } = request;
  Workspace.one(workspace)
    .then(workspace => {
      return Comment.create({ issuer: _user.id, belongs_to, replied_to, body, workspace: workspace.id })
        .then(comment => {
          return Argument.addComment(belongs_to, comment)
            .then(argument => {
              if (replied_to) {
                Notification.create({
                  issuer: comment.issuer,
                  recipient: comment.replied_to.issuer,
                  type: 'reply',
                  data: {
                    id: workspace.id,
                    title: argument.body,
                    workspace: workspace.title
                  }
                }).then(notification => {
                  Socket.notify(notification)
                })
              }

              if (workspace.creator._id == argument.issuer) {
                if (_user.id != workspace.creator._id && (comment.replied_to == null || workspace.creator._id != comment.replied_to.issuer)) {
                  Notification.create({
                    issuer: _user.id,
                    recipient: workspace.creator._id,
                    type: 'argues-comment',
                    data: {
                      id: workspace.id,
                      title: argument.body,
                      workspace: workspace.title
                    }
                  }).then(notification => {
                    Socket.notify(notification)
                  })
                }
              } else {
                if (_user.id != workspace.creator._id && (comment.replied_to == null || workspace.creator._id != comment.replied_to.issuer)) {
                  Notification.create({
                    issuer: _user.id,
                    recipient: workspace.creator._id,
                    type: 'ws-comment',
                    data: {
                      id: workspace.id,
                      title: argument.body,
                      workspace: workspace.title
                    }
                  }).then(notification => {
                    Socket.notify(notification)
                  })
                }

                if (_user.id != argument.issuer && (comment.replied_to == null || argument.issuer != comment.replied_to.issuer)) {
                  Notification.create({
                    issuer: _user.id,
                    recipient: argument.issuer,
                    type: 'argues-comment',
                    data: {
                      id: workspace.id,
                      title: argument.body,
                      workspace: workspace.title
                    }
                  }).then(notification => {
                    Socket.notify(notification)
                  })
                }
              }

              Socket.updateArgueComments(workspace.id, _user.id);
              return response.send(successHandler({ comment }))
            })
        })
    })
    .catch(error =>
      response.send(errorHandler(error)));
}

function update(request, response) {
  const {
    body: { body, media },
    params: { commentId },
  } = request;

  Comment.edit({ id: commentId, body, media })
    .then(comment =>
      response.send(successHandler({ comment })))
    .catch(error =>
      response.send(errorHandler(error)));
}

function remove(request, response) {
  const {
    _user,
    params: { argue },
    body
  } = request;

  // TODO: should remove all comments
  Comment.remove(body)
    .then(comment => {
      Comment.list(body.argue)
        .then(comments => {
          Argument.removeComment(body.argue, comments)
            .then(_ => {
              Socket.updateArgueComments(body.workspace, _user.id);
              return response.send(successHandler({ comment }))
            })
        })
    })
    .catch(error =>
      response.send(errorHandler(error)));
}

function react(request, response) {
  const {
    _user,
    body: { type, value }, // Action should be `{type: 'like/vote', value: 1/-1}`
    params: { comment },
  } = request;

  // TODO: Should send notification to creator of this argument if like
  // TODO: Should send notification to all participants if vote
  Comment.react(comment, { issuer: _user.id, type, value })
    .then(comment =>
      response.send(successHandler({ comment })))
    .catch(error =>
      response.send(errorHandler(error)));
}