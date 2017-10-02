const router = require('express').Router();

// Middleware
const verification = require('../middlewares/checkToken');

const authorize = require('./authorize');
const authenticate = require('./authenticate');
const users = require('./users');
const self = require('./self');

router
	.use('/authorize', authorize)
	.use('/authenticate', authenticate)
	.use(verification)
	.use('/users', users)
	.use('/self', self);

module.exports = router;