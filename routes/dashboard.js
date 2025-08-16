const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');
const auth = require('../middleware/auth');

router.get('/stats', auth(['Admin', 'Teacher']), dashboardController.getDashboardStats);
router.get('/admin', auth(['Admin']), dashboardController.getAdminDashboard);
router.get('/teacher', auth(['Teacher']), dashboardController.getTeacherDashboard);

module.exports = router;