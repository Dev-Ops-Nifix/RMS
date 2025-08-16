const express = require('express');
const router = express.Router();
const teacherMessageController = require('../controllers/teacherMessageController');
const auth = require('../middleware/auth');

router.get('/my-class-parents', auth(['Teacher']), teacherMessageController.getMyClassParents);
router.post('/send', auth(['Teacher']), teacherMessageController.sendMessageToParent);
router.get('/conversation/:studentId', auth(['Teacher']), teacherMessageController.getConversationWithParent);
router.get('/my-conversations', auth(['Teacher']), teacherMessageController.getMyConversations);
router.get('/debug/:studentId', auth(['Teacher']), teacherMessageController.debugStudentTeacher);
router.get('/check-messages', auth(['Teacher']), teacherMessageController.checkMessages);

const fixController = require('../controllers/fixController');
router.put('/assign-student/:studentId', auth(['Teacher']), fixController.assignStudentToCurrentTeacher);

module.exports = router;