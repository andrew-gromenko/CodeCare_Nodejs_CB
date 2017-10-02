const router = require('express').Router();

const arguments = require('../../_Controllers/arguments');
const comments = require('../../_Controllers/arguments.comments');
const workspaces = require('../../_Controllers/workspaces');
const members = require('../../_Controllers/workspaces.members');

/* Workspaces */
router.route('/workspaces')
	// Get list of workspaces
	.get(workspaces.list)

	// Create new workspace entity
	.post(workspaces.create);

router.route('/workspaces/:workspace')
	// Get workspace entity
	.get(workspaces.one)

	// Update workspace entity
	.put(workspaces.update)

	// Archive/Undo archive workspace entity
	.patch(workspaces.archive)

	// Remove workspace entity
	.delete(workspaces.remove);


/* Members */
router.route('/workspaces/:workspace/members')
	// Get list of workspace members
	.get(members.list)

	// Push workspace member
	.post(members.push)

	// Pull workspace member
	.delete(members.pull);


/* Argues */
router.route('/workspaces/:workspace/argues')
	// Get list of workspace argues
	.get(arguments.list)

	// Create new argues entity
	.post(arguments.create);

router.route('/workspaces/:workspace/argues/:argue')
	// Update argue entity
	.put(arguments.update)

	// Update like/vote argue entity
	.patch(arguments.react)

	// Remove argue entity
	.delete(arguments.remove);


/* Comments */
router.route('/workspaces/:workspace/argues/:argue/comments')
	// Get argue comments list
	.get(comments.list)

	// Create argue comment
	.post(comments.create);

router.route('/workspaces/:workspace/argues/:argue/comments/:comment')
	// Update comment entity
	.put(comments.update)

	// Update like comment entity
	.patch(comments.react)

	// Remove comment entity
	.delete(comments.remove);

module.exports = router;