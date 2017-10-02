const router = require('express').Router();

const chat = require('./chat');
const self = require('./self');
const workspace = require('./workspace');

router
	.use('/', self)
	.use('/chats', chat)
	.use('/workspaces', workspace);

module.exports = router;