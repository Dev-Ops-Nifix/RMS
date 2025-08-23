const mongoose = require('mongoose');
const Performance = require('./models/Performance');
const Student = require('./models/Student');
const User = require('./models/User');
require('dotenv').config();

const seedPerformanceData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/report-card-system');
    console.log('Connected to MongoDB');

    // Find existing students and teachers
    const students = await Student.find().limit(5);
    const teachers = await User.find({ role: 'Teacher' }).limit(3);

    if (students.length === 0 || teachers.length === 0) {
      console.log('No students or teachers found. Please create some first.');
      return;
    }

    // Clear existing performance data
    await Performance.deleteMany({});
    console.log('Cleared existing performance data');

    const subjects = ['Mathematics', 'Science', 'English', 'History', 'Geography'];
    const testTypes = ['quiz', 'test', 'assignment', 'project'];
    
    const performanceData = [];

    // Generate performance data for each student
    for (const student of students) {
      const teacher = teachers[Math.floor(Math.random() * teachers.length)];
      
      // Generate data for the last 3 months
      for (let month = 0; month < 3; month++) {
        for (const subject of subjects) {
          // Generate 3-5 tests per subject per month
          const testsCount = Math.floor(Math.random() * 3) + 3;
          
          for (let test = 0; test < testsCount; test++) {
            const date = new Date();
            date.setMonth(date.getMonth() - month);
            date.setDate(Math.floor(Math.random() * 28) + 1);
            
            const testType = testTypes[Math.floor(Math.random() * testTypes.length)];
            const totalMarks = testType === 'quiz' ? 20 : testType === 'assignment' ? 50 : 100;
            
            // Generate realistic scores with some variation
            let baseScore = 70 + Math.random() * 25; // 70-95% base range
            
            // Add subject-specific tendencies
            if (subject === 'Mathematics') baseScore += Math.random() * 10 - 5;
            if (subject === 'Science') baseScore += Math.random() * 8 - 4;
            if (subject === 'English') baseScore += Math.random() * 6 - 3;
            
            // Add monthly improvement trend
            baseScore += (2 - month) * 2; // Recent months slightly better
            
            // Ensure score is within bounds
            baseScore = Math.max(45, Math.min(98, baseScore));
            
            const marks = Math.round((baseScore / 100) * totalMarks);
            const percentage = Math.round((marks / totalMarks) * 100);

            performanceData.push({
              studentId: student._id,
              subject,
              testType,
              marks,
              totalMarks,
              percentage,
              date,
              teacherId: teacher._id
            });
          }
        }
      }
    }

    // Insert all performance data
    await Performance.insertMany(performanceData);
    console.log(`Inserted ${performanceData.length} performance records`);

    // Display sample data for verification
    console.log('\nSample Performance Data:');
    const sampleStudent = students[0];
    const samplePerformances = await Performance.find({ studentId: sampleStudent._id })
      .populate('teacherId', 'name')
      .sort({ date: -1 })
      .limit(10);

    console.log(`\nRecent performances for ${sampleStudent.name}:`);
    samplePerformances.forEach(perf => {
      console.log(`${perf.subject} - ${perf.testType}: ${perf.marks}/${perf.totalMarks} (${perf.percentage}%) - ${perf.date.toDateString()}`);
    });

    // Calculate and display analytics
    const monthlyPerformances = await Performance.find({
      studentId: sampleStudent._id,
      date: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
    });

    if (monthlyPerformances.length > 0) {
      const averageScore = Math.round(
        monthlyPerformances.reduce((sum, p) => sum + p.percentage, 0) / monthlyPerformances.length * 10
      ) / 10;
      const highestScore = Math.max(...monthlyPerformances.map(p => p.percentage));
      
      console.log(`\nThis Month Analytics for ${sampleStudent.name}:`);
      console.log(`Average Score: ${averageScore}%`);
      console.log(`Highest Score: ${highestScore}%`);
      console.log(`Total Tests: ${monthlyPerformances.length}`);
    }

    console.log('\nPerformance data seeding completed successfully!');
    console.log('\nYou can now test the analytics endpoints:');
    console.log(`GET /api/analytics/${sampleStudent._id}/overview?period=month`);
    console.log(`GET /api/analytics/${sampleStudent._id}/dashboard?period=month`);
    console.log(`GET /api/analytics/${sampleStudent._id}/subjects?period=month`);
    console.log(`GET /api/analytics/${sampleStudent._id}/strengths-improvements?period=month`);

  } catch (error) {
    console.error('Error seeding performance data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the seeder
if (require.main === module) {
  seedPerformanceData();
}

module.exports = seedPerformanceData;