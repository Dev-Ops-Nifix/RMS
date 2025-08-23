const express = require('express');
const router = express.Router();
const mobileAuthController = require('../controllers/mobileAuthController');
const { validateMobileLogin, validateOTP } = require('../middleware/validation');
const { otpLimiter, loginLimiter } = require('../middleware/rateLimiter');

// Mobile authentication routes
router.post('/request-otp', otpLimiter, validateMobileLogin, mobileAuthController.requestOTP);
router.post('/verify-otp', loginLimiter, validateOTP, mobileAuthController.verifyOTPAndLogin);
router.post('/logout', mobileAuthController.logout);

module.exports = router;