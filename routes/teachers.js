const express = require('express');
const router = express.Router();
const { getMyStudents, addStudent, getStudent, updateStudent, deleteStudent, assignStudentToMe, createTeacher, getAllTeachers } = require('../controllers/teacherController');
const auth = require('../middleware/auth');

// Teacher management (Admin only)
router.post('/', auth(['Admin']), createTeacher);
router.get('/', auth(['Admin']), getAllTeachers);

// Student management
router.get('/students', auth(['Admin', 'Teacher']), getMyStudents);
router.post('/students', auth(['Admin', 'Teacher']), addStudent);
router.get('/students/:id', auth(['Admin', 'Teacher']), getStudent);
router.put('/students/:id', auth(['Admin', 'Teacher']), updateStudent);
router.delete('/students/:id', auth(['Admin', 'Teacher']), deleteStudent);
router.put('/assign-student/:id', auth(['Teacher']), assignStudentToMe);

const quickFix = require('../controllers/quickFix');
router.put('/fix-name', auth(['Teacher']), quickFix.updateTeacherName);
router.put('/fix-student/:studentId', auth(['Teacher']), quickFix.updateStudentTeacher);

module.exports = router;