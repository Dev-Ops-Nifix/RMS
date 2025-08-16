const AdminTeacherMessage = require('../models/AdminTeacherMessage');
const User = require('../models/User');

// Admin sends message to teacher
exports.adminSendMessage = async (req, res) => {
  try {
    const { teacherId, content } = req.body;
    
    const teacher = await User.findOne({ _id: teacherId, role: 'Teacher' });
    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });
    
    const message = new AdminTeacherMessage({
      adminId: req.user.id,
      teacherId,
      sender: 'admin',
      content
    });
    
    await message.save();
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Teacher sends message to admin
exports.teacherSendMessage = async (req, res) => {
  try {
    const { adminId, content } = req.body;
    
    const admin = await User.findOne({ _id: adminId, role: 'Admin' });
    if (!admin) return res.status(404).json({ message: 'Admin not found' });
    
    const message = new AdminTeacherMessage({
      adminId,
      teacherId: req.user.id,
      sender: 'teacher',
      content
    });
    
    await message.save();
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get chat history between admin and teacher
exports.getChatHistory = async (req, res) => {
  try {
    const { adminId, teacherId } = req.params;
    
    const messages = await AdminTeacherMessage.find({ adminId, teacherId })
      .populate('adminId', 'name')
      .populate('teacherId', 'name')
      .sort({ timestamp: 1 });
    
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Get all teacher chats
exports.getAdminChats = async (req, res) => {
  try {
    const adminId = req.user.id;
    
    const chats = await AdminTeacherMessage.aggregate([
      { $match: { adminId: require('mongoose').Types.ObjectId(adminId) } },
      { $group: {
          _id: '$teacherId',
          lastMessage: { $last: '$content' },
          lastTimestamp: { $last: '$timestamp' },
          unreadCount: { $sum: { $cond: [{ $and: [{ $eq: ['$read', false] }, { $eq: ['$sender', 'teacher'] }] }, 1, 0] } }
        }
      },
      { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'teacher' } },
      { $unwind: '$teacher' }
    ]);
    
    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Teacher: Get admin chats
exports.getTeacherChats = async (req, res) => {
  try {
    const teacherId = req.user.id;
    
    const chats = await AdminTeacherMessage.aggregate([
      { $match: { teacherId: require('mongoose').Types.ObjectId(teacherId) } },
      { $group: {
          _id: '$adminId',
          lastMessage: { $last: '$content' },
          lastTimestamp: { $last: '$timestamp' },
          unreadCount: { $sum: { $cond: [{ $and: [{ $eq: ['$read', false] }, { $eq: ['$sender', 'admin'] }] }, 1, 0] } }
        }
      },
      { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'admin' } },
      { $unwind: '$admin' }
    ]);
    
    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all admins (for teacher to select who to chat with)
exports.getAdmins = async (req, res) => {
  try {
    const admins = await User.find({ role: 'Admin' }).select('_id name email');
    res.json(admins);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};