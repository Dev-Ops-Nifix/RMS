const express = require('express');
const router = express.Router();
const parentController = require('../controllers/parentController');
const auth = require('../middleware/auth');

router.get('/children', auth(['Parent']), parentController.getChildren);
router.get('/performance/:studentId', auth(['Parent']), parentController.getChildPerformance);
router.get('/leaderboard/:studentId', auth(['Parent']), parentController.getClassLeaderboard);

module.exports = router;