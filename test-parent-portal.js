// Test script for Parent Portal functionality
const mongoose = require('mongoose');
const Student = require('./models/Student');
const Performance = require('./models/Performance');
const Test = require('./models/Test');
const Message = require('./models/Message');
const User = require('./models/User');
const { calculateGPA, getGradeFromPercentage, sendParentNotification } = require('./utils/parentPortalHelpers');

require('dotenv').config();

const testParentPortal = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/report-card-system');
    console.log('Connected to MongoDB for testing');

    // Test 1: Grade calculation functions
    console.log('\n=== Testing Grade Calculations ===');
    const samplePerformances = [
      { percentage: 85 },
      { percentage: 92 },
      { percentage: 78 }
    ];
    
    const gpa = calculateGPA(samplePerformances);
    console.log(`GPA for [85%, 92%, 78%]: ${gpa}`);
    
    console.log(`Grade for 95%: ${getGradeFromPercentage(95)}`);
    console.log(`Grade for 85%: ${getGradeFromPercentage(85)}`);
    console.log(`Grade for 65%: ${getGradeFromPercentage(65)}`);

    // Test 2: Find sample student and parent
    console.log('\n=== Testing Data Retrieval ===');
    const sampleStudent = await Student.findOne().populate('parentId');
    if (sampleStudent) {
      console.log(`Found student: ${sampleStudent.name} (Class: ${sampleStudent.class})`);
      
      // Get student's recent performances
      const performances = await Performance.find({ studentId: sampleStudent._id })
        .sort({ date: -1 })
        .limit(5);
      console.log(`Recent performances: ${performances.length} records found`);
      
      // Get upcoming tests for student's class
      const upcomingTests = await Test.find({
        class: sampleStudent.class,
        section: sampleStudent.section,
        date: { $gte: new Date() }
      }).limit(3);
      console.log(`Upcoming tests: ${upcomingTests.length} tests found`);
      
      // Test notification system (if parent exists)
      if (sampleStudent.parentId) {
        console.log('\n=== Testing Notification System ===');
        const testNotification = await sendParentNotification(
          sampleStudent.parentId,
          sampleStudent.teacherId,
          sampleStudent._id,
          `Test notification for ${sampleStudent.name}: Math quiz completed with 85%`
        );
        console.log(`Notification sent: ${testNotification}`);
      }
    } else {
      console.log('No sample student found in database');
    }

    // Test 3: Dashboard data structure
    console.log('\n=== Testing Dashboard Data Structure ===');
    if (sampleStudent) {
      const dashboardData = {
        student: {
          name: sampleStudent.name,
          class: sampleStudent.class,
          section: sampleStudent.section,
          gpa: parseFloat(calculateGPA(samplePerformances))
        },
        currentSemester: {
          progress: 87,
          period: '2023 Fall - Week 7'
        },
        overallProgress: 87,
        upcomingTests: 3,
        reportCard: {
          overallGrade: 'A',
          attendance: '95%'
        }
      };
      console.log('Dashboard data structure:', JSON.stringify(dashboardData, null, 2));
    }

    console.log('\n=== Parent Portal Test Completed Successfully ===');
    
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the test
if (require.main === module) {
  testParentPortal();
}

module.exports = testParentPortal;