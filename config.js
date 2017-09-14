const DEV_CONFIG = {
	db: {
		url: 'mongodb://127.0.0.1:27017/clockbeats',
		user: '',
		password: ''
	},

	api: {
		host: '127.0.0.1',
		port: '8095',
		secret: 'c3VwZXJjYWxpZnJhZ2lsaXN0aWNleHBpYWxpZG9jaW91cw==',
		cors: {
			origin: ['http://localhost:3000'],
			allowedHeaders: ['Authorization', 'Content-Type'],
			optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
		}
	}
};

const PROD_CONFIG = {
	db: {
		url: 'mongodb://127.0.0.1:27017/clockbeats',
		user: '',
		password: ''
	},

	api: {
		host: '127.0.0.1',
		port: '8095',
		secret: 'c3VwZXJjYWxpZnJhZ2lsaXN0aWNleHBpYWxpZG9jaW91cw==',
		cors: {
			origin: ['http://188.166.28.121'],
			allowedHeaders: ['Authorization', 'Content-Type'],
			optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
		}
	}
};

module.exports = process.env.NODE_ENV === 'production' ? PROD_CONFIG : DEV_CONFIG;