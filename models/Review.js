const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  review: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Review', reviewSchema);