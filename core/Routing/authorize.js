const router = require('express').Router();

const authorize = require('../Controllers/authorize');

router.post('/', authorize.authorize);
router.post('/email', authorize.verifyEmail);
router.patch('/restore/:token', authorize.restorePassword)
router.get('/verify-email?:token', authorize.verify);


module.exports = router;