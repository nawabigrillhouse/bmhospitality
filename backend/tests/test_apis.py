"""
Backend API Tests for BM Hospitality Travel Services
Tests for: /api/subscribe, /api/flight-inquiry, /api/hotel-inquiry, /api/contact, /api/inquiry
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

class TestSubscribeAPI:
    """Tests for /api/subscribe endpoint"""
    
    def test_subscribe_success(self):
        """Test newsletter subscription with valid data"""
        payload = {
            "name": "TEST_John Doe",
            "email": "test_john@example.com",
            "phone": "+91 9876543210"
        }
        response = requests.post(f"{BASE_URL}/api/subscribe", json=payload)
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        assert data["status"] == "success"
        assert "message" in data
        print(f"✓ Subscribe API working: {data['message']}")

    def test_subscribe_missing_fields(self):
        """Test subscription with missing required fields"""
        payload = {"email": "test@example.com"}  # missing name and phone
        response = requests.post(f"{BASE_URL}/api/subscribe", json=payload)
        assert response.status_code == 422, f"Expected 422 for validation error, got {response.status_code}"
        print("✓ Subscribe API validates required fields correctly")


class TestFlightInquiryAPI:
    """Tests for /api/flight-inquiry endpoint"""
    
    def test_flight_inquiry_round_trip(self):
        """Test flight inquiry for round trip"""
        payload = {
            "name": "TEST_Jane Smith",
            "email": "test_jane@example.com",
            "phone": "+91 8765432109",
            "from_city": "Mumbai",
            "to_city": "Dubai",
            "departure_date": "2025-03-15",
            "return_date": "2025-03-20",
            "passengers": "2",
            "travel_class": "Economy",
            "trip_type": "Round Trip"
        }
        response = requests.post(f"{BASE_URL}/api/flight-inquiry", json=payload)
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        assert data["status"] == "success"
        assert "message" in data
        print(f"✓ Flight Inquiry API (round trip) working: {data['message']}")

    def test_flight_inquiry_one_way(self):
        """Test flight inquiry for one way trip"""
        payload = {
            "name": "TEST_Bob Wilson",
            "email": "test_bob@example.com",
            "phone": "+91 7654321098",
            "from_city": "Delhi",
            "to_city": "Singapore",
            "departure_date": "2025-04-10",
            "return_date": None,
            "passengers": "1",
            "travel_class": "Business",
            "trip_type": "One Way"
        }
        response = requests.post(f"{BASE_URL}/api/flight-inquiry", json=payload)
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        assert data["status"] == "success"
        print("✓ Flight Inquiry API (one way) working")

    def test_flight_inquiry_missing_fields(self):
        """Test flight inquiry with missing required fields"""
        payload = {
            "name": "TEST_Invalid",
            "email": "test@example.com"
            # Missing required fields
        }
        response = requests.post(f"{BASE_URL}/api/flight-inquiry", json=payload)
        assert response.status_code == 422, f"Expected 422 for validation error, got {response.status_code}"
        print("✓ Flight Inquiry API validates required fields correctly")


class TestHotelInquiryAPI:
    """Tests for /api/hotel-inquiry endpoint"""
    
    def test_hotel_inquiry_success(self):
        """Test hotel inquiry with valid data including email and whatsapp fields"""
        payload = {
            "destination": "Dubai, UAE",
            "check_in_date": "2025-03-20",
            "check_out_date": "2025-03-25",
            "adults": "2",
            "children": "1",
            "child_ages": "5",
            "meal_plan": "Half Board",
            "email": "test_hotel@example.com",
            "whatsapp": "+91 9876543210"
        }
        response = requests.post(f"{BASE_URL}/api/hotel-inquiry", json=payload)
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        assert data["status"] == "success"
        assert "message" in data
        print(f"✓ Hotel Inquiry API working: {data['message']}")
        print("✓ Hotel Inquiry API accepts email and whatsapp fields")

    def test_hotel_inquiry_no_children(self):
        """Test hotel inquiry without children"""
        payload = {
            "destination": "Maldives",
            "check_in_date": "2025-04-01",
            "check_out_date": "2025-04-07",
            "adults": "2",
            "children": "0",
            "child_ages": None,
            "meal_plan": "All Inclusive",
            "email": "test_honeymoon@example.com",
            "whatsapp": "+91 8765432109"
        }
        response = requests.post(f"{BASE_URL}/api/hotel-inquiry", json=payload)
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        assert data["status"] == "success"
        print("✓ Hotel Inquiry API works without children")


class TestContactAPI:
    """Tests for /api/contact endpoint"""
    
    def test_contact_with_phone(self):
        """Test contact form with all fields"""
        payload = {
            "name": "TEST_Contact Person",
            "email": "test_contact@example.com",
            "phone": "+91 6543210987",
            "subject": "General Inquiry",
            "message": "I would like to know more about your services."
        }
        response = requests.post(f"{BASE_URL}/api/contact", json=payload)
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        assert data["status"] == "success"
        assert "message" in data
        print(f"✓ Contact API working: {data['message']}")

    def test_contact_without_phone(self):
        """Test contact form without optional phone field"""
        payload = {
            "name": "TEST_NoPhone Person",
            "email": "test_nophone@example.com",
            "phone": None,
            "subject": "Package Query",
            "message": "What packages do you have for Goa?"
        }
        response = requests.post(f"{BASE_URL}/api/contact", json=payload)
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        assert data["status"] == "success"
        print("✓ Contact API works without phone (optional)")


class TestQuickInquiryAPI:
    """Tests for /api/inquiry endpoint (Quick Travel Inquiry)"""
    
    def test_quick_inquiry_full(self):
        """Test quick inquiry with all fields"""
        payload = {
            "package_type": "Domestic Package (India)",
            "name": "TEST_Quick Inquiry",
            "email": "test_quick@example.com",
            "phone": "+91 5432109876",
            "destination": "Kashmir",
            "check_in_date": "2025-05-01",
            "check_out_date": "2025-05-07",
            "number_of_adults": "4",
            "number_of_children": "2",
            "budget": "100000",
            "requirements": "Need halal food options and family rooms"
        }
        response = requests.post(f"{BASE_URL}/api/inquiry", json=payload)
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        assert data["status"] == "success"
        assert "message" in data
        print(f"✓ Quick Inquiry API working: {data['message']}")

    def test_quick_inquiry_minimal(self):
        """Test quick inquiry with only required fields"""
        payload = {
            "package_type": "International Package",
            "name": "TEST_Minimal Inquiry",
            "email": "test_minimal@example.com",
            "phone": "+91 4321098765",
            "destination": "Thailand",
            "check_in_date": "2025-06-01",
            "check_out_date": "2025-06-10",
            "number_of_adults": "2",
            "number_of_children": "0",
            "budget": None,
            "requirements": None
        }
        response = requests.post(f"{BASE_URL}/api/inquiry", json=payload)
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        assert data["status"] == "success"
        print("✓ Quick Inquiry API works with minimal fields")


class TestHealthCheck:
    """Basic health check tests"""
    
    def test_root_endpoint(self):
        """Test API root endpoint"""
        response = requests.get(f"{BASE_URL}/api/")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        assert data["message"] == "Hello World"
        print("✓ API root endpoint working")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
