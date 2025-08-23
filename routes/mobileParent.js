const express = require('express');
const router = express.Router();
const mobileParentController = require('../controllers/mobileParentController');
const auth = require('../middleware/auth');

// Mobile parent routes
router.get('/dashboard', auth(['Parent']), mobileParentController.getParentDashboard);
router.get('/child/:studentId', auth(['Parent']), mobileParentController.getChildDetails);
router.get('/report-card/:studentId', auth(['Parent']), mobileParentController.getChildReportCard);
router.get('/chat/:studentId', auth(['Parent']), mobileParentController.getChatWithTeacher);
router.post('/chat/:studentId/send', auth(['Parent']), mobileParentController.sendMessageToTeacher);
router.get('/notifications', auth(['Parent']), mobileParentController.getNotifications);
router.put('/notifications/:messageId/read', auth(['Parent']), mobileParentController.markNotificationRead);
router.post('/add-student', auth(['Parent']), mobileParentController.addStudent);

module.exports = router;