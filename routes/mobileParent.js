const express = require('express');
const router = express.Router();
const mobileParentController = require('../controllers/mobileParentController');
const auth = require('../middleware/auth');

// Mobile parent routes
router.get('/dashboard', auth(['Parent']), mobileParentController.getParentDashboard);
router.get('/child/:studentId', auth(['Parent']), mobileParentController.getChildDetails);
router.get('/notifications', auth(['Parent']), mobileParentController.getNotifications);
router.put('/notifications/:messageId/read', auth(['Parent']), mobileParentController.markNotificationRead);

module.exports = router;