#!/usr/bin/env python
"""
Simple test script to verify API functionality
Run this after setting up the Django backend
"""

import requests
import json
import sys

BASE_URL = "http://localhost:8000/api"

def test_public_endpoints():
    """Test public API endpoints that don't require authentication"""
    print("Testing Public API Endpoints...")
    
    endpoints = [
        "/public/properties/",
        "/public/compounds/",
        "/public/developers/",
        "/public/blog-posts/",
    ]
    
    for endpoint in endpoints:
        try:
            response = requests.get(f"{BASE_URL}{endpoint}")
            if response.status_code == 200:
                data = response.json()
                print(f"✅ {endpoint} - OK ({len(data.get('results', []))} items)")
            else:
                print(f"❌ {endpoint} - Error {response.status_code}")
        except requests.exceptions.RequestException as e:
            print(f"❌ {endpoint} - Connection error: {e}")

def test_auth():
    """Test authentication endpoint"""
    print("\nTesting Authentication...")
    
    # You'll need to replace these with actual admin credentials
    auth_data = {
        "username": "admin",  # Replace with your admin username
        "password": "admin"    # Replace with your admin password
    }
    
    try:
        response = requests.post(f"{BASE_URL}/auth/login/", json=auth_data)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Authentication - OK (Token: {data.get('token', 'N/A')[:20]}...)")
            return data.get('token')
        else:
            print(f"❌ Authentication - Error {response.status_code}: {response.text}")
            return None
    except requests.exceptions.RequestException as e:
        print(f"❌ Authentication - Connection error: {e}")
        return None

def test_admin_endpoints(token):
    """Test admin API endpoints with authentication"""
    if not token:
        print("\nSkipping admin endpoint tests (no token)")
        return
    
    print("\nTesting Admin API Endpoints...")
    
    headers = {"Authorization": f"Token {token}"}
    
    endpoints = [
        "/admin/properties/",
        "/admin/compounds/",
        "/admin/developers/",
        "/admin/locations/",
        "/admin/amenities/",
        "/admin/authors/",
        "/admin/blog-posts/",
        "/admin/partners/",
        "/admin/testimonials/",
    ]
    
    for endpoint in endpoints:
        try:
            response = requests.get(f"{BASE_URL}{endpoint}", headers=headers)
            if response.status_code == 200:
                data = response.json()
                print(f"✅ {endpoint} - OK ({len(data.get('results', []))} items)")
            else:
                print(f"❌ {endpoint} - Error {response.status_code}")
        except requests.exceptions.RequestException as e:
            print(f"❌ {endpoint} - Connection error: {e}")

def test_property_filters():
    """Test property filtering functionality"""
    print("\nTesting Property Filters...")
    
    filters = [
        "?search=luxury",
        "?property_type=Apartment",
        "?min_price=1000000",
        "?max_price=5000000",
        "?bedrooms=3",
        "?is_featured=true",
        "?is_new_launch=true",
    ]
    
    for filter_param in filters:
        try:
            response = requests.get(f"{BASE_URL}/public/properties/{filter_param}")
            if response.status_code == 200:
                data = response.json()
                print(f"✅ Filter {filter_param} - OK ({len(data.get('results', []))} results)")
            else:
                print(f"❌ Filter {filter_param} - Error {response.status_code}")
        except requests.exceptions.RequestException as e:
            print(f"❌ Filter {filter_param} - Connection error: {e}")

def main():
    """Run all tests"""
    print("Four Seasons Real Estate Hub - API Test Suite")
    print("=" * 50)
    
    # Test public endpoints
    test_public_endpoints()
    
    # Test authentication
    token = test_auth()
    
    # Test admin endpoints
    test_admin_endpoints(token)
    
    # Test property filters
    test_property_filters()
    
    print("\n" + "=" * 50)
    print("Test completed!")
    print("\nNote: Some tests may fail if the database is empty or if admin credentials are incorrect.")
    print("Make sure to:")
    print("1. Run migrations: python manage.py migrate")
    print("2. Create superuser: python manage.py createsuperuser")
    print("3. Add some sample data through the admin interface")

if __name__ == "__main__":
    main()

