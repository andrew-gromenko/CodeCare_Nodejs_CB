const router = require('express').Router();
const controller = require('../../controllers/users');

router.route('/')
	.get(controller.list);

router.route('/:user')
	.get(controller.find);

router.route('/:user/profile')
	.get(controller.profile);

router.route('/:user/relationships')
	.get(controller.relationships)
	.post(controller.relationship);

module.exports = router;