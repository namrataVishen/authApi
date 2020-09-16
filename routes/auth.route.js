const express = require('express');
const router = express.Router();
const authCtrl = require('../controllers/auth.controller');
const jwtHelper = require('../config/jwtHelper');

router.post('/register', authCtrl.register);
router.post('/authenticate', authCtrl.authenticate);
router.post('/refreshToken', authCtrl.refreshToken);
router.post('/logout', jwtHelper.verifyJwtToken, authCtrl.logout);

module.exports = router;
