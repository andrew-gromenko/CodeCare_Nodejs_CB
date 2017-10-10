const cors = require('cors');
const bodyParser = require('body-parser');
const compression = require('compression');
const express = require('express');
const helmet = require('helmet');

const {api, cors: CORS} = require('../../common.config');

// Require database connection;
require('./database');

// Create express instance
const server = express();

// Express configuration
server.use(helmet());
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({extended: true}));
server.use(cors(CORS));
server.use(compression());

server.enable('trust proxy');
server.enable('etag', 'strong');

// Setup secret word for jwt authentication
server.set('SECRET_TOKEN', api.secret);

/* Server startup */
const http = server.listen(api.port, api.host, () => {
	console.info(`API server is running on ${api.host}:${api.port}`);
});

/* Sockets startup */
const IO = require('./socket')(http);

module.exports = {server, IO};