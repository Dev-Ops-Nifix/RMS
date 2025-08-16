const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const auth = require('../middleware/auth');

router.post('/send', auth(['Admin', 'Teacher']), messageController.sendMessage);
router.post('/parent-message', auth(['Parent']), messageController.parentMessage);
router.get('/chat/:teacherId/:parentId/:studentId', auth(['Admin', 'Teacher', 'Parent']), messageController.getChatHistory);
router.get('/teacher-chats', auth(['Admin', 'Teacher']), messageController.getTeacherChats);
router.get('/parent-chats', auth(['Parent']), messageController.getParentChats);
router.get('/parent-students', auth(['Parent']), messageController.getParentStudents);
router.get('/teachers', auth(['Admin', 'Parent']), messageController.getTeachers);

module.exports = router;