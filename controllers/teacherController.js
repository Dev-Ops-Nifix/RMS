const Student = require('../models/Student');
const User = require('../models/User');

const getMyStudents = async (req, res) => {
  try {
    const teacher = await User.findById(req.user.id);
    const students = await Student.find({ teacher: teacher.name }).populate('parentId', 'name email');
    
    const studentsData = students.map(student => ({
      id: student.studentId,
      studentName: student.name,
      class: student.class,
      section: student.section,
      teacher: student.teacher,
      _id: student._id
    }));

    res.json(studentsData);
  } catch (err) {
    console.error('Get students error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

const addStudent = async (req, res) => {
  try {
    const { studentId, name, class: studentClass, section, parentId } = req.body;
    const teacher = await User.findById(req.user.id);
    
    const student = new Student({
      studentId,
      name,
      class: studentClass,
      section,
      teacher: teacher.name,
      teacherId: req.user.id,
      parentId
    });
    
    await student.save();
    res.status(201).json({
      id: student.studentId,
      studentName: student.name,
      class: student.class,
      section: student.section,
      teacher: student.teacher,
      _id: student._id
    });
  } catch (err) {
    console.error('Add student error:', err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

const getStudent = async (req, res) => {
  try {
    // Teachers can only access their own students
    const query = req.user.role === 'Teacher' 
      ? { _id: req.params.id, teacherId: req.user.id }
      : { _id: req.params.id };
      
    const student = await Student.findOne(query).populate('parentId', 'name email');
    if (!student) return res.status(404).json({ message: 'Student not found or access denied' });
    
    res.json({
      id: student.studentId,
      studentName: student.name,
      class: student.class,
      section: student.section,
      teacher: student.teacher,
      parentInfo: student.parentId,
      _id: student._id
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateStudent = async (req, res) => {
  try {
    const { studentId, name, class: studentClass, section, parentId } = req.body;
    
    // Teachers can only update their own students
    const query = req.user.role === 'Teacher' 
      ? { _id: req.params.id, teacherId: req.user.id }
      : { _id: req.params.id };
    
    const updateData = { studentId, name, class: studentClass, section, parentId };
    
    if (req.user.role === 'Teacher') {
      const teacher = await User.findById(req.user.id);
      updateData.teacher = teacher.name;
      updateData.teacherId = req.user.id;
    }
    
    const student = await Student.findOneAndUpdate(query, updateData, { new: true });
    
    if (!student) return res.status(404).json({ message: 'Student not found or access denied' });
    
    res.json({
      id: student.studentId,
      studentName: student.name,
      class: student.class,
      section: student.section,
      teacher: student.teacher,
      _id: student._id
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteStudent = async (req, res) => {
  try {
    // Teachers can only delete their own students
    const query = req.user.role === 'Teacher' 
      ? { _id: req.params.id, teacherId: req.user.id }
      : { _id: req.params.id };
      
    const student = await Student.findOneAndDelete(query);
    if (!student) return res.status(404).json({ message: 'Student not found or access denied' });
    
    res.json({ message: 'Student deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

const assignStudentToMe = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const teacherName = req.user.name;
    
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { 
        teacher: teacherName,
        teacherId: teacherId
      },
      { new: true }
    );
    
    if (!student) {
      return res.status(404).json({ message: 'Student not found' });
    }
    
    res.json({
      message: 'Student assigned to you',
      student: {
        id: student._id,
        name: student.name,
        teacher: student.teacher,
        teacherId: student.teacherId
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { getMyStudents, addStudent, getStudent, updateStudent, deleteStudent, assignStudentToMe };