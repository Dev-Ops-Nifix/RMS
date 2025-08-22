const express = require('express');
const router = express.Router();
const supportController = require('../controllers/supportController');
const adminSupportController = require('../controllers/adminSupportController');
const auth = require('../middleware/auth');

// Public routes
router.get('/faq', supportController.getFAQ);
router.get('/resources/:type', supportController.getResources);
router.post('/tickets', supportController.createTicket);

// User routes (authenticated)
router.get('/tickets', auth(['Admin', 'Teacher', 'Parent']), supportController.getTickets);
router.get('/tickets/:ticketId', auth(['Admin', 'Teacher', 'Parent']), supportController.getTicket);

// Admin routes
router.get('/admin/tickets', auth(['Admin', 'SuperAdmin']), supportController.getAllTickets);
router.put('/admin/tickets/:ticketId', auth(['Admin', 'SuperAdmin']), supportController.updateTicketStatus);
router.get('/admin/dashboard', auth(['Admin', 'SuperAdmin']), adminSupportController.getDashboardStats);
router.post('/admin/faq', auth(['Admin', 'SuperAdmin']), adminSupportController.createFAQ);
router.put('/admin/faq/:id', auth(['Admin', 'SuperAdmin']), adminSupportController.updateFAQ);
router.delete('/admin/faq/:id', auth(['Admin', 'SuperAdmin']), adminSupportController.deleteFAQ);
router.post('/admin/resources', auth(['Admin', 'SuperAdmin']), adminSupportController.createResource);
router.put('/admin/resources/:id', auth(['Admin', 'SuperAdmin']), adminSupportController.updateResource);

module.exports = router;