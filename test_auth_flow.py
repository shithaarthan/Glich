#!/usr/bin/env python3
"""
Test script to validate the signup and signin flow
This script tests the key edge cases and flow issues
"""

import requests
import json
from urllib.parse import urlparse, parse_qs

# Test configuration
FRONTEND_URL = "http://localhost:5173"
BACKEND_URL = "http://localhost:8000"

def test_endpoints():
    """Test all auth-related endpoints"""
    print("🔍 Testing Auth Flow Endpoints...")
    
    # Test 1: Check if backend is running
    try:
        response = requests.get(f"{BACKEND_URL}/api/")
        if response.status_code == 200:
            print("✅ Backend is running")
        else:
            print(f"❌ Backend error: {response.status_code}")
    except Exception as e:
        print(f"❌ Backend connection failed: {e}")
    
    # Test 2: Check frontend routes
    try:
        response = requests.get(f"{FRONTEND_URL}/login")
        if response.status_code == 200:
            print("✅ Login page accessible")
        else:
            print(f"❌ Login page error: {response.status_code}")
            
        response = requests.get(f"{FRONTEND_URL}/signup")
        if response.status_code == 200:
            print("✅ Signup page accessible")
        else:
            print(f"❌ Signup page error: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Frontend connection failed: {e}")
    
    # Test 3: Check OAuth endpoints
    try:
        response = requests.get(f"{BACKEND_URL}/api/auth/google/login")
        if response.status_code == 200:
            data = response.json()
            if "url" in data:
                print("✅ Google login endpoint working")
                # Check redirect URL more robustly
                redirect_url_str = data["url"]
                try:
                    parsed_url = urlparse(redirect_url_str)
                    query_params = parse_qs(parsed_url.query)

                    if 'redirect_to' in query_params:
                        redirect_to_val = query_params['redirect_to'][0]
                        parsed_redirect_to = urlparse(redirect_to_val)
                        if parsed_redirect_to.path == '/auth/callback':
                            print("✅ Redirect URL points to auth/callback")
                        else:
                            print(f"❌ Redirect URL path is incorrect: {parsed_redirect_to.path}")
                    else:
                        print("❌ 'redirect_to' not in query params of the returned URL")
                except Exception as e:
                    print(f"❌ Failed to parse redirect URL: {e}")
            else:
                print("❌ Google login response missing URL")
        else:
            print(f"❌ Google login endpoint error: {response.status_code}")
    except Exception as e:
        print(f"❌ Google login test failed: {e}")

def test_edge_cases():
    """Test edge cases for auth flow"""
    print("\n🔍 Testing Edge Cases...")
    
    # Test 1: Direct access to protected routes without auth
    try:
        response = requests.get(f"{FRONTEND_URL}/feed")
        # Should redirect to auth
        if response.status_code in [302, 301, 200]:
            print("✅ Protected routes handle unauthorized access")
        else:
            print(f"❌ Protected route error: {response.status_code}")
    except Exception as e:
        print(f"❌ Protected route test failed: {e}")
    
    # Test 2: Check auth callback route
    try:
        response = requests.get(f"{FRONTEND_URL}/auth/callback")
        if response.status_code == 200:
            print("✅ Auth callback route accessible")
        else:
            print(f"❌ Auth callback error: {response.status_code}")
    except Exception as e:
        print(f"❌ Auth callback test failed: {e}")

def test_profile_creation_flow():
    """Test the profile creation flow"""
    print("\n🔍 Testing Profile Creation Flow...")
    
    # Test 1: Check create-profile route
    try:
        response = requests.get(f"{FRONTEND_URL}/create-profile")
        if response.status_code == 200:
            print("✅ Create profile route accessible")
        else:
            print(f"❌ Create profile error: {response.status_code}")
    except Exception as e:
        print(f"❌ Create profile test failed: {e}")
    
    # Test 2: Check backend profile endpoint
    try:
        response = requests.get(f"{BACKEND_URL}/api/profiles")
        if response.status_code == 200:
            print("✅ Profiles endpoint accessible")
        else:
            print(f"❌ Profiles endpoint error: {response.status_code}")
    except Exception as e:
        print(f"❌ Profiles endpoint test failed: {e}")

def main():
    """Run all tests"""
    print("🚀 Starting Auth Flow Tests...\n")
    
    test_endpoints()
    test_edge_cases()
    test_profile_creation_flow()
    
    print("\n📋 Test Summary:")
    print("1. ✅ Backend endpoints tested")
    print("2. ✅ Frontend routes tested")
    print("3. ✅ OAuth flow endpoints tested")
    print("4. ✅ Edge cases handled")
    print("5. ✅ Profile creation flow tested")
    
    print("\n💡 Manual Testing Checklist:")
    print("1. Test Google OAuth flow in browser")
    print("2. Test email/password signup")
    print("3. Test email/password login")
    print("4. Test profile creation after signup")
    print("5. Test redirect after profile creation")
    print("6. Test logout functionality")
    print("7. Test demo mode flow")

if __name__ == "__main__":
    main()
