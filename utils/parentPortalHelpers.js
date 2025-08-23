const Message = require('../models/Message');
const Performance = require('../models/Performance');

// Grade calculation helpers
const calculateGPA = (performances) => {
  if (!performances.length) return 0;
  const total = performances.reduce((sum, p) => sum + p.percentage, 0);
  const avg = total / performances.length;
  return (avg / 100 * 4).toFixed(1); // Convert to 4.0 scale
};

const getGradeFromPercentage = (percentage) => {
  if (percentage >= 90) return 'A+';
  if (percentage >= 80) return 'A';
  if (percentage >= 70) return 'B';
  if (percentage >= 60) return 'C';
  return 'D';
};

const calculateProgressPercentage = (performances) => {
  if (!performances.length) return 0;
  return Math.round(performances.reduce((sum, p) => sum + p.percentage, 0) / performances.length);
};

// Notification helpers
const sendParentNotification = async (parentId, teacherId, studentId, content, sender = 'teacher') => {
  try {
    await Message.create({
      parentId,
      teacherId,
      studentId,
      content,
      sender,
      timestamp: new Date(),
      read: false
    });
    return true;
  } catch (error) {
    console.error('Failed to send parent notification:', error);
    return false;
  }
};

const createPerformanceNotification = (studentName, subject, testType, marks, totalMarks, percentage) => {
  return `New ${testType} result for ${studentName} in ${subject}: ${marks}/${totalMarks} (${percentage}%)`;
};

const createTestScheduleNotification = (studentName, subject, title, date) => {
  return `Upcoming ${subject} test scheduled for ${studentName}: ${title} on ${new Date(date).toLocaleDateString()}`;
};

const createHomeworkNotification = (studentName, subject, assignment, dueDate) => {
  return `New homework assigned for ${studentName} in ${subject}: ${assignment}. Due: ${new Date(dueDate).toLocaleDateString()}`;
};

const createAchievementNotification = (studentName, achievement) => {
  return `Congratulations! ${studentName} has achieved: ${achievement}`;
};

// Progress tracking helpers
const getSubjectWiseProgress = async (studentId) => {
  try {
    const performances = await Performance.aggregate([
      { $match: { studentId } },
      {
        $group: {
          _id: '$subject',
          avgPercentage: { $avg: '$percentage' },
          totalTests: { $sum: 1 },
          recentPerformance: { $last: '$percentage' },
          bestPerformance: { $max: '$percentage' },
          worstPerformance: { $min: '$percentage' }
        }
      }
    ]);

    return performances.map(p => ({
      subject: p._id,
      average: Math.round(p.avgPercentage),
      grade: getGradeFromPercentage(p.avgPercentage),
      totalTests: p.totalTests,
      trend: p.recentPerformance > p.avgPercentage ? 'up' : 'down',
      best: p.bestPerformance,
      worst: p.worstPerformance
    }));
  } catch (error) {
    console.error('Error calculating subject-wise progress:', error);
    return [];
  }
};

const getProgressTrends = async (studentId, months = 6) => {
  try {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    const trends = await Performance.find({
      studentId,
      date: { $gte: startDate }
    }).sort({ date: 1 });

    return trends.map(t => ({
      date: t.date,
      subject: t.subject,
      percentage: t.percentage,
      testType: t.testType
    }));
  } catch (error) {
    console.error('Error getting progress trends:', error);
    return [];
  }
};

// Activity feed helpers
const generateActivityFeed = (performances, tests, messages) => {
  const activities = [];

  // Add test completions
  performances.forEach(perf => {
    activities.push({
      type: 'test_completed',
      title: `${perf.subject} ${perf.testType} Completed`,
      description: `Score: ${perf.percentage}%`,
      date: perf.date,
      icon: perf.percentage >= 80 ? 'star' : 'assignment',
      priority: perf.percentage >= 90 ? 'high' : 'normal'
    });
  });

  // Add upcoming tests as homework assignments
  tests.forEach(test => {
    activities.push({
      type: 'homework_assigned',
      title: 'New Homework Assigned',
      description: `${test.subject} - Due ${test.date.toLocaleDateString()}`,
      date: test.createdAt,
      icon: 'assignment',
      priority: 'normal'
    });
  });

  // Add achievement notifications for high scores
  performances.forEach(perf => {
    if (perf.percentage >= 95) {
      activities.push({
        type: 'achievement',
        title: 'Excellent Performance!',
        description: `Outstanding score in ${perf.subject}: ${perf.percentage}%`,
        date: perf.date,
        icon: 'trophy',
        priority: 'high'
      });
    }
  });

  // Sort by date (most recent first)
  return activities.sort((a, b) => new Date(b.date) - new Date(a.date));
};

module.exports = {
  calculateGPA,
  getGradeFromPercentage,
  calculateProgressPercentage,
  sendParentNotification,
  createPerformanceNotification,
  createTestScheduleNotification,
  createHomeworkNotification,
  createAchievementNotification,
  getSubjectWiseProgress,
  getProgressTrends,
  generateActivityFeed
};