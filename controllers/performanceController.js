const Performance = require('../models/Performance');
const Student = require('../models/Student');

const addPerformance = async (req, res) => {
  try {
    const { studentId, subject, testType, marks, totalMarks, date } = req.body;
    const teacherId = req.user.id;
    
    const percentage = Math.round((marks / totalMarks) * 100);
    
    const performance = new Performance({
      studentId,
      subject,
      testType,
      marks,
      totalMarks,
      percentage,
      date: new Date(date),
      teacherId
    });
    
    await performance.save();
    res.status(201).json({ message: 'Performance record added successfully', performance });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getStudentPerformance = async (req, res) => {
  try {
    const { studentId } = req.params;
    const performances = await Performance.find({ studentId }).sort({ date: -1 });
    
    const analytics = {
      totalTests: performances.length,
      averagePercentage: performances.length > 0 
        ? Math.round(performances.reduce((sum, p) => sum + p.percentage, 0) / performances.length)
        : 0,
      subjectWise: {}
    };
    
    performances.forEach(p => {
      if (!analytics.subjectWise[p.subject]) {
        analytics.subjectWise[p.subject] = [];
      }
      analytics.subjectWise[p.subject].push({
        percentage: p.percentage,
        date: p.date,
        testType: p.testType
      });
    });
    
    res.json({ studentId, performances, analytics });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getClassPerformance = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const students = await Student.find({ teacherId });
    const studentIds = students.map(s => s._id);
    
    const performances = await Performance.find({ studentId: { $in: studentIds } });
    
    const classAnalytics = {
      totalStudents: students.length,
      totalTests: performances.length,
      classAverage: performances.length > 0
        ? Math.round(performances.reduce((sum, p) => sum + p.percentage, 0) / performances.length)
        : 0,
      subjectAverages: {}
    };
    
    const subjectGroups = {};
    performances.forEach(p => {
      if (!subjectGroups[p.subject]) {
        subjectGroups[p.subject] = [];
      }
      subjectGroups[p.subject].push(p.percentage);
    });
    
    Object.keys(subjectGroups).forEach(subject => {
      const avg = subjectGroups[subject].reduce((sum, p) => sum + p, 0) / subjectGroups[subject].length;
      classAnalytics.subjectAverages[subject] = Math.round(avg);
    });
    
    res.json(classAnalytics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getPerformanceTrends = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const { range = '3months' } = req.query;
    
    let dateFilter;
    switch(range) {
      case '1month':
        dateFilter = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '6months':
        dateFilter = new Date(Date.now() - 180 * 24 * 60 * 60 * 1000);
        break;
      default:
        dateFilter = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000);
    }
    
    const students = await Student.find({ teacherId });
    const studentIds = students.map(s => s._id);
    
    const performances = await Performance.find({
      studentId: { $in: studentIds },
      date: { $gte: dateFilter }
    }).sort({ date: 1 });
    
    const trends = performances.map(p => ({
      date: p.date,
      percentage: p.percentage,
      subject: p.subject,
      testType: p.testType
    }));
    
    res.json({ timeRange: range, data: trends });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSubjectPerformanceStats = async (req, res) => {
  try {
    const { class: className, section } = req.query;
    let studentQuery = {};
    
    if (className) studentQuery.class = className;
    if (section) studentQuery.section = section;
    
    const students = await Student.find(studentQuery);
    const studentIds = students.map(s => s._id);
    
    const performances = await Performance.find({ studentId: { $in: studentIds } });
    
    const subjectStats = {};
    
    performances.forEach(p => {
      if (!subjectStats[p.subject]) {
        subjectStats[p.subject] = {
          subject: p.subject,
          total: 0,
          pass: 0,
          fail: 0,
          totalMarks: 0
        };
      }
      
      subjectStats[p.subject].total++;
      subjectStats[p.subject].totalMarks += p.percentage;
      
      if (p.percentage >= 50) {
        subjectStats[p.subject].pass++;
      } else {
        subjectStats[p.subject].fail++;
      }
    });
    
    const result = Object.values(subjectStats).map(stat => ({
      subject: stat.subject,
      passPercentage: stat.total > 0 ? Math.round((stat.pass / stat.total) * 100) : 0,
      failPercentage: stat.total > 0 ? Math.round((stat.fail / stat.total) * 100) : 0,
      averagePercentage: stat.total > 0 ? Math.round(stat.totalMarks / stat.total) : 0
    }));
    
    res.json({ subjectStats: result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  addPerformance,
  getStudentPerformance,
  getClassPerformance,
  getPerformanceTrends,
  getSubjectPerformanceStats
};