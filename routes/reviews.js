const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const auth = require('../middleware/auth');

router.post('/', auth(['Teacher']), reviewController.addReview);
router.get('/parent', auth(['Parent']), reviewController.getParentReviews);

module.exports = router;