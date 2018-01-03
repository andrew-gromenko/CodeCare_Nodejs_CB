const router = require('express').Router();
const notifications = require('../../Controllers/notifications');

router.route('/')

//Notification List

.get(notifications.list)

router.route('/:type')

//Delete current user notifications by type

.delete(notifications.removeMany)

module.exports = router;