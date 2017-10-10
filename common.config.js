const PRODUCTION = process.env.NODE_ENV === 'production';
const config = {};

config.db = {
	user: PRODUCTION ? 'cb'                 : 'admin',
	pass: PRODUCTION ? 'cbsecurepassword'   : 'password',
	host: PRODUCTION ? 'ds113915.mlab.com'  : '127.0.0.1',
	port: PRODUCTION ? '13915'              : '27017',
	path: PRODUCTION ? 'clockbeats'         : 'development',
};

config.db.uri = !PRODUCTION ? `mongodb//${config.db.host}:${config.db.port}/${config.db.path}` : `mongodb://${config.db.user}:${config.db.pass}@${config.db.host}:${config.db.port}/${config.db.path}`;

config.api = {
	host: PRODUCTION ? '' : 'localhost',
	port: PRODUCTION ? '80' : '8080',
	secret: PRODUCTION ? '' : 'c3VwZXJjYWxpZnJhZ2lsaXN0aWNleHBpYWxpZG9jaW91cw==',
};

config.cors = {
	origin: PRODUCTION ? 'https://client-cb-staging.herokuapp.com' : '*',
	allowedHeaders: ['Authorization', 'Content-Type'],
	optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

config.socket = {
	cookie: false,
	origins: config.cors.origin,
	transports: ['websocket', 'flashsocket', 'htmlfile', 'xhr-polling', 'jsonp-polling'],
};

config.redis = {
	// TODO: enable into project to use for online users
};

config.logging = {
	// TODO: enable into project to use for debugging on production
};

module.exports = config;