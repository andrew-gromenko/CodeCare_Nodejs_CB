const router = require('express').Router();
const authenticate = require('../../controllers/authenticate');

router.post('/', authenticate);

module.exports = router;