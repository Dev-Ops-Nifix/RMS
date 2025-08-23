const Student = require('../models/Student');
const Performance = require('../models/Performance');
const Test = require('../models/Test');
const Message = require('../models/Message');
const ReportCard = require('../models/ReportCard');
const User = require('../models/User');

// Helper function to calculate GPA from grades
const calculateGPA = (performances) => {
  if (!performances.length) return 0;
  const total = performances.reduce((sum, p) => sum + p.percentage, 0);
  const avg = total / performances.length;
  return (avg / 100 * 4).toFixed(1); // Convert to 4.0 scale
};

// Helper function to get grade from percentage
const getGrade = (percentage) => {
  if (percentage >= 90) return 'A+';
  if (percentage >= 80) return 'A';
  if (percentage >= 70) return 'B';
  if (percentage >= 60) return 'C';
  return 'D';
};

// Helper function to send notification to parent
const sendNotificationToParent = async (parentId, teacherId, studentId, content, sender = 'teacher') => {
  try {
    await Message.create({ parentId, teacherId, studentId, content, sender });
  } catch (error) {
    console.error('Failed to send notification:', error);
  }
};

// GET /api/parent/dashboard/:studentId - Main dashboard data
const getDashboard = async (req, res) => {
  try {
    const { studentId } = req.params;
    const student = await Student.findOne({ _id: studentId, parentId: req.user.id });
    if (!student) return res.status(404).json({ message: 'Student not found' });

    // Get recent performances for current semester
    const recentPerformances = await Performance.find({ studentId })
      .sort({ date: -1 })
      .limit(10);

    // Calculate current semester progress
    const currentSemesterProgress = recentPerformances.length > 0 
      ? Math.round(recentPerformances.reduce((sum, p) => sum + p.percentage, 0) / recentPerformances.length)
      : 0;

    // Get GPA
    const gpa = calculateGPA(recentPerformances);

    // Get upcoming tests
    const upcomingTests = await Test.find({
      class: student.class,
      section: student.section,
      date: { $gte: new Date() }
    }).sort({ date: 1 }).limit(3);

    // Get report card
    const reportCard = await ReportCard.findOne({ studentId });

    res.json({
      student: {
        name: student.name,
        class: student.class,
        section: student.section,
        gpa: parseFloat(gpa)
      },
      currentSemester: {
        progress: currentSemesterProgress,
        period: '2023 Fall - Week 7'
      },
      overallProgress: currentSemesterProgress,
      upcomingTests: upcomingTests.length,
      reportCard: reportCard ? {
        overallGrade: reportCard.summary.overallGrade,
        attendance: reportCard.summary.attendance
      } : null
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET /api/parent/progress/:studentId - Academic progress details
const getProgress = async (req, res) => {
  try {
    const { studentId } = req.params;
    const student = await Student.findOne({ _id: studentId, parentId: req.user.id });
    if (!student) return res.status(404).json({ message: 'Student not found' });

    // Get subject-wise performance
    const performances = await Performance.aggregate([
      { $match: { studentId: student._id } },
      {
        $group: {
          _id: '$subject',
          avgPercentage: { $avg: '$percentage' },
          totalTests: { $sum: 1 },
          recentPerformance: { $last: '$percentage' }
        }
      }
    ]);

    // Get progress trends (last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const trends = await Performance.find({
      studentId,
      date: { $gte: sixMonthsAgo }
    }).sort({ date: 1 });

    const subjectProgress = performances.map(p => ({
      subject: p._id,
      average: Math.round(p.avgPercentage),
      grade: getGrade(p.avgPercentage),
      totalTests: p.totalTests,
      trend: p.recentPerformance > p.avgPercentage ? 'up' : 'down'
    }));

    res.json({
      subjectProgress,
      trends: trends.map(t => ({
        date: t.date,
        subject: t.subject,
        percentage: t.percentage
      }))
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET /api/parent/tests/:studentId - Upcoming and recent tests
const getTests = async (req, res) => {
  try {
    const { studentId } = req.params;
    const student = await Student.findOne({ _id: studentId, parentId: req.user.id });
    if (!student) return res.status(404).json({ message: 'Student not found' });

    // Get upcoming tests
    const upcomingTests = await Test.find({
      class: student.class,
      section: student.section,
      date: { $gte: new Date() }
    }).sort({ date: 1 });

    // Get recent test results
    const recentResults = await Performance.find({ studentId })
      .sort({ date: -1 })
      .limit(5)
      .populate('teacherId', 'name');

    res.json({
      upcoming: upcomingTests.map(test => ({
        title: test.title,
        subject: test.subject,
        date: test.date,
        duration: test.duration,
        totalMarks: test.totalMarks
      })),
      recent: recentResults.map(result => ({
        subject: result.subject,
        testType: result.testType,
        marks: result.marks,
        totalMarks: result.totalMarks,
        percentage: result.percentage,
        date: result.date,
        teacher: result.teacherId?.name
      }))
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET /api/parent/activity/:studentId - Recent activity feed
const getActivity = async (req, res) => {
  try {
    const { studentId } = req.params;
    const student = await Student.findOne({ _id: studentId, parentId: req.user.id });
    if (!student) return res.status(404).json({ message: 'Student not found' });

    // Get recent performances
    const recentPerformances = await Performance.find({ studentId })
      .sort({ date: -1 })
      .limit(5);

    // Get upcoming tests for homework assignments
    const upcomingTests = await Test.find({
      class: student.class,
      section: student.section,
      date: { $gte: new Date(), $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) }
    }).sort({ date: 1 });

    const activities = [];

    // Add test completions
    recentPerformances.forEach(perf => {
      activities.push({
        type: 'test_completed',
        title: `${perf.subject} ${perf.testType} Completed`,
        description: `Score: ${perf.percentage}%`,
        date: perf.date,
        icon: 'star'
      });
    });

    // Add homework assignments
    upcomingTests.forEach(test => {
      activities.push({
        type: 'homework_assigned',
        title: 'New Homework Assigned',
        description: `${test.subject} - Due ${test.date.toLocaleDateString()}`,
        date: test.createdAt,
        icon: 'assignment'
      });
    });

    // Sort by date
    activities.sort((a, b) => new Date(b.date) - new Date(a.date));

    res.json(activities.slice(0, 10));
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET /api/parent/notifications - Parent notifications
const getNotifications = async (req, res) => {
  try {
    const notifications = await Message.find({ parentId: req.user.id })
      .sort({ timestamp: -1 })
      .limit(20)
      .populate('studentId', 'name')
      .populate('teacherId', 'name');

    res.json(notifications.map(notif => ({
      id: notif._id,
      content: notif.content,
      timestamp: notif.timestamp,
      read: notif.read,
      student: notif.studentId?.name,
      teacher: notif.teacherId?.name,
      sender: notif.sender
    })));
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// POST /api/teacher/performance - Auto-notify parents when adding performance data
const createPerformanceWithNotification = async (req, res) => {
  try {
    const { studentId, subject, testType, marks, totalMarks, date } = req.body;
    const percentage = Math.round((marks / totalMarks) * 100);

    // Create performance record
    const performance = await Performance.create({
      studentId,
      subject,
      testType,
      marks,
      totalMarks,
      percentage,
      date: date || new Date(),
      teacherId: req.user.id
    });

    // Get student and parent info
    const student = await Student.findById(studentId);
    if (student && student.parentId) {
      // Send notification to parent
      const content = `New ${testType} result for ${student.name} in ${subject}: ${marks}/${totalMarks} (${percentage}%)`;
      await sendNotificationToParent(student.parentId, req.user.id, studentId, content);
    }

    res.status(201).json({ message: 'Performance recorded and parent notified', performance });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Notification triggers for test scheduling
const createTestWithNotification = async (req, res) => {
  try {
    const { title, subject, class: className, section, date, duration, totalMarks, description } = req.body;

    // Create test
    const test = await Test.create({
      title,
      subject,
      class: className,
      section,
      teacherId: req.user.id,
      date,
      duration,
      totalMarks,
      description
    });

    // Notify all parents in the class
    const students = await Student.find({ class: className, section, parentId: { $ne: null } });
    
    for (const student of students) {
      const content = `Upcoming ${subject} test scheduled for ${student.name}: ${title} on ${new Date(date).toLocaleDateString()}`;
      await sendNotificationToParent(student.parentId, req.user.id, student._id, content);
    }

    res.status(201).json({ message: 'Test scheduled and parents notified', test });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// Legacy functions for backward compatibility
const getChildren = async (req, res) => {
  try {
    const children = await Student.find({ parentId: req.user.id });
    res.json(children);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getChildPerformance = async (req, res) => {
  try {
    const { studentId } = req.params;
    const student = await Student.findOne({ _id: studentId, parentId: req.user.id });
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const reportCard = await ReportCard.findOne({ studentId }).populate('studentId', 'name class');
    if (!reportCard) return res.status(404).json({ message: 'No performance data found' });

    const performanceData = {
      student: reportCard.studentId,
      period: reportCard.period,
      academicYear: reportCard.academicYear,
      subjects: reportCard.performance.map(perf => ({
        subject: perf.subject,
        grade: perf.grade,
        weakness: perf.weakness || 'No specific weaknesses noted',
        improvement: perf.improvement || 'Continue current efforts'
      })),
      teacherComments: reportCard.teacherComments,
      summary: reportCard.summary
    };

    res.json(performanceData);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getClassLeaderboard = async (req, res) => {
  try {
    const { studentId } = req.params;
    const student = await Student.findOne({ _id: studentId, parentId: req.user.id });
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const classStudents = await Student.find({ class: student.class, section: student.section });
    const leaderboard = await Promise.all(classStudents.map(async (s) => {
      const reportCard = await ReportCard.findOne({ studentId: s._id });
      const avgGrade = reportCard ? reportCard.performance.reduce((sum, p) => sum + parseFloat(p.grade), 0) / reportCard.performance.length : 0;
      return { name: s.name, avgGrade: avgGrade.toFixed(2) };
    }));

    leaderboard.sort((a, b) => b.avgGrade - a.avgGrade);
    res.json(leaderboard);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  // New parent portal functions
  getDashboard,
  getProgress,
  getTests,
  getActivity,
  getNotifications,
  createPerformanceWithNotification,
  createTestWithNotification,
  // Legacy functions
  getChildren,
  getChildPerformance,
  getClassLeaderboard
};