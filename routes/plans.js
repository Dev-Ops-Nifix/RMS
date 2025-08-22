const express = require('express');
const router = express.Router();
const planController = require('../controllers/planController');
const auth = require('../middleware/auth');

router.get('/', auth(['Admin', 'Teacher']), planController.getPlans);
router.get('/current', auth(['Admin', 'Teacher']), planController.getCurrentPlan);
router.get('/subscriptions', auth(['Admin']), planController.getStudentSubscriptions);
router.post('/upgrade', auth(['Admin']), planController.upgradePlan);

module.exports = router;