const router = require('express').Router();
const users = require('../controllers/users');

router.route('/')
	.get(users.list);

router.route('/:user')
	.get(users.find);

router.route('/:user/profile')
	.get(users.profile);

router.route('/:user/relationships')
	.get(users.relationships)
	.post(users.relationship);

module.exports = router;