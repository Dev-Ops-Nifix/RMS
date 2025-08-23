# Parent Portal API Documentation

## Overview
Complete Node.js/Express backend system for parent portal in education management system with automated notifications and real-time progress tracking.

## API Endpoints

### Parent Dashboard
**GET** `/api/parents/dashboard/:studentId`
- **Description**: Get main dashboard data for a student
- **Auth**: Parent role required
- **Response**:
```json
{
  "student": {
    "name": "John Doe",
    "class": "Grade 7",
    "section": "Section B",
    "gpa": 4.0
  },
  "currentSemester": {
    "progress": 87,
    "period": "2023 Fall - Week 7"
  },
  "overallProgress": 87,
  "upcomingTests": 3,
  "reportCard": {
    "overallGrade": "A",
    "attendance": "95%"
  }
}
```

### Academic Progress
**GET** `/api/parents/progress/:studentId`
- **Description**: Get detailed academic progress with subject-wise breakdown
- **Auth**: Parent role required
- **Response**:
```json
{
  "subjectProgress": [
    {
      "subject": "Math",
      "average": 92,
      "grade": "A+",
      "totalTests": 5,
      "trend": "up"
    }
  ],
  "trends": [
    {
      "date": "2023-10-15",
      "subject": "Math",
      "percentage": 92
    }
  ]
}
```

### Tests & Assignments
**GET** `/api/parents/tests/:studentId`
- **Description**: Get upcoming tests and recent results
- **Auth**: Parent role required
- **Response**:
```json
{
  "upcoming": [
    {
      "title": "Math Quiz",
      "subject": "Math",
      "date": "2023-11-15",
      "duration": 60,
      "totalMarks": 100
    }
  ],
  "recent": [
    {
      "subject": "Math",
      "testType": "quiz",
      "marks": 72,
      "totalMarks": 100,
      "percentage": 72,
      "date": "2023-10-30",
      "teacher": "Mrs. Smith"
    }
  ]
}
```

### Activity Feed
**GET** `/api/parents/activity/:studentId`
- **Description**: Get recent activity feed for student
- **Auth**: Parent role required
- **Response**:
```json
[
  {
    "type": "test_completed",
    "title": "Math Quiz Completed",
    "description": "Score: 72%",
    "date": "2023-10-30",
    "icon": "star"
  },
  {
    "type": "homework_assigned",
    "title": "New Homework Assigned",
    "description": "Science - Due Oct 17",
    "date": "2023-10-15",
    "icon": "assignment"
  }
]
```

### Notifications
**GET** `/api/parents/notifications`
- **Description**: Get parent notifications
- **Auth**: Parent role required
- **Response**:
```json
[
  {
    "id": "notification_id",
    "content": "New quiz result for John Doe in Math: 72/100 (72%)",
    "timestamp": "2023-10-30T10:30:00Z",
    "read": false,
    "student": "John Doe",
    "teacher": "Mrs. Smith",
    "sender": "teacher"
  }
]
```

## Teacher Endpoints (Auto-Notification)

### Add Performance with Notification
**POST** `/api/parents/teacher/performance`
- **Description**: Add performance data and auto-notify parent
- **Auth**: Teacher role required
- **Body**:
```json
{
  "studentId": "student_id",
  "subject": "Math",
  "testType": "quiz",
  "marks": 72,
  "totalMarks": 100,
  "date": "2023-10-30"
}
```

### Schedule Test with Notification
**POST** `/api/parents/teacher/test`
- **Description**: Schedule test and auto-notify all parents in class
- **Auth**: Teacher role required
- **Body**:
```json
{
  "title": "Math Quiz",
  "subject": "Math",
  "class": "Grade 7",
  "section": "Section B",
  "date": "2023-11-15",
  "duration": 60,
  "totalMarks": 100,
  "description": "Chapter 5 quiz"
}
```

## Automatic Notification Triggers

### Performance Notifications
- **Trigger**: When teacher adds performance data via `/api/performance` or `/api/parents/teacher/performance`
- **Recipients**: Student's parent
- **Content**: "New [testType] result for [studentName] in [subject]: [marks]/[totalMarks] ([percentage]%)"

### Test Schedule Notifications
- **Trigger**: When teacher schedules test via `/api/tests` or `/api/parents/teacher/test`
- **Recipients**: All parents in the class/section
- **Content**: "Upcoming [subject] test scheduled for [studentName]: [title] on [date]"

### Grade Update Notifications
- **Trigger**: When performance percentage changes significantly
- **Recipients**: Student's parent
- **Content**: "Grade update for [studentName] in [subject]: [newGrade]"

### Achievement Notifications
- **Trigger**: When student scores 95% or above
- **Recipients**: Student's parent
- **Content**: "Congratulations! [studentName] has achieved excellent performance in [subject]: [percentage]%"

## Helper Functions

### Grade Calculations
- **calculateGPA()**: Converts percentage to 4.0 GPA scale
- **getGradeFromPercentage()**: Converts percentage to letter grade
- **calculateProgressPercentage()**: Calculates overall progress

### Progress Tracking
- **getSubjectWiseProgress()**: MongoDB aggregation for subject analysis
- **getProgressTrends()**: Historical performance trends
- **generateActivityFeed()**: Creates activity timeline

## Database Models Used

### Student
- `name`, `class`, `section`, `parentId`, `teacher`

### Performance
- `studentId`, `subject`, `testType`, `marks`, `totalMarks`, `percentage`, `date`, `teacherId`

### Test
- `title`, `subject`, `class`, `section`, `teacherId`, `date`, `duration`, `totalMarks`

### Message
- `parentId`, `teacherId`, `studentId`, `content`, `timestamp`, `sender`, `read`

### ReportCard
- `studentId`, `summary` with `overallGrade` and `attendance`

## Error Handling
All endpoints include comprehensive error handling with appropriate HTTP status codes:
- `404`: Student not found or unauthorized access
- `500`: Server errors with detailed error messages
- `401`: Authentication required
- `403`: Insufficient permissions

## Security Features
- JWT authentication required for all endpoints
- Role-based access control (Parent/Teacher)
- Parent can only access their own children's data
- Teacher can only modify data for their assigned students

## Real-time Features
- Automatic parent notifications on teacher actions
- Real-time progress calculations
- Live activity feed updates
- Instant grade notifications

## Usage Examples

### Get Dashboard Data
```javascript
GET /api/parents/dashboard/student_id
Authorization: Bearer jwt_token
```

### Add Performance (Teacher)
```javascript
POST /api/parents/teacher/performance
Authorization: Bearer teacher_jwt_token
Content-Type: application/json

{
  "studentId": "67890",
  "subject": "Math",
  "testType": "quiz",
  "marks": 85,
  "totalMarks": 100
}
```

This system provides complete parent portal functionality with automated notifications, real-time progress tracking, and comprehensive academic monitoring.