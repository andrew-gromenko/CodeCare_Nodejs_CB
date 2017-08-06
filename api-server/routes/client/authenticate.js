const router = require('express').Router();
const controller = require('../../controllers/users');

router
	.post('/', controller.verify);

module.exports = router;