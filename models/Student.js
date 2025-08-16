const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
  studentId: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  class: { type: String, required: true },
  section: { type: String, required: true },
  teacher: { type: String, required: true },
  teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  avatar: { type: String, default: null }
});

module.exports = mongoose.model('Student', studentSchema);