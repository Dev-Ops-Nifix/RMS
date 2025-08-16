const express = require('express');
const router = express.Router();
const adminTeacherController = require('../controllers/adminTeacherController');
const auth = require('../middleware/auth');

router.get('/', auth(['Admin', 'SuperAdmin']), adminTeacherController.getAllTeachers);
router.get('/:id', auth(['Admin', 'SuperAdmin']), adminTeacherController.getTeacher);
router.post('/', auth(['Admin', 'SuperAdmin']), adminTeacherController.createTeacher);
router.put('/:id', auth(['Admin', 'SuperAdmin']), adminTeacherController.updateTeacher);
router.delete('/:id', auth(['Admin', 'SuperAdmin']), adminTeacherController.deleteTeacher);

module.exports = router;