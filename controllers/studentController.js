const Student = require('../models/Student');

const createStudent = async (req, res) => {
  try {
    const { studentId, name, class: studentClass, section, teacher, parentId } = req.body;
    
    // Validate required fields
    if (!studentId || !name || !studentClass || !section || !teacher) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    // Find teacher by name to get teacherId
    const User = require('../models/User');
    const teacherUser = await User.findOne({ name: teacher, role: 'Teacher' });
    if (!teacherUser) {
      return res.status(404).json({ message: 'Teacher not found' });
    }
    
    const studentData = {
      studentId,
      name,
      class: studentClass,
      section,
      teacher,
      teacherId: teacherUser._id,
      parentId: parentId || null
    };
    
    const student = new Student(studentData);
    await student.save();
    res.status(201).json({ message: 'Student created successfully', student });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Student ID already exists' });
    }
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

const getTeachers = async (req, res) => {
  try {
    const User = require('../models/User');
    const teachers = await User.find({ role: 'Teacher' }).select('name email');
    res.json(teachers);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getClassSections = async (req, res) => {
  try {
    const classes = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'];
    const sections = ['A', 'B', 'C', 'D'];
    res.json({ classes, sections });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { createStudent, getAllStudents, getParentStudents, getTeachers, getClassSections };