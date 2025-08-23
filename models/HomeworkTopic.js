const mongoose = require('mongoose');

const homeworkTopicSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subject: { type: String, required: true },
  class: { type: String, required: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Medium' },
  duration: Number,
  resources: [{
    title: String,
    url: String,
    type: { type: String, enum: ['video', 'article', 'interactive', 'practice'] }
  }],
  studyTips: [String],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('HomeworkTopic', homeworkTopicSchema);