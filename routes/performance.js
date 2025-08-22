const express = require('express');
const router = express.Router();
const { addPerformance, getStudentPerformance, getClassPerformance, getPerformanceTrends, getSubjectPerformanceStats } = require('../controllers/performanceController');
const auth = require('../middleware/auth');

router.post('/', auth, addPerformance);
router.get('/student/:studentId', auth, getStudentPerformance);
router.get('/class', auth, getClassPerformance);
router.get('/trends', auth, getPerformanceTrends);
router.get('/subject-stats', auth(['Admin']), getSubjectPerformanceStats);

module.exports = router;