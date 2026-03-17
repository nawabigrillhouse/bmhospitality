from fastapi import FastAPI, APIRouter
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
from datetime import datetime, timezone


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

class SubscribeRequest(BaseModel):
    name: str
    email: str
    phone: str

class FlightInquiryRequest(BaseModel):
    name: str
    email: str
    phone: str
    from_city: str
    to_city: str
    departure_date: str
    return_date: Optional[str] = None
    passengers: str
    travel_class: str
    trip_type: str

class HotelInquiryRequest(BaseModel):
    destination: str
    check_in_date: str
    check_out_date: str
    adults: str
    children: str
    child_ages: Optional[str] = None
    meal_plan: str
    email: str
    whatsapp: str

class ContactRequest(BaseModel):
    name: str
    email: str
    phone: Optional[str] = None
    subject: str
    message: str

class QuickInquiryRequest(BaseModel):
    package_type: str
    name: str
    email: str
    phone: str
    destination: str
    check_in_date: str
    check_out_date: str
    number_of_adults: str
    number_of_children: str
    budget: Optional[str] = None
    requirements: Optional[str] = None


# Routes
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_dict = input.model_dump()
    status_obj = StatusCheck(**status_dict)
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    _ = await db.status_checks.insert_one(doc)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
    for check in status_checks:
        if isinstance(check['timestamp'], str):
            check['timestamp'] = datetime.fromisoformat(check['timestamp'])
    return status_checks

@api_router.post("/subscribe")
async def subscribe(data: SubscribeRequest):
    doc = data.model_dump()
    doc['id'] = str(uuid.uuid4())
    doc['created_at'] = datetime.now(timezone.utc).isoformat()
    await db.subscriptions.insert_one(doc)
    return {"status": "success", "message": "Subscription received successfully"}

@api_router.post("/flight-inquiry")
async def flight_inquiry(data: FlightInquiryRequest):
    doc = data.model_dump()
    doc['id'] = str(uuid.uuid4())
    doc['created_at'] = datetime.now(timezone.utc).isoformat()
    await db.flight_inquiries.insert_one(doc)
    return {"status": "success", "message": "Flight inquiry received. We will get back to you with the best options."}

@api_router.post("/hotel-inquiry")
async def hotel_inquiry(data: HotelInquiryRequest):
    doc = data.model_dump()
    doc['id'] = str(uuid.uuid4())
    doc['created_at'] = datetime.now(timezone.utc).isoformat()
    await db.hotel_inquiries.insert_one(doc)
    return {"status": "success", "message": "Hotel inquiry received. We will send you the best options."}

@api_router.post("/contact")
async def contact(data: ContactRequest):
    doc = data.model_dump()
    doc['id'] = str(uuid.uuid4())
    doc['created_at'] = datetime.now(timezone.utc).isoformat()
    await db.contacts.insert_one(doc)
    return {"status": "success", "message": "Message received. We will respond within 24 hours."}

@api_router.post("/inquiry")
async def quick_inquiry(data: QuickInquiryRequest):
    doc = data.model_dump()
    doc['id'] = str(uuid.uuid4())
    doc['created_at'] = datetime.now(timezone.utc).isoformat()
    await db.inquiries.insert_one(doc)
    return {"status": "success", "message": "Inquiry received. We will contact you shortly with the best options."}


# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()