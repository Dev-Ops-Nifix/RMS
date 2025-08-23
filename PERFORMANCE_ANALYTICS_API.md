# Performance Analytics API Documentation

## Overview
Complete Node.js/Express backend system for dynamic report card generation with real-time analytics based on teacher performance data entries.

## Base URL
```
http://localhost:5000/api
```

## Authentication
All endpoints require authentication. Include JWT token in Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Core Features

### 1. Performance Analytics Endpoints

#### Get Performance Overview
```http
GET /analytics/{studentId}/overview?period={period}
```

**Parameters:**
- `studentId` (required): Student's MongoDB ObjectId
- `period` (optional): `week`, `month`, `semester` (default: `month`)

**Response:**
```json
{
  "studentName": "Emma Johnson",
  "period": "month",
  "overview": {
    "averageScore": 88.8,
    "totalTests": 4,
    "highestScore": 92,
    "improvement": 2.5,
    "gpa": "3.8",
    "rank": "4/28"
  }
}
```

#### Get Recent Tests
```http
GET /analytics/{studentId}/recent-tests?period={period}&limit={limit}
```

**Parameters:**
- `studentId` (required): Student's MongoDB ObjectId
- `period` (optional): `week`, `month`, `semester` (default: `month`)
- `limit` (optional): Number of tests to return (default: 10)

**Response:**
```json
{
  "recentTests": [
    {
      "id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "subject": "Mathematics",
      "testType": "quiz",
      "score": "18/20",
      "percentage": 90,
      "grade": "A-",
      "date": "2024-01-15T00:00:00.000Z",
      "teacher": "Mr. Anderson",
      "status": "excellent"
    }
  ],
  "period": "month",
  "total": 4
}
```

#### Get Subject-wise Performance
```http
GET /analytics/{studentId}/subjects?period={period}
```

**Response:**
```json
{
  "subjects": [
    {
      "subject": "Mathematics",
      "tests": [
        {
          "testType": "quiz",
          "score": "18/20",
          "percentage": 90,
          "grade": "A-",
          "date": "2024-01-15T00:00:00.000Z"
        }
      ],
      "teacher": "Mr. Anderson",
      "totalTests": 3,
      "averageScore": 92.0,
      "highestScore": 95,
      "lowestScore": 88,
      "grade": "A",
      "improvement": 3.5
    }
  ],
  "period": "month",
  "totalSubjects": 5
}
```

#### Get Strengths and Improvement Areas
```http
GET /analytics/{studentId}/strengths-improvements?period={period}
```

**Response:**
```json
{
  "strengths": [
    {
      "area": "Mathematics",
      "type": "subject",
      "average": 92.0,
      "grade": "A",
      "description": "Consistently strong performance in Mathematics"
    }
  ],
  "improvements": [
    {
      "area": "History",
      "type": "subject",
      "average": 72.0,
      "grade": "C",
      "description": "Needs additional support in History",
      "priority": "medium"
    }
  ],
  "period": "month"
}
```

#### Get Performance Trends
```http
GET /analytics/{studentId}/trends?period={period}
```

**Response:**
```json
{
  "trends": [
    {
      "week": "2024-01-08",
      "average": 85.5,
      "testsCount": 2,
      "grade": "B+"
    }
  ],
  "overallTrend": "improving",
  "comparison": {
    "studentAverage": 88.8,
    "classAverage": 82.3,
    "difference": 6.5,
    "performance": "above_average"
  },
  "period": "month"
}
```

#### Get Complete Analytics Dashboard
```http
GET /analytics/{studentId}/dashboard?period={period}
```

**Response:**
```json
{
  "overview": {
    "averageScore": 88.8,
    "totalTests": 4,
    "highestScore": 92,
    "improvement": 2.5,
    "gpa": "3.8"
  },
  "recentTests": [...],
  "subjects": [...],
  "strengths": [...],
  "improvements": [...],
  "trends": [...],
  "period": "month",
  "lastUpdated": "2024-01-20T10:30:00.000Z"
}
```

### 2. Teacher Performance Input System

#### Add Single Performance Record
```http
POST /api/teacher/performance
```

**Request Body:**
```json
{
  "studentId": "64f8a1b2c3d4e5f6a7b8c9d0",
  "subject": "Mathematics",
  "testType": "quiz",
  "marks": 18,
  "totalMarks": 20,
  "date": "2024-01-15"
}
```

**Response:**
```json
{
  "message": "Performance added and parent notified",
  "performance": {
    "studentId": "64f8a1b2c3d4e5f6a7b8c9d0",
    "subject": "Mathematics",
    "testType": "quiz",
    "marks": 18,
    "totalMarks": 20,
    "percentage": 90,
    "date": "2024-01-15T00:00:00.000Z",
    "teacherId": "64f8a1b2c3d4e5f6a7b8c9d1"
  },
  "grade": "A-",
  "reportCardUpdated": true
}
```

#### Batch Add Performance Records
```http
POST /api/teacher/performance/batch
```

**Request Body:**
```json
{
  "performances": [
    {
      "studentId": "64f8a1b2c3d4e5f6a7b8c9d0",
      "subject": "Mathematics",
      "testType": "test",
      "marks": 85,
      "totalMarks": 100,
      "date": "2024-01-15"
    },
    {
      "studentId": "64f8a1b2c3d4e5f6a7b8c9d2",
      "subject": "Mathematics",
      "testType": "test",
      "marks": 78,
      "totalMarks": 100,
      "date": "2024-01-15"
    }
  ]
}
```

#### Update Performance Record
```http
PUT /api/teacher/performance/{performanceId}
```

**Request Body:**
```json
{
  "marks": 19,
  "totalMarks": 20
}
```

### 3. Dynamic Report Card Generation

#### Generate Report Card
```http
GET /report-cards/{studentId}?period={period}
```

**Response:**
```json
{
  "student": {
    "name": "Emma Johnson",
    "class": "Grade 7B"
  },
  "period": "month",
  "overall": {
    "gpa": "3.8",
    "average": "91%",
    "rank": "4/28",
    "comment": "Excellent progress this term"
  },
  "subjects": [
    {
      "name": "Mathematics",
      "grade": "A",
      "percentage": 95,
      "teacher": "Mr. Anderson"
    },
    {
      "name": "Science",
      "grade": "A-",
      "percentage": 88,
      "teacher": "Mr. Anderson"
    }
  ]
}
```

## Grade Conversion System

### Letter Grades
- A+: 97-100%
- A: 93-96%
- A-: 90-92%
- B+: 87-89%
- B: 83-86%
- B-: 80-82%
- C+: 77-79%
- C: 73-76%
- C-: 70-72%
- D+: 67-69%
- D: 65-66%
- F: Below 65%

### GPA Conversion
- A+/A: 4.0
- A-: 3.7
- B+: 3.3
- B: 3.0
- B-: 2.7
- C+: 2.3
- C: 2.0
- C-: 1.7
- D+: 1.3
- D: 1.0
- F: 0.0

## Automatic Notifications

### Parent Notifications
- **Grade Updates**: Sent when teachers add new performance data
- **Progress Alerts**: Sent when performance drops below 80%
- **Report Card Updates**: Sent when significant changes occur
- **Grade Changes**: Sent when existing grades are modified by 5% or more

### Notification Types
- `grade_update`: New grade added
- `grade_change`: Existing grade modified
- `progress_alert`: Performance needs attention
- `report_card`: Report card updated

## Real-time Features

### Automatic Calculations
- GPA recalculated on every grade input
- Class rankings updated in real-time
- Performance averages recalculated automatically
- Trend analysis updated with new data

### Performance Optimization
- MongoDB aggregation for complex calculations
- Caching for frequently accessed data
- Batch processing for multiple grade entries
- Optimized queries for large datasets

## Error Handling

### Common Error Responses
```json
{
  "message": "Student not found",
  "error": "Invalid student ID"
}
```

### HTTP Status Codes
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

## Usage Examples

### Testing the System
1. Run the data seeder:
```bash
node seedPerformanceData.js
```

2. Test analytics endpoints:
```bash
# Get performance overview
curl -H "Authorization: Bearer <token>" \
  "http://localhost:5000/api/analytics/{studentId}/overview?period=month"

# Get complete dashboard
curl -H "Authorization: Bearer <token>" \
  "http://localhost:5000/api/analytics/{studentId}/dashboard?period=month"
```

3. Add new performance data:
```bash
curl -X POST -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{"studentId":"...","subject":"Math","testType":"quiz","marks":18,"totalMarks":20,"date":"2024-01-15"}' \
  "http://localhost:5000/api/teacher/performance"
```

## Integration Notes

### Frontend Integration
- Use period parameter to switch between "This Week", "This Month", "This Semester"
- Dashboard endpoint provides all data needed for report card UI
- Real-time updates trigger automatic data refresh
- Progress bars can be generated from percentage values

### Mobile App Integration
- All endpoints support mobile authentication
- Lightweight responses for mobile optimization
- Offline capability through data caching
- Push notifications for grade updates

This system provides a complete backend solution for dynamic report card generation with real-time analytics, automatic parent notifications, and comprehensive performance tracking.