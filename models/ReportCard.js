const mongoose = require('mongoose');

const reportCardSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  period: { type: String, required: true },
  academicYear: { type: String, required: true },
  performance: [{
    subject: { type: String, required: true },
    grade: { type: String, required: true },
    teacher: { type: String, required: true },
    comments: String,
    weakness: String,
    improvement: String
  }],
  summary: {
    overallGrade: { type: String, required: true },
    overallPercentage: { type: Number },
    attendance: { type: String, required: true },
    behavior: { type: String, required: true },
    classRank: { type: String, required: true }
  },
  teacherComments: { type: String, required: true },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
  filePath: { type: String } // Store the uploaded PDF path
});

module.exports = mongoose.model('ReportCard', reportCardSchema);