const HomeworkTopic = require('../models/HomeworkTopic');
const Student = require('../models/Student');

// GET /api/homework/topics/:studentId
exports.getTopicsByStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.studentId);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    
    const topics = await HomeworkTopic.find({ class: student.class });
    res.json(topics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/homework/resources/:topicId
exports.getTopicResources = async (req, res) => {
  try {
    const topic = await HomeworkTopic.findById(req.params.topicId);
    if (!topic) return res.status(404).json({ message: 'Topic not found' });
    
    res.json({
      title: topic.title,
      subject: topic.subject,
      difficulty: topic.difficulty,
      duration: topic.duration,
      resources: topic.resources,
      studyTips: topic.studyTips
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/homework/subjects/:subject/class/:class
exports.getSubjectTopics = async (req, res) => {
  try {
    const { subject, class: grade } = req.params;
    const topics = await HomeworkTopic.find({ subject, class: grade });
    res.json(topics);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};