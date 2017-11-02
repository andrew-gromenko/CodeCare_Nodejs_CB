module.exports = {
	/**
	 * Application configuration section
	 * http://pm2.keymetrics.io/docs/usage/application-declaration/
	 */
	apps: [
		{
			name: "API-server",
			script: "./index.js",

			exec_mode: "cluster",
			max_restarts: 3,
			max_memory_restart: "512M",

			out_file: './.logs/API.out.log',
			error_file: './.logs/API.errors.log',

			env_production: {
				NODE_ENV: "production"
			},

			env: {
				NODE_ENV: "development"
			}
		}
	]
};