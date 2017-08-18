const router = require('express').Router();
const authorize = require('../../controllers/authorize');

router.post('/', authorize);

module.exports = router;