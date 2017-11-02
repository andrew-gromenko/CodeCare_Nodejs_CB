const cors      = require('cors');
const compress  = require('compression');
const express   = require('express');
const helmet    = require('helmet');
const parser    = require('body-parser');

// Module that loads environment variables from a .env file into process.env
// As early as possible in your application, require and configure dotenv.
// https://github.com/motdotla/dotenv
require('dotenv').config();

// Require configs
const {api, cors: CORS} = require('../common.config');

// Require database connection;
require('./database');

// Create express instance
const server = express();

// Express configuration
server.use(helmet());
server.use(parser.json({limit: '50mb', parameterLimit: 1000000}));
server.use(parser.urlencoded({extended: true, limit: '50mb', parameterLimit: 1000000}));
server.use(cors(CORS));
server.use(compress());

server.enable('trust proxy');
server.enable('etag', 'strong');

// Setup secret word for jwt authentication
server.set('SECRET_TOKEN', api.secret);

/* Server startup */
const http = server.listen(api.port, () => {
	console.info(`API server is running on ${api.port} port`);
});

/* Sockets startup */
const IO = require('./socket')(http);

module.exports = {server, IO};