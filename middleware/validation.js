const { body, validationResult } = require('express-validator');

// Validation middleware
exports.validateMobileLogin = [
  body('mobile')
    .isMobilePhone('any')
    .withMessage('Invalid mobile number format'),
  body('email')
    .isEmail()
    .withMessage('Invalid email format'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

exports.validateOTP = [
  body('otp')
    .isLength({ min: 4, max: 4 })
    .isNumeric()
    .withMessage('OTP must be 4 digits'),
  body('userId')
    .isMongoId()
    .withMessage('Invalid user ID'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];