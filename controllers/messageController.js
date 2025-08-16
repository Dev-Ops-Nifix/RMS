const Message = require('../models/Message');
const Student = require('../models/Student');
const User = require('../models/User');

exports.sendMessage = async (req, res) => {
  try {
    const { studentId, content } = req.body;
    const teacherId = req.user.id;
    
    // Teachers can only send messages about their own students
    const query = req.user.role === 'Teacher' 
      ? { _id: studentId, teacherId: req.user.id }
      : { _id: studentId };
      
    const student = await Student.findOne(query).populate('parentId');
    if (!student) {
      return res.status(404).json({ error: 'Student not found or access denied' });
    }
    
    if (!student.parentId || student.parentId.role !== 'Parent') {
      return res.status(404).json({ error: 'Parent not found for this student' });
    }
    
    const message = new Message({
      teacherId,
      parentId: student.parentId._id, // Use parentId from student record
      studentId,
      sender: 'teacher',
      content
    });
    
    await message.save();
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.parentMessage = async (req, res) => {
  try {
    const { teacherId, studentId, content } = req.body;
    const loggedParentId = req.user.id;
    
    // Get student and verify parent relationship
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    
    if (student.parentId.toString() !== loggedParentId) {
      return res.status(403).json({ error: 'Unauthorized: Student does not belong to this parent' });
    }
    
    // Verify teacher exists
    const teacher = await User.findById(teacherId);
    if (!teacher || teacher.role !== 'Teacher') {
      return res.status(404).json({ error: 'Teacher not found' });
    }
    
    const message = new Message({
      teacherId,
      parentId: student.parentId, // Use parentId from student record
      studentId,
      sender: 'parent',
      content
    });
    
    await message.save();
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getChatHistory = async (req, res) => {
  try {
    const { teacherId, parentId, studentId } = req.params;
    
    const messages = await Message.find({
      teacherId,
      parentId,
      studentId
    }).sort({ timestamp: 1 });
    
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTeacherChats = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const mongoose = require('mongoose');
    
    const chats = await Message.aggregate([
      { $match: { teacherId: mongoose.Types.ObjectId(teacherId) } },
      { $group: { 
          _id: { parentId: '$parentId', studentId: '$studentId' },
          lastMessage: { $last: '$content' },
          lastTimestamp: { $last: '$timestamp' },
          unreadCount: { $sum: { $cond: [{ $and: [{ $eq: ['$read', false] }, { $eq: ['$sender', 'parent'] }] }, 1, 0] } }
        }
      },
      { $lookup: { from: 'users', localField: '_id.parentId', foreignField: '_id', as: 'parent' } },
      { $lookup: { from: 'students', localField: '_id.studentId', foreignField: '_id', as: 'student' } }
    ]);
    
    res.json(chats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getParentChats = async (req, res) => {
  try {
    const parentId = req.user.id;
    const mongoose = require('mongoose');
    
    const chats = await Message.aggregate([
      { $match: { parentId: mongoose.Types.ObjectId(parentId) } },
      { $group: { 
          _id: { teacherId: '$teacherId', studentId: '$studentId' },
          lastMessage: { $last: '$content' },
          lastTimestamp: { $last: '$timestamp' },
          unreadCount: { $sum: { $cond: [{ $and: [{ $eq: ['$read', false] }, { $eq: ['$sender', 'teacher'] }] }, 1, 0] } }
        }
      },
      { $lookup: { from: 'users', localField: '_id.teacherId', foreignField: '_id', as: 'teacher' } },
      { $lookup: { from: 'students', localField: '_id.studentId', foreignField: '_id', as: 'student' } }
    ]);
    
    res.json(chats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getParentStudents = async (req, res) => {
  try {
    const parentId = req.user.id;
    const students = await Student.find({ parentId }).select('_id name class section teacher');
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTeachers = async (req, res) => {
  try {
    const teachers = await User.find({ role: 'Teacher' }).select('_id name email');
    res.json(teachers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};