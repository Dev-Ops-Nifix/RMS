const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');
const auth = require('../middleware/auth');

router.get('/', auth(), settingsController.getSettings);
router.put('/password', auth(), settingsController.changePassword);
router.put('/', auth(), settingsController.updateSettings);
router.get('/export', auth(), settingsController.exportData);
router.delete('/account', auth(), settingsController.deleteAccount);

module.exports = router;