const router = require('express').Router();
const authorize = require('./authorize');
const authenticate = require('./authenticate');
const checkToken = require('../../middlewares/checkToken');
const self = require('./self');
const users = require('./users');

router
	.use('/authorize', authorize)
	.use('/authenticate', authenticate)
	.use(checkToken)
	.use('/users', users)
	.use('/self', self);

module.exports = router;