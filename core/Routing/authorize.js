const router = require('express').Router();

const authorize = require('../Controllers/authorize');

router.post('/', authorize.authorize);
router.get('/verify-email?:token', authorize.verify);

module.exports = router;