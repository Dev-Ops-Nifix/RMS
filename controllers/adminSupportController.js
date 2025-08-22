const SupportTicket = require('../models/SupportTicket');
const FAQ = require('../models/FAQ');
const SupportResource = require('../models/SupportResource');

const getDashboardStats = async (req, res) => {
  try {
    const totalTickets = await SupportTicket.countDocuments();
    const openTickets = await SupportTicket.countDocuments({ status: 'open' });
    const inProgressTickets = await SupportTicket.countDocuments({ status: 'in-progress' });
    const resolvedTickets = await SupportTicket.countDocuments({ status: 'resolved' });
    
    const stats = {
      totalTickets,
      openTickets,
      inProgressTickets,
      resolvedTickets,
      totalFAQs: await FAQ.countDocuments({ isActive: true }),
      totalResources: await SupportResource.countDocuments({ isActive: true })
    };
    
    res.json({ stats });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createFAQ = async (req, res) => {
  try {
    const { question, answer, category, order } = req.body;
    
    const faq = new FAQ({
      question,
      answer,
      category: category || 'general',
      order: order || 0
    });
    
    await faq.save();
    res.status(201).json({ faq, message: 'FAQ created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateFAQ = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const faq = await FAQ.findByIdAndUpdate(id, updates, { new: true });
    
    if (!faq) {
      return res.status(404).json({ error: 'FAQ not found' });
    }
    
    res.json({ faq, message: 'FAQ updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteFAQ = async (req, res) => {
  try {
    const { id } = req.params;
    
    const faq = await FAQ.findByIdAndDelete(id);
    
    if (!faq) {
      return res.status(404).json({ error: 'FAQ not found' });
    }
    
    res.json({ message: 'FAQ deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createResource = async (req, res) => {
  try {
    const { title, description, type, url, order } = req.body;
    
    const resource = new SupportResource({
      title,
      description,
      type,
      url,
      order: order || 0
    });
    
    await resource.save();
    res.status(201).json({ resource, message: 'Resource created successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateResource = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const resource = await SupportResource.findByIdAndUpdate(id, updates, { new: true });
    
    if (!resource) {
      return res.status(404).json({ error: 'Resource not found' });
    }
    
    res.json({ resource, message: 'Resource updated successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getDashboardStats,
  createFAQ,
  updateFAQ,
  deleteFAQ,
  createResource,
  updateResource
};