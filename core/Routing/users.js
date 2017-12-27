// Third party
const router = require('express').Router();

// Middleware
const verification = require('../Services/Middleware/verification');

// Controller
const users = require('../Controllers/users');

router.route('/')
	.get(users.list);

router.route('/:username')
	.get(users.profile);

router.route('/:id')
	.patch(users.view)
	
router.route('/:user/projects')
	.get(users.projects);

router.route('/:user/events')
	.get(users.events);

router.route('/:user/relationships')
	.get(users.relationships)
	.post([verification, users.relationship]);


module.exports = router;