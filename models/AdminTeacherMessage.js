const mongoose = require('mongoose');

const adminTeacherMessageSchema = new mongoose.Schema({
  adminId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sender: { type: String, enum: ['admin', 'teacher'], required: true },
  content: { type: String, required: true },
  read: { type: Boolean, default: false },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AdminTeacherMessage', adminTeacherMessageSchema);