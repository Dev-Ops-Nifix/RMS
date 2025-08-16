const Student = require('../models/Student');

const createStudent = async (req, res) => {
  try {
    const { name, class: studentClass, parentId, studentId, section } = req.body;
    const studentData = { name, class: studentClass, parentId };
    
    // If teacher is creating, assign to themselves
    if (req.user.role === 'Teacher') {
      const teacher = await require('../models/User').findById(req.user.id);
      studentData.teacher = teacher.name;
      studentData.teacherId = req.user.id;
    }
    
    if (studentId) studentData.studentId = studentId;
    if (section) studentData.section = section;
    
    const student = new Student(studentData);
    await student.save();
    res.status(201).json(student);
  } catch (err) {
    console.error('Student creation error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getAllStudents = async (req, res) => {
  try {
    // Teachers can only see their own students
    if (req.user.role === 'Teacher') {
      const students = await Student.find({ teacherId: req.user.id }).populate('parentId', 'name email');
      return res.json(students);
    }
    // Admins can see all students
    const students = await Student.find().populate('parentId', 'name email');
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getParentStudents = async (req, res) => {
  try {
    const students = await Student.find({ parentId: req.user.id });
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createStudent, getAllStudents, getParentStudents };