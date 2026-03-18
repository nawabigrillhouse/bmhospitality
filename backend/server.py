from fastapi import FastAPI, APIRouter, UploadFile, File, HTTPException, Header, Query, Response
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
import hashlib
from datetime import datetime, timezone
from storage import init_storage, upload_image, get_object

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")

ADMIN_PASSWORD = "Nawabi@2025"

# --- Models ---
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

class AdminLoginRequest(BaseModel):
    password: str

class ContentUpdateRequest(BaseModel):
    section: str
    item_id: str
    field: str
    value: str


# --- Helper ---
def generate_token(password: str) -> str:
    return hashlib.sha256(f"{password}_bm_hospitality_admin".encode()).hexdigest()

def verify_admin(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Unauthorized")
    token = authorization.split(" ")[1]
    if token != generate_token(ADMIN_PASSWORD):
        raise HTTPException(status_code=401, detail="Invalid token")
    return True


# --- Public Routes ---
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
    doc['type'] = 'flight'
    await db.inquiries.insert_one(doc)
    return {"status": "success", "message": "Flight inquiry received. We will get back to you with the best options."}

@api_router.post("/hotel-inquiry")
async def hotel_inquiry(data: HotelInquiryRequest):
    doc = data.model_dump()
    doc['id'] = str(uuid.uuid4())
    doc['created_at'] = datetime.now(timezone.utc).isoformat()
    doc['type'] = 'hotel'
    await db.inquiries.insert_one(doc)
    return {"status": "success", "message": "Hotel inquiry received. We will send you the best options."}

@api_router.post("/contact")
async def contact(data: ContactRequest):
    doc = data.model_dump()
    doc['id'] = str(uuid.uuid4())
    doc['created_at'] = datetime.now(timezone.utc).isoformat()
    doc['type'] = 'contact'
    await db.inquiries.insert_one(doc)
    return {"status": "success", "message": "Message received. We will respond within 24 hours."}

@api_router.post("/inquiry")
async def quick_inquiry(data: QuickInquiryRequest):
    doc = data.model_dump()
    doc['id'] = str(uuid.uuid4())
    doc['created_at'] = datetime.now(timezone.utc).isoformat()
    doc['type'] = 'package'
    await db.inquiries.insert_one(doc)
    return {"status": "success", "message": "Inquiry received. We will contact you shortly with the best options."}


@api_router.get("/images/{section}")
async def get_public_images(section: str):
    items = await db.files.find(
        {"section": section, "is_deleted": {"$ne": True}},
        {"_id": 0}
    ).sort("created_at", 1).to_list(100)
    return {"images": items}

# --- Public: Get content images ---
@api_router.get("/content/{section}")
async def get_section_content(section: str):
    items = await db.content.find({"section": section, "is_deleted": {"$ne": True}}, {"_id": 0}).to_list(100)
    return {"items": items}

@api_router.get("/files/{path:path}")
async def serve_file(path: str):
    record = await db.files.find_one({"storage_path": path, "is_deleted": {"$ne": True}}, {"_id": 0})
    if not record:
        raise HTTPException(status_code=404, detail="File not found")
    data, content_type = get_object(path)
    return Response(content=data, media_type=record.get("content_type", content_type))


# --- Admin Routes ---
@api_router.post("/admin/login")
async def admin_login(data: AdminLoginRequest):
    if data.password != ADMIN_PASSWORD:
        raise HTTPException(status_code=401, detail="Invalid password")
    token = generate_token(ADMIN_PASSWORD)
    return {"status": "success", "token": token}

@api_router.get("/admin/inquiries")
async def get_inquiries(authorization: str = Header(None)):
    verify_admin(authorization)
    items = await db.inquiries.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)
    return {"inquiries": items}

@api_router.get("/admin/subscriptions")
async def get_subscriptions(authorization: str = Header(None)):
    verify_admin(authorization)
    items = await db.subscriptions.find({}, {"_id": 0}).sort("created_at", -1).to_list(500)
    return {"subscriptions": items}

@api_router.get("/admin/images")
async def get_images(section: str = Query(None), authorization: str = Header(None)):
    verify_admin(authorization)
    query = {"is_deleted": {"$ne": True}}
    if section:
        query["section"] = section
    items = await db.files.find(query, {"_id": 0}).sort("created_at", -1).to_list(200)
    return {"images": items}

@api_router.post("/admin/upload")
async def admin_upload(
    file: UploadFile = File(...),
    section: str = Query(...),
    item_id: str = Query(""),
    label: str = Query(""),
    authorization: str = Header(None)
):
    verify_admin(authorization)
    
    allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"]
    if file.content_type not in allowed:
        raise HTTPException(status_code=400, detail="Only JPEG, PNG, WebP, GIF images allowed")
    
    data = await file.read()
    if len(data) > 10 * 1024 * 1024:
        raise HTTPException(status_code=400, detail="File too large. Max 10MB.")
    
    result = upload_image(data, file.filename, file.content_type)
    
    file_doc = {
        "id": str(uuid.uuid4()),
        "storage_path": result["storage_path"],
        "original_filename": result["original_filename"],
        "content_type": result["content_type"],
        "size": result["size"],
        "section": section,
        "item_id": item_id,
        "label": label,
        "is_deleted": False,
        "created_at": datetime.now(timezone.utc).isoformat()
    }
    await db.files.insert_one(file_doc)
    
    file_doc.pop("_id", None)
    return {"status": "success", "file": file_doc}

@api_router.delete("/admin/images/{image_id}")
async def delete_image(image_id: str, authorization: str = Header(None)):
    verify_admin(authorization)
    result = await db.files.update_one(
        {"id": image_id},
        {"$set": {"is_deleted": True}}
    )
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Image not found")
    return {"status": "success", "message": "Image deleted"}

@api_router.get("/admin/stats")
async def get_stats(authorization: str = Header(None)):
    verify_admin(authorization)
    total_inquiries = await db.inquiries.count_documents({})
    total_subs = await db.subscriptions.count_documents({})
    total_images = await db.files.count_documents({"is_deleted": {"$ne": True}})
    flight_inq = await db.inquiries.count_documents({"type": "flight"})
    hotel_inq = await db.inquiries.count_documents({"type": "hotel"})
    contact_inq = await db.inquiries.count_documents({"type": "contact"})
    package_inq = await db.inquiries.count_documents({"type": "package"})
    return {
        "total_inquiries": total_inquiries,
        "total_subscriptions": total_subs,
        "total_images": total_images,
        "by_type": {
            "flight": flight_inq,
            "hotel": hotel_inq,
            "contact": contact_inq,
            "package": package_inq
        }
    }


# --- App Setup ---
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

@app.on_event("startup")
async def startup():
    try:
        init_storage()
    except Exception as e:
        logger.error(f"Storage init failed: {e}")

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
