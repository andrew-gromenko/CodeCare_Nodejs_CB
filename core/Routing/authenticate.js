const router = require('express').Router();

const authenticate = require('../Controllers/authenticate');

router.post('/', authenticate);

module.exports = router;