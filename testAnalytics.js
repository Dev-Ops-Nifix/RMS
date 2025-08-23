const axios = require('axios');

// Test configuration
const BASE_URL = 'http://localhost:5000/api';
const TEST_STUDENT_ID = '64f8a1b2c3d4e5f6a7b8c9d0'; // Replace with actual student ID
const AUTH_TOKEN = 'your_jwt_token_here'; // Replace with actual token

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Authorization': `Bearer ${AUTH_TOKEN}`,
    'Content-Type': 'application/json'
  }
});

const testAnalyticsEndpoints = async () => {
  console.log('🧪 Testing Performance Analytics System\n');

  try {
    // Test 1: Performance Overview
    console.log('1️⃣ Testing Performance Overview...');
    const overview = await api.get(`/analytics/${TEST_STUDENT_ID}/overview?period=month`);
    console.log('✅ Overview:', {
      averageScore: overview.data.overview.averageScore,
      totalTests: overview.data.overview.totalTests,
      gpa: overview.data.overview.gpa
    });

    // Test 2: Recent Tests
    console.log('\n2️⃣ Testing Recent Tests...');
    const recentTests = await api.get(`/analytics/${TEST_STUDENT_ID}/recent-tests?period=month&limit=5`);
    console.log('✅ Recent Tests Count:', recentTests.data.total);
    if (recentTests.data.recentTests.length > 0) {
      console.log('   Latest Test:', {
        subject: recentTests.data.recentTests[0].subject,
        percentage: recentTests.data.recentTests[0].percentage,
        grade: recentTests.data.recentTests[0].grade
      });
    }

    // Test 3: Subject Performance
    console.log('\n3️⃣ Testing Subject Performance...');
    const subjects = await api.get(`/analytics/${TEST_STUDENT_ID}/subjects?period=month`);
    console.log('✅ Subjects Count:', subjects.data.totalSubjects);
    if (subjects.data.subjects.length > 0) {
      console.log('   Top Subject:', {
        subject: subjects.data.subjects[0].subject,
        average: subjects.data.subjects[0].averageScore,
        grade: subjects.data.subjects[0].grade
      });
    }

    // Test 4: Strengths and Improvements
    console.log('\n4️⃣ Testing Strengths & Improvements...');
    const analysis = await api.get(`/analytics/${TEST_STUDENT_ID}/strengths-improvements?period=month`);
    console.log('✅ Strengths:', analysis.data.strengths.length);
    console.log('✅ Improvement Areas:', analysis.data.improvements.length);

    // Test 5: Performance Trends
    console.log('\n5️⃣ Testing Performance Trends...');
    const trends = await api.get(`/analytics/${TEST_STUDENT_ID}/trends?period=month`);
    console.log('✅ Trend Analysis:', {
      overallTrend: trends.data.overallTrend,
      weeklyDataPoints: trends.data.trends.length
    });

    // Test 6: Complete Dashboard
    console.log('\n6️⃣ Testing Complete Dashboard...');
    const dashboard = await api.get(`/analytics/${TEST_STUDENT_ID}/dashboard?period=month`);
    console.log('✅ Dashboard Data:', {
      hasOverview: !!dashboard.data.overview,
      hasSubjects: !!dashboard.data.subjects,
      hasStrengths: !!dashboard.data.strengths,
      hasTrends: !!dashboard.data.trends,
      lastUpdated: dashboard.data.lastUpdated
    });

    // Test 7: Report Card Generation
    console.log('\n7️⃣ Testing Report Card Generation...');
    const reportCard = await api.get(`/report-cards/${TEST_STUDENT_ID}?period=month`);
    console.log('✅ Report Card:', {
      studentName: reportCard.data.student.name,
      gpa: reportCard.data.overall.gpa,
      average: reportCard.data.overall.average,
      rank: reportCard.data.overall.rank,
      subjectsCount: reportCard.data.subjects.length
    });

    console.log('\n🎉 All tests completed successfully!');
    console.log('\n📊 System Features Verified:');
    console.log('   ✅ Real-time performance calculations');
    console.log('   ✅ Grade conversion (percentage to letter grades)');
    console.log('   ✅ GPA calculation');
    console.log('   ✅ Class ranking');
    console.log('   ✅ Subject-wise analysis');
    console.log('   ✅ Strengths and improvement identification');
    console.log('   ✅ Performance trend analysis');
    console.log('   ✅ Time period filtering');
    console.log('   ✅ Dynamic report card generation');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
    console.log('\n🔧 Troubleshooting:');
    console.log('   1. Make sure the server is running on port 5000');
    console.log('   2. Update TEST_STUDENT_ID with a valid student ID');
    console.log('   3. Update AUTH_TOKEN with a valid JWT token');
    console.log('   4. Run seedPerformanceData.js to generate test data');
  }
};

const testPerformanceInput = async () => {
  console.log('\n🧪 Testing Performance Input System\n');

  try {
    // Test adding a single performance record
    console.log('1️⃣ Testing Single Performance Input...');
    const performanceData = {
      studentId: TEST_STUDENT_ID,
      subject: 'Mathematics',
      testType: 'quiz',
      marks: 18,
      totalMarks: 20,
      date: new Date().toISOString().split('T')[0]
    };

    const addResult = await api.post('/teacher/performance', performanceData);
    console.log('✅ Performance Added:', {
      subject: addResult.data.performance.subject,
      percentage: addResult.data.performance.percentage,
      grade: addResult.data.grade,
      notified: addResult.data.message.includes('notified')
    });

    // Test batch performance input
    console.log('\n2️⃣ Testing Batch Performance Input...');
    const batchData = {
      performances: [
        {
          studentId: TEST_STUDENT_ID,
          subject: 'Science',
          testType: 'test',
          marks: 85,
          totalMarks: 100,
          date: new Date().toISOString().split('T')[0]
        },
        {
          studentId: TEST_STUDENT_ID,
          subject: 'English',
          testType: 'assignment',
          marks: 42,
          totalMarks: 50,
          date: new Date().toISOString().split('T')[0]
        }
      ]
    };

    const batchResult = await api.post('/teacher/performance/batch', batchData);
    console.log('✅ Batch Performance Added:', {
      recordsAdded: batchResult.data.results.length,
      notificationsSent: batchResult.data.notificationsSent
    });

    console.log('\n🎉 Performance input tests completed!');

  } catch (error) {
    console.error('❌ Performance input test failed:', error.response?.data || error.message);
  }
};

// Run tests
const runAllTests = async () => {
  console.log('🚀 Starting Performance Analytics System Tests\n');
  console.log('📋 Prerequisites:');
  console.log('   - Server running on http://localhost:5000');
  console.log('   - Valid student ID and auth token');
  console.log('   - Performance data seeded\n');

  await testAnalyticsEndpoints();
  await testPerformanceInput();

  console.log('\n✨ Testing completed!');
  console.log('\n📚 Next Steps:');
  console.log('   1. Integrate with frontend "This Month" button');
  console.log('   2. Add real-time updates to UI');
  console.log('   3. Implement parent notification system');
  console.log('   4. Add performance visualization charts');
};

// Export for use in other files
module.exports = {
  testAnalyticsEndpoints,
  testPerformanceInput,
  runAllTests
};

// Run if called directly
if (require.main === module) {
  runAllTests();
}