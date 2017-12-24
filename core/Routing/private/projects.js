const router = require('express').Router();

const projects = require('../../Controllers/projects');

router.route('/')
	// Get list of projects
	.get(projects.list)

	// Create new project
	.post(projects.create);



router.route('/:project')

	//Delete project
	.delete(projects.remove);

module.exports = router;