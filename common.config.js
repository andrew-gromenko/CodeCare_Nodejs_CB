const PRODUCTION = process.env.NODE_ENV === 'production';

if (!PRODUCTION) {
	// Module that loads environment variables from a .env file into process.env
	// As early as possible in your application, require and configure dotenv.
	// https://github.com/motdotla/dotenv
	require('dotenv').config();
}

const {
	API_PORT,
	API_SECRET_WORD,

	DB_HOST,
	DB_PORT,
	DB_PATH,
	DB_USER,
	DB_PASS,

	AWS_S3_BUCKET,
	AWS_S3_REGION,
	AWS_ACCESS_KEY_ID,
	AWS_SECRET_ACCESS_KEY,
	AWS_SIGNATURE_VERSION,
} = process.env;

const config = {};

config.db = {
	host: DB_HOST,
	port: DB_PORT,
	path: DB_PATH,
	user: DB_USER,
	pass: DB_PASS,
};

config.db.uri = !PRODUCTION
	? `mongodb://${config.db.host}:${config.db.port}/${config.db.path}`
	: `mongodb://${config.db.user}:${config.db.pass}@${config.db.host}:${config.db.port}/${config.db.path}`;

config.api = {
	port: API_PORT,
	secret: API_SECRET_WORD,
};

config.cors = {
	origin: PRODUCTION ? 'https://client-cb-staging.herokuapp.com' : '*',
	allowedHeaders: ['Authorization', 'Content-Type'],
	optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};

config.aws = {
	params: {
		ACL: 'public-read',
		Bucket: AWS_S3_BUCKET,
	},
	region: AWS_S3_REGION,
	accessKeyId: AWS_ACCESS_KEY_ID,
	secretAccessKey: AWS_SECRET_ACCESS_KEY,
	signatureVersion: AWS_SIGNATURE_VERSION,
};

config.socket = {
	// TODO: Needs calibration
	// https://socket.io/docs/server-api
};

config.redis = {
	// TODO: enable into project to use for online users
	// https://github.com/socketio/socket.io-redis
};

config.logging = {
	// TODO: enable into project to use for debugging on production
};

module.exports = config;