const router = require('express').Router();

const cloudbeats = require('../../Controllers/cloudbeats');

router.route('/')
	.get(cloudbeats.list)
	.post(cloudbeats.create);

module.exports = router;