const {server, sockets} = require('./config/express');
const routes = require('./routes');
const Socket = require('./services/Socket');
const errorHandler = require('./middlewares/errors');


/*========================== SOCKETS ==================================*/
sockets.on('connection', Socket.handler);
/*========================== SOCKETS END ==============================*/


/*========================== EXPRESS ==================================*/
// Routing configuration
server.get('/', (request, response, next) => {
	response
		.send({
			name: 'Clockbeats API',
			version: '2.0.0',
			developer: {
				name: 'Serhii Yaitsky',
				email: 'eggcllnt@gmail.com'
			}
		});
});

server.use('/', routes);

server.all('*', (request, response, next) => {
	response
		.send({
			status: 405,
			error: {
				message: 'Method not allowed'
			}
		});
});
/*========================== EXPRESS END ==============================*/