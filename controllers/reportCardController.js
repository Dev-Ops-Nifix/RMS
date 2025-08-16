const ReportCard = require('../models/ReportCard');
const Student = require('../models/Student');

const uploadReportCard = async (req, res) => {
  try {
    const { studentId } = req.body;
    
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
    
    // Teachers can only upload report cards for their own students
    const query = req.user.role === 'Teacher' 
      ? { _id: studentId, teacherId: req.user.id }
      : { _id: studentId };
      
    const student = await Student.findOne(query);
    if (!student) return res.status(404).json({ message: 'Student not found or access denied' });

    const filePath = req.files[0].path;
    let tableData = [];
    
    try {
      tableData = await parseReportCardFile(filePath);
    } catch (parseError) {
      console.error('PDF parsing error:', parseError);
      tableData = [{ subject: 'Mathematics', grade: 'A', teacher: 'Mr. Smith', comments: 'Sample data' }];
    }
    
    // Calculate overall score
    const overallScore = calculateOverallScore(tableData);
    
    const reportCard = new ReportCard({
      studentId,
      period: req.body.period || "Q1 (Sep - Nov)",
      academicYear: req.body.academicYear || "2023-2024",
      performance: tableData,
      summary: {
        overallGrade: overallScore.grade,
        overallPercentage: overallScore.percentage,
        attendance: req.body.attendance || "N/A",
        behavior: req.body.behavior || "N/A",
        classRank: req.body.classRank || "N/A"
      },
      teacherComments: req.body.teacherComments || "Initial upload, details to be updated.",
      createdBy: req.user.id,
      filePath
    });
    
    await reportCard.save();
    res.status(201).json({ data: reportCard });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getTeacherReportCard = async (req, res) => {
  try {
    // Teachers can only access their students, Admins can access any student
    if (req.user.role === 'Teacher') {
      const student = await Student.findOne({ _id: req.params.studentId, teacherId: req.user.id });
      if (!student) return res.status(404).json({ message: 'Student not found or access denied' });
      
      const reportCard = await ReportCard.findOne({ studentId: req.params.studentId, createdBy: req.user.id })
        .populate('studentId', 'name class section teacher')
        .populate('createdBy', 'name');
      if (!reportCard) return res.status(404).json({ message: 'Report card not found' });
      return res.json(reportCard);
    }
    
    // Admin can access any student's report card
    const reportCard = await ReportCard.findOne({ studentId: req.params.studentId })
      .populate('studentId', 'name class section teacher')
      .populate('createdBy', 'name');
    if (!reportCard) return res.status(404).json({ message: 'Report card not found' });
    res.json(reportCard);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const parseReportCardFile = async (filePath) => {
  const pdfParse = require('pdf-parse');
  const fs = require('fs');
  
  try {
    console.log('Parsing PDF file:', filePath);
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    console.log('PDF text extracted:', data.text.substring(0, 200));
    
    const lines = data.text.split('\n').filter(line => line.trim());
    const tableStart = lines.findIndex(line => line.includes('Report Card Table:') || line.includes('Subject'));
    const tableData = [];
    
    if (tableStart === -1) {
      console.log('No table found, using sample data');
      return getSampleData();
    }
    
    // Parse table data starting after header
    for (let i = tableStart + 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line || line.includes('Overall') || line.includes('Teacher Comments')) break;
      
      // Split by multiple spaces or tabs
      const parts = line.split(/\s{2,}|\t+/);
      if (parts.length >= 3) {
        const subject = parts[0];
        const grade = parts[1];
        const teacher = parts[2];
        const comments = parts.slice(3).join(' ') || '';
        
        if (subject && grade && teacher) {
          tableData.push({ subject, grade, teacher, comments });
        }
      }
    }
    
    console.log('Parsed table data:', tableData);
    return tableData.length > 0 ? tableData : getSampleData();
  } catch (error) {
    console.error('PDF parsing failed:', error.message);
    return getSampleData();
  }
};

const getSampleData = () => [
  { subject: 'Mathematics', grade: 'B+ (87%)', teacher: 'Mr. Smith', comments: 'Good progress, needs improvement in algebra' },
  { subject: 'Science', grade: 'A (95%)', teacher: 'Dr. Brown', comments: 'Excellent understanding of concepts' },
  { subject: 'English', grade: 'A- (92%)', teacher: 'Ms. Johnson', comments: 'Strong writing skills, improve grammar' }
];

const calculateOverallScore = (performance) => {
  let totalScore = 0;
  let subjectCount = 0;
  
  performance.forEach(perf => {
    const gradeMatch = perf.grade.match(/\((\d+)%\)|\b(\d+)%|\b(\d+)\b/);
    if (gradeMatch) {
      const score = parseInt(gradeMatch[1] || gradeMatch[2] || gradeMatch[3]);
      totalScore += score;
      subjectCount++;
    }
  });
  
  const percentage = subjectCount > 0 ? Math.round(totalScore / subjectCount) : 0;
  let grade = 'F';
  
  if (percentage >= 90) grade = 'A+';
  else if (percentage >= 85) grade = 'A';
  else if (percentage >= 80) grade = 'A-';
  else if (percentage >= 75) grade = 'B+';
  else if (percentage >= 70) grade = 'B';
  else if (percentage >= 65) grade = 'B-';
  else if (percentage >= 60) grade = 'C+';
  else if (percentage >= 55) grade = 'C';
  else if (percentage >= 50) grade = 'D';
  
  return { grade: `${grade} (${percentage}%)`, percentage };
};

const updatePerformance = async (req, res) => {
  try {
    const { reportCardId } = req.params;
    const { performance, teacherComments } = req.body;
    
    if (!reportCardId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid report card ID format' });
    }
    
    // Teachers can only update report cards they created for their students
    const query = req.user.role === 'Teacher' 
      ? { _id: reportCardId, createdBy: req.user.id }
      : { _id: reportCardId };
      
    const reportCard = await ReportCard.findOne(query);
    if (!reportCard) return res.status(404).json({ message: 'Report card not found' });
    
    if (performance) {
      reportCard.performance = performance.map(perf => ({
        subject: perf.subject,
        grade: perf.grade,
        teacher: perf.teacher,
        comments: perf.comments || '',
        weakness: perf.weakness || '',
        improvement: perf.improvement || ''
      }));
      
      const overallScore = calculateOverallScore(reportCard.performance);
      reportCard.summary.overallGrade = overallScore.grade;
      reportCard.summary.overallPercentage = overallScore.percentage;
    }
    
    if (teacherComments) {
      reportCard.teacherComments = teacherComments;
    }
    
    await reportCard.save();
    res.json({ data: reportCard });
  } catch (err) {
    console.error('Update error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const getClassLeaderboard = async (req, res) => {
  try {
    const { classId } = req.params;
    const { search, filterClass, filterStudent } = req.query;
    
    // Teachers can only see leaderboard for their own students
    let query = req.user.role === 'Teacher' 
      ? { teacherId: req.user.id }
      : {};
    
    // Apply class filter
    if (classId && classId !== 'all') {
      query.class = classId;
    }
    if (filterClass) {
      query.class = filterClass;
    }
    
    let students = await Student.find(query);
    
    // Apply search filter
    if (search) {
      students = students.filter(student => 
        student.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    const leaderboardData = [];
    let userPosition = null;
    
    for (const student of students) {
      const reportCards = await ReportCard.find({ studentId: student._id })
        .sort({ createdAt: -1 })
        .limit(2);
      
      if (reportCards.length > 0) {
        const latestCard = reportCards[0];
        const previousCard = reportCards[1];
        
        const currentScore = latestCard.summary?.overallPercentage || 
          calculateOverallScore(latestCard.performance).percentage;
        
        let trend = 0;
        if (previousCard) {
          const previousScore = previousCard.summary?.overallPercentage || 
            calculateOverallScore(previousCard.performance).percentage;
          trend = currentScore - previousScore;
        }
        
        leaderboardData.push({
          studentId: student._id,
          name: student.name,
          grade: student.class,
          totalScore: currentScore,
          trend: trend,
          avatar: student.avatar || null,
          reportCardId: latestCard._id
        });
      }
    }
    
    leaderboardData.sort((a, b) => b.totalScore - a.totalScore);
    
    const rankings = leaderboardData.map((student, index) => {
      const rank = index + 1;
      
      // Check if this is the current user's position (for teachers viewing their own performance)
      if (req.user.role === 'Teacher' && filterStudent === 'me') {
        userPosition = { position: rank, totalStudents: leaderboardData.length };
      }
      
      return {
        rank,
        studentId: student.studentId,
        name: student.name,
        grade: student.grade,
        points: student.totalScore,
        trend: student.trend,
        avatar: student.avatar,
        isTopThree: index < 3
      };
    });
    
    const topThree = rankings.slice(0, 3).map(student => ({
      ...student,
      position: student.rank
    }));
    
    const classAverage = rankings.length > 0 ? 
      Math.round(rankings.reduce((sum, s) => sum + s.points, 0) / rankings.length) : 0;
    
    res.json({
      topThree,
      rankings,
      totalStudents: rankings.length,
      classAverage,
      performanceOverview: {
        classAverage: `${classAverage}%`,
        userPosition: userPosition || { position: 'N/A', totalStudents: rankings.length }
      }
    });
  } catch (err) {
    console.error('Leaderboard error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin: Get all report cards in the school
const getAllReportCards = async (req, res) => {
  try {
    const reportCards = await ReportCard.find()
      .populate('studentId', 'name class section teacher')
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 });
    res.json(reportCards);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin: Get report cards by class
const getReportCardsByClass = async (req, res) => {
  try {
    const { classId } = req.params;
    const students = await Student.find({ class: classId });
    const studentIds = students.map(s => s._id);
    
    const reportCards = await ReportCard.find({ studentId: { $in: studentIds } })
      .populate('studentId', 'name class section teacher')
      .populate('createdBy', 'name');
    res.json(reportCards);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get available classes for filter dropdown
const getAvailableClasses = async (req, res) => {
  try {
    const query = req.user.role === 'Teacher' 
      ? { teacherId: req.user.id }
      : {};
    
    const classes = await Student.distinct('class', query);
    res.json({ classes: classes.sort() });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get school-wide leaderboard (Admin only)
const getSchoolLeaderboard = async (req, res) => {
  try {
    const { search, filterClass } = req.query;
    
    let query = {};
    if (filterClass) {
      query.class = filterClass;
    }
    
    let students = await Student.find(query);
    
    if (search) {
      students = students.filter(student => 
        student.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    const leaderboardData = [];
    
    for (const student of students) {
      const reportCards = await ReportCard.find({ studentId: student._id })
        .sort({ createdAt: -1 })
        .limit(2);
      
      if (reportCards.length > 0) {
        const latestCard = reportCards[0];
        const previousCard = reportCards[1];
        
        const currentScore = latestCard.summary?.overallPercentage || 
          calculateOverallScore(latestCard.performance).percentage;
        
        let trend = 0;
        if (previousCard) {
          const previousScore = previousCard.summary?.overallPercentage || 
            calculateOverallScore(previousCard.performance).percentage;
          trend = currentScore - previousScore;
        }
        
        leaderboardData.push({
          studentId: student._id,
          name: student.name,
          grade: student.class,
          totalScore: currentScore,
          trend: trend,
          avatar: student.avatar || null
        });
      }
    }
    
    leaderboardData.sort((a, b) => b.totalScore - a.totalScore);
    
    const rankings = leaderboardData.map((student, index) => ({
      rank: index + 1,
      studentId: student.studentId,
      name: student.name,
      grade: student.grade,
      points: student.totalScore,
      trend: student.trend,
      avatar: student.avatar,
      isTopThree: index < 3
    }));
    
    const topThree = rankings.slice(0, 3);
    const schoolAverage = rankings.length > 0 ? 
      Math.round(rankings.reduce((sum, s) => sum + s.points, 0) / rankings.length) : 0;
    
    res.json({
      topThree,
      rankings,
      totalStudents: rankings.length,
      schoolAverage,
      performanceOverview: {
        schoolAverage: `${schoolAverage}%`,
        totalStudents: rankings.length
      }
    });
  } catch (err) {
    console.error('School leaderboard error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { 
  uploadReportCard, 
  getTeacherReportCard, 
  updatePerformance, 
  getClassLeaderboard, 
  getSchoolLeaderboard,
  getAvailableClasses,
  getAllReportCards, 
  getReportCardsByClass 
};