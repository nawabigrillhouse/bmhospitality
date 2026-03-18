"""
Test Content Manager APIs for BM Hospitality Admin Panel
Tests: POST/GET/PUT/DELETE /api/admin/content and GET /api/content/{section}
"""

import pytest
import requests
import os
import time

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')
ADMIN_PASSWORD = "Nawabi@2025"


@pytest.fixture(scope="module")
def auth_token():
    """Get admin authentication token"""
    response = requests.post(f"{BASE_URL}/api/admin/login", json={"password": ADMIN_PASSWORD})
    assert response.status_code == 200, f"Login failed: {response.text}"
    data = response.json()
    assert "token" in data, "Token not found in login response"
    return data["token"]


@pytest.fixture
def auth_headers(auth_token):
    """Auth headers for admin endpoints"""
    return {"Authorization": f"Bearer {auth_token}", "Content-Type": "application/json"}


class TestPublicContentEndpoints:
    """Test public content retrieval endpoints - these should work without auth"""
    
    def test_get_domestic_packages_public(self):
        """GET /api/content/domestic-packages should return items array"""
        response = requests.get(f"{BASE_URL}/api/content/domestic-packages")
        assert response.status_code == 200
        data = response.json()
        assert "items" in data
        assert isinstance(data["items"], list)
        print(f"Public domestic-packages returned {len(data['items'])} items")
    
    def test_get_international_packages_public(self):
        """GET /api/content/international-packages should return items array"""
        response = requests.get(f"{BASE_URL}/api/content/international-packages")
        assert response.status_code == 200
        data = response.json()
        assert "items" in data
        assert isinstance(data["items"], list)
        print(f"Public international-packages returned {len(data['items'])} items")
    
    def test_get_goa_packages_public(self):
        """GET /api/content/goa-packages should return items array"""
        response = requests.get(f"{BASE_URL}/api/content/goa-packages")
        assert response.status_code == 200
        data = response.json()
        assert "items" in data
        assert isinstance(data["items"], list)
        print(f"Public goa-packages returned {len(data['items'])} items")
    
    def test_get_testimonials_public(self):
        """GET /api/content/testimonials should return items array"""
        response = requests.get(f"{BASE_URL}/api/content/testimonials")
        assert response.status_code == 200
        data = response.json()
        assert "items" in data
        assert isinstance(data["items"], list)
        print(f"Public testimonials returned {len(data['items'])} items")
    
    def test_get_offers_public(self):
        """GET /api/content/offers should return items array"""
        response = requests.get(f"{BASE_URL}/api/content/offers")
        assert response.status_code == 200
        data = response.json()
        assert "items" in data
        assert isinstance(data["items"], list)
        print(f"Public offers returned {len(data['items'])} items")


class TestAdminContentAuthentication:
    """Test that admin content endpoints require authentication"""
    
    def test_admin_get_content_no_auth(self):
        """GET /api/admin/content should fail without auth"""
        response = requests.get(f"{BASE_URL}/api/admin/content")
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
    
    def test_admin_post_content_no_auth(self):
        """POST /api/admin/content should fail without auth"""
        response = requests.post(f"{BASE_URL}/api/admin/content", json={
            "section": "domestic-packages",
            "data": {"name": "Test"},
            "sort_order": 0
        })
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"


class TestAdminContentCRUD:
    """Test full CRUD operations for admin content management"""
    
    def test_create_domestic_package(self, auth_headers):
        """POST /api/admin/content - Create a domestic package"""
        payload = {
            "section": "domestic-packages",
            "data": {
                "name": "TEST_Kerala Paradise",
                "destination": "Kerala, India",
                "duration": "5 Days / 4 Nights",
                "description": "Explore the backwaters, beaches, and hill stations of God's Own Country",
                "highlights": ["Houseboat stay", "Spice plantation tour", "Kathakali show"],
                "image": "https://example.com/kerala.jpg"
            },
            "sort_order": 1
        }
        response = requests.post(f"{BASE_URL}/api/admin/content", json=payload, headers=auth_headers)
        assert response.status_code == 200, f"Create failed: {response.text}"
        data = response.json()
        assert data["status"] == "success"
        assert "item" in data
        item = data["item"]
        assert "id" in item
        assert item["section"] == "domestic-packages"
        assert item["data"]["name"] == "TEST_Kerala Paradise"
        assert item["data"]["destination"] == "Kerala, India"
        assert item["data"]["highlights"] == ["Houseboat stay", "Spice plantation tour", "Kathakali show"]
        print(f"Created domestic package with id: {item['id']}")
        return item["id"]
    
    def test_create_testimonial(self, auth_headers):
        """POST /api/admin/content - Create a testimonial"""
        payload = {
            "section": "testimonials",
            "data": {
                "name": "TEST_John Doe",
                "location": "Mumbai, India",
                "rating": 5,
                "comment": "Amazing trip to Goa! The service was top-notch.",
                "package": "Goa Beach Getaway",
                "image": "https://example.com/john.jpg"
            },
            "sort_order": 0
        }
        response = requests.post(f"{BASE_URL}/api/admin/content", json=payload, headers=auth_headers)
        assert response.status_code == 200, f"Create failed: {response.text}"
        data = response.json()
        assert data["status"] == "success"
        item = data["item"]
        assert item["data"]["name"] == "TEST_John Doe"
        assert item["data"]["rating"] == 5
        print(f"Created testimonial with id: {item['id']}")
        return item["id"]
    
    def test_create_offer(self, auth_headers):
        """POST /api/admin/content - Create an offer"""
        payload = {
            "section": "offers",
            "data": {
                "title": "TEST_Summer Special",
                "description": "Book any international package and get complimentary travel insurance",
                "discount": "Free Insurance",
                "validTill": "August 31, 2025",
                "category": "International Packages",
                "image": "https://example.com/offer.jpg"
            },
            "sort_order": 0
        }
        response = requests.post(f"{BASE_URL}/api/admin/content", json=payload, headers=auth_headers)
        assert response.status_code == 200, f"Create failed: {response.text}"
        data = response.json()
        assert data["status"] == "success"
        item = data["item"]
        assert item["data"]["title"] == "TEST_Summer Special"
        assert item["data"]["discount"] == "Free Insurance"
        print(f"Created offer with id: {item['id']}")
        return item["id"]


class TestAdminContentGetAndFilter:
    """Test admin GET with section filtering"""
    
    def test_get_all_admin_content(self, auth_headers):
        """GET /api/admin/content - Get all content items"""
        response = requests.get(f"{BASE_URL}/api/admin/content", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert "items" in data
        print(f"Admin GET all content: {len(data['items'])} items")
    
    def test_get_admin_content_by_section(self, auth_headers):
        """GET /api/admin/content?section=domestic-packages - Filter by section"""
        response = requests.get(f"{BASE_URL}/api/admin/content?section=domestic-packages", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert "items" in data
        # All items should be from domestic-packages section
        for item in data["items"]:
            assert item["section"] == "domestic-packages"
        print(f"Admin GET domestic-packages: {len(data['items'])} items")


class TestContentUpdateAndDelete:
    """Test UPDATE and DELETE operations"""
    
    def test_content_crud_full_cycle(self, auth_headers):
        """Test full CRUD cycle: Create -> GET -> UPDATE -> GET -> DELETE -> Verify"""
        
        # CREATE
        create_payload = {
            "section": "international-packages",
            "data": {
                "name": "TEST_Paris Romance",
                "destination": "Paris, France",
                "duration": "7 Days / 6 Nights",
                "description": "Romantic getaway in the City of Love",
                "highlights": ["Eiffel Tower", "Seine River Cruise", "Louvre Museum"]
            },
            "sort_order": 0
        }
        create_response = requests.post(f"{BASE_URL}/api/admin/content", json=create_payload, headers=auth_headers)
        assert create_response.status_code == 200
        item_id = create_response.json()["item"]["id"]
        print(f"Created item: {item_id}")
        
        # GET via public API to verify persistence
        get_response = requests.get(f"{BASE_URL}/api/content/international-packages")
        assert get_response.status_code == 200
        items = get_response.json()["items"]
        created_item = next((i for i in items if i.get("id") == item_id), None)
        assert created_item is not None, "Created item not found in public API"
        assert created_item["data"]["name"] == "TEST_Paris Romance"
        print("Verified item exists in public API")
        
        # UPDATE
        update_payload = {
            "data": {
                "name": "TEST_Paris Romance Updated",
                "destination": "Paris, France",
                "duration": "8 Days / 7 Nights",
                "description": "Updated romantic getaway in the City of Love",
                "highlights": ["Eiffel Tower", "Seine River Cruise", "Louvre Museum", "Versailles Palace"]
            }
        }
        update_response = requests.put(f"{BASE_URL}/api/admin/content/{item_id}", json=update_payload, headers=auth_headers)
        assert update_response.status_code == 200
        assert update_response.json()["status"] == "success"
        print("Updated item successfully")
        
        # GET to verify update persisted
        get_updated = requests.get(f"{BASE_URL}/api/content/international-packages")
        assert get_updated.status_code == 200
        updated_items = get_updated.json()["items"]
        updated_item = next((i for i in updated_items if i.get("id") == item_id), None)
        assert updated_item is not None
        assert updated_item["data"]["name"] == "TEST_Paris Romance Updated"
        assert updated_item["data"]["duration"] == "8 Days / 7 Nights"
        assert "Versailles Palace" in updated_item["data"]["highlights"]
        print("Verified update persisted in public API")
        
        # DELETE (soft delete)
        delete_response = requests.delete(f"{BASE_URL}/api/admin/content/{item_id}", headers=auth_headers)
        assert delete_response.status_code == 200
        assert delete_response.json()["status"] == "success"
        print("Deleted item successfully")
        
        # GET to verify item no longer appears
        get_after_delete = requests.get(f"{BASE_URL}/api/content/international-packages")
        assert get_after_delete.status_code == 200
        after_delete_items = get_after_delete.json()["items"]
        deleted_item = next((i for i in after_delete_items if i.get("id") == item_id), None)
        assert deleted_item is None, "Deleted item still appears in public API"
        print("Verified item removed from public API after delete")


class TestContentEdgeCases:
    """Test edge cases and error handling"""
    
    def test_update_nonexistent_content(self, auth_headers):
        """PUT /api/admin/content/{invalid_id} should return 404"""
        response = requests.put(
            f"{BASE_URL}/api/admin/content/nonexistent-id-12345",
            json={"data": {"name": "Test"}},
            headers=auth_headers
        )
        assert response.status_code == 404
    
    def test_delete_nonexistent_content(self, auth_headers):
        """DELETE /api/admin/content/{invalid_id} should return 404"""
        response = requests.delete(
            f"{BASE_URL}/api/admin/content/nonexistent-id-12345",
            headers=auth_headers
        )
        assert response.status_code == 404
    
    def test_create_goa_package(self, auth_headers):
        """Create Goa hotel/resort content item"""
        payload = {
            "section": "goa-packages",
            "data": {
                "name": "TEST_Beach Resort",
                "location": "South Goa - Palolem",
                "description": "Luxury beachfront resort with private beach access",
                "amenities": ["Swimming Pool", "Spa", "Beach Access", "Restaurant"],
                "priceStart": "5,500"
            },
            "sort_order": 0
        }
        response = requests.post(f"{BASE_URL}/api/admin/content", json=payload, headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "success"
        item = data["item"]
        assert item["data"]["name"] == "TEST_Beach Resort"
        print(f"Created goa-package with id: {item['id']}")
        
        # Verify in public API
        public_response = requests.get(f"{BASE_URL}/api/content/goa-packages")
        assert public_response.status_code == 200
        items = public_response.json()["items"]
        created = next((i for i in items if i.get("id") == item["id"]), None)
        assert created is not None
        print("Verified goa-package in public API")
        
        # Cleanup - delete the test item
        delete_response = requests.delete(f"{BASE_URL}/api/admin/content/{item['id']}", headers=auth_headers)
        assert delete_response.status_code == 200


class TestContentCleanup:
    """Cleanup TEST_ prefixed content items"""
    
    def test_cleanup_test_content(self, auth_headers):
        """Delete all TEST_ prefixed content items"""
        # Get all content
        response = requests.get(f"{BASE_URL}/api/admin/content", headers=auth_headers)
        assert response.status_code == 200
        items = response.json()["items"]
        
        deleted_count = 0
        for item in items:
            data = item.get("data", {})
            name = data.get("name", "") or data.get("title", "")
            if name.startswith("TEST_"):
                delete_response = requests.delete(
                    f"{BASE_URL}/api/admin/content/{item['id']}",
                    headers=auth_headers
                )
                if delete_response.status_code == 200:
                    deleted_count += 1
                    print(f"Deleted test content: {name}")
        
        print(f"Cleanup completed: {deleted_count} TEST_ items deleted")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
