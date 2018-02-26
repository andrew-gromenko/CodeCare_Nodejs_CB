const router = require('express').Router();
const notifications = require('../../Controllers/notifications');

router.route('/')

//Notification List

.get(notifications.list);

router.route('/:type')

//Read user notifications by type

.patch(notifications.readMany);

router.route('/:notification')

//Read notification by id

.put(notifications.read);

module.exports = router;