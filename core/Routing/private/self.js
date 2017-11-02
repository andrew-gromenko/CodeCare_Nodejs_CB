const router = require('express').Router();

const user = require('../../Controllers/self');

router.route('/')
	// Get user profile
	.get(user.self)

	// Update user profile
	.put(user.update)

	// Discard removed profile
	.patch(user.discard)

	// Set profile as removed
	.delete(user.remove);

router.route('/relationships')
	.get(user.relationships);

module.exports = router;