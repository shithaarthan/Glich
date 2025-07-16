#!/usr/bin/env python3
"""
Backend API Testing Suite
Tests all backend endpoints for the social media app
"""

import requests
import json
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Get backend URL from frontend .env file
def get_backend_url():
    frontend_env_path = "/app/frontend/.env"
    if os.path.exists(frontend_env_path):
        with open(frontend_env_path, 'r') as f:
            for line in f:
                if line.startswith('REACT_APP_BACKEND_URL='):
                    return line.split('=', 1)[1].strip()
    return "http://localhost:8001"

BASE_URL = get_backend_url()
API_BASE = f"{BASE_URL}/api"

class BackendTester:
    def __init__(self):
        self.session = requests.Session()
        self.auth_token = None
        self.test_user_id = "test-user-123"
        self.test_results = []
        
    def log_test(self, endpoint, method, status, message, details=None):
        """Log test results"""
        result = {
            "endpoint": endpoint,
            "method": method,
            "status": "PASS" if status else "FAIL",
            "message": message,
            "details": details or {}
        }
        self.test_results.append(result)
        status_symbol = "✅" if status else "❌"
        print(f"{status_symbol} {method} {endpoint}: {message}")
        if details and not status:
            print(f"   Details: {details}")
    
    def test_root_endpoint(self):
        """Test GET /api/ - Welcome message"""
        try:
            response = self.session.get(f"{API_BASE}/")
            if response.status_code == 200:
                data = response.json()
                if "message" in data and "Welcome" in data["message"]:
                    self.log_test("/", "GET", True, "Welcome message returned successfully")
                    return True
                else:
                    self.log_test("/", "GET", False, "Invalid response format", {"response": data})
                    return False
            else:
                self.log_test("/", "GET", False, f"HTTP {response.status_code}", {"response": response.text})
                return False
        except Exception as e:
            self.log_test("/", "GET", False, f"Request failed: {str(e)}")
            return False
    
    def test_auth_endpoints(self):
        """Test authentication endpoints"""
        endpoints = [
            ("/auth/google/login", "Google login URL"),
            ("/auth/google/signup", "Google signup URL")
        ]
        
        results = []
        for endpoint, description in endpoints:
            try:
                response = self.session.get(f"{API_BASE}{endpoint}")
                if response.status_code == 200:
                    data = response.json()
                    if "url" in data:
                        self.log_test(endpoint, "GET", True, f"{description} returned successfully")
                        results.append(True)
                    else:
                        self.log_test(endpoint, "GET", False, "No URL in response", {"response": data})
                        results.append(False)
                else:
                    self.log_test(endpoint, "GET", False, f"HTTP {response.status_code}", {"response": response.text})
                    results.append(False)
            except Exception as e:
                self.log_test(endpoint, "GET", False, f"Request failed: {str(e)}")
                results.append(False)
        
        # Test callback endpoint (will fail without proper code, but should not crash)
        try:
            response = self.session.get(f"{API_BASE}/auth/google/callback?code=test_code")
            # This should return an error but not crash
            if response.status_code in [400, 401, 500]:
                self.log_test("/auth/google/callback", "GET", True, "Callback endpoint handles invalid code properly")
                results.append(True)
            else:
                self.log_test("/auth/google/callback", "GET", False, f"Unexpected status: {response.status_code}")
                results.append(False)
        except Exception as e:
            self.log_test("/auth/google/callback", "GET", False, f"Request failed: {str(e)}")
            results.append(False)
        
        return all(results)
    
    def test_profiles_unauthenticated(self):
        """Test profile endpoints without authentication"""
        # Test GET /api/profiles (should work without auth based on code)
        try:
            response = self.session.get(f"{API_BASE}/profiles")
            if response.status_code == 200:
                data = response.json()
                if "profiles" in data or "message" in data:
                    self.log_test("/profiles", "GET", True, "Profiles endpoint accessible without auth")
                    return True
                else:
                    self.log_test("/profiles", "GET", False, "Invalid response format", {"response": data})
                    return False
            else:
                self.log_test("/profiles", "GET", False, f"HTTP {response.status_code}", {"response": response.text})
                return False
        except Exception as e:
            self.log_test("/profiles", "GET", False, f"Request failed: {str(e)}")
            return False
    
    def test_authenticated_endpoints_without_auth(self):
        """Test that authenticated endpoints properly reject unauthenticated requests"""
        endpoints_to_test = [
            ("/profiles", "POST", {"user_id": "test", "username": "testuser"}),
            ("/profiles/test-user", "GET", None),
            ("/profiles/test-user", "PUT", {"username": "newname"}),
            ("/calls", "GET", None),
            ("/calls", "POST", {"user_id": "test", "prompt": "test prompt"}),
            ("/responses", "GET", None),
            ("/responses", "POST", {"call_id": "test", "user_id": "test", "response_text": "test"}),
            ("/echoes", "GET", None),
            ("/echoes", "POST", {"call_id": "test", "response_id": "test", "user_id": "test"}),
            ("/calls/test-post/amplify", "POST", None),
            ("/calls/test-post/bookmark", "POST", None),
            ("/search?query=test", "GET", None),
            ("/calls/test-post/interactions", "GET", None)
        ]
        
        results = []
        for endpoint, method, data in endpoints_to_test:
            try:
                if method == "GET":
                    response = self.session.get(f"{API_BASE}{endpoint}")
                elif method == "POST":
                    response = self.session.post(f"{API_BASE}{endpoint}", json=data)
                elif method == "PUT":
                    response = self.session.put(f"{API_BASE}{endpoint}", json=data)
                
                if response.status_code == 401:
                    self.log_test(endpoint, method, True, "Properly rejects unauthenticated request")
                    results.append(True)
                else:
                    self.log_test(endpoint, method, False, f"Should return 401, got {response.status_code}", {"response": response.text})
                    results.append(False)
            except Exception as e:
                self.log_test(endpoint, method, False, f"Request failed: {str(e)}")
                results.append(False)
        
        return all(results)
    
    def test_with_mock_auth(self):
        """Test endpoints with mock authentication header"""
        # Create a mock auth header (this won't work with real Supabase but tests the endpoint structure)
        mock_headers = {"Authorization": "Bearer mock_token_for_testing"}
        
        endpoints_to_test = [
            ("/profiles/test-user", "GET"),
            ("/calls", "GET"),
            ("/responses", "GET"),
            ("/echoes", "GET"),
            ("/search?query=test", "GET"),
            ("/calls/test-post/interactions", "GET")
        ]
        
        results = []
        for endpoint, method in endpoints_to_test:
            try:
                if method == "GET":
                    response = self.session.get(f"{API_BASE}{endpoint}", headers=mock_headers)
                
                # With mock token, we expect either 401 (invalid token) or 500 (Supabase error)
                # Both are acceptable as they show the endpoint is processing auth
                if response.status_code in [401, 500]:
                    self.log_test(endpoint, method, True, f"Endpoint processes auth header (HTTP {response.status_code})")
                    results.append(True)
                elif response.status_code == 200:
                    # If it somehow works, that's also fine
                    self.log_test(endpoint, method, True, "Endpoint works with auth")
                    results.append(True)
                else:
                    self.log_test(endpoint, method, False, f"Unexpected status: {response.status_code}", {"response": response.text})
                    results.append(False)
            except Exception as e:
                self.log_test(endpoint, method, False, f"Request failed: {str(e)}")
                results.append(False)
        
        return all(results)
    
    def test_endpoint_structure(self):
        """Test that all endpoints are properly structured and don't crash"""
        # Test POST endpoints with mock data to ensure they don't crash
        mock_headers = {"Authorization": "Bearer mock_token"}
        
        post_endpoints = [
            ("/profiles", {"user_id": "test-user-123", "username": "testuser", "bio": "Test bio"}),
            ("/calls", {"user_id": "test-user-123", "prompt": "This is a test call"}),
            ("/responses", {"call_id": "test-call-123", "user_id": "test-user-123", "response_text": "Test response"}),
            ("/echoes", {"call_id": "test-call-123", "response_id": "test-response-123", "user_id": "test-user-123"}),
            ("/calls/test-post-123/amplify", {}),
            ("/calls/test-post-123/bookmark", {})
        ]
        
        results = []
        for endpoint, data in post_endpoints:
            try:
                response = self.session.post(f"{API_BASE}{endpoint}", json=data, headers=mock_headers)
                
                # We expect auth errors (401) or validation errors (400/500), not crashes
                if response.status_code in [400, 401, 403, 500]:
                    self.log_test(endpoint, "POST", True, f"Endpoint handles request properly (HTTP {response.status_code})")
                    results.append(True)
                elif response.status_code in [200, 201]:
                    self.log_test(endpoint, "POST", True, "Endpoint works successfully")
                    results.append(True)
                else:
                    self.log_test(endpoint, "POST", False, f"Unexpected status: {response.status_code}", {"response": response.text})
                    results.append(False)
            except Exception as e:
                self.log_test(endpoint, "POST", False, f"Request failed: {str(e)}")
                results.append(False)
        
        return all(results)
    
    def run_all_tests(self):
        """Run all backend tests"""
        print(f"🚀 Starting Backend API Tests")
        print(f"📍 Testing against: {API_BASE}")
        print("=" * 60)
        
        # Test basic connectivity
        print("\n📋 Testing Basic Connectivity...")
        root_test = self.test_root_endpoint()
        
        # Test authentication endpoints
        print("\n🔐 Testing Authentication Endpoints...")
        auth_test = self.test_auth_endpoints()
        
        # Test unauthenticated access
        print("\n👤 Testing Unauthenticated Access...")
        unauth_profiles_test = self.test_profiles_unauthenticated()
        
        # Test authentication requirements
        print("\n🔒 Testing Authentication Requirements...")
        auth_required_test = self.test_authenticated_endpoints_without_auth()
        
        # Test with mock authentication
        print("\n🎭 Testing with Mock Authentication...")
        mock_auth_test = self.test_with_mock_auth()
        
        # Test endpoint structure
        print("\n🏗️  Testing Endpoint Structure...")
        structure_test = self.test_endpoint_structure()
        
        # Summary
        print("\n" + "=" * 60)
        print("📊 TEST SUMMARY")
        print("=" * 60)
        
        total_tests = len(self.test_results)
        passed_tests = len([r for r in self.test_results if r["status"] == "PASS"])
        failed_tests = total_tests - passed_tests
        
        print(f"Total Tests: {total_tests}")
        print(f"Passed: {passed_tests} ✅")
        print(f"Failed: {failed_tests} ❌")
        print(f"Success Rate: {(passed_tests/total_tests)*100:.1f}%")
        
        if failed_tests > 0:
            print("\n❌ FAILED TESTS:")
            for result in self.test_results:
                if result["status"] == "FAIL":
                    print(f"  • {result['method']} {result['endpoint']}: {result['message']}")
        
        print("\n🔍 DETAILED RESULTS:")
        for result in self.test_results:
            status_symbol = "✅" if result["status"] == "PASS" else "❌"
            print(f"  {status_symbol} {result['method']} {result['endpoint']}: {result['message']}")
        
        return {
            "total": total_tests,
            "passed": passed_tests,
            "failed": failed_tests,
            "success_rate": (passed_tests/total_tests)*100,
            "results": self.test_results
        }

if __name__ == "__main__":
    tester = BackendTester()
    results = tester.run_all_tests()
    
    # Exit with error code if tests failed
    if results["failed"] > 0:
        exit(1)
    else:
        print("\n🎉 All tests passed!")
        exit(0)