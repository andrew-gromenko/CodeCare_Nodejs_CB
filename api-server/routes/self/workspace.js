const router = require('express').Router();

// const arguments = require('../../Controllers/arguments');
// const workspaces = require('../../Controllers/workspaces');
// const members = require('../../Controllers/workspaces.members');

const arguments = require('../../controllers/self/arguments');
const workspaces = require('../../controllers/self/workspace');
const members = require('../../controllers/self/workspace.members');
// const comments = require('../../controllers/self/arguments.comments');


/* Workspaces */
router.route('/')
	// Get list of workspaces
	.get(workspaces.list)

	// Create new workspace entity
	.post(workspaces.create);

router.route('/:workspace')
	// Get workspace entity
	.get(workspaces.one)

	// Invite people to workspace
	.post(workspaces.invite)

	// Update workspace entity
	.put(workspaces.update)

	// Archive/Undo workspace entity
	.patch(workspaces.archive)

	// Remove workspace entity
	.delete(workspaces.remove);



/* Members */
router.route('/:workspace/members')
	// Get list of workspace members
	.get(members.list)

	// Push workspace member
	.post(members.push)

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
// // Get argue comments list
// 	.get(comments.list)
//
// 	// Create argue comment
// 	.post(comments.create);
//
// router.route('/:workspace/argues/:argue/comments/:comment')
// // Update comment entity
// 	.put(comments.update)
//
// 	// Update like comment entity
// 	.patch(comments.react)
//
// 	// Remove comment entity
// 	.delete(comments.remove);

module.exports = router;