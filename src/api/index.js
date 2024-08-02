const express = require('express');
const router = express.Router();
const user = require('./User/router');
const role = require('./Role/router');
const auth = require('./Auth/router');


router.use(user);
router.use(role);
router.use(auth);


module.exports = router;