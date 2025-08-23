# Quick Test Scenarios for Postman

## Scenario 1: Parent Views Report Card

1. **Login as Parent**
   - POST `/api/auth/login`
   - Body: `{"email": "parent@test.com", "password": "123456"}`

2. **Get Student Dashboard**
   - GET `/api/parent/dashboard/STUDENT_ID`
   - Check: GPA, progress, upcoming tests

3. **View Report Card Details**
   - GET `/api/parent/performance/STUDENT_ID`
   - Check: Subjects, grades, teacher comments

## Scenario 2: Parent Chats with Teacher

1. **Get Student List**
   - GET `/api/messages/parent-students`
   - Note down student IDs

2. **Get Teachers List**
   - GET `/api/messages/teachers`
   - Note down teacher IDs

3. **Send Message**
   - POST `/api/messages/parent-message`
   - Body: `{"teacherId": "ID", "studentId": "ID", "content": "Test message"}`

4. **Check Chat History**
   - GET `/api/messages/chat/TEACHER_ID/PARENT_ID/STUDENT_ID`

## Test with Sample Data

### Parent Login:
```json
{
  "email": "alice.parent@example.com",
  "password": "parent123"
}
```

### Teacher Response (Login as teacher first):
```json
{
  "email": "john.teacher@example.com", 
  "password": "teacher123"
}
```

### Message Example:
```json
{
  "teacherId": "60d5ecb74b24a1234567890a",
  "studentId": "60d5ecb74b24a1234567890b", 
  "content": "How is my child performing in Mathematics?"
}
```

## Quick Validation Checklist

✅ Parent can login successfully  
✅ Dashboard shows student info  
✅ Report card displays grades  
✅ Parent can send message to teacher  
✅ Chat history shows messages  
✅ Teacher can reply to parent  
✅ Notifications work properly