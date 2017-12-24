const router = require('express').Router();

const self = require('./self');
const chats = require('./chats');
const cloudbeats = require('./cloudbeats');
const workspaces = require('./workspaces');
const projects = require('./projects')

router
	.use('/', self)
	.use('/chats', chats)
	.use('/cloudbeats', cloudbeats)
	.use('/workspaces', workspaces)
	.use('/projects', projects);

module.exports = router;