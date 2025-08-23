# Manual Postman Tests - Report Card & Chat

## Authentication Setup
First, login to get your token:

### 1. Parent Login
```
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "parent@example.com",
  "password": "password123"
}
```
Copy the token from response for Authorization header: `Bearer YOUR_TOKEN`

---

## REPORT CARD TESTS (Parent Side)

### 2. Get Parent Dashboard
```
GET http://localhost:3000/api/parent/dashboard/STUDENT_ID
Authorization: Bearer YOUR_PARENT_TOKEN
```

### 3. Get Child Performance (Report Card)
```
GET http://localhost:3000/api/parent/performance/STUDENT_ID
Authorization: Bearer YOUR_PARENT_TOKEN
```

### 4. Get Academic Progress
```
GET http://localhost:3000/api/parent/progress/STUDENT_ID
Authorization: Bearer YOUR_PARENT_TOKEN
```

### 5. Get Test Results
```
GET http://localhost:3000/api/parent/tests/STUDENT_ID
Authorization: Bearer YOUR_PARENT_TOKEN
```

### 6. Get Activity Feed
```
GET http://localhost:3000/api/parent/activity/STUDENT_ID
Authorization: Bearer YOUR_PARENT_TOKEN
```

---

## CHAT WITH TEACHER TESTS

### 7. Get Parent's Students List
```
GET http://localhost:3000/api/messages/parent-students
Authorization: Bearer YOUR_PARENT_TOKEN
```

### 8. Get Available Teachers
```
GET http://localhost:3000/api/messages/teachers
Authorization: Bearer YOUR_PARENT_TOKEN
```

### 9. Send Message to Teacher (Parent)
```
POST http://localhost:3000/api/messages/parent-message
Authorization: Bearer YOUR_PARENT_TOKEN
Content-Type: application/json

{
  "teacherId": "TEACHER_ID",
  "studentId": "STUDENT_ID",
  "content": "Hello, I wanted to discuss my child's progress in Math."
}
```

### 10. Get Chat History
```
GET http://localhost:3000/api/messages/chat/TEACHER_ID/PARENT_ID/STUDENT_ID
Authorization: Bearer YOUR_PARENT_TOKEN
```

### 11. Get Parent Chat List
```
GET http://localhost:3000/api/messages/parent-chats
Authorization: Bearer YOUR_PARENT_TOKEN
```

### 12. Get Notifications
```
GET http://localhost:3000/api/parent/notifications
Authorization: Bearer YOUR_PARENT_TOKEN
```

---

## TEACHER SIDE (For Testing Chat Response)

### 13. Teacher Login
```
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "teacher@example.com",
  "password": "password123"
}
```

### 14. Send Message to Parent (Teacher)
```
POST http://localhost:3000/api/messages/send
Authorization: Bearer YOUR_TEACHER_TOKEN
Content-Type: application/json

{
  "studentId": "STUDENT_ID",
  "content": "Thank you for your message. Your child is doing well in Math."
}
```

### 15. Get Teacher Chat List
```
GET http://localhost:3000/api/messages/teacher-chats
Authorization: Bearer YOUR_TEACHER_TOKEN
```

---

## SAMPLE TEST DATA

Replace these IDs with actual IDs from your database:

- STUDENT_ID: `507f1f77bcf86cd799439011`
- TEACHER_ID: `507f1f77bcf86cd799439012`
- PARENT_ID: `507f1f77bcf86cd799439013`

## Expected Responses

### Dashboard Response:
```json
{
  "student": {
    "name": "John Doe",
    "class": "Grade 5",
    "section": "A",
    "gpa": 3.2
  },
  "currentSemester": {
    "progress": 85,
    "period": "2023 Fall - Week 7"
  },
  "overallProgress": 85,
  "upcomingTests": 2,
  "reportCard": {
    "overallGrade": "B+ (85%)",
    "attendance": "95%"
  }
}
```

### Chat History Response:
```json
[
  {
    "_id": "message_id",
    "content": "Hello teacher",
    "sender": "parent",
    "timestamp": "2024-01-15T10:30:00Z",
    "read": false
  },
  {
    "_id": "message_id_2",
    "content": "Hello, how can I help?",
    "sender": "teacher",
    "timestamp": "2024-01-15T10:35:00Z",
    "read": true
  }
]
```