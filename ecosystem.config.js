module.exports = {
	/**
	 * Application configuration section
	 * http://pm2.keymetrics.io/docs/usage/application-declaration/
	 */
	apps: [
		{
			name: "API-server",
			script: "./api-server/index.js",

			"exec_mode": "cluster",
			"max_restarts": 3,
			"max_memory_restart": "512M",

			"watch": true,

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