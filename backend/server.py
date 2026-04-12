import os
import uuid
import httpx
from datetime import datetime, timezone, timedelta
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException, Request, Response, Depends
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from pydantic import BaseModel
from typing import Optional

load_dotenv()

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

MONGO_URL = os.environ.get("MONGO_URL")
DB_NAME = os.environ.get("DB_NAME")
client = MongoClient(MONGO_URL)
db = client[DB_NAME]

users_col = db["users"]
sessions_col = db["sessions"]
cases_col = db["cases"]
notifications_col = db["notifications"]

# --- Pydantic Models ---
class CaseCreate(BaseModel):
    case_number: str
    petitioner_name: str
    respondent_name: str
    court_name: str
    court_place: str
    adjournment_date: str
    step: str
    status: str = "Open"
    client_email: Optional[str] = ""
    client_phone: Optional[str] = ""

class CaseUpdate(BaseModel):
    case_number: Optional[str] = None
    petitioner_name: Optional[str] = None
    respondent_name: Optional[str] = None
    court_name: Optional[str] = None
    court_place: Optional[str] = None
    adjournment_date: Optional[str] = None
    step: Optional[str] = None
    status: Optional[str] = None
    client_email: Optional[str] = None
    client_phone: Optional[str] = None

# --- Auth Helpers ---
def get_session_token(request: Request) -> str:
    token = request.cookies.get("session_token")
    if not token:
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    return token

def get_current_user(request: Request) -> dict:
    token = get_session_token(request)
    session = sessions_col.find_one({"session_token": token}, {"_id": 0})
    if not session:
        raise HTTPException(status_code=401, detail="Invalid session")
    expires_at = session["expires_at"]
    if isinstance(expires_at, str):
        expires_at = datetime.fromisoformat(expires_at)
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)
    if expires_at < datetime.now(timezone.utc):
        raise HTTPException(status_code=401, detail="Session expired")
    user = users_col.find_one({"user_id": session["user_id"]}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    return user

# --- Health ---
@app.get("/api/health")
def health():
    return {"status": "ok"}

# --- Auth Routes ---
@app.post("/api/auth/session")
async def exchange_session(request: Request, response: Response):
    body = await request.json()
    session_id = body.get("session_id")
    if not session_id:
        raise HTTPException(status_code=400, detail="session_id required")
    async with httpx.AsyncClient() as client_http:
        resp = await client_http.get(
            "https://demobackend.emergentagent.com/auth/v1/env/oauth/session-data",
            headers={"X-Session-ID": session_id}
        )
    if resp.status_code != 200:
        raise HTTPException(status_code=401, detail="Invalid session_id")
    data = resp.json()
    email = data.get("email")
    name = data.get("name", "")
    picture = data.get("picture", "")
    session_token = data.get("session_token", str(uuid.uuid4()))
    existing = users_col.find_one({"email": email}, {"_id": 0})
    if existing:
        user_id = existing["user_id"]
        users_col.update_one({"email": email}, {"$set": {"name": name, "picture": picture}})
    else:
        user_id = f"user_{uuid.uuid4().hex[:12]}"
        users_col.insert_one({
            "user_id": user_id,
            "email": email,
            "name": name,
            "picture": picture,
            "created_at": datetime.now(timezone.utc).isoformat()
        })
    sessions_col.insert_one({
        "user_id": user_id,
        "session_token": session_token,
        "expires_at": (datetime.now(timezone.utc) + timedelta(days=7)),
        "created_at": datetime.now(timezone.utc)
    })
    response.set_cookie(
        key="session_token",
        value=session_token,
        httponly=True,
        secure=True,
        samesite="none",
        path="/",
        max_age=7 * 24 * 3600
    )
    user = users_col.find_one({"user_id": user_id}, {"_id": 0})
    return user

@app.get("/api/auth/me")
def auth_me(request: Request):
    user = get_current_user(request)
    return user

@app.post("/api/auth/logout")
def logout(request: Request, response: Response):
    token = request.cookies.get("session_token")
    if token:
        sessions_col.delete_many({"session_token": token})
    response.delete_cookie("session_token", path="/", samesite="none", secure=True)
    return {"message": "Logged out"}

# --- Case Routes ---
@app.get("/api/cases")
def get_cases(request: Request):
    user = get_current_user(request)
    cases = list(cases_col.find({"user_id": user["user_id"]}, {"_id": 0}))
    return cases

@app.post("/api/cases")
def create_case(case: CaseCreate, request: Request):
    user = get_current_user(request)
    case_id = f"case_{uuid.uuid4().hex[:12]}"
    share_token = uuid.uuid4().hex[:16]
    doc = {
        "case_id": case_id,
        "user_id": user["user_id"],
        "share_token": share_token,
        "case_number": case.case_number,
        "petitioner_name": case.petitioner_name,
        "respondent_name": case.respondent_name,
        "court_name": case.court_name,
        "court_place": case.court_place,
        "adjournment_date": case.adjournment_date,
        "step": case.step,
        "status": case.status,
        "client_email": case.client_email,
        "client_phone": case.client_phone,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
    cases_col.insert_one(doc)
    result = cases_col.find_one({"case_id": case_id}, {"_id": 0})
    return result

@app.put("/api/cases/{case_id}")
def update_case(case_id: str, case: CaseUpdate, request: Request):
    user = get_current_user(request)
    existing = cases_col.find_one({"case_id": case_id, "user_id": user["user_id"]}, {"_id": 0})
    if not existing:
        raise HTTPException(status_code=404, detail="Case not found")
    updates = {k: v for k, v in case.dict().items() if v is not None}
    updates["updated_at"] = datetime.now(timezone.utc).isoformat()
    cases_col.update_one({"case_id": case_id}, {"$set": updates})
    result = cases_col.find_one({"case_id": case_id}, {"_id": 0})
    return result

@app.delete("/api/cases/{case_id}")
def delete_case(case_id: str, request: Request):
    user = get_current_user(request)
    result = cases_col.delete_one({"case_id": case_id, "user_id": user["user_id"]})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Case not found")
    return {"message": "Case deleted"}

# --- Public Case View ---
@app.get("/api/public/case/{share_token}")
def get_public_case(share_token: str):
    case = cases_col.find_one({"share_token": share_token}, {"_id": 0, "user_id": 0})
    if not case:
        raise HTTPException(status_code=404, detail="Case not found")
    return case

# --- Mock Notifications ---
@app.get("/api/notifications")
def get_notifications(request: Request):
    user = get_current_user(request)
    notifs = list(notifications_col.find({"user_id": user["user_id"]}, {"_id": 0}).sort("created_at", -1).limit(20))
    return notifs

@app.post("/api/notifications/check")
def check_adjournment_notifications(request: Request):
    user = get_current_user(request)
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    cases_today = list(cases_col.find({
        "user_id": user["user_id"],
        "adjournment_date": today,
        "status": "Open"
    }, {"_id": 0}))
    created = []
    for c in cases_today:
        existing = notifications_col.find_one({
            "case_id": c["case_id"],
            "date": today,
            "type": "adjournment"
        })
        if not existing:
            notif = {
                "notification_id": f"notif_{uuid.uuid4().hex[:12]}",
                "user_id": user["user_id"],
                "case_id": c["case_id"],
                "case_number": c["case_number"],
                "type": "adjournment",
                "message": f"Adjournment reminder: Case {c['case_number']} has a hearing today at {c['court_name']}, {c['court_place']}",
                "email_sent": False,
                "sms_sent": False,
                "email_status": "MOCKED - Not sent (integration pending)",
                "sms_status": "MOCKED - Not sent (integration pending)",
                "date": today,
                "created_at": datetime.now(timezone.utc).isoformat()
            }
            notifications_col.insert_one(notif)
            created.append({k: v for k, v in notif.items() if k != "_id"})
    return {"checked": len(cases_today), "notifications_created": len(created), "notifications": created}

# --- Dashboard Stats ---
@app.get("/api/stats")
def get_stats(request: Request):
    user = get_current_user(request)
    uid = user["user_id"]
    total = cases_col.count_documents({"user_id": uid})
    open_cases = cases_col.count_documents({"user_id": uid, "status": "Open"})
    closed_cases = cases_col.count_documents({"user_id": uid, "status": "Closed"})
    today = datetime.now(timezone.utc).strftime("%Y-%m-%d")
    upcoming = cases_col.count_documents({
        "user_id": uid,
        "adjournment_date": {"$gte": today},
        "status": "Open"
    })
    return {
        "total_cases": total,
        "open_cases": open_cases,
        "closed_cases": closed_cases,
        "upcoming_adjournments": upcoming
    }
