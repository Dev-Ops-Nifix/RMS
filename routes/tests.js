const express = require('express');
const router = express.Router();
const { createTest, getTeacherTests, updateTest, deleteTest } = require('../controllers/testController');
const auth = require('../middleware/auth');

router.post('/', auth, createTest);
router.get('/', auth, getTeacherTests);
router.put('/:id', auth, updateTest);
router.delete('/:id', auth, deleteTest);

module.exports = router;