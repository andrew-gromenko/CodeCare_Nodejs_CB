const router = require('express').Router();

const authorize = require('../Controllers/authorize');

router.post('/', authorize);

module.exports = router;