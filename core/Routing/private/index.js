const router = require('express').Router();

const self = require('./self');
const chats = require('./chats');
const cloudbeats = require('./cloudbeats');
const workspaces = require('./workspaces');

router
	.use('/', self)
	.use('/chats', chats)
	.use('/cloudbeats', cloudbeats)
	.use('/workspaces', workspaces);

module.exports = router;