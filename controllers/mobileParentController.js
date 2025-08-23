const Student = require('../models/Student');
const ReportCard = require('../models/ReportCard');
const Message = require('../models/Message');
const User = require('../models/User');

// Mobile: Get parent dashboard data
exports.getParentDashboard = async (req, res) => {
  try {
    const parentId = req.user.id;
    
    // Get all children
    const children = await Student.find({ parentId }).select('name class section teacher');
    
    // Get recent report cards
    const recentReportCards = await ReportCard.find({ 
      studentId: { $in: children.map(c => c._id) } 
    })
    .populate('studentId', 'name')
    .sort({ createdAt: -1 })
    .limit(5);
    
    // Get unread messages count
    const unreadCount = await Message.countDocuments({ 
      parentId, 
      sender: 'teacher', 
      read: false 
    });
    
    res.json({
      children: children.length,
      recentReportCards,
      unreadMessages: unreadCount,
      childrenList: children
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mobile: Get child detailed info
exports.getChildDetails = async (req, res) => {
  try {
    const { studentId } = req.params;
    const parentId = req.user.id;
    
    // Verify child belongs to parent
    const student = await Student.findOne({ _id: studentId, parentId });
    if (!student) return res.status(404).json({ message: 'Child not found' });
    
    // Get latest report card
    const reportCard = await ReportCard.findOne({ studentId })
      .sort({ createdAt: -1 });
    
    // Get teacher info
    const teacher = await User.findOne({ name: student.teacher })
      .select('name email');
    
    res.json({
      student: {
        name: student.name,
        class: student.class,
        section: student.section,
        teacher: student.teacher
      },
      teacher,
      latestReportCard: reportCard,
      overallGrade: reportCard?.summary?.overallGrade || 'N/A',
      attendance: reportCard?.summary?.attendance || 'N/A'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mobile: Get notifications for parent
exports.getNotifications = async (req, res) => {
  try {
    const parentId = req.user.id;
    
    // Get recent messages as notifications
    const notifications = await Message.find({ parentId, sender: 'teacher' })
      .populate('studentId', 'name')
      .populate('teacherId', 'name')
      .sort({ timestamp: -1 })
      .limit(10);
    
    res.json(notifications.map(msg => ({
      id: msg._id,
      title: `Message from ${msg.teacherId.name}`,
      message: msg.content,
      studentName: msg.studentId.name,
      timestamp: msg.timestamp,
      read: msg.read
    })));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mobile: Mark notification as read
exports.markNotificationRead = async (req, res) => {
  try {
    const { messageId } = req.params;
    
    await Message.findByIdAndUpdate(messageId, { read: true });
    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mobile: Add student
exports.addStudent = async (req, res) => {
  try {
    const { name, studentId, class: studentClass, section, dateOfBirth } = req.body;
    const parentId = req.user.id;
    
    // Check if student ID already exists
    const existingStudent = await Student.findOne({ studentId });
    if (existingStudent) {
      return res.status(400).json({ message: 'Student ID already exists' });
    }
    
    const student = new Student({
      name,
      studentId,
      class: studentClass,
      section,
      dateOfBirth: new Date(dateOfBirth),
      teacher: 'TBD', // Will be assigned by admin
      parentId
    });
    
    await student.save();
    
    res.status(201).json({
      message: 'Student added successfully',
      student: {
        id: student._id,
        name: student.name,
        studentId: student.studentId,
        class: student.class,
        section: student.section,
        dateOfBirth: student.dateOfBirth
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mobile: Get child report card
exports.getChildReportCard = async (req, res) => {
  try {
    const { studentId } = req.params;
    const parentId = req.user.id;
    
    // Verify child belongs to parent
    const student = await Student.findOne({ _id: studentId, parentId });
    if (!student) return res.status(404).json({ message: 'Child not found' });
    
    // Get all report cards for progress calculation
    const reportCards = await ReportCard.find({ studentId })
      .populate('studentId', 'name class section')
      .sort({ createdAt: -1 });
    
    if (!reportCards.length) return res.status(404).json({ message: 'No report card found' });
    
    const latest = reportCards[0];
    const previous = reportCards[1];
    
    // Calculate metrics
    const currentScores = latest.performance.map(p => extractScore(p.grade));
    const averageScore = Math.round(currentScores.reduce((a, b) => a + b, 0) / currentScores.length);
    const highestScore = Math.max(...currentScores);
    
    // Calculate improvement
    let improvement = 0;
    if (previous) {
      const prevScores = previous.performance.map(p => extractScore(p.grade));
      const prevAverage = Math.round(prevScores.reduce((a, b) => a + b, 0) / prevScores.length);
      improvement = ((averageScore - prevAverage) / prevAverage * 100).toFixed(1);
    }
    
    res.json({
      student: {
        name: latest.studentId.name,
        grade: latest.studentId.class
      },
      performanceOverview: {
        averageScore: `${averageScore}%`,
        testsTaken: latest.performance.length,
        highestScore: `${highestScore}%`,
        improvement: improvement > 0 ? `+${improvement}%` : `${improvement}%`
      },
      recentTests: latest.performance.map(perf => ({
        subject: perf.subject,
        score: `${extractScore(perf.grade)}/100`,
        testName: `${perf.subject} Test`,
        date: latest.createdAt.toLocaleDateString(),
        strengths: perf.comments ? perf.comments.split(',').map(s => s.trim()) : [],
        areasToImprove: perf.weakness ? perf.weakness.split(',').map(s => s.trim()) : []
      }))
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// Mobile: Get chat with teacher for specific student
exports.getChatWithTeacher = async (req, res) => {
  try {
    const { studentId } = req.params;
    const parentId = req.user.id;
    
    // Verify child belongs to parent
    const student = await Student.findOne({ _id: studentId, parentId });
    if (!student) return res.status(404).json({ message: 'Child not found' });
    
    // Get teacher info
    const teacher = await User.findOne({ name: student.teacher, role: 'Teacher' });
    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });
    
    // Get chat history
    const messages = await Message.find({
      parentId,
      studentId,
      teacherId: teacher._id
    })
    .sort({ timestamp: 1 })
    .populate('teacherId', 'name')
    .populate('parentId', 'name');
    
    // Mark teacher messages as read
    await Message.updateMany(
      { parentId, studentId, teacherId: teacher._id, sender: 'teacher', read: false },
      { read: true }
    );
    
    res.json({
      teacher: {
        id: teacher._id,
        name: teacher.name
      },
      student: {
        id: student._id,
        name: student.name
      },
      messages: messages.map(msg => ({
        id: msg._id,
        content: msg.content,
        sender: msg.sender,
        timestamp: msg.timestamp,
        senderName: msg.sender === 'teacher' ? msg.teacherId.name : msg.parentId.name
      }))
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Mobile: Send message to teacher
exports.sendMessageToTeacher = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { content } = req.body;
    const parentId = req.user.id;
    
    // Verify child belongs to parent
    const student = await Student.findOne({ _id: studentId, parentId });
    if (!student) return res.status(404).json({ message: 'Child not found' });
    
    // Get teacher
    const teacher = await User.findOne({ name: student.teacher, role: 'Teacher' });
    if (!teacher) return res.status(404).json({ message: 'Teacher not found' });
    
    const message = new Message({
      teacherId: teacher._id,
      parentId,
      studentId,
      sender: 'parent',
      content
    });
    
    await message.save();
    
    res.status(201).json({
      id: message._id,
      content: message.content,
      sender: message.sender,
      timestamp: message.timestamp
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};