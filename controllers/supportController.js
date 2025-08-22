const SupportTicket = require('../models/SupportTicket');
const FAQ = require('../models/FAQ');
const SupportResource = require('../models/SupportResource');
const nodemailer = require('nodemailer');

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'support@vault.nifix.in',
    pass: process.env.EMAIL_PASS || 'your-app-password'
  }
});

const createTicket = async (req, res) => {
  try {
    const { name, email, subject, message, priority } = req.body;
    
    console.log('Creating ticket:', { name, email, subject });
    
    const ticket = new SupportTicket({
      name,
      email,
      subject,
      message,
      priority: priority || 'medium',
      userId: req.user ? req.user.id : null
    });
    
    await ticket.save();
    console.log('Ticket saved:', ticket.ticketId);
    
    res.status(201).json({
      success: true,
      ticket: {
        ticketId: ticket.ticketId,
        subject: ticket.subject,
        status: ticket.status,
        createdAt: ticket.createdAt
      },
      message: 'Support ticket created successfully'
    });
  } catch (error) {
    console.error('Create ticket error:', error);
    res.status(500).json({ error: error.message });
  }
};

const getTickets = async (req, res) => {
  try {
    const tickets = await SupportTicket.find({})
      .select('ticketId subject status priority createdAt')
      .sort({ createdAt: -1 });
    
    console.log('Found tickets:', tickets.length);
    res.json({ tickets });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTicket = async (req, res) => {
  try {
    const ticket = await SupportTicket.findOne({ ticketId: req.params.ticketId });
    
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }
    
    res.json({ ticket });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getFAQ = async (req, res) => {
  try {
    const { search } = req.query;
    let query = { isActive: true };
    
    if (search) {
      query.$or = [
        { question: { $regex: search, $options: 'i' } },
        { answer: { $regex: search, $options: 'i' } }
      ];
    }
    
    const faqs = await FAQ.find(query).sort({ order: 1, createdAt: -1 });
    res.json({ faqs });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getResources = async (req, res) => {
  try {
    const { type } = req.params;
    const resources = await SupportResource.find({ 
      type, 
      isActive: true 
    }).sort({ order: 1, createdAt: -1 });
    
    res.json({ resources });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Admin functions
const getAllTickets = async (req, res) => {
  try {
    const { status, priority } = req.query;
    let query = {};
    
    if (status) query.status = status;
    if (priority) query.priority = priority;
    
    const tickets = await SupportTicket.find(query)
      .sort({ createdAt: -1 })
      .populate('userId', 'name email');
    
    res.json({ tickets });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateTicketStatus = async (req, res) => {
  try {
    const { ticketId } = req.params;
    const { status, adminReply } = req.body;
    
    const ticket = await SupportTicket.findOneAndUpdate(
      { ticketId },
      { 
        status, 
        adminReply: adminReply || ticket.adminReply,
        repliedAt: adminReply ? new Date() : ticket.repliedAt
      },
      { new: true }
    );
    
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found' });
    }
    
    res.json({ ticket, message: 'Ticket updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createTicket,
  getTickets,
  getTicket,
  getFAQ,
  getResources,
  getAllTickets,
  updateTicketStatus
};