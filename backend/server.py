from fastapi import FastAPI, APIRouter, HTTPException, status
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List
import uuid
from datetime import datetime, timedelta
import random
import sys

# Twilio and FastMail
from twilio.rest import Client
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig

# Load environment
ROOT_DIR = Path(__file__).parent
if not load_dotenv(ROOT_DIR / '.env'):
    print("Warning: .env file not found or could not be loaded.", file=sys.stderr)

# MongoDB connection
mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
db_name = os.environ.get('DB_NAME', 'test_database')
client = AsyncIOMotorClient(mongo_url)
db = client[db_name]

# FastAPI app
app = FastAPI()
api_router = APIRouter(prefix="/api")

# Logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Email config
mail_tls = os.environ.get('MAIL_TLS', 'True').lower() == 'true'
mail_ssl = os.environ.get('MAIL_SSL', 'False').lower() == 'true'
mail_port = int(os.environ.get('MAIL_PORT', 587))

conf = ConnectionConfig(
    MAIL_USERNAME=os.environ.get('MAIL_USERNAME'),
    MAIL_PASSWORD=os.environ.get('MAIL_PASSWORD'),
    MAIL_FROM=os.environ.get('MAIL_FROM'),
    MAIL_PORT=mail_port,
    MAIL_SERVER=os.environ.get('MAIL_SERVER'),
    MAIL_TLS=mail_tls,
    MAIL_SSL=mail_ssl,
    USE_CREDENTIALS=True
)

# Twilio config
twilio_account_sid = os.environ.get("TWILIO_ACCOUNT_SID", "")
twilio_auth_token = os.environ.get("TWILIO_AUTH_TOKEN", "")
twilio_phone_number = os.environ.get("TWILIO_PHONE_NUMBER", "")
twilio_client = Client(twilio_account_sid, twilio_auth_token) if twilio_account_sid and twilio_auth_token else None

# Models
class StatusCheck(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

class OtpRequest(BaseModel):
    contact: str
    type: str  # 'email' or 'sms'

class OtpVerification(BaseModel):
    contact: str
    otp: str

class OtpInDB(BaseModel):
    contact: str
    otp: str
    expiration: datetime

# Routes
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    await db.status_checks.insert_one(status_obj.model_dump())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**sc) for sc in status_checks]

# OTP Endpoints
@api_router.post("/send-otp", status_code=status.HTTP_200_OK)
async def send_otp(request: OtpRequest):
    if request.type not in ['email', 'sms']:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid contact type. Must be 'email' or 'sms'."
        )

    otp = str(random.randint(100000, 999999))
    expiration = datetime.utcnow() + timedelta(minutes=5)

    # Store OTP in DB
    await db.otps.update_one(
        {"contact": request.contact},
        {"$set": {"otp": otp, "expiration": expiration}},
        upsert=True
    )

    if request.type == 'sms':
        try:
            if not twilio_client:
                raise ValueError("Twilio credentials missing")
            twilio_client.messages.create(
                body=f"Your CareSphere OTP is: {otp}. Valid for 5 minutes.",
                from_=twilio_phone_number,
                to=request.contact
            )
            return {"message": "OTP sent via SMS", "otp": otp}  # for testing
        except Exception as e:
            logger.error(f"SMS delivery failed: {e}")
            return {"message": f"SMS delivery failed, check logs. OTP: {otp}"}

    elif request.type == 'email':
        try:
            message = MessageSchema(
                subject="Your CareSphere OTP",
                recipients=[request.contact],
                body=f"Your OTP is <strong>{otp}</strong>. Valid for 5 minutes.",
                subtype="html"
            )
            fm = FastMail(conf)
            await fm.send_message(message)
            return {"message": "OTP sent via Email", "otp": otp}
        except Exception as e:
            logger.error(f"Email delivery failed: {e}")
            return {"message": f"Email delivery failed, check logs. OTP: {otp}"}

@api_router.post("/verify-otp", status_code=status.HTTP_200_OK)
async def verify_otp(request: OtpVerification):
    otp_doc = await db.otps.find_one({"contact": request.contact})
    if not otp_doc:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid contact or no pending verification."
        )

    otp_in_db = OtpInDB(**otp_doc)

    if otp_in_db.otp != request.otp:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid OTP"
        )

    if otp_in_db.expiration < datetime.utcnow():
        await db.otps.delete_one({"contact": request.contact})
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="OTP expired"
        )

    await db.otps.delete_one({"contact": request.contact})
    return {"message": "OTP verified successfully"}

# Include router
app.include_router(api_router)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Shutdown DB
@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
