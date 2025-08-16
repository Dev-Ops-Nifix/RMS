const express = require('express');
const router = express.Router();
const performanceController = require('../controllers/performanceController');
const auth = require('../middleware/auth');

router.get('/student/:studentId', auth(['Admin', 'Teacher']), performanceController.getStudentPerformance);
router.get('/class/:classId', auth(['Admin', 'Teacher']), performanceController.getClassPerformance);
router.get('/trends', auth(['Admin', 'Teacher']), performanceController.getPerformanceTrends);

module.exports = router;