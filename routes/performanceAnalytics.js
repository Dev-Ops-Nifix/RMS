const express = require('express');
const router = express.Router();
const {
  getPerformanceOverview,
  getRecentTests,
  getSubjectPerformance,
  getStrengthsAndImprovements,
  getPerformanceTrends,
  getAnalyticsDashboard
} = require('../controllers/performanceAnalyticsController');
const auth = require('../middleware/auth');

// Performance analytics routes
router.get('/:studentId/overview', auth(['Admin', 'Teacher', 'Parent']), getPerformanceOverview);
router.get('/:studentId/recent-tests', auth(['Admin', 'Teacher', 'Parent']), getRecentTests);
router.get('/:studentId/subjects', auth(['Admin', 'Teacher', 'Parent']), getSubjectPerformance);
router.get('/:studentId/strengths-improvements', auth(['Admin', 'Teacher', 'Parent']), getStrengthsAndImprovements);
router.get('/:studentId/trends', auth(['Admin', 'Teacher', 'Parent']), getPerformanceTrends);
router.get('/:studentId/dashboard', auth(['Admin', 'Teacher', 'Parent']), getAnalyticsDashboard);

module.exports = router;