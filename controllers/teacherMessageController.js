const Message = require('../models/Message');
const Student = require('../models/Student');
const User = require('../models/User');
const mongoose = require('mongoose');

exports.getMyClassParents = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const teacherName = req.user.name;
    
    console.log('=== DEBUG INFO ===');
    console.log('Teacher ID:', teacherId);
    console.log('Teacher Name:', teacherName);
    
    // Check all students first
    const allStudents = await Student.find({});
    console.log('Total students in DB:', allStudents.length);
    allStudents.forEach(s => {
      console.log(`Student: ${s.name}, Teacher: "${s.teacher}", TeacherID: ${s.teacherId}`);
    });
    
    const students = await Student.find({ 
      $or: [
        { teacherId: teacherId },
        { teacher: teacherName }
      ]
    })
    .populate('parentId', 'name email')
    .select('name class section parentId');
    
    console.log('Found students for this teacher:', students.length);
    console.log('==================');
    
    const parents = students.map(student => ({
      studentId: student._id,
      studentName: student.name,
      class: student.class,
      section: student.section,
      parent: {
        id: student.parentId._id,
        name: student.parentId.name,
        email: student.parentId.email
      }
    }));
    
    res.json(parents);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.sendMessageToParent = async (req, res) => {
  try {
    const { studentId, content } = req.body;
    const teacherId = req.user.id;
    const teacherName = req.user.name;
    
    const student = await Student.findById(studentId).populate('parentId');
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    
    // Debug info
    console.log('=== SEND MESSAGE DEBUG ===');
    console.log('Student teacherId:', student.teacherId);
    console.log('Student teacher name:', `"${student.teacher}"`);
    console.log('Current teacherId:', teacherId);
    console.log('Current teacher name:', `"${teacherName}"`);
    console.log('TeacherId match:', student.teacherId?.toString() === teacherId);
    console.log('Teacher name match:', student.teacher === teacherName);
    console.log('========================');
    
    // Check if student belongs to this teacher (using both teacherId and teacher name)
    const isMyStudent = student.teacherId?.toString() === teacherId || student.teacher === teacherName;
    if (!isMyStudent) {
      return res.status(403).json({ 
        error: 'Student is not in your class',
        debug: {
          studentTeacher: student.teacher,
          studentTeacherId: student.teacherId,
          currentTeacher: teacherName,
          currentTeacherId: teacherId
        }
      });
    }
    
    if (!student.parentId || student.parentId.role !== 'Parent') {
      return res.status(404).json({ error: 'Parent not found for this student' });
    }
    
    const message = new Message({
      teacherId,
      parentId: student.parentId._id,
      studentId,
      sender: 'teacher',
      content
    });
    
    await message.save();
    res.status(201).json({
      message,
      studentName: student.name,
      parentName: student.parentId.name
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getConversationWithParent = async (req, res) => {
  try {
    const { studentId } = req.params;
    const teacherId = req.user.id;
    const teacherName = req.user.name;
    
    const student = await Student.findById(studentId).populate('parentId');
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    
    // Check if student belongs to this teacher (using both teacherId and teacher name)
    const isMyStudent = student.teacherId?.toString() === teacherId || student.teacher === teacherName;
    if (!isMyStudent) {
      return res.status(403).json({ error: 'Student not in your class' });
    }
    
    const messages = await Message.find({
      teacherId,
      parentId: student.parentId._id,
      studentId
    }).sort({ timestamp: 1 });
    
    res.json({
      student: { name: student.name, class: student.class, section: student.section },
      parent: { name: student.parentId.name, email: student.parentId.email },
      messages
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMyConversations = async (req, res) => {
  try {
    const teacherId = req.user.id;
    
    console.log('=== CONVERSATIONS DEBUG ===');
    console.log('Teacher ID:', teacherId);
    
    // Get messages without populate first
    const rawMessages = await Message.find({ teacherId });
    console.log('Raw messages found:', rawMessages.length);
    console.log('Raw messages:', rawMessages);
    
    // Simple approach - get all messages for this teacher and group them
    const messages = await Message.find({ teacherId })
      .populate('parentId', 'name email')
      .populate('studentId', 'name class section')
      .sort({ timestamp: -1 });
    
    console.log('Populated messages found:', messages.length);
    console.log('First message:', messages[0]);
    
    // Group by student-parent pairs
    const conversationMap = new Map();
    
    messages.forEach(message => {
      if (message.studentId && message.parentId) {
        const key = `${message.studentId._id}-${message.parentId._id}`;
        if (!conversationMap.has(key)) {
          conversationMap.set(key, {
            studentId: message.studentId._id,
            studentName: message.studentId.name,
            studentClass: message.studentId.class,
            studentSection: message.studentId.section,
            parentId: message.parentId._id,
            parentName: message.parentId.name,
            parentEmail: message.parentId.email,
            lastMessage: message.content,
            lastSender: message.sender,
            lastTimestamp: message.timestamp,
            unreadCount: 0
          });
        }
        
        // Count unread messages from parents
        if (message.sender === 'parent' && !message.read) {
          conversationMap.get(key).unreadCount++;
        }
      }
    });
    
    const conversations = Array.from(conversationMap.values());
    console.log('Final conversations:', conversations.length);
    console.log('========================');
    
    res.json(conversations);
  } catch (error) {
    console.error('Conversations error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.debugStudentTeacher = async (req, res) => {
  try {
    const { studentId } = req.params;
    const teacherId = req.user.id;
    const teacherName = req.user.name;
    
    const student = await Student.findById(studentId);
    
    res.json({
      currentTeacher: {
        id: teacherId,
        name: teacherName
      },
      student: {
        id: student._id,
        name: student.name,
        teacher: student.teacher,
        teacherId: student.teacherId
      },
      validation: {
        teacherIdMatch: student.teacherId?.toString() === teacherId,
        teacherNameMatch: student.teacher === teacherName
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.checkMessages = async (req, res) => {
  try {
    const teacherId = req.user.id;
    
    const allMessages = await Message.find({ teacherId });
    const messageCount = await Message.countDocuments({ teacherId });
    
    res.json({
      teacherId,
      messageCount,
      messages: allMessages
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};