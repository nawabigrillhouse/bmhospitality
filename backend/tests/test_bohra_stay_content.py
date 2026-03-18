"""
Test Bohra Stay Content Management APIs for BM Hospitality Admin Panel
Tests: bohra-stay-types and bohra-stay-options sections in content management
"""

import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')
ADMIN_PASSWORD = "Nawabi@2025"

# Valid stay type keys for dropdown options
STAY_TYPE_KEYS = ['privateVillaCommonPool', 'privateVillaPrivatePool', 'apartments']


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


class TestPublicBohraStayEndpoints:
    """Test public content retrieval endpoints for Bohra Stay sections"""
    
    def test_get_bohra_stay_types_public(self):
        """GET /api/content/bohra-stay-types should return items array"""
        response = requests.get(f"{BASE_URL}/api/content/bohra-stay-types")
        assert response.status_code == 200
        data = response.json()
        assert "items" in data
        assert isinstance(data["items"], list)
        print(f"Public bohra-stay-types returned {len(data['items'])} items")
    
    def test_get_bohra_stay_options_public(self):
        """GET /api/content/bohra-stay-options should return items array"""
        response = requests.get(f"{BASE_URL}/api/content/bohra-stay-options")
        assert response.status_code == 200
        data = response.json()
        assert "items" in data
        assert isinstance(data["items"], list)
        print(f"Public bohra-stay-options returned {len(data['items'])} items")


class TestAdminBohraStayAuthentication:
    """Test that admin endpoints require authentication for Bohra Stay sections"""
    
    def test_admin_post_bohra_stay_type_no_auth(self):
        """POST /api/admin/content with bohra-stay-types should fail without auth"""
        response = requests.post(f"{BASE_URL}/api/admin/content", json={
            "section": "bohra-stay-types",
            "data": {"key": "privateVillaCommonPool", "name": "Test"},
            "sort_order": 0
        })
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
    
    def test_admin_post_bohra_stay_option_no_auth(self):
        """POST /api/admin/content with bohra-stay-options should fail without auth"""
        response = requests.post(f"{BASE_URL}/api/admin/content", json={
            "section": "bohra-stay-options",
            "data": {"stayType": "privateVillaCommonPool", "bhk": "2 BHK"},
            "sort_order": 0
        })
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"


class TestCreateBohraStayType:
    """Test creating bohra-stay-types content items"""
    
    def test_create_bohra_stay_type_private_villa_common(self, auth_headers):
        """POST /api/admin/content - Create a stay type for Private Villa with Common Pool"""
        payload = {
            "section": "bohra-stay-types",
            "data": {
                "key": "privateVillaCommonPool",
                "name": "TEST_Private Villa with Common Pool",
                "subtitle": "Luxurious villa with shared pool amenities",
                "tag": "Best for Families"
            },
            "sort_order": 0
        }
        response = requests.post(f"{BASE_URL}/api/admin/content", json=payload, headers=auth_headers)
        assert response.status_code == 200, f"Create failed: {response.text}"
        data = response.json()
        assert data["status"] == "success"
        assert "item" in data
        item = data["item"]
        assert "id" in item
        assert item["section"] == "bohra-stay-types"
        assert item["data"]["key"] == "privateVillaCommonPool"
        assert item["data"]["name"] == "TEST_Private Villa with Common Pool"
        assert item["data"]["subtitle"] == "Luxurious villa with shared pool amenities"
        assert item["data"]["tag"] == "Best for Families"
        print(f"Created bohra-stay-type with id: {item['id']}")
        return item["id"]
    
    def test_create_bohra_stay_type_private_pool(self, auth_headers):
        """POST /api/admin/content - Create a stay type for Private Villa with Private Pool"""
        payload = {
            "section": "bohra-stay-types",
            "data": {
                "key": "privateVillaPrivatePool",
                "name": "TEST_Private Villa with Private Pool",
                "subtitle": "Exclusive villa with dedicated private pool",
                "tag": "Premium Experience"
            },
            "sort_order": 1
        }
        response = requests.post(f"{BASE_URL}/api/admin/content", json=payload, headers=auth_headers)
        assert response.status_code == 200, f"Create failed: {response.text}"
        data = response.json()
        assert data["status"] == "success"
        item = data["item"]
        assert item["data"]["key"] == "privateVillaPrivatePool"
        print(f"Created bohra-stay-type with id: {item['id']}")
        return item["id"]
    
    def test_create_bohra_stay_type_apartments(self, auth_headers):
        """POST /api/admin/content - Create a stay type for Apartments"""
        payload = {
            "section": "bohra-stay-types",
            "data": {
                "key": "apartments",
                "name": "TEST_Apartments with Common Pool",
                "subtitle": "Comfortable apartments with shared pool access",
                "tag": "Budget Friendly"
            },
            "sort_order": 2
        }
        response = requests.post(f"{BASE_URL}/api/admin/content", json=payload, headers=auth_headers)
        assert response.status_code == 200, f"Create failed: {response.text}"
        data = response.json()
        assert data["status"] == "success"
        item = data["item"]
        assert item["data"]["key"] == "apartments"
        print(f"Created bohra-stay-type with id: {item['id']}")
        return item["id"]


class TestCreateBohraStayOption:
    """Test creating bohra-stay-options content items"""
    
    def test_create_bohra_stay_option_2bhk(self, auth_headers):
        """POST /api/admin/content - Create a 2 BHK stay option"""
        payload = {
            "section": "bohra-stay-options",
            "data": {
                "stayType": "privateVillaCommonPool",
                "bhk": "TEST_2 BHK",
                "capacity": "4-6 Person",
                "option1": "2BHK Per unit for 4 person",
                "option2": "2BHK Per unit for 4-6 person",
                "price": "18,500",
                "note": "Minimum 3 night stay required",
                "image": "https://example.com/2bhk.jpg"
            },
            "sort_order": 0
        }
        response = requests.post(f"{BASE_URL}/api/admin/content", json=payload, headers=auth_headers)
        assert response.status_code == 200, f"Create failed: {response.text}"
        data = response.json()
        assert data["status"] == "success"
        item = data["item"]
        assert "id" in item
        assert item["section"] == "bohra-stay-options"
        assert item["data"]["stayType"] == "privateVillaCommonPool"
        assert item["data"]["bhk"] == "TEST_2 BHK"
        assert item["data"]["capacity"] == "4-6 Person"
        assert item["data"]["option1"] == "2BHK Per unit for 4 person"
        assert item["data"]["option2"] == "2BHK Per unit for 4-6 person"
        assert item["data"]["price"] == "18,500"
        print(f"Created bohra-stay-option with id: {item['id']}")
        return item["id"]
    
    def test_create_bohra_stay_option_3bhk(self, auth_headers):
        """POST /api/admin/content - Create a 3 BHK stay option"""
        payload = {
            "section": "bohra-stay-options",
            "data": {
                "stayType": "privateVillaPrivatePool",
                "bhk": "TEST_3 BHK",
                "capacity": "6-8 Person",
                "option1": "3BHK Per unit for 6 person",
                "option2": "3BHK Per unit for 6-8 person",
                "price": "25,000",
                "note": "",
                "image": ""
            },
            "sort_order": 1
        }
        response = requests.post(f"{BASE_URL}/api/admin/content", json=payload, headers=auth_headers)
        assert response.status_code == 200, f"Create failed: {response.text}"
        data = response.json()
        assert data["status"] == "success"
        item = data["item"]
        assert item["data"]["stayType"] == "privateVillaPrivatePool"
        assert item["data"]["bhk"] == "TEST_3 BHK"
        assert item["data"]["capacity"] == "6-8 Person"
        print(f"Created bohra-stay-option with id: {item['id']}")
        return item["id"]


class TestBohraStayGetAndFilter:
    """Test admin GET with section filtering for Bohra Stay"""
    
    def test_get_admin_content_bohra_stay_types(self, auth_headers):
        """GET /api/admin/content?section=bohra-stay-types - Filter by section"""
        response = requests.get(f"{BASE_URL}/api/admin/content?section=bohra-stay-types", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert "items" in data
        # All items should be from bohra-stay-types section
        for item in data["items"]:
            assert item["section"] == "bohra-stay-types"
        print(f"Admin GET bohra-stay-types: {len(data['items'])} items")
    
    def test_get_admin_content_bohra_stay_options(self, auth_headers):
        """GET /api/admin/content?section=bohra-stay-options - Filter by section"""
        response = requests.get(f"{BASE_URL}/api/admin/content?section=bohra-stay-options", headers=auth_headers)
        assert response.status_code == 200
        data = response.json()
        assert "items" in data
        # All items should be from bohra-stay-options section
        for item in data["items"]:
            assert item["section"] == "bohra-stay-options"
        print(f"Admin GET bohra-stay-options: {len(data['items'])} items")


class TestBohraStayCRUDFullCycle:
    """Test full CRUD cycle for Bohra Stay items"""
    
    def test_stay_type_crud_full_cycle(self, auth_headers):
        """Test full CRUD cycle: Create -> GET -> UPDATE -> GET -> DELETE -> Verify for stay type"""
        
        # CREATE
        create_payload = {
            "section": "bohra-stay-types",
            "data": {
                "key": "apartments",
                "name": "TEST_CRUD_Apartments",
                "subtitle": "CRUD test apartments",
                "tag": "Test Tag"
            },
            "sort_order": 99
        }
        create_response = requests.post(f"{BASE_URL}/api/admin/content", json=create_payload, headers=auth_headers)
        assert create_response.status_code == 200
        item_id = create_response.json()["item"]["id"]
        print(f"Created stay type item: {item_id}")
        
        # GET via public API to verify persistence
        get_response = requests.get(f"{BASE_URL}/api/content/bohra-stay-types")
        assert get_response.status_code == 200
        items = get_response.json()["items"]
        created_item = next((i for i in items if i.get("id") == item_id), None)
        assert created_item is not None, "Created item not found in public API"
        assert created_item["data"]["name"] == "TEST_CRUD_Apartments"
        print("Verified item exists in public API")
        
        # UPDATE
        update_payload = {
            "data": {
                "key": "apartments",
                "name": "TEST_CRUD_Apartments Updated",
                "subtitle": "CRUD test apartments updated",
                "tag": "Updated Tag"
            }
        }
        update_response = requests.put(f"{BASE_URL}/api/admin/content/{item_id}", json=update_payload, headers=auth_headers)
        assert update_response.status_code == 200
        assert update_response.json()["status"] == "success"
        print("Updated item successfully")
        
        # GET to verify update persisted
        get_updated = requests.get(f"{BASE_URL}/api/content/bohra-stay-types")
        assert get_updated.status_code == 200
        updated_items = get_updated.json()["items"]
        updated_item = next((i for i in updated_items if i.get("id") == item_id), None)
        assert updated_item is not None
        assert updated_item["data"]["name"] == "TEST_CRUD_Apartments Updated"
        assert updated_item["data"]["tag"] == "Updated Tag"
        print("Verified update persisted in public API")
        
        # DELETE (soft delete)
        delete_response = requests.delete(f"{BASE_URL}/api/admin/content/{item_id}", headers=auth_headers)
        assert delete_response.status_code == 200
        assert delete_response.json()["status"] == "success"
        print("Deleted item successfully")
        
        # GET to verify item no longer appears
        get_after_delete = requests.get(f"{BASE_URL}/api/content/bohra-stay-types")
        assert get_after_delete.status_code == 200
        after_delete_items = get_after_delete.json()["items"]
        deleted_item = next((i for i in after_delete_items if i.get("id") == item_id), None)
        assert deleted_item is None, "Deleted item still appears in public API"
        print("Verified item removed from public API after delete")
    
    def test_stay_option_crud_full_cycle(self, auth_headers):
        """Test full CRUD cycle for stay option"""
        
        # CREATE
        create_payload = {
            "section": "bohra-stay-options",
            "data": {
                "stayType": "privateVillaCommonPool",
                "bhk": "TEST_CRUD_4 BHK",
                "capacity": "8-10 Person",
                "option1": "4BHK Per unit for 8 person",
                "option2": "4BHK Per unit for 8-10 person",
                "price": "35,000",
                "note": "CRUD test option",
                "image": ""
            },
            "sort_order": 99
        }
        create_response = requests.post(f"{BASE_URL}/api/admin/content", json=create_payload, headers=auth_headers)
        assert create_response.status_code == 200
        item_id = create_response.json()["item"]["id"]
        print(f"Created stay option item: {item_id}")
        
        # GET via public API to verify persistence
        get_response = requests.get(f"{BASE_URL}/api/content/bohra-stay-options")
        assert get_response.status_code == 200
        items = get_response.json()["items"]
        created_item = next((i for i in items if i.get("id") == item_id), None)
        assert created_item is not None, "Created item not found in public API"
        assert created_item["data"]["bhk"] == "TEST_CRUD_4 BHK"
        assert created_item["data"]["stayType"] == "privateVillaCommonPool"
        print("Verified stay option exists in public API")
        
        # UPDATE - change stayType
        update_payload = {
            "data": {
                "stayType": "privateVillaPrivatePool",  # Changed stayType
                "bhk": "TEST_CRUD_4 BHK Updated",
                "capacity": "8-12 Person",
                "option1": "4BHK Per unit for 8 person",
                "option2": "4BHK Per unit for 8-12 person",
                "price": "40,000",
                "note": "Updated CRUD test option",
                "image": ""
            }
        }
        update_response = requests.put(f"{BASE_URL}/api/admin/content/{item_id}", json=update_payload, headers=auth_headers)
        assert update_response.status_code == 200
        assert update_response.json()["status"] == "success"
        print("Updated stay option successfully")
        
        # GET to verify update persisted
        get_updated = requests.get(f"{BASE_URL}/api/content/bohra-stay-options")
        assert get_updated.status_code == 200
        updated_items = get_updated.json()["items"]
        updated_item = next((i for i in updated_items if i.get("id") == item_id), None)
        assert updated_item is not None
        assert updated_item["data"]["bhk"] == "TEST_CRUD_4 BHK Updated"
        assert updated_item["data"]["stayType"] == "privateVillaPrivatePool"
        assert updated_item["data"]["price"] == "40,000"
        print("Verified stay option update persisted in public API")
        
        # DELETE
        delete_response = requests.delete(f"{BASE_URL}/api/admin/content/{item_id}", headers=auth_headers)
        assert delete_response.status_code == 200
        print("Deleted stay option successfully")
        
        # Verify deletion
        get_after_delete = requests.get(f"{BASE_URL}/api/content/bohra-stay-options")
        assert get_after_delete.status_code == 200
        after_delete_items = get_after_delete.json()["items"]
        deleted_item = next((i for i in after_delete_items if i.get("id") == item_id), None)
        assert deleted_item is None, "Deleted item still appears in public API"
        print("Verified stay option removed from public API after delete")


class TestBohraStayCleanup:
    """Cleanup TEST_ prefixed Bohra Stay content items"""
    
    def test_cleanup_bohra_stay_test_content(self, auth_headers):
        """Delete all TEST_ prefixed bohra-stay content items"""
        deleted_count = 0
        
        # Clean up bohra-stay-types
        response1 = requests.get(f"{BASE_URL}/api/admin/content?section=bohra-stay-types", headers=auth_headers)
        if response1.status_code == 200:
            items = response1.json()["items"]
            for item in items:
                data = item.get("data", {})
                name = data.get("name", "")
                if name.startswith("TEST_"):
                    delete_response = requests.delete(
                        f"{BASE_URL}/api/admin/content/{item['id']}",
                        headers=auth_headers
                    )
                    if delete_response.status_code == 200:
                        deleted_count += 1
                        print(f"Deleted test bohra-stay-type: {name}")
        
        # Clean up bohra-stay-options
        response2 = requests.get(f"{BASE_URL}/api/admin/content?section=bohra-stay-options", headers=auth_headers)
        if response2.status_code == 200:
            items = response2.json()["items"]
            for item in items:
                data = item.get("data", {})
                bhk = data.get("bhk", "")
                if bhk.startswith("TEST_"):
                    delete_response = requests.delete(
                        f"{BASE_URL}/api/admin/content/{item['id']}",
                        headers=auth_headers
                    )
                    if delete_response.status_code == 200:
                        deleted_count += 1
                        print(f"Deleted test bohra-stay-option: {bhk}")
        
        print(f"Bohra Stay cleanup completed: {deleted_count} TEST_ items deleted")


if __name__ == "__main__":
    pytest.main([__file__, "-v", "--tb=short"])
