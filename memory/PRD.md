# Case Management System - PRD

## Problem Statement
Build a public interactive dashboard for case management for legal professionals. Title: "Case Management System". Login with Google SSO. Dashboard with case details (S.No, Case Number, Petitioner, Respondent, Court, Place, Adjournment Date, Step, Status). Email/SMS notifications on adjournment dates (mocked). Public shareable URL for clients.

## Architecture
- **Backend**: Python FastAPI on port 8001
- **Frontend**: React (Vite) + Tailwind CSS v4 on port 3000
- **Database**: MongoDB (local)
- **Auth**: Emergent-managed Google OAuth

## User Personas
1. **Legal Professional** - Primary user who manages cases, adds/edits/deletes cases, views dashboard
2. **Client** - Read-only access via public shareable URL

## Core Requirements
- [x] Google SSO Authentication
- [x] Case CRUD (Create, Read, Update, Delete)
- [x] Dashboard with statistics (Total, Open, Closed, Upcoming)
- [x] Case table with all required fields
- [x] Search & filter cases
- [x] Public shareable URL for clients
- [x] Mock notification system (email/SMS)
- [x] Attractive Swiss/Brutalist UI design

## What's Been Implemented (Apr 12, 2026)
- Full-stack case management system
- Google SSO via Emergent Auth
- CRUD operations for cases with all required fields
- Dashboard stats cards (Total, Open, Closed, Upcoming Hearings)
- Searchable case table with all columns
- Add/Edit case slide-in modal
- Public case view page with shareable tokens
- Mock notification endpoint for adjournment dates
- Professional Swiss/High-contrast UI design

## Prioritized Backlog
### P0 (Critical)
- None remaining

### P1 (Important)
- Real email notification integration (Resend/SendGrid)
- Real SMS notification integration (Twilio)
- Cron job for automated adjournment date checking

### P2 (Nice to Have)
- Case document uploads
- Multi-user team collaboration
- Calendar view for adjournment dates
- Case timeline/history tracking
- Export cases to PDF/CSV
- Dashboard analytics charts

## Next Tasks
1. Integrate real email service (user to provide preference)
2. Integrate real SMS service (user to provide preference)
3. Add automated cron job for daily adjournment checks
