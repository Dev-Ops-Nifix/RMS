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