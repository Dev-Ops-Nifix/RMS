const express = require('express');
const router = express.Router();
const { createTest, getTeacherTests, updateTest, deleteTest, getAllTopics, createSampleTopics, getTestTopic } = require('../controllers/testController');
const auth = require('../middleware/auth');

router.post('/', auth, createTest);
router.get('/', auth, getTeacherTests);
router.put('/:id', auth, updateTest);
router.delete('/:id', auth, deleteTest);
router.get('/topics', getAllTopics);
router.post('/sample-topics', createSampleTopics);
router.get('/topic/:topic', getTestTopic);

module.exports = router;