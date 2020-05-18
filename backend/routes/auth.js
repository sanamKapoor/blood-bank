const express = require('express');

const authController = require('../controller/auth');

const router = express.Router();

router.post('/bank-login', authController.bankLogin);
router.post('/donor-login', authController.donorLogin);

module.exports = router;
