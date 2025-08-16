const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const auth = require('../middleware/auth');

router.post('/', auth(['Admin', 'Teacher']), studentController.createStudent);
router.get('/', auth(['Admin', 'Teacher']), studentController.getAllStudents);
router.get('/parent', auth(['Parent']), studentController.getParentStudents);

module.exports = router;