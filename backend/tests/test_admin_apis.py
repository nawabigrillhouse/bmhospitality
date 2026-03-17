"""
Backend API Tests for BM Hospitality Admin Panel
Tests for: Admin login, stats, inquiries, subscriptions, image upload/delete
"""
import pytest
import requests
import os

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# Admin credentials
ADMIN_PASSWORD = "Nawabi@2025"
WRONG_PASSWORD = "wrongpassword123"

class TestAdminLogin:
    """Tests for /api/admin/login endpoint"""
    
    def test_admin_login_success(self):
        """Test admin login with correct password"""
        payload = {"password": ADMIN_PASSWORD}
        response = requests.post(f"{BASE_URL}/api/admin/login", json=payload)
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        assert data["status"] == "success"
        assert "token" in data
        assert len(data["token"]) > 0
        print(f"✓ Admin login successful, token received (length: {len(data['token'])})")
        return data["token"]

    def test_admin_login_wrong_password(self):
        """Test admin login with wrong password"""
        payload = {"password": WRONG_PASSWORD}
        response = requests.post(f"{BASE_URL}/api/admin/login", json=payload)
        assert response.status_code == 401, f"Expected 401, got {response.status_code}: {response.text}"
        data = response.json()
        assert "detail" in data
        print("✓ Admin login rejects wrong password with 401")

    def test_admin_login_empty_password(self):
        """Test admin login with empty password"""
        payload = {"password": ""}
        response = requests.post(f"{BASE_URL}/api/admin/login", json=payload)
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("✓ Admin login rejects empty password")

    def test_admin_login_missing_password(self):
        """Test admin login with missing password field"""
        payload = {}
        response = requests.post(f"{BASE_URL}/api/admin/login", json=payload)
        assert response.status_code == 422, f"Expected 422 for validation error, got {response.status_code}"
        print("✓ Admin login validates required password field")


class TestAdminStatsWithAuth:
    """Tests for /api/admin/stats endpoint (requires auth)"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Get auth token before each test"""
        response = requests.post(f"{BASE_URL}/api/admin/login", json={"password": ADMIN_PASSWORD})
        self.token = response.json().get("token")
        assert self.token, "Failed to get auth token"
    
    def test_admin_stats_success(self):
        """Test getting admin stats with valid token"""
        response = requests.get(
            f"{BASE_URL}/api/admin/stats",
            headers={"Authorization": f"Bearer {self.token}"}
        )
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        
        # Validate response structure
        assert "total_inquiries" in data
        assert "total_subscriptions" in data
        assert "total_images" in data
        assert "by_type" in data
        
        # Validate by_type structure
        assert "flight" in data["by_type"]
        assert "hotel" in data["by_type"]
        assert "contact" in data["by_type"]
        assert "package" in data["by_type"]
        
        # Validate values are integers
        assert isinstance(data["total_inquiries"], int)
        assert isinstance(data["total_subscriptions"], int)
        assert isinstance(data["total_images"], int)
        
        print(f"✓ Admin stats: {data['total_inquiries']} inquiries, {data['total_subscriptions']} subs, {data['total_images']} images")

    def test_admin_stats_no_auth(self):
        """Test getting admin stats without auth token"""
        response = requests.get(f"{BASE_URL}/api/admin/stats")
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("✓ Admin stats rejects unauthenticated requests")

    def test_admin_stats_invalid_token(self):
        """Test getting admin stats with invalid token"""
        response = requests.get(
            f"{BASE_URL}/api/admin/stats",
            headers={"Authorization": "Bearer invalid_token_12345"}
        )
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("✓ Admin stats rejects invalid token")


class TestAdminInquiries:
    """Tests for /api/admin/inquiries endpoint"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Get auth token before each test"""
        response = requests.post(f"{BASE_URL}/api/admin/login", json={"password": ADMIN_PASSWORD})
        self.token = response.json().get("token")
        assert self.token, "Failed to get auth token"
    
    def test_get_inquiries_success(self):
        """Test getting all inquiries with valid token"""
        response = requests.get(
            f"{BASE_URL}/api/admin/inquiries",
            headers={"Authorization": f"Bearer {self.token}"}
        )
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        
        assert "inquiries" in data
        assert isinstance(data["inquiries"], list)
        print(f"✓ Got {len(data['inquiries'])} inquiries from admin endpoint")

    def test_get_inquiries_no_auth(self):
        """Test getting inquiries without auth"""
        response = requests.get(f"{BASE_URL}/api/admin/inquiries")
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("✓ Admin inquiries rejects unauthenticated requests")


class TestAdminSubscriptions:
    """Tests for /api/admin/subscriptions endpoint"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Get auth token before each test"""
        response = requests.post(f"{BASE_URL}/api/admin/login", json={"password": ADMIN_PASSWORD})
        self.token = response.json().get("token")
        assert self.token, "Failed to get auth token"
    
    def test_get_subscriptions_success(self):
        """Test getting all subscriptions with valid token"""
        response = requests.get(
            f"{BASE_URL}/api/admin/subscriptions",
            headers={"Authorization": f"Bearer {self.token}"}
        )
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        
        assert "subscriptions" in data
        assert isinstance(data["subscriptions"], list)
        print(f"✓ Got {len(data['subscriptions'])} subscriptions from admin endpoint")

    def test_get_subscriptions_no_auth(self):
        """Test getting subscriptions without auth"""
        response = requests.get(f"{BASE_URL}/api/admin/subscriptions")
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("✓ Admin subscriptions rejects unauthenticated requests")


class TestAdminImages:
    """Tests for /api/admin/images and /api/admin/upload endpoints"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Get auth token before each test"""
        response = requests.post(f"{BASE_URL}/api/admin/login", json={"password": ADMIN_PASSWORD})
        self.token = response.json().get("token")
        assert self.token, "Failed to get auth token"
    
    def test_get_images_all(self):
        """Test getting all images with valid token"""
        response = requests.get(
            f"{BASE_URL}/api/admin/images",
            headers={"Authorization": f"Bearer {self.token}"}
        )
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        
        assert "images" in data
        assert isinstance(data["images"], list)
        print(f"✓ Got {len(data['images'])} images from admin endpoint")

    def test_get_images_by_section(self):
        """Test getting images filtered by section"""
        response = requests.get(
            f"{BASE_URL}/api/admin/images?section=hero",
            headers={"Authorization": f"Bearer {self.token}"}
        )
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        assert "images" in data
        print(f"✓ Got {len(data['images'])} images for 'hero' section")

    def test_get_images_no_auth(self):
        """Test getting images without auth"""
        response = requests.get(f"{BASE_URL}/api/admin/images")
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("✓ Admin images rejects unauthenticated requests")

    def test_upload_image_success(self):
        """Test image upload with valid file"""
        # Create a simple test image (1x1 red pixel PNG)
        import base64
        png_base64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg=="
        image_data = base64.b64decode(png_base64)
        
        files = {"file": ("test_image.png", image_data, "image/png")}
        
        response = requests.post(
            f"{BASE_URL}/api/admin/upload?section=general&label=TEST_Image_Upload",
            headers={"Authorization": f"Bearer {self.token}"},
            files=files
        )
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        
        assert data["status"] == "success"
        assert "file" in data
        assert "id" in data["file"]
        assert "storage_path" in data["file"]
        assert data["file"]["section"] == "general"
        assert "TEST_Image_Upload" in data["file"]["label"]
        
        print(f"✓ Image uploaded successfully, ID: {data['file']['id']}")
        return data["file"]["id"]

    def test_upload_image_different_sections(self):
        """Test image upload to different sections"""
        import base64
        png_base64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg=="
        image_data = base64.b64decode(png_base64)
        
        sections = ["hero", "domestic-packages", "international-packages", "goa-hotels", "gallery"]
        
        for section in sections:
            files = {"file": ("test.png", image_data, "image/png")}
            response = requests.post(
                f"{BASE_URL}/api/admin/upload?section={section}&label=TEST_{section}_Image",
                headers={"Authorization": f"Bearer {self.token}"},
                files=files
            )
            assert response.status_code == 200, f"Failed to upload to {section}: {response.text}"
            data = response.json()
            assert data["file"]["section"] == section
            print(f"✓ Image uploaded to '{section}' section")

    def test_upload_no_auth(self):
        """Test image upload without auth"""
        import base64
        png_base64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg=="
        image_data = base64.b64decode(png_base64)
        files = {"file": ("test.png", image_data, "image/png")}
        
        response = requests.post(
            f"{BASE_URL}/api/admin/upload?section=general&label=test",
            files=files
        )
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("✓ Admin upload rejects unauthenticated requests")


class TestAdminImageDelete:
    """Tests for DELETE /api/admin/images/{id} endpoint"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Get auth token and upload a test image"""
        response = requests.post(f"{BASE_URL}/api/admin/login", json={"password": ADMIN_PASSWORD})
        self.token = response.json().get("token")
        assert self.token, "Failed to get auth token"
        
        # Upload a test image to delete
        import base64
        png_base64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg=="
        image_data = base64.b64decode(png_base64)
        files = {"file": ("delete_test.png", image_data, "image/png")}
        
        upload_response = requests.post(
            f"{BASE_URL}/api/admin/upload?section=general&label=TEST_Delete_Me",
            headers={"Authorization": f"Bearer {self.token}"},
            files=files
        )
        if upload_response.status_code == 200:
            self.image_id = upload_response.json()["file"]["id"]
        else:
            self.image_id = None
    
    def test_delete_image_success(self):
        """Test deleting an image with valid token"""
        if not self.image_id:
            pytest.skip("No image to delete (upload may have failed)")
        
        response = requests.delete(
            f"{BASE_URL}/api/admin/images/{self.image_id}",
            headers={"Authorization": f"Bearer {self.token}"}
        )
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        assert data["status"] == "success"
        print(f"✓ Image {self.image_id} deleted successfully")
        
        # Verify image is no longer returned in list (soft delete)
        list_response = requests.get(
            f"{BASE_URL}/api/admin/images",
            headers={"Authorization": f"Bearer {self.token}"}
        )
        images = list_response.json()["images"]
        image_ids = [img["id"] for img in images]
        assert self.image_id not in image_ids, "Deleted image still appears in list"
        print("✓ Verified deleted image no longer appears in list")

    def test_delete_image_not_found(self):
        """Test deleting a non-existent image"""
        response = requests.delete(
            f"{BASE_URL}/api/admin/images/non_existent_id_12345",
            headers={"Authorization": f"Bearer {self.token}"}
        )
        assert response.status_code == 404, f"Expected 404, got {response.status_code}"
        print("✓ Delete returns 404 for non-existent image")

    def test_delete_image_no_auth(self):
        """Test deleting an image without auth"""
        response = requests.delete(f"{BASE_URL}/api/admin/images/some_id")
        assert response.status_code == 401, f"Expected 401, got {response.status_code}"
        print("✓ Delete rejects unauthenticated requests")


class TestFileServing:
    """Tests for GET /api/files/{path} endpoint"""
    
    @pytest.fixture(autouse=True)
    def setup(self):
        """Get auth token and upload a test image"""
        response = requests.post(f"{BASE_URL}/api/admin/login", json={"password": ADMIN_PASSWORD})
        self.token = response.json().get("token")
        assert self.token, "Failed to get auth token"
        
        # Upload a test image
        import base64
        png_base64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg=="
        self.image_data = base64.b64decode(png_base64)
        files = {"file": ("serve_test.png", self.image_data, "image/png")}
        
        upload_response = requests.post(
            f"{BASE_URL}/api/admin/upload?section=general&label=TEST_Serve_Test",
            headers={"Authorization": f"Bearer {self.token}"},
            files=files
        )
        if upload_response.status_code == 200:
            self.storage_path = upload_response.json()["file"]["storage_path"]
        else:
            self.storage_path = None
    
    def test_serve_file_success(self):
        """Test serving an uploaded file"""
        if not self.storage_path:
            pytest.skip("No file to serve (upload may have failed)")
        
        response = requests.get(f"{BASE_URL}/api/files/{self.storage_path}")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}"
        assert response.headers.get("Content-Type") == "image/png"
        assert len(response.content) > 0
        print(f"✓ File served successfully, size: {len(response.content)} bytes")

    def test_serve_file_not_found(self):
        """Test serving a non-existent file"""
        response = requests.get(f"{BASE_URL}/api/files/non_existent_path/image.png")
        assert response.status_code == 404, f"Expected 404, got {response.status_code}"
        print("✓ File serving returns 404 for non-existent file")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
