const User = require('../models/User');
const Student = require('../models/Student');

exports.updateTeacherName = async (req, res) => {
  try {
    const teacherId = req.user.id;
    
    // Update teacher's name to match the student's teacher field
    await User.findByIdAndUpdate(teacherId, { name: "Mrs. Smith" });
    
    res.json({ message: "Teacher name updated to Mrs. Smith" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateStudentTeacher = async (req, res) => {
  try {
    const { studentId } = req.params;
    const teacherId = req.user.id;
    
    // Update student to use current teacher's ID
    await Student.findByIdAndUpdate(studentId, { 
      teacherId: teacherId,
      teacher: "Mrs. Smith"
    });
    
    res.json({ message: "Student updated with current teacher" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};