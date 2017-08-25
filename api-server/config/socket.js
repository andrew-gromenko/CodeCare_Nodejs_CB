const IO = require('socket.io');

const HOST = process.env.NODE_ENV === 'production' ? '188.166.28.121' : 'http://localhost:3000';
const config = {
	origins: HOST,
	serveClient: false,
	transports: ['websocket', 'flashsocket', 'htmlfile', 'xhr-polling', 'jsonp-polling'],
	cookie: false,
};

module.exports = server => new IO(server, config);