const express = require('express');
// const passport = require('passport');

const router = express.Router();
const { loginUser } = require('./controller');

router.post('/login-user', loginUser);

module.exports = router;
