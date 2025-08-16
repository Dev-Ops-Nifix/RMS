const express = require('express');
const router = express.Router();
const adminTeacherChatController = require('../controllers/adminTeacherChatController');
const auth = require('../middleware/auth');

// Admin routes
router.post('/admin/send', auth(['Admin']), adminTeacherChatController.adminSendMessage);
router.get('/admin/chats', auth(['Admin']), adminTeacherChatController.getAdminChats);

// Teacher routes
router.post('/teacher/send', auth(['Teacher']), adminTeacherChatController.teacherSendMessage);
router.get('/teacher/chats', auth(['Teacher']), adminTeacherChatController.getTeacherChats);
router.get('/admins', auth(['Teacher']), adminTeacherChatController.getAdmins);

// Shared routes
router.get('/history/:adminId/:teacherId', auth(['Admin', 'Teacher']), adminTeacherChatController.getChatHistory);

module.exports = router;