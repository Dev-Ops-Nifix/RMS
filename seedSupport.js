const mongoose = require('mongoose');
const FAQ = require('./models/FAQ');
const SupportResource = require('./models/SupportResource');
require('dotenv').config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/report-card-system');
    
    // Clear existing data
    await FAQ.deleteMany({});
    await SupportResource.deleteMany({});
    
    // Seed FAQ data
    const faqs = [
      {
        question: "How to upload student marks?",
        answer: "To upload student marks, navigate to the 'Assessment' tab in the dashboard. Click on 'Upload Marks' and select the class and subject. You can either enter marks manually or upload a CSV file with the predefined template. Make sure to review and confirm before finalizing the submission.",
        category: "features",
        order: 1
      },
      {
        question: "How to generate report cards?",
        answer: "Go to the Report Cards section from the main menu. Select the class, term, and students for whom you want to generate report cards. Click 'Generate Report Cards' and the system will create PDF reports based on the uploaded marks and assessments.",
        category: "reports",
        order: 2
      },
      {
        question: "How to add a new subject?",
        answer: "Navigate to the Settings section and click on 'Subjects Management'. Click 'Add New Subject', enter the subject name, code, and select the applicable classes. Save the changes to make the subject available for mark entry.",
        category: "features",
        order: 3
      },
      {
        question: "How to reset admin password?",
        answer: "If you've forgotten your admin password, click on 'Forgot Password' on the login page. Enter your registered email address and follow the instructions sent to your email. Alternatively, contact support for immediate assistance.",
        category: "account",
        order: 4
      },
      {
        question: "How to customize report card templates?",
        answer: "Go to Settings > Report Card Templates. You can modify the existing template or create a new one. Customize the layout, add school logo, change colors, and configure which fields to display. Preview the template before applying it to ensure it meets your requirements.",
        category: "reports",
        order: 5
      }
    ];
    
    await FAQ.insertMany(faqs);
    
    // Seed Support Resources
    const resources = [
      {
        title: "User Manual",
        description: "Detailed user guides",
        type: "documentation",
        url: "https://docs.eduvault.com/user-manual",
        order: 1
      },
      {
        title: "Getting Started Guide",
        description: "Quick start tutorial",
        type: "tutorial",
        url: "https://tutorials.eduvault.com/getting-started",
        order: 1
      },
      {
        title: "EDU VAULT Brochure",
        description: "Product overview and features",
        type: "brochure",
        url: "https://downloads.eduvault.com/brochure.pdf",
        order: 1
      },
      {
        title: "API Documentation",
        description: "Developer API reference",
        type: "documentation",
        url: "https://docs.eduvault.com/api",
        order: 2
      },
      {
        title: "Video Tutorials",
        description: "Step-by-step videos",
        type: "tutorial",
        url: "https://tutorials.eduvault.com/videos",
        order: 2
      }
    ];
    
    await SupportResource.insertMany(resources);
    
    console.log('Support data seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();