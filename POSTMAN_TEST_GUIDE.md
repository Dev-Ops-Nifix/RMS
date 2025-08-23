# 📋 EDU_VAULT Postman Test Guide

## 🚀 Quick Setup

### 1. Import Collection
- Open Postman
- Click **Import** → **Upload Files**
- Select `postman-test-cases.json`
- Collection will be imported with all test scenarios

### 2. Environment Variables
The collection uses these variables (auto-managed):
- `baseUrl`: http://localhost:3000
- `authToken`: Auto-set after successful OTP verification
- `parentId`: Auto-set after login
- `studentId`: Auto-set from dashboard response

### 3. Prerequisites
- Backend server running on localhost:3000
- Database with sample parent/student data
- OTP service configured (or mock OTP: 1234)

## 📊 Test Categories

### 🔐 1. Authentication Tests (8 scenarios)
| Test | Purpose | Expected Result |
|------|---------|----------------|
| 1.1 Valid OTP Request | Normal flow | 200 - OTP sent |
| 1.2 Invalid Mobile | Validation | 400 - Invalid mobile |
| 1.3 Invalid Email | Validation | 400 - Invalid email |
| 1.4 Parent Not Found | Data validation | 404 - Parent not found |
| 1.5 Rate Limiting | Security | 429 after 3 requests |
| 1.6 Valid OTP Verify | Login success | 200 + JWT token |
| 1.7 Invalid OTP | Wrong OTP | 400 - Invalid OTP |
| 1.8 Expired OTP | Time validation | 400 - OTP expired |

### 📱 2. Dashboard Tests (3 scenarios)
| Test | Purpose | Expected Result |
|------|---------|----------------|
| 2.1 Valid Dashboard | Normal access | 200 + children list |
| 2.2 No Token | Auth required | 401 - Authorization denied |
| 2.3 Invalid Token | Token validation | 401 - Token invalid |

### 👶 3. Child Details Tests (4 scenarios)
| Test | Purpose | Expected Result |
|------|---------|----------------|
| 3.1 Valid Child ID | Normal access | 200 + child details |
| 3.2 Invalid Child ID | Data validation | 404 - Student not found |
| 3.3 Unauthorized Access | Security | 403 - Access denied |
| 3.4 No Token | Auth required | 401 - Authorization denied |

### 🛡️ 4. Security Tests (5 scenarios)
| Test | Purpose | Expected Result |
|------|---------|----------------|
| 4.1 SQL Injection | Security | 400/404 - Blocked |
| 4.2 XSS Attack | Security | 400/404 - Blocked |
| 4.3 Large Payload | Stability | 200/400/413 - Handled |
| 4.4 Missing Fields | Validation | 400 - Required fields |
| 4.5 Empty Body | Validation | 400 - Validation error |

### ⚡ 5. Performance Tests (2 scenarios)
| Test | Purpose | Expected Result |
|------|---------|----------------|
| 5.1 Response Time | Performance | < 1000ms response |
| 5.2 Concurrent Requests | Load handling | 200/429 - Stable |

## 🎯 Test Execution Order

### Phase 1: Authentication Flow
1. Run **1.1 Valid OTP Request** first
2. Check console/logs for generated OTP
3. Update **1.6 Valid OTP Verify** with actual OTP
4. Run **1.6** to get auth token (auto-saved)

### Phase 2: Protected Routes
5. Run **2.1 Dashboard** (uses saved token)
6. Run **3.1 Child Details** (uses saved token & studentId)

### Phase 3: Validation & Security
7. Run all remaining tests in any order

## 📝 Sample Test Data

### Valid Parent Credentials
```json
{
  "mobile": "9876543210",
  "email": "parent@example.com"
}
```

### Invalid Test Cases
```json
// Invalid Mobile
{"mobile": "123", "email": "parent@example.com"}

// Invalid Email  
{"mobile": "9876543210", "email": "invalid-email"}

// Non-existent Parent
{"mobile": "1111111111", "email": "notfound@example.com"}
```

## 🔍 Expected API Responses

### Successful OTP Request
```json
{
  "message": "OTP sent successfully to mobile and email",
  "otpExpiry": "2024-01-01T12:05:00.000Z"
}
```

### Successful Login
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "parent": {
    "id": "parent123",
    "name": "John Doe",
    "mobile": "9876543210",
    "email": "parent@example.com"
  }
}
```

### Dashboard Response
```json
{
  "parent": {
    "id": "parent123",
    "name": "John Doe"
  },
  "children": [
    {
      "id": "student123",
      "name": "Alice Doe",
      "class": "5th Grade",
      "profilePicture": "https://example.com/pic.jpg",
      "lastActivity": "2024-01-01T10:30:00.000Z"
    }
  ]
}
```

### Child Details Response
```json
{
  "student": {
    "id": "student123",
    "name": "Alice Doe",
    "class": "5th Grade",
    "rollNumber": "2024001",
    "profilePicture": "https://example.com/pic.jpg"
  },
  "performance": {
    "overallGrade": "A",
    "subjects": [
      {"name": "Math", "grade": "A+", "score": 95},
      {"name": "Science", "grade": "A", "score": 88}
    ],
    "attendance": "92%"
  },
  "teacher": {
    "name": "Mrs. Smith",
    "subject": "Class Teacher",
    "contact": "teacher@school.com"
  }
}
```

## ⚠️ Common Issues & Solutions

### Issue: OTP Not Working
**Solution**: Check if using mock OTP (1234) or real SMS service

### Issue: Token Expired
**Solution**: Re-run authentication flow (tests 1.1 → 1.6)

### Issue: Rate Limiting Triggered
**Solution**: Wait 15 minutes or restart server

### Issue: Student ID Not Found
**Solution**: Ensure database has sample student data linked to parent

### Issue: 500 Server Errors
**Solution**: Check server logs, database connection, and environment variables

## 🏃‍♂️ Running Tests

### Individual Tests
- Click any test → **Send**
- Check **Test Results** tab for pass/fail

### Collection Runner
1. Right-click collection → **Run collection**
2. Select all tests or specific folder
3. Set iterations (1 for normal testing)
4. Click **Run EDU_VAULT Backend API Tests**

### Automated Testing
- Use Newman CLI for CI/CD integration
- Export environment after manual token setup
- Run: `newman run postman-test-cases.json -e environment.json`

## 📊 Success Criteria

### ✅ All Tests Should Pass When:
- Backend server is running
- Database has sample data
- OTP service is configured
- All environment variables are set
- No rate limiting is active

### 📈 Performance Benchmarks:
- OTP Request: < 2000ms
- Dashboard Load: < 1000ms  
- Child Details: < 1000ms
- All endpoints: 99%+ success rate

## 🔧 Debugging Tips

1. **Check Response Body**: Always review actual vs expected responses
2. **Monitor Server Logs**: Watch console for errors during test execution
3. **Verify Database**: Ensure test data exists and matches test expectations
4. **Token Validation**: Use JWT.io to decode and verify token contents
5. **Network Issues**: Test with curl if Postman fails consistently

---

**🎉 Ready to Test!** Import the collection and start with the authentication flow. All tests include automatic validations and will show clear pass/fail results.