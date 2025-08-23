const mongoose = require('mongoose');
const User = require('./models/User');
const Student = require('./models/Student');
require('dotenv').config();

async function setupTestData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/report-card-system');
    
    // Create a test parent
    const testParent = new User({
      name: 'Test Parent',
      email: 'parent@test.com',
      mobile: '1234567890',
      password: 'password123',
      role: 'Parent'
    });
    await testParent.save();
    console.log('Test parent created:', testParent._id);
    
    // Create test students
    const student1 = new Student({
      studentId: 'STU001',
      name: 'Alice Johnson',
      class: '5th',
      section: 'A',
      teacher: 'Mrs. Smith',
      parentId: testParent._id
    });
    
    const student2 = new Student({
      studentId: 'STU002',
      name: 'Bob Johnson',
      class: '3rd',
      section: 'B',
      teacher: 'Mr. Brown',
      parentId: testParent._id
    });
    
    await student1.save();
    await student2.save();
    
    console.log('Test students created');
    console.log('Test data setup complete!');
    console.log('Use mobile: 1234567890 and email: parent@test.com to test login');
    
  } catch (error) {
    console.error('Error setting up test data:', error);
  } finally {
    mongoose.disconnect();
  }
}

setupTestData();