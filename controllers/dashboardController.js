const Student = require('../models/Student');
const User = require('../models/User');
const Test = require('../models/Test');
const Event = require('../models/Event');
const Performance = require('../models/Performance');
const Message = require('../models/Message');
const ReportCard = require('../models/ReportCard');

const getDashboardStats = async (req, res) => {
  try {
    // Placeholder for dashboard statistics
    const stats = {
      totalStudents: 0,
      totalTeachers: 0,
      totalReportCards: 0,
      recentActivity: [],
      message: "Dashboard module - placeholder implementation"
    };
    
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAdminDashboard = async (req, res) => {
  try {
    const classes = await Student.aggregate([
      {
        $group: {
          _id: { class: '$class', section: '$section' },
          studentCount: { $sum: 1 },
          teacher: { $first: '$teacher' }
        }
      },
      {
        $project: {
          _id: 0,
          class: '$_id.class',
          section: '$_id.section',
          studentCount: 1,
          teacher: 1
        }
      },
      { $sort: { class: 1, section: 1 } }
    ]);
    
    res.json({ classes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getClassDashboard = async (req, res) => {
  try {
    const { classNum, section } = req.params;
    
    // Get students for this class
    const students = await Student.find({ class: classNum, section });
    const studentIds = students.map(s => s._id);
    
    // Get teacher for this class
    const teacher = await User.findOne({ 
      role: 'Teacher',
      class: classNum,
      section: section
    });
    
    // Calculate class average
    const performances = await Performance.find({ 
      studentId: { $in: studentIds },
      date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    });
    
    const currentAverage = performances.length > 0 
      ? Math.round(performances.reduce((sum, p) => sum + p.percentage, 0) / performances.length)
      : 0;
    
    // Get upcoming tests
    const upcomingTests = await Test.find({
      teacherId: teacher?._id,
      date: { $gte: new Date(), $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }
    }).sort({ date: 1 });
    
    // Get unread messages
    const unreadMessages = await Message.find({
      teacherId: teacher?._id,
      sender: 'parent',
      read: false
    }).countDocuments();
    
    // Get subject performance
    const subjectPerformance = await Performance.aggregate([
      { $match: { studentId: { $in: studentIds } } },
      { $group: { _id: '$subject', average: { $avg: '$percentage' } } },
      { $sort: { average: 1 } }
    ]);
    
    // Get top 3 students
    const topStudents = await Performance.aggregate([
      { $match: { studentId: { $in: studentIds } } },
      { $group: { _id: '$studentId', average: { $avg: '$percentage' } } },
      { $sort: { average: -1 } },
      { $limit: 3 },
      { $lookup: { from: 'students', localField: '_id', foreignField: '_id', as: 'student' } },
      { $unwind: '$student' }
    ]);
    
    const dashboardData = {
      teacher: {
        name: teacher?.name || 'No Teacher Assigned',
        initials: teacher?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'NA'
      },
      classInfo: {
        class: classNum,
        section: section,
        totalStudents: students.length
      },
      metrics: {
        currentAverage: {
          value: currentAverage,
          trend: '0%',
          isPositive: true
        },
        upcomingTests: {
          count: upcomingTests.length,
          tests: upcomingTests.map(test => ({
            title: test.title,
            subject: test.subject,
            date: test.date
          }))
        },
        unreadMessages: { count: unreadMessages }
      },
      performance: {
        subjectAverages: subjectPerformance.map(sp => ({
          subject: sp._id,
          average: Math.round(sp.average),
          needsImprovement: sp.average < 80
        }))
      },
      topStudents: topStudents.map((student, index) => ({
        rank: index + 1,
        name: student.student.name,
        class: student.student.class,
        average: Math.round(student.average)
      }))
    };
    
    res.json(dashboardData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTeacherDashboard = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const teacher = await User.findById(teacherId);
    
    // Get teacher's students
    const students = await Student.find({ teacherId });
    const studentIds = students.map(s => s._id);
    
    // Calculate class average
    const performances = await Performance.find({ 
      studentId: { $in: studentIds },
      date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    });
    
    const currentAverage = performances.length > 0 
      ? Math.round(performances.reduce((sum, p) => sum + p.percentage, 0) / performances.length)
      : 0;
    
    // Calculate trend
    const previousPerformances = await Performance.find({
      studentId: { $in: studentIds },
      date: { 
        $gte: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
        $lt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      }
    });
    
    const previousAverage = previousPerformances.length > 0
      ? Math.round(previousPerformances.reduce((sum, p) => sum + p.percentage, 0) / previousPerformances.length)
      : currentAverage;
    
    const trend = currentAverage - previousAverage;
    
    // Get upcoming tests
    const upcomingTests = await Test.find({
      teacherId,
      date: { $gte: new Date(), $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }
    }).sort({ date: 1 });
    
    // Get unread messages
    const unreadMessages = await Message.find({
      teacherId,
      sender: 'parent',
      read: false
    }).countDocuments();
    
    // Get subject performance
    const subjectPerformance = await Performance.aggregate([
      { $match: { studentId: { $in: studentIds } } },
      { $group: { _id: '$subject', average: { $avg: '$percentage' } } },
      { $sort: { average: 1 } }
    ]);
    
    // Get upcoming events
    const upcomingEvents = await Event.find({
      $or: [{ teacherId }, { class: students[0]?.class }],
      date: { $gte: new Date() }
    }).sort({ date: 1 }).limit(5);
    
    // Get latest report card
    const latestReportCard = await ReportCard.findOne({
      studentId: { $in: studentIds }
    }).sort({ createdAt: -1 }).populate('studentId', 'name');
    
    // Get top 3 students
    const topStudents = await Performance.aggregate([
      { $match: { studentId: { $in: studentIds } } },
      { $group: { _id: '$studentId', average: { $avg: '$percentage' } } },
      { $sort: { average: -1 } },
      { $limit: 3 },
      { $lookup: { from: 'students', localField: '_id', foreignField: '_id', as: 'student' } },
      { $unwind: '$student' }
    ]);
    
    const dashboardData = {
      teacher: {
        name: teacher.name,
        initials: teacher.name.split(' ').map(n => n[0]).join('').toUpperCase()
      },
      classInfo: {
        class: students[0]?.class || 'N/A',
        section: students[0]?.section || 'N/A',
        totalStudents: students.length
      },
      metrics: {
        currentAverage: {
          value: currentAverage,
          trend: trend > 0 ? `+${trend}%` : `${trend}%`,
          isPositive: trend >= 0
        },
        upcomingTests: {
          count: upcomingTests.length,
          tests: upcomingTests.map(test => ({
            title: test.title,
            subject: test.subject,
            date: test.date
          }))
        },
        unreadMessages: { count: unreadMessages }
      },
      performance: {
        chartData: performances.map(p => ({
          date: p.date,
          percentage: p.percentage,
          subject: p.subject
        })),
        subjectAverages: subjectPerformance.map(sp => ({
          subject: sp._id,
          average: Math.round(sp.average),
          needsImprovement: sp.average < 80
        }))
      },
      upcomingEvents: upcomingEvents.map(event => ({
        title: event.title,
        date: event.date,
        time: event.time,
        type: event.type
      })),
      latestReportCard: latestReportCard ? {
        studentName: latestReportCard.studentId.name,
        period: latestReportCard.period,
        createdAt: latestReportCard.createdAt
      } : null,
      topStudents: topStudents.map((student, index) => ({
        rank: index + 1,
        name: student.student.name,
        class: student.student.class,
        average: Math.round(student.average)
      }))
    };
    
    res.json(dashboardData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getDashboardStats,
  getAdminDashboard,
  getClassDashboard,
  getTeacherDashboard
};