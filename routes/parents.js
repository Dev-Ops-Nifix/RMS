const express = require('express');
const router = express.Router();
const parentController = require('../controllers/parentController');
const auth = require('../middleware/auth');

// New parent portal routes
router.get('/dashboard/:studentId', auth(['Parent']), parentController.getDashboard);
router.get('/progress/:studentId', auth(['Parent']), parentController.getProgress);
router.get('/tests/:studentId', auth(['Parent']), parentController.getTests);
router.get('/activity/:studentId', auth(['Parent']), parentController.getActivity);
router.get('/notifications', auth(['Parent']), parentController.getNotifications);

// Teacher routes for auto-notifications
router.post('/teacher/performance', auth(['Teacher']), parentController.createPerformanceWithNotification);
router.post('/teacher/test', auth(['Teacher']), parentController.createTestWithNotification);

// Legacy routes
router.get('/children', auth(['Parent']), parentController.getChildren);
router.get('/performance/:studentId', auth(['Parent']), parentController.getChildPerformance);
router.get('/leaderboard/:studentId', auth(['Parent']), parentController.getClassLeaderboard);

module.exports = router;