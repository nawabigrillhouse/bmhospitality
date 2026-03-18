"""
Backend API Tests for BM Hospitality Dynamic Image System
Tests for: Public image API endpoints, admin upload, file serving, dynamic image integration
"""
import pytest
import requests
import os
import base64
import time

BASE_URL = os.environ.get('REACT_APP_BACKEND_URL', '').rstrip('/')

# Admin credentials
ADMIN_PASSWORD = "Nawabi@2025"

# Test image (1x1 red PNG)
TEST_PNG_BASE64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8DwHwAFBQIAX8jx0gAAAABJRU5ErkJggg=="

# Valid sections that the frontend uses
VALID_SECTIONS = ["hero", "gallery", "bohra-stays", "domestic-packages", "international-packages", "goa-hotels", "offers"]


@pytest.fixture(scope="module")
def admin_token():
    """Get admin auth token once for all tests in this module"""
    response = requests.post(f"{BASE_URL}/api/admin/login", json={"password": ADMIN_PASSWORD})
    assert response.status_code == 200, f"Failed to login: {response.text}"
    return response.json()["token"]


class TestAdminLogin:
    """Module: Admin authentication tests"""
    
    def test_admin_login_returns_token(self):
        """POST /api/admin/login with correct password returns token"""
        response = requests.post(f"{BASE_URL}/api/admin/login", json={"password": ADMIN_PASSWORD})
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        assert data["status"] == "success"
        assert "token" in data
        assert len(data["token"]) > 0
        print(f"✓ Admin login successful, token length: {len(data['token'])}")


class TestPublicImagesAPI:
    """Module: Public image API tests - GET /api/images/{section}"""
    
    @pytest.mark.parametrize("section", VALID_SECTIONS)
    def test_get_images_by_section(self, section):
        """GET /api/images/{section} returns images array for each valid section"""
        response = requests.get(f"{BASE_URL}/api/images/{section}")
        assert response.status_code == 200, f"Expected 200 for section '{section}', got {response.status_code}: {response.text}"
        data = response.json()
        assert "images" in data, f"Response missing 'images' key for section '{section}'"
        assert isinstance(data["images"], list), f"'images' should be a list for section '{section}'"
        print(f"✓ GET /api/images/{section}: {len(data['images'])} images")
    
    def test_images_have_required_fields(self, admin_token):
        """Images returned should have required fields (storage_path, section, etc.)"""
        # First upload a test image
        image_data = base64.b64decode(TEST_PNG_BASE64)
        files = {"file": ("test_fields.png", image_data, "image/png")}
        upload_res = requests.post(
            f"{BASE_URL}/api/admin/upload?section=hero&label=TEST_Fields_Check",
            headers={"Authorization": f"Bearer {admin_token}"},
            files=files
        )
        assert upload_res.status_code == 200, f"Upload failed: {upload_res.text}"
        
        # Now check the public endpoint
        response = requests.get(f"{BASE_URL}/api/images/hero")
        assert response.status_code == 200
        data = response.json()
        
        if len(data["images"]) > 0:
            img = data["images"][0]
            required_fields = ["storage_path", "section", "id"]
            for field in required_fields:
                assert field in img, f"Image missing required field: {field}"
            print(f"✓ Images have required fields: {required_fields}")
        else:
            print("⚠ No images to verify fields")


class TestImageUploadEndpoint:
    """Module: Admin image upload tests - POST /api/admin/upload"""
    
    def test_upload_with_section_and_label(self, admin_token):
        """POST /api/admin/upload with file + section query param uploads correctly"""
        image_data = base64.b64decode(TEST_PNG_BASE64)
        files = {"file": ("test_upload.png", image_data, "image/png")}
        
        response = requests.post(
            f"{BASE_URL}/api/admin/upload?section=hero&label=TEST_Dynamic_Hero",
            headers={"Authorization": f"Bearer {admin_token}"},
            files=files
        )
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        
        assert data["status"] == "success"
        assert "file" in data
        assert data["file"]["section"] == "hero"
        assert "storage_path" in data["file"]
        assert "id" in data["file"]
        print(f"✓ Image uploaded to 'hero' section, ID: {data['file']['id']}")
        return data["file"]
    
    def test_upload_to_all_valid_sections(self, admin_token):
        """Upload images to all valid sections used by frontend"""
        image_data = base64.b64decode(TEST_PNG_BASE64)
        uploaded = []
        
        for section in VALID_SECTIONS:
            files = {"file": (f"test_{section}.png", image_data, "image/png")}
            response = requests.post(
                f"{BASE_URL}/api/admin/upload?section={section}&label=TEST_{section}_Dynamic",
                headers={"Authorization": f"Bearer {admin_token}"},
                files=files
            )
            assert response.status_code == 200, f"Failed to upload to {section}: {response.text}"
            data = response.json()
            assert data["file"]["section"] == section
            uploaded.append((section, data["file"]["id"]))
            print(f"✓ Uploaded to '{section}'")
        
        return uploaded
    
    def test_upload_requires_auth(self):
        """Upload endpoint requires authentication"""
        image_data = base64.b64decode(TEST_PNG_BASE64)
        files = {"file": ("test_noauth.png", image_data, "image/png")}
        
        response = requests.post(
            f"{BASE_URL}/api/admin/upload?section=hero&label=test",
            files=files
        )
        assert response.status_code == 401, f"Expected 401 without auth, got {response.status_code}"
        print("✓ Upload requires authentication")


class TestFileServingEndpoint:
    """Module: File serving tests - GET /api/files/{storage_path}"""
    
    def test_serve_uploaded_file(self, admin_token):
        """GET /api/files/{storage_path} serves uploaded file content"""
        # Upload a test image
        image_data = base64.b64decode(TEST_PNG_BASE64)
        files = {"file": ("serve_test.png", image_data, "image/png")}
        
        upload_res = requests.post(
            f"{BASE_URL}/api/admin/upload?section=gallery&label=TEST_Serve_File",
            headers={"Authorization": f"Bearer {admin_token}"},
            files=files
        )
        assert upload_res.status_code == 200, f"Upload failed: {upload_res.text}"
        storage_path = upload_res.json()["file"]["storage_path"]
        
        # Serve the file
        response = requests.get(f"{BASE_URL}/api/files/{storage_path}")
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        assert response.headers.get("Content-Type") in ["image/png", "application/octet-stream"]
        assert len(response.content) > 0, "File content should not be empty"
        print(f"✓ File served successfully, size: {len(response.content)} bytes")
    
    def test_serve_nonexistent_file_returns_404(self):
        """GET /api/files/{path} returns 404 for non-existent file"""
        response = requests.get(f"{BASE_URL}/api/files/nonexistent/path/image.png")
        assert response.status_code == 404, f"Expected 404, got {response.status_code}"
        print("✓ Non-existent file returns 404")


class TestAdminImagesEndpoint:
    """Module: Admin images list tests - GET /api/admin/images"""
    
    def test_get_all_images_with_auth(self, admin_token):
        """GET /api/admin/images returns all uploaded images (requires auth)"""
        response = requests.get(
            f"{BASE_URL}/api/admin/images",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        assert "images" in data
        assert isinstance(data["images"], list)
        print(f"✓ Admin images endpoint returned {len(data['images'])} images")
    
    def test_get_images_requires_auth(self):
        """GET /api/admin/images requires authentication"""
        response = requests.get(f"{BASE_URL}/api/admin/images")
        assert response.status_code == 401, f"Expected 401 without auth, got {response.status_code}"
        print("✓ Admin images endpoint requires auth")
    
    def test_filter_images_by_section(self, admin_token):
        """GET /api/admin/images?section=hero filters by section"""
        response = requests.get(
            f"{BASE_URL}/api/admin/images?section=hero",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        
        # All returned images should be from 'hero' section
        for img in data["images"]:
            assert img["section"] == "hero", f"Expected section 'hero', got '{img['section']}'"
        print(f"✓ Section filter works, {len(data['images'])} images in 'hero'")


class TestImageDeleteEndpoint:
    """Module: Admin image delete tests - DELETE /api/admin/images/{image_id}"""
    
    def test_soft_delete_image(self, admin_token):
        """DELETE /api/admin/images/{image_id} soft deletes an image"""
        # Upload a test image to delete
        image_data = base64.b64decode(TEST_PNG_BASE64)
        files = {"file": ("delete_test.png", image_data, "image/png")}
        
        upload_res = requests.post(
            f"{BASE_URL}/api/admin/upload?section=general&label=TEST_Delete_Dynamic",
            headers={"Authorization": f"Bearer {admin_token}"},
            files=files
        )
        assert upload_res.status_code == 200, f"Upload failed: {upload_res.text}"
        image_id = upload_res.json()["file"]["id"]
        
        # Delete the image
        response = requests.delete(
            f"{BASE_URL}/api/admin/images/{image_id}",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert response.status_code == 200, f"Expected 200, got {response.status_code}: {response.text}"
        data = response.json()
        assert data["status"] == "success"
        print(f"✓ Image {image_id} deleted successfully")
        
        # Verify it's no longer in the list
        list_res = requests.get(
            f"{BASE_URL}/api/admin/images",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        images = list_res.json()["images"]
        image_ids = [img["id"] for img in images]
        assert image_id not in image_ids, "Deleted image should not appear in list"
        print("✓ Deleted image not in admin list")
    
    def test_delete_requires_auth(self):
        """DELETE /api/admin/images/{id} requires authentication"""
        response = requests.delete(f"{BASE_URL}/api/admin/images/some_id")
        assert response.status_code == 401, f"Expected 401 without auth, got {response.status_code}"
        print("✓ Delete requires authentication")


class TestDynamicImageIntegration:
    """Module: End-to-end dynamic image integration tests"""
    
    def test_upload_verify_public_and_serve_flow(self, admin_token):
        """Complete flow: Upload -> Public API -> File Serve"""
        # Step 1: Upload image to 'hero' section
        image_data = base64.b64decode(TEST_PNG_BASE64)
        files = {"file": ("integration_test.png", image_data, "image/png")}
        
        upload_res = requests.post(
            f"{BASE_URL}/api/admin/upload?section=hero&label=TEST_Integration_Flow",
            headers={"Authorization": f"Bearer {admin_token}"},
            files=files
        )
        assert upload_res.status_code == 200, f"Upload failed: {upload_res.text}"
        uploaded = upload_res.json()["file"]
        print(f"Step 1: ✓ Uploaded image ID: {uploaded['id']}")
        
        # Step 2: Verify image appears in public API
        public_res = requests.get(f"{BASE_URL}/api/images/hero")
        assert public_res.status_code == 200
        public_images = public_res.json()["images"]
        found = any(img["id"] == uploaded["id"] for img in public_images)
        assert found, "Uploaded image not found in public API"
        print(f"Step 2: ✓ Image found in public /api/images/hero")
        
        # Step 3: Verify file can be served
        serve_res = requests.get(f"{BASE_URL}/api/files/{uploaded['storage_path']}")
        assert serve_res.status_code == 200, f"File serve failed: {serve_res.status_code}"
        assert len(serve_res.content) > 0
        print(f"Step 3: ✓ File served from /api/files/{uploaded['storage_path']}")
        
        # Step 4: Verify frontend URL construction would work
        expected_url = f"{BASE_URL}/api/files/{uploaded['storage_path']}"
        verify_res = requests.get(expected_url)
        assert verify_res.status_code == 200
        print(f"Step 4: ✓ Frontend URL pattern works: {expected_url}")
    
    def test_deleted_image_not_in_public_api(self, admin_token):
        """Deleted images should not appear in public API"""
        # Upload
        image_data = base64.b64decode(TEST_PNG_BASE64)
        files = {"file": ("delete_public_test.png", image_data, "image/png")}
        
        upload_res = requests.post(
            f"{BASE_URL}/api/admin/upload?section=gallery&label=TEST_Delete_Public",
            headers={"Authorization": f"Bearer {admin_token}"},
            files=files
        )
        assert upload_res.status_code == 200
        image_id = upload_res.json()["file"]["id"]
        
        # Delete
        delete_res = requests.delete(
            f"{BASE_URL}/api/admin/images/{image_id}",
            headers={"Authorization": f"Bearer {admin_token}"}
        )
        assert delete_res.status_code == 200
        
        # Verify not in public API
        public_res = requests.get(f"{BASE_URL}/api/images/gallery")
        public_images = public_res.json()["images"]
        found = any(img["id"] == image_id for img in public_images)
        assert not found, "Deleted image should not appear in public API"
        print("✓ Deleted image not in public API")


if __name__ == "__main__":
    pytest.main([__file__, "-v"])
