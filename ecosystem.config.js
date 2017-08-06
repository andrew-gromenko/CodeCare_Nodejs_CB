module.exports = {
	/**
	 * Application configuration section
	 * http://pm2.keymetrics.io/docs/usage/application-declaration/
	 */
	apps: [
		{
			name: "API-server",
			script: "./api-server/index.js",
			error_file: './.logs/API.errors.log',
			out_file: './.logs/API.out.log',
			"env_production": {
				"NODE_ENV": "production"
			},
			"env": {
				"NODE_ENV": "development"
			}
		}
	]
};