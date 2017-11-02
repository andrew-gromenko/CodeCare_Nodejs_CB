const router = require('express').Router();

const chats = require('../../Controllers/chats');
const messages = require('../../Controllers/chats.messages');

router.route('/')
	.get(chats.list)
	.post(chats.create);

router.route('/:room')
	.get(chats.one);

router.route('/:room/messages')
	.get(messages.list)
	.post(messages.create)
	.patch(messages.pristine)
	.delete(messages.remove);

router.route('/:room/messages/:message')
	.patch(messages.edit);

module.exports = router;