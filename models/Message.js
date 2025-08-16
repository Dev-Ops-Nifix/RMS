const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
  sender: { type: String, enum: ['teacher', 'parent'], required: true },
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  read: { type: Boolean, default: false }
});

module.exports = mongoose.model('Message', messageSchema);