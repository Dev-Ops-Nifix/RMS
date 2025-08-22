const express = require('express');
const router = express.Router();
const { createEvent, getTeacherEvents, updateEvent, deleteEvent } = require('../controllers/eventController');
const auth = require('../middleware/auth');

router.post('/', auth, createEvent);
router.get('/', auth, getTeacherEvents);
router.put('/:id', auth, updateEvent);
router.delete('/:id', auth, deleteEvent);

module.exports = router;