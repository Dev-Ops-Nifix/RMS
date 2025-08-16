const Student = require('../models/Student');
const User = require('../models/User');

exports.assignStudentToCurrentTeacher = async (req, res) => {
  try {
    const { studentId } = req.params;
    const teacherId = req.user.id;
    const teacherName = req.user.name;
    
    const student = await Student.findByIdAndUpdate(
      studentId,
      { 
        teacher: teacherName,
        teacherId: teacherId
      },
      { new: true }
    );
    
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    
    res.json({
      message: 'Student assigned to current teacher',
      student: {
        id: student._id,
        name: student.name,
        teacher: student.teacher,
        teacherId: student.teacherId
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};