const express = require('express');
const router = express.Router();
const { createStudent, getAllStudents, getParentStudents, getTeachers, getClassSections } = require('../controllers/studentController');
const auth = require('../middleware/auth');

router.post('/', auth(['Admin', 'Teacher']), createStudent);
router.get('/', auth(['Admin', 'Teacher']), getAllStudents);
router.get('/parent', auth(['Parent']), getParentStudents);
router.get('/teachers', auth(['Admin', 'Teacher']), getTeachers);
router.get('/class-sections', auth(['Admin', 'Teacher']), getClassSections);

module.exports = router;