# 📋 EDU_VAULT Simple Postman Tests

## 1. Request OTP
**POST** `/api/mobile/auth/request-otp`
```json
{
  "mobile": "9876543210",
  "email": "parent@example.com"
}
```

## 2. Verify OTP & Login
**POST** `/api/mobile/auth/verify-otp`
```json
{
  "mobile": "9876543210",
  "email": "parent@example.com",
  "otp": "1234"
}
```

## 3. Get Parent Dashboard (Only Their Children)
**GET** `/api/mobile/parent/dashboard`
**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```
**Expected Response:**
```json
{
  "children": 2,
  "childrenList": [
    {
      "_id": "student123",
      "name": "John Doe",
      "class": "5th Grade",
      "section": "A",
      "teacher": "Mrs. Smith"
    }
  ],
  "recentReportCards": [],
  "unreadMessages": 0
}
```

## 4. Get Child Details (Only Parent's Own Child)
**GET** `/api/mobile/parent/child/STUDENT_ID_FROM_DASHBOARD`
**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```
**Expected Response:**
```json
{
  "student": {
    "name": "John Doe",
    "class": "5th Grade",
    "section": "A",
    "teacher": "Mrs. Smith"
  },
  "teacher": {
    "name": "Mrs. Smith",
    "email": "teacher@school.com"
  },
  "latestReportCard": {},
  "overallGrade": "A",
  "attendance": "95%"
}
```

---

## 🔒 Security Test Flow:
1. Run test #1 to request OTP
2. Check console/logs for generated OTP
3. Run test #2 with OTP to get JWT token
4. Run test #3 to get ONLY your children list
5. Copy student ID from response
6. Run test #4 with YOUR child's ID (works)
7. Try test #4 with ANOTHER parent's child ID (fails with 404)

## ✅ Parent Access Control Tests:

### Valid Child Access (Your Own Child)
**GET** `/api/mobile/parent/child/YOUR_CHILD_ID`
**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```
**Expected:** 200 - Child details returned

### Invalid Child Access (Another Parent's Child)
**GET** `/api/mobile/parent/child/OTHER_PARENT_CHILD_ID`
**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```
**Expected:** 404 - "Child not found" (Security: Can't access other children)

## ❌ Error Test Cases:

### Invalid Mobile Format
**POST** `/api/mobile/auth/request-otp`
```json
{
  "mobile": "123",
  "email": "parent@example.com"
}
```
**Expected:** 400 - Invalid mobile number

### Invalid Email Format
**POST** `/api/mobile/auth/request-otp`
```json
{
  "mobile": "9876543210",
  "email": "invalid-email"
}
```
**Expected:** 400 - Invalid email format

### Wrong OTP
**POST** `/api/mobile/auth/verify-otp`
```json
{
  "mobile": "9876543210",
  "email": "parent@example.com",
  "otp": "9999"
}
```
**Expected:** 400 - Invalid OTP

### No Authorization Header
**GET** `/api/mobile/parent/dashboard`
(Don't include Authorization header)
**Expected:** 401 - Authorization denied

### Invalid Student ID
**GET** `/api/mobile/parent/child/invalid_id`
**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN_HERE
```
**Expected:** 404 - Child not found

---

## 🛡️ Security Features Confirmed:
✅ Parents can ONLY see their own children  
✅ Parents can ONLY access their own children's reports  
✅ JWT token required for all protected routes  
✅ Child access verified by parentId in database  
✅ No cross-parent data access possible