const express = require('express');
const router = express.Router();
const teacherController = require('../controllers/teacherController');
const auth = require('../middleware/auth');

router.get('/students', auth(['Admin', 'Teacher']), teacherController.getMyStudents);
router.post('/students', auth(['Admin', 'Teacher']), teacherController.addStudent);
router.get('/students/:id', auth(['Admin', 'Teacher']), teacherController.getStudent);
router.put('/students/:id', auth(['Admin', 'Teacher']), teacherController.updateStudent);
router.delete('/students/:id', auth(['Admin', 'Teacher']), teacherController.deleteStudent);
router.put('/assign-student/:id', auth(['Teacher']), teacherController.assignStudentToMe);

const quickFix = require('../controllers/quickFix');
router.put('/fix-name', auth(['Teacher']), quickFix.updateTeacherName);
router.put('/fix-student/:studentId', auth(['Teacher']), quickFix.updateStudentTeacher);

module.exports = router;