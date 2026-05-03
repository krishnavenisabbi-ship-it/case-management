## Deployment Checklist

### Backend: Render (`yourcase-backend`)

Add these environment variables in Render:

- `MONGO_URI`
- `JWT_SECRET`
- `ADMIN_EMAILS`
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_PHONE_NUMBER`

Notes:

- `MONGO_URI` must be set in the Render dashboard. The backend log showed it was `undefined`.
- `JWT_SECRET` must also be set in Render.
- The backend code reads Twilio values from `TWILIO_ACCOUNT_SID`, `TWILIO_AUTH_TOKEN`, and `TWILIO_PHONE_NUMBER`.

After saving env vars, redeploy the backend service.

### Frontend: Vercel

Set these frontend environment variables in Vercel:

- `VITE_BACKEND_URL=https://case-management-fei4.onrender.com`
- `VITE_GOOGLE_CLIENT_ID=400532799045-aqoo74q76bms4o0erh379oou3np727b5.apps.googleusercontent.com`

### Google OAuth

Google OAuth client in the frontend uses:

- `400532799045-aqoo74q76bms4o0erh379oou3np727b5.apps.googleusercontent.com`

Add these authorized JavaScript origins in Google Cloud Console for that client:

- `https://krishnavenisabbi-ship-it-case-manag.vercel.app`
- `https://yourcase.in`
- `https://www.yourcase.in`
- `http://localhost:5173`

If you use a different Vercel production URL, add that exact origin too.

### Smoke Test

1. Open the frontend.
2. Sign in with Google.
3. Open the dashboard.
4. Edit the profile phone number.
5. Refresh the page.
6. Confirm the phone number persists.
