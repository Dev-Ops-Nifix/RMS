const mongoose = require('mongoose');
const HomeworkTopic = require('./models/HomeworkTopic');
require('dotenv').config();

const sampleTopics = [
  {
    title: "Solving Quadratic Equations",
    subject: "Mathematics",
    class: "10",
    difficulty: "Medium",
    duration: 30,
    resources: [
      { title: "Khan Academy Tutorial", url: "https://www.khanacademy.org/math/algebra/x2f8bb11595b61c86:quadratic-functions-equations", type: "video" },
      { title: "Practice Problems", url: "https://www.mathway.com/examples/algebra/quadratic-equations", type: "practice" },
      { title: "Interactive Graph", url: "https://www.desmos.com/calculator", type: "interactive" }
    ],
    studyTips: ["Practice step by step", "Use the quadratic formula", "Graph to visualize solutions"]
  },
  {
    title: "Cell Structure and Function",
    subject: "Science",
    class: "10",
    difficulty: "Easy",
    duration: 25,
    resources: [
      { title: "Biology Online", url: "https://www.biologyonline.com/dictionary/cell", type: "article" },
      { title: "Cell Diagram", url: "https://www.cellsalive.com/cells/cell_model.htm", type: "interactive" },
      { title: "YouTube Explanation", url: "https://www.youtube.com/results?search_query=cell+structure+biology", type: "video" }
    ],
    studyTips: ["Use diagrams to memorize parts", "Understand function of each organelle", "Practice labeling"]
  },
  {
    title: "Essay Writing Structure",
    subject: "English",
    class: "10",
    difficulty: "Medium",
    duration: 40,
    resources: [
      { title: "Writing Guide", url: "https://owl.purdue.edu/owl/general_writing/the_writing_process/organizing_your_argument/index.html", type: "article" },
      { title: "Essay Examples", url: "https://www.grammarly.com/blog/essay-writing/", type: "article" },
      { title: "Structure Template", url: "https://www.readwritethink.org/classroom-resources/printouts/persuasion-30034.html", type: "practice" }
    ],
    studyTips: ["Start with an outline", "Use topic sentences", "Include evidence and examples"]
  },
  {
    title: "World War II Timeline",
    subject: "History",
    class: "10",
    difficulty: "Easy",
    duration: 35,
    resources: [
      { title: "BBC History", url: "https://www.bbc.co.uk/history/worldwars/wwtwo/", type: "article" },
      { title: "Interactive Timeline", url: "https://www.timetoast.com/timelines/world-war-2-timeline", type: "interactive" },
      { title: "Documentary Clips", url: "https://www.youtube.com/results?search_query=world+war+2+timeline", type: "video" }
    ],
    studyTips: ["Create your own timeline", "Focus on key dates", "Understand cause and effect"]
  }
];

async function seedHomework() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/report-card-system');
    await HomeworkTopic.deleteMany({});
    await HomeworkTopic.insertMany(sampleTopics);
    console.log('Homework topics seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding homework topics:', error);
    process.exit(1);
  }
}

seedHomework();