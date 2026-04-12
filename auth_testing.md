# Auth-Gated App Testing Playbook

## Step 1: Create Test User & Session
```bash
mongosh --eval "
use('case_management');
var userId = 'test-user-' + Date.now();
var sessionToken = 'test_session_' + Date.now();
db.users.insertOne({
  user_id: userId,
  email: 'test.user.' + Date.now() + '@example.com',
  name: 'Test User',
  picture: 'https://via.placeholder.com/150',
  created_at: new Date()
});
db.sessions.insertOne({
  user_id: userId,
  session_token: sessionToken,
  expires_at: new Date(Date.now() + 7*24*60*60*1000),
  created_at: new Date()
});
print('Session token: ' + sessionToken);
print('User ID: ' + userId);
"
```

## Step 2: Test Backend API
```bash
API_URL="https://245338f4-e8c3-4094-99d9-9a96ef5fa0fc.preview.emergentagent.com"

curl -X GET "$API_URL/api/auth/me" \
  -H "Authorization: Bearer YOUR_SESSION_TOKEN"

curl -X GET "$API_URL/api/cases" \
  -H "Authorization: Bearer YOUR_SESSION_TOKEN"

curl -X POST "$API_URL/api/cases" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_SESSION_TOKEN" \
  -d '{"case_number": "CIV/2024/001", "petitioner_name": "John Doe", "respondent_name": "Jane Smith", "court_name": "High Court", "court_place": "Chennai", "adjournment_date": "2024-03-15", "step": "Hearing", "status": "Open"}'
```

## Step 3: Browser Testing
```python
await page.context.add_cookies([{
    "name": "session_token",
    "value": "YOUR_SESSION_TOKEN",
    "domain": "245338f4-e8c3-4094-99d9-9a96ef5fa0fc.preview.emergentagent.com",
    "path": "/",
    "httpOnly": True,
    "secure": True,
    "sameSite": "None"
}])
await page.goto("https://245338f4-e8c3-4094-99d9-9a96ef5fa0fc.preview.emergentagent.com")
```

## Checklist
- User document has user_id field
- Session user_id matches user's user_id exactly
- All queries use {"_id": 0} projection
- API returns user data with user_id field
- Browser loads dashboard (not login page)
