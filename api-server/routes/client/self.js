const router = require('express').Router();
const controller = require('../../controllers/self');

router.route('/')
	.get(controller.self.self);

router.route('/notifications')
	.get(controller.notifications.list);

router.route('/relationships')
	.get(controller.relationships.list);

/* CHATS */
router.route('/chats')
	.get(controller.chat.list)
	.post(controller.chat.create);

router.route('/chats/:chat')
	.get(controller.chat.one);

router.route('/chats/:room/messages')
	.get(controller.chat.messageList)
	.post(controller.chat.messageCreate);

router.route('/chats/:room/messages/:message')
	.patch(controller.chat.messageEdit)
	.delete(controller.chat.messageRemove);

/* WORKSPACES */
router.route('/workspaces')
	.get(controller.workspace.list)
	.post(controller.workspace.create);

router.route('/workspaces/:workspace')
	.get(controller.workspace.detail)
	.put(controller.workspace.update)
	.patch(controller.workspace.archive)
	.delete(controller.workspace.remove);

// router.route('/workspaces/:workspace/arguments')
// 	.get()
// 	.post()
// 	.patch()
// 	.delete();

// router.route('/workspaces/:workspace/members')
// 	.get()
// 	.post()
// 	.patch()
// 	.delete();


module.exports = router;