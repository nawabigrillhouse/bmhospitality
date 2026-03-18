from fastapi import FastAPI, APIRouter, UploadFile, File, HTTPException, Header, Query, Response
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import asyncio
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List, Optional
import uuid
import hashlib
from datetime import datetime, timezone
from storage import init_storage, upload_image, get_object
import resend

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI()
api_router = APIRouter(prefix="/api")

ADMIN_PASSWORD = "Nawabi@2025"

# Resend email setup
resend.api_key = os.environ.get('RESEND_API_KEY', '')
NOTIFICATION_EMAIL = os.environ.get('NOTIFICATION_EMAIL', '')
SENDER_EMAIL = os.environ.get('SENDER_EMAIL', 'onboarding@resend.dev')

async def send_notification_email(subject: str, html_content: str):
    """Send email notification to business owner - non-blocking"""
    if not resend.api_key or not NOTIFICATION_EMAIL:
        logging.warning("Email not configured, skipping notification")
        return
    try:
        params = {
            "from": SENDER_EMAIL,
            "to": [NOTIFICATION_EMAIL],
            "subject": subject,
            "html": html_content
        }
        await asyncio.to_thread(resend.Emails.send, params)
        logging.info(f"Notification email sent: {subject}")
    except Exception as e:
        logging.error(f"Failed to send notification email: {e}")

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

class ContentItem(BaseModel):
    section: str
    data: dict
    sort_order: int = 0

class ContentUpdateRequest(BaseModel):
    data: dict = None
    sort_order: int = None


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
    asyncio.create_task(send_notification_email(
        "New Newsletter Subscription - BM Hospitality",
        f"<h2>New Subscriber</h2><table style='border-collapse:collapse;width:100%'>"
        f"<tr><td style='padding:8px;border:1px solid #ddd;font-weight:bold'>Name</td><td style='padding:8px;border:1px solid #ddd'>{doc.get('name','')}</td></tr>"
        f"<tr><td style='padding:8px;border:1px solid #ddd;font-weight:bold'>Email</td><td style='padding:8px;border:1px solid #ddd'>{doc.get('email','')}</td></tr>"
        f"<tr><td style='padding:8px;border:1px solid #ddd;font-weight:bold'>Phone</td><td style='padding:8px;border:1px solid #ddd'>{doc.get('phone','')}</td></tr>"
        f"</table>"
    ))
    return {"status": "success", "message": "Subscription received successfully"}

@api_router.post("/flight-inquiry")
async def flight_inquiry(data: FlightInquiryRequest):
    doc = data.model_dump()
    doc['id'] = str(uuid.uuid4())
    doc['created_at'] = datetime.now(timezone.utc).isoformat()
    doc['type'] = 'flight'
    await db.inquiries.insert_one(doc)
    asyncio.create_task(send_notification_email(
        f"New Flight Inquiry from {doc.get('name','')} - BM Hospitality",
        f"<h2>Flight Inquiry</h2><table style='border-collapse:collapse;width:100%'>"
        f"<tr><td style='padding:8px;border:1px solid #ddd;font-weight:bold'>Name</td><td style='padding:8px;border:1px solid #ddd'>{doc.get('name','')}</td></tr>"
        f"<tr><td style='padding:8px;border:1px solid #ddd;font-weight:bold'>Email</td><td style='padding:8px;border:1px solid #ddd'>{doc.get('email','')}</td></tr>"
        f"<tr><td style='padding:8px;border:1px solid #ddd;font-weight:bold'>Phone</td><td style='padding:8px;border:1px solid #ddd'>{doc.get('phone','')}</td></tr>"
        f"<tr><td style='padding:8px;border:1px solid #ddd;font-weight:bold'>From</td><td style='padding:8px;border:1px solid #ddd'>{doc.get('from_city','')}</td></tr>"
        f"<tr><td style='padding:8px;border:1px solid #ddd;font-weight:bold'>To</td><td style='padding:8px;border:1px solid #ddd'>{doc.get('to_city','')}</td></tr>"
        f"<tr><td style='padding:8px;border:1px solid #ddd;font-weight:bold'>Departure</td><td style='padding:8px;border:1px solid #ddd'>{doc.get('departure_date','')}</td></tr>"
        f"<tr><td style='padding:8px;border:1px solid #ddd;font-weight:bold'>Return</td><td style='padding:8px;border:1px solid #ddd'>{doc.get('return_date','N/A')}</td></tr>"
        f"<tr><td style='padding:8px;border:1px solid #ddd;font-weight:bold'>Passengers</td><td style='padding:8px;border:1px solid #ddd'>{doc.get('passengers','')}</td></tr>"
        f"<tr><td style='padding:8px;border:1px solid #ddd;font-weight:bold'>Class</td><td style='padding:8px;border:1px solid #ddd'>{doc.get('travel_class','')}</td></tr>"
        f"<tr><td style='padding:8px;border:1px solid #ddd;font-weight:bold'>Trip Type</td><td style='padding:8px;border:1px solid #ddd'>{doc.get('trip_type','')}</td></tr>"
        f"</table>"
    ))
    return {"status": "success", "message": "Flight inquiry received. We will get back to you with the best options."}

@api_router.post("/hotel-inquiry")
async def hotel_inquiry(data: HotelInquiryRequest):
    doc = data.model_dump()
    doc['id'] = str(uuid.uuid4())
    doc['created_at'] = datetime.now(timezone.utc).isoformat()
    doc['type'] = 'hotel'
    await db.inquiries.insert_one(doc)
    asyncio.create_task(send_notification_email(
        f"New Hotel Inquiry - {doc.get('destination','')} - BM Hospitality",
        f"<h2>Hotel/Resort Inquiry</h2><table style='border-collapse:collapse;width:100%'>"
        f"<tr><td style='padding:8px;border:1px solid #ddd;font-weight:bold'>Destination</td><td style='padding:8px;border:1px solid #ddd'>{doc.get('destination','')}</td></tr>"
        f"<tr><td style='padding:8px;border:1px solid #ddd;font-weight:bold'>Check-in</td><td style='padding:8px;border:1px solid #ddd'>{doc.get('check_in_date','')}</td></tr>"
        f"<tr><td style='padding:8px;border:1px solid #ddd;font-weight:bold'>Check-out</td><td style='padding:8px;border:1px solid #ddd'>{doc.get('check_out_date','')}</td></tr>"
        f"<tr><td style='padding:8px;border:1px solid #ddd;font-weight:bold'>Adults</td><td style='padding:8px;border:1px solid #ddd'>{doc.get('adults','')}</td></tr>"
        f"<tr><td style='padding:8px;border:1px solid #ddd;font-weight:bold'>Children</td><td style='padding:8px;border:1px solid #ddd'>{doc.get('children','')}</td></tr>"
        f"<tr><td style='padding:8px;border:1px solid #ddd;font-weight:bold'>Meal Plan</td><td style='padding:8px;border:1px solid #ddd'>{doc.get('meal_plan','')}</td></tr>"
        f"<tr><td style='padding:8px;border:1px solid #ddd;font-weight:bold'>Email</td><td style='padding:8px;border:1px solid #ddd'>{doc.get('email','')}</td></tr>"
        f"<tr><td style='padding:8px;border:1px solid #ddd;font-weight:bold'>WhatsApp</td><td style='padding:8px;border:1px solid #ddd'>{doc.get('whatsapp','')}</td></tr>"
        f"</table>"
    ))
    return {"status": "success", "message": "Hotel inquiry received. We will send you the best options."}

@api_router.post("/contact")
async def contact(data: ContactRequest):
    doc = data.model_dump()
    doc['id'] = str(uuid.uuid4())
    doc['created_at'] = datetime.now(timezone.utc).isoformat()
    doc['type'] = 'contact'
    await db.inquiries.insert_one(doc)
    asyncio.create_task(send_notification_email(
        f"New Contact Message from {doc.get('name','')} - BM Hospitality",
        f"<h2>Contact Message</h2><table style='border-collapse:collapse;width:100%'>"
        f"<tr><td style='padding:8px;border:1px solid #ddd;font-weight:bold'>Name</td><td style='padding:8px;border:1px solid #ddd'>{doc.get('name','')}</td></tr>"
        f"<tr><td style='padding:8px;border:1px solid #ddd;font-weight:bold'>Email</td><td style='padding:8px;border:1px solid #ddd'>{doc.get('email','')}</td></tr>"
        f"<tr><td style='padding:8px;border:1px solid #ddd;font-weight:bold'>Phone</td><td style='padding:8px;border:1px solid #ddd'>{doc.get('phone','')}</td></tr>"
        f"<tr><td style='padding:8px;border:1px solid #ddd;font-weight:bold'>Subject</td><td style='padding:8px;border:1px solid #ddd'>{doc.get('subject','')}</td></tr>"
        f"<tr><td style='padding:8px;border:1px solid #ddd;font-weight:bold'>Message</td><td style='padding:8px;border:1px solid #ddd'>{doc.get('message','')}</td></tr>"
        f"</table>"
    ))
    return {"status": "success", "message": "Message received. We will respond within 24 hours."}

@api_router.post("/inquiry")
async def quick_inquiry(data: QuickInquiryRequest):
    doc = data.model_dump()
    doc['id'] = str(uuid.uuid4())
    doc['created_at'] = datetime.now(timezone.utc).isoformat()
    doc['type'] = 'package'
    await db.inquiries.insert_one(doc)
    asyncio.create_task(send_notification_email(
        f"New Package Inquiry from {doc.get('name','')} - BM Hospitality",
        f"<h2>Package Inquiry</h2><table style='border-collapse:collapse;width:100%'>"
        f"<tr><td style='padding:8px;border:1px solid #ddd;font-weight:bold'>Package</td><td style='padding:8px;border:1px solid #ddd'>{doc.get('package_type','')}</td></tr>"
        f"<tr><td style='padding:8px;border:1px solid #ddd;font-weight:bold'>Name</td><td style='padding:8px;border:1px solid #ddd'>{doc.get('name','')}</td></tr>"
        f"<tr><td style='padding:8px;border:1px solid #ddd;font-weight:bold'>Email</td><td style='padding:8px;border:1px solid #ddd'>{doc.get('email','')}</td></tr>"
        f"<tr><td style='padding:8px;border:1px solid #ddd;font-weight:bold'>Phone</td><td style='padding:8px;border:1px solid #ddd'>{doc.get('phone','')}</td></tr>"
        f"<tr><td style='padding:8px;border:1px solid #ddd;font-weight:bold'>Destination</td><td style='padding:8px;border:1px solid #ddd'>{doc.get('destination','')}</td></tr>"
        f"<tr><td style='padding:8px;border:1px solid #ddd;font-weight:bold'>Check-in</td><td style='padding:8px;border:1px solid #ddd'>{doc.get('check_in_date','')}</td></tr>"
        f"<tr><td style='padding:8px;border:1px solid #ddd;font-weight:bold'>Check-out</td><td style='padding:8px;border:1px solid #ddd'>{doc.get('check_out_date','')}</td></tr>"
        f"<tr><td style='padding:8px;border:1px solid #ddd;font-weight:bold'>Adults</td><td style='padding:8px;border:1px solid #ddd'>{doc.get('number_of_adults','')}</td></tr>"
        f"<tr><td style='padding:8px;border:1px solid #ddd;font-weight:bold'>Children</td><td style='padding:8px;border:1px solid #ddd'>{doc.get('number_of_children','')}</td></tr>"
        f"<tr><td style='padding:8px;border:1px solid #ddd;font-weight:bold'>Requirements</td><td style='padding:8px;border:1px solid #ddd'>{doc.get('requirements','')}</td></tr>"
        f"</table>"
    ))
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
    total_content = await db.content.count_documents({"is_deleted": {"$ne": True}})
    flight_inq = await db.inquiries.count_documents({"type": "flight"})
    hotel_inq = await db.inquiries.count_documents({"type": "hotel"})
    contact_inq = await db.inquiries.count_documents({"type": "contact"})
    package_inq = await db.inquiries.count_documents({"type": "package"})
    return {
        "total_inquiries": total_inquiries,
        "total_subscriptions": total_subs,
        "total_images": total_images,
        "total_content": total_content,
        "by_type": {
            "flight": flight_inq,
            "hotel": hotel_inq,
            "contact": contact_inq,
            "package": package_inq
        }
    }

# --- Admin: Content CRUD ---
@api_router.get("/admin/content")
async def admin_get_content(section: str = Query(None), authorization: str = Header(None)):
    verify_admin(authorization)
    query = {"is_deleted": {"$ne": True}}
    if section:
        query["section"] = section
    items = await db.content.find(query, {"_id": 0}).sort("sort_order", 1).to_list(500)
    return {"items": items}

@api_router.post("/admin/content")
async def admin_create_content(item: ContentItem, authorization: str = Header(None)):
    verify_admin(authorization)
    doc = {
        "id": str(uuid.uuid4()),
        "section": item.section,
        "data": item.data,
        "sort_order": item.sort_order,
        "is_deleted": False,
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat()
    }
    await db.content.insert_one(doc)
    doc.pop("_id", None)
    return {"status": "success", "item": doc}

@api_router.put("/admin/content/{item_id}")
async def admin_update_content(item_id: str, update: ContentUpdateRequest, authorization: str = Header(None)):
    verify_admin(authorization)
    set_fields = {"updated_at": datetime.now(timezone.utc).isoformat()}
    if update.data is not None:
        set_fields["data"] = update.data
    if update.sort_order is not None:
        set_fields["sort_order"] = update.sort_order
    result = await db.content.update_one({"id": item_id, "is_deleted": {"$ne": True}}, {"$set": set_fields})
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Content item not found")
    return {"status": "success", "message": "Content updated"}

@api_router.delete("/admin/content/{item_id}")
async def admin_delete_content(item_id: str, authorization: str = Header(None)):
    verify_admin(authorization)
    result = await db.content.update_one({"id": item_id}, {"$set": {"is_deleted": True}})
    if result.modified_count == 0:
        raise HTTPException(status_code=404, detail="Content item not found")
    return {"status": "success", "message": "Content deleted"}

@api_router.post("/admin/content/seed/{section}")
async def admin_seed_content(section: str, authorization: str = Header(None)):
    verify_admin(authorization)
    existing = await db.content.count_documents({"section": section, "is_deleted": {"$ne": True}})
    if existing > 0:
        return {"status": "skipped", "message": f"Section '{section}' already has {existing} items"}
    return {"status": "success", "message": "Use the admin panel to add content items"}


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
