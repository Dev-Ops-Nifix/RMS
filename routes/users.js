const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');

router.get('/', auth(['SuperAdmin']), userController.getUsers);
router.put('/:id', auth(['SuperAdmin']), userController.updateUserRole);

module.exports = router;