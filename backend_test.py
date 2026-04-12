#!/usr/bin/env python3
import requests
import sys
import json
from datetime import datetime, timezone, timedelta
from pymongo import MongoClient
import os

class CaseManagementAPITester:
    def __init__(self, use_existing_session=False):
        self.base_url = "https://245338f4-e8c3-4094-99d9-9a96ef5fa0fc.preview.emergentagent.com"
        self.session_token = None
        self.user_id = None
        self.test_case_id = None
        self.tests_run = 0
        self.tests_passed = 0
        self.use_existing_session = use_existing_session
        
        # MongoDB connection for test data setup
        self.mongo_client = MongoClient("mongodb://localhost:27017")
        self.db = self.mongo_client["case_management"]
        
        # Use existing test session if specified
        if use_existing_session:
            self.session_token = "test_session_ui1"
            self.user_id = "test-user-ui1"

    def log_test(self, name, success, details=""):
        """Log test results"""
        self.tests_run += 1
        if success:
            self.tests_passed += 1
            print(f"✅ {name} - PASSED")
        else:
            print(f"❌ {name} - FAILED: {details}")
        return success

    def setup_test_user(self):
        """Create test user and session in MongoDB or use existing"""
        if self.use_existing_session:
            # Verify existing session exists
            session = self.db.sessions.find_one({"session_token": self.session_token})
            if session:
                print(f"🔧 Using existing test session: {self.session_token}")
                print(f"🔧 User ID: {self.user_id}")
                return True
            else:
                print(f"❌ Existing session not found, creating new one")
                # Fall back to creating new session
                self.use_existing_session = False
        
        if not self.use_existing_session:
            try:
                timestamp = int(datetime.now().timestamp())
                self.user_id = f"test-user-{timestamp}"
                self.session_token = f"test_session_{timestamp}"
                
                # Create test user
                user_doc = {
                    "user_id": self.user_id,
                    "email": f"test.user.{timestamp}@example.com",
                    "name": "Test User",
                    "picture": "https://via.placeholder.com/150",
                    "created_at": datetime.now(timezone.utc).isoformat()
                }
                self.db.users.insert_one(user_doc)
                
                # Create test session
                session_doc = {
                    "user_id": self.user_id,
                    "session_token": self.session_token,
                    "expires_at": datetime.now(timezone.utc) + timedelta(days=7),
                    "created_at": datetime.now(timezone.utc)
                }
                self.db.sessions.insert_one(session_doc)
                
                print(f"🔧 Test user created: {self.user_id}")
                print(f"🔧 Session token: {self.session_token}")
                return True
            except Exception as e:
                print(f"❌ Failed to setup test user: {str(e)}")
                return False

    def cleanup_test_data(self):
        """Clean up test data"""
        if self.use_existing_session:
            # Don't cleanup existing test session data
            print(f"🔧 Preserving existing test session data for user: {self.user_id}")
            return
            
        try:
            if self.user_id:
                self.db.users.delete_many({"user_id": self.user_id})
                self.db.sessions.delete_many({"user_id": self.user_id})
                self.db.cases.delete_many({"user_id": self.user_id})
                self.db.notifications.delete_many({"user_id": self.user_id})
                print(f"🧹 Cleaned up test data for user: {self.user_id}")
        except Exception as e:
            print(f"⚠️ Cleanup warning: {str(e)}")

    def make_request(self, method, endpoint, data=None, auth=True):
        """Make HTTP request with optional auth"""
        url = f"{self.base_url}{endpoint}"
        headers = {'Content-Type': 'application/json'}
        
        if auth and self.session_token:
            headers['Authorization'] = f'Bearer {self.session_token}'
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=10)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=10)
            elif method == 'PUT':
                response = requests.put(url, json=data, headers=headers, timeout=10)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers, timeout=10)
            
            return response
        except Exception as e:
            print(f"Request error: {str(e)}")
            return None

    def test_health_check(self):
        """Test health endpoint"""
        response = self.make_request('GET', '/api/health', auth=False)
        if response and response.status_code == 200:
            data = response.json()
            return self.log_test("Health Check", data.get('status') == 'ok')
        return self.log_test("Health Check", False, f"Status: {response.status_code if response else 'No response'}")

    def test_auth_me(self):
        """Test auth/me endpoint"""
        response = self.make_request('GET', '/api/auth/me')
        if response and response.status_code == 200:
            data = response.json()
            success = data.get('user_id') == self.user_id
            return self.log_test("Auth Me", success, f"User ID: {data.get('user_id')}")
        return self.log_test("Auth Me", False, f"Status: {response.status_code if response else 'No response'}")

    def test_auth_logout(self):
        """Test logout endpoint"""
        response = self.make_request('POST', '/api/auth/logout')
        if response and response.status_code == 200:
            return self.log_test("Auth Logout", True)
        return self.log_test("Auth Logout", False, f"Status: {response.status_code if response else 'No response'}")

    def test_create_case(self):
        """Test case creation"""
        case_data = {
            "case_number": "CIV/2024/TEST001",
            "petitioner_name": "Test Petitioner",
            "respondent_name": "Test Respondent", 
            "court_name": "Test High Court",
            "court_place": "Test City",
            "adjournment_date": "2024-12-31",
            "step": "Initial Hearing",
            "status": "Open",
            "client_email": "client@test.com",
            "client_phone": "+91XXXXXXXXXX"
        }
        
        response = self.make_request('POST', '/api/cases', case_data)
        if response and response.status_code == 200:
            data = response.json()
            self.test_case_id = data.get('case_id')
            success = data.get('case_number') == case_data['case_number']
            return self.log_test("Create Case", success, f"Case ID: {self.test_case_id}")
        return self.log_test("Create Case", False, f"Status: {response.status_code if response else 'No response'}")

    def test_get_cases(self):
        """Test get cases"""
        response = self.make_request('GET', '/api/cases')
        if response and response.status_code == 200:
            data = response.json()
            success = isinstance(data, list)
            return self.log_test("Get Cases", success, f"Found {len(data)} cases")
        return self.log_test("Get Cases", False, f"Status: {response.status_code if response else 'No response'}")

    def test_update_case(self):
        """Test case update"""
        if not self.test_case_id:
            return self.log_test("Update Case", False, "No test case ID available")
        
        update_data = {
            "step": "Updated Step",
            "status": "Closed"
        }
        
        response = self.make_request('PUT', f'/api/cases/{self.test_case_id}', update_data)
        if response and response.status_code == 200:
            data = response.json()
            success = data.get('step') == update_data['step']
            return self.log_test("Update Case", success)
        return self.log_test("Update Case", False, f"Status: {response.status_code if response else 'No response'}")

    def test_delete_case(self):
        """Test case deletion"""
        if not self.test_case_id:
            return self.log_test("Delete Case", False, "No test case ID available")
        
        response = self.make_request('DELETE', f'/api/cases/{self.test_case_id}')
        if response and response.status_code == 200:
            return self.log_test("Delete Case", True)
        return self.log_test("Delete Case", False, f"Status: {response.status_code if response else 'No response'}")

    def test_get_stats(self):
        """Test dashboard stats"""
        response = self.make_request('GET', '/api/stats')
        if response and response.status_code == 200:
            data = response.json()
            required_fields = ['total_cases', 'open_cases', 'closed_cases', 'upcoming_adjournments']
            success = all(field in data for field in required_fields)
            return self.log_test("Get Stats", success, f"Stats: {data}")
        return self.log_test("Get Stats", False, f"Status: {response.status_code if response else 'No response'}")

    def test_public_case_view(self):
        """Test public case view"""
        # First create a case to get share token
        case_data = {
            "case_number": "CIV/2024/PUBLIC001",
            "petitioner_name": "Public Test Petitioner",
            "respondent_name": "Public Test Respondent",
            "court_name": "Public Test Court",
            "court_place": "Public Test City",
            "adjournment_date": "2024-12-31",
            "step": "Public Test Step",
            "status": "Open"
        }
        
        response = self.make_request('POST', '/api/cases', case_data)
        if not response or response.status_code != 200:
            return self.log_test("Public Case View", False, "Failed to create test case")
        
        case_data = response.json()
        share_token = case_data.get('share_token')
        
        if not share_token:
            return self.log_test("Public Case View", False, "No share token in response")
        
        # Test public access (no auth)
        response = self.make_request('GET', f'/api/public/case/{share_token}', auth=False)
        if response and response.status_code == 200:
            data = response.json()
            success = data.get('case_number') == case_data['case_number']
            return self.log_test("Public Case View", success)
        return self.log_test("Public Case View", False, f"Status: {response.status_code if response else 'No response'}")

    def test_notifications(self):
        """Test notifications endpoints"""
        # Test get notifications
        response = self.make_request('GET', '/api/notifications')
        if response and response.status_code == 200:
            get_success = True
        else:
            get_success = False
            
        # Test check notifications
        response = self.make_request('POST', '/api/notifications/check')
        if response and response.status_code == 200:
            data = response.json()
            check_success = 'checked' in data and 'notifications_created' in data
        else:
            check_success = False
        
        success = get_success and check_success
        return self.log_test("Notifications", success, f"Get: {get_success}, Check: {check_success}")

    def run_all_tests(self):
        """Run all backend tests"""
        print("🚀 Starting Case Management API Tests")
        print("=" * 50)
        
        # Setup
        if not self.setup_test_user():
            print("❌ Failed to setup test environment")
            return False
        
        try:
            # Run tests
            self.test_health_check()
            self.test_auth_me()
            self.test_create_case()
            self.test_get_cases()
            self.test_update_case()
            self.test_delete_case()
            self.test_get_stats()
            self.test_public_case_view()
            self.test_notifications()
            self.test_auth_logout()
            
        finally:
            # Cleanup
            self.cleanup_test_data()
        
        # Results
        print("\n" + "=" * 50)
        print(f"📊 Test Results: {self.tests_passed}/{self.tests_run} passed")
        success_rate = (self.tests_passed / self.tests_run) * 100 if self.tests_run > 0 else 0
        print(f"📈 Success Rate: {success_rate:.1f}%")
        
        return self.tests_passed == self.tests_run

def main():
    # Test with existing session for UI testing
    print("🧪 Testing with existing session for UI integration...")
    tester = CaseManagementAPITester(use_existing_session=True)
    success = tester.run_all_tests()
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())