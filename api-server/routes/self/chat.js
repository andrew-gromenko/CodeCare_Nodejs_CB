const router = require('express').Router();

const chat = require('../../controllers/self/chat');

/* CHATS */
router.route('/')
	.get(chat.list)
	.post(chat.create);

router.route('/:room')
	.get(chat.one);

router.route('/:room/messages')
	.get(chat.messageList)
	.post(chat.messageCreate)
	.patch(chat.messagePristine);

router.route('/:room/messages/:message')
	.put(chat.messageEdit)
	.delete(chat.messageRemove);

module.exports = router;