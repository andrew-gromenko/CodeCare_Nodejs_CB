const router = require('express').Router();

const arguments = require('../../Controllers/arguments');
// const comments = require('../../Controllers/arguments.comments');
const workspaces = require('../../Controllers/workspaces');
const members = require('../../Controllers/workspaces.members');

/* Workspaces */
router.route('/')
	// Get list of workspaces
	.get(workspaces.list)

	// Create new workspace entity
	.post(workspaces.create);

router.route('/:workspace')
	// Get workspace entity
	.get(workspaces.one)

	// Update workspace entity
	.put(workspaces.update)

	// Archive/Undo archive workspace entity
	.patch(workspaces.archive)

	// Remove workspace entity
	.delete(workspaces.remove);


/* Members */
router.route('/:workspace/members')
	// Get list of workspace members
	.get(members.list)

	// Push workspace member
	.put(members.push)

	// Pull workspace member
	.delete(members.pull);


/* Argues */
router.route('/:workspace/argues')
	// Get list of workspace argues
	.get(arguments.list)

	// Create new argues entity
	.post(arguments.create);

router.route('/:workspace/argues/:argue')
	// Update argue entity
	.put(arguments.update)

	// Update like/vote argue entity
	.patch(arguments.react)

	// Remove argue entity
	.delete(arguments.remove);


// /* Comments */
// router.route('/:workspace/argues/:argue/comments')
// 	// Get argue comments list
// 	.get(comments.list)
//
// 	// Create argue comment
// 	.post(comments.create);
//
// router.route('/:workspace/argues/:argue/comments/:comment')
// 	// Update comment entity
// 	.put(comments.update)
//
// 	// Update like comment entity
// 	.patch(comments.react)
//
// 	// Remove comment entity
// 	.delete(comments.remove);

module.exports = router;