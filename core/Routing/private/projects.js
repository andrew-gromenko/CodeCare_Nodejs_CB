const router = require('express').Router();

const projects = require('../../Controllers/projects');

router.route('/')
	// Get list of projects
	.get(projects.list)

	// Create new project
	.post(projects.create);

router.route('/:project')

	//Delete project
	.delete(projects.remove)

	//Edit project
	.post(projects.update)

router.route('/:user')

	//Get list of user's projects by Id (only public projects)
	.get(projects.listById)

module.exports = router;