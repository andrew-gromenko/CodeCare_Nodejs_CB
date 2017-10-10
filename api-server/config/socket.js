const IO = require('socket.io');
const {socket} = require('../../common.config');

module.exports = server => new IO(server, socket);