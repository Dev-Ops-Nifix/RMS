const Test = require('../models/Test');
const Student = require('../models/Student');
const Message = require('../models/Message');

// Helper function to send notification to parent
const sendNotificationToParent = async (parentId, teacherId, studentId, content) => {
  try {
    await Message.create({ parentId, teacherId, studentId, content, sender: 'teacher' });
  } catch (error) {
    console.error('Failed to send notification:', error);
  }
};

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
    
    // Auto-notify all parents in the class
    const students = await Student.find({ class: className, section, parentId: { $ne: null } });
    
    for (const student of students) {
      const content = `Upcoming ${subject} test scheduled for ${student.name}: ${title} on ${new Date(date).toLocaleDateString()}`;
      await sendNotificationToParent(student.parentId, teacherId, student._id, content);
    }
    
    res.status(201).json({ message: 'Test created successfully and parents notified', test });
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

const getAllTopics = async (req, res) => {
  try {
    const HomeworkTopic = require('../models/HomeworkTopic');
    const topics = await HomeworkTopic.find({}, 'title subject class _id');
    res.json({
      success: true,
      count: topics.length,
      topics
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createSampleTopics = async (req, res) => {
  try {
    const HomeworkTopic = require('../models/HomeworkTopic');
    const sampleTopics = [
      { title: 'Algebra Basics', subject: 'Mathematics', class: '10th' },
      { title: 'Cell Biology', subject: 'Science', class: '9th' },
      { title: 'Grammar Rules', subject: 'English', class: '8th' }
    ];
    const topics = await HomeworkTopic.insertMany(sampleTopics);
    res.json({ success: true, message: 'Sample topics created', topics });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTestTopic = async (req, res) => {
  try {
    const { topic } = req.params;
    res.json({
      success: true,
      message: `Test topic: ${topic}`,
      timestamp: new Date().toISOString(),
      data: {
        topic: topic || 'default',
        status: 'active',
        testId: Math.floor(Math.random() * 1000)
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createTest,
  getTeacherTests,
  updateTest,
  deleteTest,
  getAllTopics,
  createSampleTopics,
  getTestTopic,
  sendNotificationToParent
};