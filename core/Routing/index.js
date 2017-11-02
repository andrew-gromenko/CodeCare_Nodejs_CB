// Third party
const router = require('express').Router();

// Middleware
const verification = require('../Services/Middleware/verification');

// Routes
const authorize = require('./authorize');
const authenticate = require('./authenticate');
const users = require('./users');
const user = require('./private');

router
	.use('/authorize', authorize)
	.use('/authenticate', authenticate)
	.use('/users', users)
	.use(verification)
	.use('/self', user);

module.exports = router;