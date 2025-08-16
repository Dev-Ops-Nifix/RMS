const User = require('../models/User');
const Student = require('../models/Student');

exports.getAllTeachers = async (req, res) => {
  try {
    const teachers = await User.find({ role: 'Teacher' }).select('-password');
    
    const teachersWithClasses = await Promise.all(
      teachers.map(async (teacher) => {
        const classes = await Student.aggregate([
          { $match: { teacher: teacher.name } },
          { $group: { 
              _id: { class: '$class', section: '$section' },
              studentCount: { $sum: 1 }
            }
          }
        ]);
        
        return {
          id: teacher._id,
          name: teacher.name,
          email: teacher.email,
          classes: classes.map(c => ({
            class: c._id.class,
            section: c._id.section,
            studentCount: c.studentCount
          }))
        };
      })
    );
    
    res.json(teachersWithClasses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getTeacher = async (req, res) => {
  try {
    const teacher = await User.findById(req.params.id).select('-password');
    if (!teacher || teacher.role !== 'Teacher') {
      return res.status(404).json({ error: 'Teacher not found' });
    }
    
    const students = await Student.find({ teacher: teacher.name })
      .populate('parentId', 'name email');
    
    res.json({
      id: teacher._id,
      name: teacher.name,
      email: teacher.email,
      students: students.map(s => ({
        id: s._id,
        name: s.name,
        class: s.class,
        section: s.section,
        parent: s.parentId
      }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createTeacher = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    const teacher = new User({
      name,
      email,
      password,
      role: 'Teacher'
    });
    
    await teacher.save();
    
    res.status(201).json({
      id: teacher._id,
      name: teacher.name,
      email: teacher.email,
      role: teacher.role
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateTeacher = async (req, res) => {
  try {
    const { name, email } = req.body;
    
    const teacher = await User.findByIdAndUpdate(
      req.params.id,
      { name, email },
      { new: true }
    ).select('-password');
    
    if (!teacher || teacher.role !== 'Teacher') {
      return res.status(404).json({ error: 'Teacher not found' });
    }
    
    // Update student records with new teacher name
    await Student.updateMany(
      { teacherId: req.params.id },
      { teacher: name }
    );
    
    res.json({
      id: teacher._id,
      name: teacher.name,
      email: teacher.email
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteTeacher = async (req, res) => {
  try {
    const teacher = await User.findById(req.params.id);
    if (!teacher || teacher.role !== 'Teacher') {
      return res.status(404).json({ error: 'Teacher not found' });
    }
    
    // Check if teacher has students
    const studentCount = await Student.countDocuments({ teacher: teacher.name });
    if (studentCount > 0) {
      return res.status(400).json({ 
        error: 'Cannot delete teacher with assigned students',
        studentCount 
      });
    }
    
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'Teacher deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};