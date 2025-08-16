const Student = require('../models/Student');
const ReportCard = require('../models/ReportCard');

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

module.exports = { getChildren, getChildPerformance, getClassLeaderboard };