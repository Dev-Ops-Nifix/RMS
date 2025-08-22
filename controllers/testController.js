const Test = require('../models/Test');

const createTest = async (req, res) => {
  try {
    const { title, subject, class: className, section, date, duration, totalMarks, description } = req.body;
    const teacherId = req.user.id;

    const test = new Test({
      title,
      subject,
      class: className,
      section,
      teacherId,
      date: new Date(date),
      duration,
      totalMarks,
      description
    });

    await test.save();
    res.status(201).json({ message: 'Test created successfully', test });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTeacherTests = async (req, res) => {
  try {
    const teacherId = req.user.id;
    const tests = await Test.find({ teacherId }).sort({ date: 1 });
    res.json(tests);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateTest = async (req, res) => {
  try {
    const { id } = req.params;
    const teacherId = req.user.id;
    
    const test = await Test.findOneAndUpdate(
      { _id: id, teacherId },
      req.body,
      { new: true }
    );
    
    if (!test) {
      return res.status(404).json({ error: 'Test not found' });
    }
    
    res.json({ message: 'Test updated successfully', test });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteTest = async (req, res) => {
  try {
    const { id } = req.params;
    const teacherId = req.user.id;
    
    const test = await Test.findOneAndDelete({ _id: id, teacherId });
    
    if (!test) {
      return res.status(404).json({ error: 'Test not found' });
    }
    
    res.json({ message: 'Test deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createTest,
  getTeacherTests,
  updateTest,
  deleteTest
};