const router = require('express').Router();
const controller = require('../../controllers/self');
// const controller = require('../../controllers/users');

router.route('/')
	.get(controller.self.self);

// router.route('/relationships')
// 	.get(controller.relationships);

// router.route('/notifications')
// 	.get(controller.notifications);
//
// router.route('/notifications/:id')
// 	.patch(controller.notificationsUpdate);
//
// router.route('/chats')
// 	.get(controller.chats)
// 	.post(controller.chatCrate);
//
// router.route('/chats/:id')
// 	.get(controller.chat);

// router.route('/chats/:id')
//     .get(controller.chat)
//     .post(controller.chatMessage);

module.exports = router;