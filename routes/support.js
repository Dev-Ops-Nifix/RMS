const express = require('express');
const router = express.Router();
const supportController = require('../controllers/supportController');
const auth = require('../middleware/auth');

router.post('/tickets', auth(['Admin', 'Teacher', 'Parent']), supportController.createTicket);
router.get('/tickets', auth(['Admin', 'Teacher', 'Parent']), supportController.getTickets);
router.get('/tickets/:ticketId', auth(['Admin', 'Teacher', 'Parent']), supportController.getTicket);
router.get('/faq', supportController.getFAQ);

module.exports = router;