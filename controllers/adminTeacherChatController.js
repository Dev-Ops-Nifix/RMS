const Message = require('../models/Message');
const Student = require('../models/Student');
const User = require('../models/User');
const mongoose = require('mongoose');

// Admin: Get all classes with student counts
exports.getClassOverview = async (req, res) => {
  try {
    const classes = await Student.aggregate([
      {
        $group: {
          _id: { class: '$class', section: '$section' },
          studentCount: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          class: '$_id.class',
          section: '$_id.section',
          studentCount: 1
        }
      },
      { $sort: { class: 1, section: 1 } }
    ]);
    
    res.json(classes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Get teacher-parent chats for a specific class
exports.getClassChats = async (req, res) => {
  try {
    const { classNum, section } = req.params;
    
    const chats = await Message.aggregate([
      {
        $lookup: {
          from: 'students',
          localField: 'studentId',
          foreignField: '_id',
          as: 'student'
        }
      },
      { $unwind: '$student' },
      {
        $match: {
          'student.class': classNum,
          'student.section': section
        }
      },
      {
        $group: {
          _id: {
            teacherId: '$teacherId',
            parentId: '$parentId',
            studentId: '$studentId'
          },
          lastMessage: { $last: '$content' },
          lastTimestamp: { $last: '$timestamp' },
          messageCount: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id.teacherId',
          foreignField: '_id',
          as: 'teacher'
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id.parentId',
          foreignField: '_id',
          as: 'parent'
        }
      },
      {
        $lookup: {
          from: 'students',
          localField: '_id.studentId',
          foreignField: '_id',
          as: 'student'
        }
      },
      { $unwind: '$teacher' },
      { $unwind: '$parent' },
      { $unwind: '$student' },
      {
        $project: {
          teacherId: '$_id.teacherId',
          parentId: '$_id.parentId',
          studentId: '$_id.studentId',
          teacherName: '$teacher.name',
          parentName: '$parent.name',
          studentName: '$student.name',
          lastMessage: 1,
          lastTimestamp: 1,
          messageCount: 1
        }
      },
      { $sort: { lastTimestamp: -1 } }
    ]);
    
    res.json(chats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin: Get specific chat history between teacher and parent for a student
exports.getChatHistory = async (req, res) => {
  try {
    const { teacherId, parentId, studentId } = req.params;
    
    const messages = await Message.find({
      teacherId,
      parentId,
      studentId
    })
    .populate('teacherId', 'name')
    .populate('parentId', 'name')
    .populate('studentId', 'name class section')
    .sort({ timestamp: 1 });
    
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};