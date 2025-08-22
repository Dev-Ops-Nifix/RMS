const express = require('express');
const router = express.Router();
const adminTeacherChatController = require('../controllers/adminTeacherChatController');
const auth = require('../middleware/auth');

// Admin routes for viewing class chats
router.get('/classes', auth(['Admin']), adminTeacherChatController.getClassOverview);
router.get('/class/:classNum/:section', auth(['Admin']), adminTeacherChatController.getClassChats);
router.get('/history/:teacherId/:parentId/:studentId', auth(['Admin']), adminTeacherChatController.getChatHistory);

module.exports = router;