# EDU VAULT Backend Demo Script

## Prerequisites
1. Start server: `node index.js`
2. Server runs on: http://localhost:5000

## Demo Flow (5 minutes)

### 1. Authentication (30 seconds)
**Create Teacher Account:**
```
POST /api/auth/register
{
  "email": "teacher@demo.com",
  "password": "demo123",
  "role": "Teacher",
  "name": "Demo Teacher"
}
```

**Login:**
```
POST /api/auth/login
{
  "email": "teacher@demo.com",
  "password": "demo123",
  "role": "Teacher"
}
```
*Copy JWT token for next requests*

### 2. Student Management (1 minute)
**Add Student:**
```
POST /api/teachers/students
Headers: Authorization: Bearer [TOKEN]
{
  "studentId": "STU001",
  "name": "Alice Johnson",
  "class": "10",
  "section": "A",
  "parentId": "PARENT_ID"
}
```

**View Students:**
```
GET /api/teachers/students
Headers: Authorization: Bearer [TOKEN]
```

### 3. Report Card System (2 minutes)
**Upload Report Card:**
```
POST /api/report-cards/upload
Headers: Authorization: Bearer [TOKEN]
Form Data:
- studentId: [STUDENT_ID]
- file: alice-report-card.pdf
```

**Update Performance:**
```
PUT /api/report-cards/[REPORT_ID]/performance
Headers: Authorization: Bearer [TOKEN]
{
  "performance": [
    {"subject": "Math", "grade": "A+ (98%)", "teacher": "Mr. Smith"},
    {"subject": "Science", "grade": "A (95%)", "teacher": "Dr. Brown"}
  ]
}
```

### 4. Analytics (1 minute)
**Class Leaderboard:**
```
GET /api/report-cards/leaderboard/10
Headers: Authorization: Bearer [TOKEN]
```

### 5. Parent Access (30 seconds)
**Parent Login & View Child:**
```
POST /api/auth/login (as Parent)
GET /api/parents/children
GET /api/parents/performance/[STUDENT_ID]
```

## Key Features Demonstrated:
✅ Role-based Authentication (Teacher/Parent)
✅ Student CRUD Operations
✅ File Upload & Processing
✅ Automated Grade Calculations
✅ Performance Analytics
✅ Parent-Child Relationships
✅ Class Leaderboards
✅ RESTful API Design