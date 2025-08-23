const Student = require('../models/Student');
const { sendParentNotification, createPerformanceNotification, createTestScheduleNotification } = require('../utils/parentPortalHelpers');

// Middleware to auto-notify parents when performance is added
const notifyParentOnPerformance = async (req, res, next) => {
  const originalSend = res.json;
  
  res.json = async function(data) {
    // Call original response first
    originalSend.call(this, data);
    
    // Then handle notification if performance was successfully created
    if (res.statusCode === 201 && req.body.studentId) {
      try {
        const { studentId, subject, testType, marks, totalMarks } = req.body;
        const percentage = Math.round((marks / totalMarks) * 100);
        
        const student = await Student.findById(studentId);
        if (student && student.parentId) {
          const content = createPerformanceNotification(
            student.name, subject, testType, marks, totalMarks, percentage
          );
          await sendParentNotification(student.parentId, req.user.id, studentId, content);
        }
      } catch (error) {
        console.error('Failed to send performance notification:', error);
      }
    }
  };
  
  next();
};

// Middleware to auto-notify parents when test is scheduled
const notifyParentOnTestSchedule = async (req, res, next) => {
  const originalSend = res.json;
  
  res.json = async function(data) {
    // Call original response first
    originalSend.call(this, data);
    
    // Then handle notification if test was successfully created
    if (res.statusCode === 201 && req.body.class && req.body.section) {
      try {
        const { title, subject, class: className, section, date } = req.body;
        
        const students = await Student.find({ 
          class: className, 
          section, 
          parentId: { $ne: null } 
        });
        
        for (const student of students) {
          const content = createTestScheduleNotification(student.name, subject, title, date);
          await sendParentNotification(student.parentId, req.user.id, student._id, content);
        }
      } catch (error) {
        console.error('Failed to send test schedule notifications:', error);
      }
    }
  };
  
  next();
};

module.exports = {
  notifyParentOnPerformance,
  notifyParentOnTestSchedule
};