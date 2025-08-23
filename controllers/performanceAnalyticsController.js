const Performance = require('../models/Performance');
const Student = require('../models/Student');
const User = require('../models/User');

// Grade conversion utilities
const getLetterGrade = (percentage) => {
  if (percentage >= 97) return 'A+';
  if (percentage >= 93) return 'A';
  if (percentage >= 90) return 'A-';
  if (percentage >= 87) return 'B+';
  if (percentage >= 83) return 'B';
  if (percentage >= 80) return 'B-';
  if (percentage >= 77) return 'C+';
  if (percentage >= 73) return 'C';
  if (percentage >= 70) return 'C-';
  if (percentage >= 67) return 'D+';
  if (percentage >= 65) return 'D';
  return 'F';
};

const getGPA = (grade) => {
  const gpaMap = {
    'A+': 4.0, 'A': 4.0, 'A-': 3.7,
    'B+': 3.3, 'B': 3.0, 'B-': 2.7,
    'C+': 2.3, 'C': 2.0, 'C-': 1.7,
    'D+': 1.3, 'D': 1.0, 'F': 0.0
  };
  return gpaMap[grade] || 0.0;
};

const getDateFilter = (period) => {
  const now = new Date();
  switch(period) {
    case 'week':
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    case 'month':
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    case 'semester':
    default:
      return new Date(now.getTime() - 120 * 24 * 60 * 60 * 1000);
  }
};

// Get comprehensive performance overview
const getPerformanceOverview = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { period = 'month' } = req.query;
    
    const student = await Student.findById(studentId);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    
    const dateFilter = getDateFilter(period);
    const performances = await Performance.find({
      studentId,
      date: { $gte: dateFilter }
    }).populate('teacherId', 'name').sort({ date: -1 });
    
    if (performances.length === 0) {
      return res.json({
        studentName: student.name,
        period,
        overview: {
          averageScore: 0,
          totalTests: 0,
          highestScore: 0,
          improvement: 0,
          gpa: '0.0',
          rank: 'N/A'
        },
        subjects: [],
        recentTests: [],
        strengths: [],
        improvements: []
      });
    }
    
    // Calculate overview metrics
    const totalTests = performances.length;
    const averageScore = Math.round(performances.reduce((sum, p) => sum + p.percentage, 0) / totalTests * 10) / 10;
    const highestScore = Math.max(...performances.map(p => p.percentage));
    
    // Calculate improvement from previous period
    const previousPeriodStart = new Date(dateFilter.getTime() - (dateFilter.getTime() - new Date().getTime()));
    const previousPerformances = await Performance.find({
      studentId,
      date: { $gte: previousPeriodStart, $lt: dateFilter }
    });
    
    let improvement = 0;
    if (previousPerformances.length > 0) {
      const previousAvg = previousPerformances.reduce((sum, p) => sum + p.percentage, 0) / previousPerformances.length;
      improvement = Math.round((averageScore - previousAvg) * 10) / 10;
    }
    
    // Calculate GPA
    const overallGrade = getLetterGrade(averageScore);
    const gpa = getGPA(overallGrade).toFixed(1);
    
    // Calculate class ranking
    const classStudents = await Student.find({ class: student.class, section: student.section });
    const rankings = [];
    
    for (const classStudent of classStudents) {
      const studentPerfs = await Performance.find({
        studentId: classStudent._id,
        date: { $gte: dateFilter }
      });
      
      if (studentPerfs.length > 0) {
        const avg = studentPerfs.reduce((sum, p) => sum + p.percentage, 0) / studentPerfs.length;
        rankings.push({ studentId: classStudent._id, average: avg });
      }
    }
    
    rankings.sort((a, b) => b.average - a.average);
    const studentRank = rankings.findIndex(r => r.studentId.toString() === studentId) + 1;
    const totalStudents = rankings.length;
    
    res.json({
      studentName: student.name,
      period,
      overview: {
        averageScore,
        totalTests,
        highestScore,
        improvement,
        gpa,
        rank: `${studentRank}/${totalStudents}`
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get recent tests with detailed information
const getRecentTests = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { period = 'month', limit = 10 } = req.query;
    
    const dateFilter = getDateFilter(period);
    const performances = await Performance.find({
      studentId,
      date: { $gte: dateFilter }
    }).populate('teacherId', 'name').sort({ date: -1 }).limit(parseInt(limit));
    
    const recentTests = performances.map(perf => ({
      id: perf._id,
      subject: perf.subject,
      testType: perf.testType,
      score: `${perf.marks}/${perf.totalMarks}`,
      percentage: perf.percentage,
      grade: getLetterGrade(perf.percentage),
      date: perf.date,
      teacher: perf.teacherId?.name || 'Unknown',
      status: perf.percentage >= 80 ? 'excellent' : perf.percentage >= 70 ? 'good' : 'needs_improvement'
    }));
    
    res.json({ recentTests, period, total: recentTests.length });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get subject-wise detailed performance
const getSubjectPerformance = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { period = 'month' } = req.query;
    
    const dateFilter = getDateFilter(period);
    const performances = await Performance.find({
      studentId,
      date: { $gte: dateFilter }
    }).populate('teacherId', 'name').sort({ date: -1 });
    
    const subjectData = {};
    performances.forEach(perf => {
      if (!subjectData[perf.subject]) {
        subjectData[perf.subject] = {
          subject: perf.subject,
          tests: [],
          teacher: perf.teacherId?.name || 'Unknown',
          totalTests: 0,
          averageScore: 0,
          highestScore: 0,
          lowestScore: 100,
          improvement: 0
        };
      }
      
      subjectData[perf.subject].tests.push({
        testType: perf.testType,
        score: `${perf.marks}/${perf.totalMarks}`,
        percentage: perf.percentage,
        grade: getLetterGrade(perf.percentage),
        date: perf.date
      });
    });
    
    // Calculate subject metrics
    const subjects = Object.keys(subjectData).map(subject => {
      const data = subjectData[subject];
      const percentages = data.tests.map(t => t.percentage);
      
      data.totalTests = percentages.length;
      data.averageScore = Math.round(percentages.reduce((sum, p) => sum + p, 0) / percentages.length * 10) / 10;
      data.highestScore = Math.max(...percentages);
      data.lowestScore = Math.min(...percentages);
      data.grade = getLetterGrade(data.averageScore);
      
      // Calculate improvement (compare first half vs second half of tests)
      if (percentages.length >= 4) {
        const firstHalf = percentages.slice(-Math.floor(percentages.length / 2));
        const secondHalf = percentages.slice(0, Math.floor(percentages.length / 2));
        const firstAvg = firstHalf.reduce((sum, p) => sum + p, 0) / firstHalf.length;
        const secondAvg = secondHalf.reduce((sum, p) => sum + p, 0) / secondHalf.length;
        data.improvement = Math.round((secondAvg - firstAvg) * 10) / 10;
      }
      
      return data;
    });
    
    res.json({ subjects, period, totalSubjects: subjects.length });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get strengths and improvement areas
const getStrengthsAndImprovements = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { period = 'month' } = req.query;
    
    const dateFilter = getDateFilter(period);
    const performances = await Performance.find({
      studentId,
      date: { $gte: dateFilter }
    }).sort({ date: -1 });
    
    const subjectAverages = {};
    const testTypeAverages = {};
    
    performances.forEach(perf => {
      // Subject averages
      if (!subjectAverages[perf.subject]) {
        subjectAverages[perf.subject] = [];
      }
      subjectAverages[perf.subject].push(perf.percentage);
      
      // Test type averages
      if (!testTypeAverages[perf.testType]) {
        testTypeAverages[perf.testType] = [];
      }
      testTypeAverages[perf.testType].push(perf.percentage);
    });
    
    // Calculate strengths (subjects/test types with >85% average)
    const strengths = [];
    Object.keys(subjectAverages).forEach(subject => {
      const avg = subjectAverages[subject].reduce((sum, p) => sum + p, 0) / subjectAverages[subject].length;
      if (avg >= 85) {
        strengths.push({
          area: subject,
          type: 'subject',
          average: Math.round(avg * 10) / 10,
          grade: getLetterGrade(avg),
          description: `Consistently strong performance in ${subject}`
        });
      }
    });
    
    Object.keys(testTypeAverages).forEach(testType => {
      const avg = testTypeAverages[testType].reduce((sum, p) => sum + p, 0) / testTypeAverages[testType].length;
      if (avg >= 85) {
        strengths.push({
          area: testType,
          type: 'test_type',
          average: Math.round(avg * 10) / 10,
          grade: getLetterGrade(avg),
          description: `Excels in ${testType} assessments`
        });
      }
    });
    
    // Calculate improvement areas (subjects/test types with <75% average)
    const improvements = [];
    Object.keys(subjectAverages).forEach(subject => {
      const avg = subjectAverages[subject].reduce((sum, p) => sum + p, 0) / subjectAverages[subject].length;
      if (avg < 75) {
        improvements.push({
          area: subject,
          type: 'subject',
          average: Math.round(avg * 10) / 10,
          grade: getLetterGrade(avg),
          description: `Needs additional support in ${subject}`,
          priority: avg < 60 ? 'high' : avg < 70 ? 'medium' : 'low'
        });
      }
    });
    
    Object.keys(testTypeAverages).forEach(testType => {
      const avg = testTypeAverages[testType].reduce((sum, p) => sum + p, 0) / testTypeAverages[testType].length;
      if (avg < 75) {
        improvements.push({
          area: testType,
          type: 'test_type',
          average: Math.round(avg * 10) / 10,
          grade: getLetterGrade(avg),
          description: `Consider different strategies for ${testType} assessments`,
          priority: avg < 60 ? 'high' : avg < 70 ? 'medium' : 'low'
        });
      }
    });
    
    res.json({
      strengths: strengths.slice(0, 5), // Top 5 strengths
      improvements: improvements.sort((a, b) => a.average - b.average).slice(0, 5), // Top 5 areas needing improvement
      period
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get performance trends and comparisons
const getPerformanceTrends = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { period = 'month' } = req.query;
    
    const dateFilter = getDateFilter(period);
    const performances = await Performance.find({
      studentId,
      date: { $gte: dateFilter }
    }).sort({ date: 1 }); // Ascending order for trend analysis
    
    // Group by weeks for trend analysis
    const weeklyData = {};
    performances.forEach(perf => {
      const weekStart = new Date(perf.date);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      const weekKey = weekStart.toISOString().split('T')[0];
      
      if (!weeklyData[weekKey]) {
        weeklyData[weekKey] = [];
      }
      weeklyData[weekKey].push(perf.percentage);
    });
    
    const trends = Object.keys(weeklyData).map(week => {
      const percentages = weeklyData[week];
      const average = Math.round(percentages.reduce((sum, p) => sum + p, 0) / percentages.length * 10) / 10;
      
      return {
        week,
        average,
        testsCount: percentages.length,
        grade: getLetterGrade(average)
      };
    }).sort((a, b) => new Date(a.week) - new Date(b.week));
    
    // Calculate overall trend
    let overallTrend = 'stable';
    if (trends.length >= 2) {
      const firstHalf = trends.slice(0, Math.floor(trends.length / 2));
      const secondHalf = trends.slice(Math.floor(trends.length / 2));
      
      const firstAvg = firstHalf.reduce((sum, t) => sum + t.average, 0) / firstHalf.length;
      const secondAvg = secondHalf.reduce((sum, t) => sum + t.average, 0) / secondHalf.length;
      
      if (secondAvg > firstAvg + 2) overallTrend = 'improving';
      else if (secondAvg < firstAvg - 2) overallTrend = 'declining';
    }
    
    // Compare with class average
    const student = await Student.findById(studentId);
    const classStudents = await Student.find({ class: student.class, section: student.section });
    const classPerformances = await Performance.find({
      studentId: { $in: classStudents.map(s => s._id) },
      date: { $gte: dateFilter }
    });
    
    const classAverage = classPerformances.length > 0 
      ? Math.round(classPerformances.reduce((sum, p) => sum + p.percentage, 0) / classPerformances.length * 10) / 10
      : 0;
    
    const studentAverage = performances.length > 0
      ? Math.round(performances.reduce((sum, p) => sum + p.percentage, 0) / performances.length * 10) / 10
      : 0;
    
    res.json({
      trends,
      overallTrend,
      comparison: {
        studentAverage,
        classAverage,
        difference: Math.round((studentAverage - classAverage) * 10) / 10,
        performance: studentAverage > classAverage ? 'above_average' : studentAverage < classAverage ? 'below_average' : 'average'
      },
      period
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get comprehensive analytics dashboard
const getAnalyticsDashboard = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { period = 'month' } = req.query;
    
    // Get all analytics in parallel
    const [overview, recentTests, subjects, strengthsAndImprovements, trends] = await Promise.all([
      getPerformanceOverviewData(studentId, period),
      getRecentTestsData(studentId, period, 5),
      getSubjectPerformanceData(studentId, period),
      getStrengthsAndImprovementsData(studentId, period),
      getPerformanceTrendsData(studentId, period)
    ]);
    
    res.json({
      overview,
      recentTests,
      subjects,
      strengths: strengthsAndImprovements.strengths,
      improvements: strengthsAndImprovements.improvements,
      trends,
      period,
      lastUpdated: new Date()
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Helper functions for dashboard
const getPerformanceOverviewData = async (studentId, period) => {
  const dateFilter = getDateFilter(period);
  const performances = await Performance.find({
    studentId,
    date: { $gte: dateFilter }
  });
  
  if (performances.length === 0) {
    return { averageScore: 0, totalTests: 0, highestScore: 0, improvement: 0, gpa: '0.0' };
  }
  
  const averageScore = Math.round(performances.reduce((sum, p) => sum + p.percentage, 0) / performances.length * 10) / 10;
  const highestScore = Math.max(...performances.map(p => p.percentage));
  const gpa = getGPA(getLetterGrade(averageScore)).toFixed(1);
  
  return {
    averageScore,
    totalTests: performances.length,
    highestScore,
    improvement: 0, // Calculate based on previous period
    gpa
  };
};

const getRecentTestsData = async (studentId, period, limit) => {
  const dateFilter = getDateFilter(period);
  const performances = await Performance.find({
    studentId,
    date: { $gte: dateFilter }
  }).populate('teacherId', 'name').sort({ date: -1 }).limit(limit);
  
  return performances.map(perf => ({
    subject: perf.subject,
    testType: perf.testType,
    percentage: perf.percentage,
    grade: getLetterGrade(perf.percentage),
    date: perf.date,
    teacher: perf.teacherId?.name || 'Unknown'
  }));
};

const getSubjectPerformanceData = async (studentId, period) => {
  const dateFilter = getDateFilter(period);
  const performances = await Performance.find({
    studentId,
    date: { $gte: dateFilter }
  }).populate('teacherId', 'name');
  
  const subjectData = {};
  performances.forEach(perf => {
    if (!subjectData[perf.subject]) {
      subjectData[perf.subject] = {
        subject: perf.subject,
        percentages: [],
        teacher: perf.teacherId?.name || 'Unknown'
      };
    }
    subjectData[perf.subject].percentages.push(perf.percentage);
  });
  
  return Object.keys(subjectData).map(subject => {
    const data = subjectData[subject];
    const average = Math.round(data.percentages.reduce((sum, p) => sum + p, 0) / data.percentages.length * 10) / 10;
    
    return {
      subject,
      average,
      grade: getLetterGrade(average),
      teacher: data.teacher,
      testsCount: data.percentages.length
    };
  });
};

const getStrengthsAndImprovementsData = async (studentId, period) => {
  const dateFilter = getDateFilter(period);
  const performances = await Performance.find({
    studentId,
    date: { $gte: dateFilter }
  });
  
  const subjectAverages = {};
  performances.forEach(perf => {
    if (!subjectAverages[perf.subject]) {
      subjectAverages[perf.subject] = [];
    }
    subjectAverages[perf.subject].push(perf.percentage);
  });
  
  const strengths = [];
  const improvements = [];
  
  Object.keys(subjectAverages).forEach(subject => {
    const avg = subjectAverages[subject].reduce((sum, p) => sum + p, 0) / subjectAverages[subject].length;
    
    if (avg >= 85) {
      strengths.push({ area: subject, average: Math.round(avg * 10) / 10 });
    } else if (avg < 75) {
      improvements.push({ area: subject, average: Math.round(avg * 10) / 10 });
    }
  });
  
  return { strengths, improvements };
};

const getPerformanceTrendsData = async (studentId, period) => {
  const dateFilter = getDateFilter(period);
  const performances = await Performance.find({
    studentId,
    date: { $gte: dateFilter }
  }).sort({ date: 1 });
  
  return performances.map(perf => ({
    date: perf.date,
    percentage: perf.percentage,
    subject: perf.subject
  }));
};

module.exports = {
  getPerformanceOverview,
  getRecentTests,
  getSubjectPerformance,
  getStrengthsAndImprovements,
  getPerformanceTrends,
  getAnalyticsDashboard
};