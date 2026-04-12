# Test Credentials

## Authentication
- **Method**: Google OAuth (Emergent-managed Google Auth)
- **No password-based credentials** - uses Google SSO

## Test Session (for automated testing)
Create test sessions directly in MongoDB:
```bash
mongosh --eval "
use('case_management');
var userId = 'test-user-' + Date.now();
var sessionToken = 'test_session_' + Date.now();
db.users.insertOne({
  user_id: userId,
  email: 'test.user@example.com',
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

## Database
- **MongoDB**: `mongodb://localhost:27017`
- **DB Name**: `case_management`
- **Collections**: `users`, `sessions`, `cases`, `notifications`
