const router = require('express').Router();
const notifications = require('../../Controllers/notifications');

router.route('/')

//Notification List

.get(notifications.list)

module.exports = router;