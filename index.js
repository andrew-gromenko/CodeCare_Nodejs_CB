const {server, IO} = require('./config/server');

const routes = require('./core/Routing');
const socket = require('./core/Services/Socket/handler');

/**
 * =======
 * SOCKETS
 *
 * Connection handler
 * =======
 */
IO.on('connection', socket);


/**
 * =======
 * EXPRESS
 *
 * Routing configuration
 * =======
 */
server.get('/', (request, response) => {
	response
		.send({
			name: 'Clockbeats API',
			version: '2.0.0',
			developer: {
				name: 'Serhii Yaitsky2222',
				email: 'eggcllnt@gmail.com',
			}
		});
});

server.use('/', routes);

server.all('*', (request, response) => {
	response
		.send({
			status: 405,
			error: {
				message: 'Method not allowed',
			}
		});
});