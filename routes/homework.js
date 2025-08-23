const express = require('express');
const router = express.Router();
const homeworkController = require('../controllers/homeworkController');
const auth = require('../middleware/auth');

router.get('/topics/:studentId', auth(['Student', 'Parent']), homeworkController.getTopicsByStudent);
router.get('/resources/:topicId', auth(['Student', 'Parent']), homeworkController.getTopicResources);
router.get('/subjects/:subject/class/:class', auth(['Student', 'Parent', 'Teacher']), homeworkController.getSubjectTopics);

module.exports = router;