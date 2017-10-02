const router = require('express').Router();

const authorize = require('./authorize');
const authenticate = require('./authenticate');


const verification = function () {};
const users = function () {};
const self = function () {};

router
	.use('/authorize', authorize)
	.use('/authenticate', authenticate)
	.use('/users', users)
	.use(verification)
	.use('/self', self);