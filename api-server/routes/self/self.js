const router = require('express').Router();
const controller = require('../../controllers/self');

router.route('/')
	.get(controller.self.self);

router.route('/notifications')
	.get(controller.notifications.list);

router.route('/relationships')
	.get(controller.relationships.list);


module.exports = router;