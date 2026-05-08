import asyncio
import httpx
import json

async def run_full_system_test():
    base_url = "http://127.0.0.1:8000/api/v1"
    phone = "03112233445"
    
    print("\n🚀 STARTING FULL SYSTEM INTEGRATION TEST")
    print("=========================================")

    async with httpx.AsyncClient() as client:
        try:
            # 1. Signup / Login
            print(f"\n[1] Testing OTP Signup for {phone}")
            resp = await client.post(f"{base_url}/auth/otp/send", json={"phone": phone})
            otp = resp.json().get("otp")
            print(f"   OTP Received: {otp}")
            
            resp = await client.post(f"{base_url}/auth/otp/verify", json={"phone": phone, "otp": otp})
            auth_data = resp.json()
            user_id = auth_data["user"]["id"]
            print(f"   Logged in as User ID: {user_id}")

            # 2. Become Provider (Seller Onboarding)
            print("\n[2] Testing 'Become Provider' Onboarding")
            onboarding_data = {
                "business_name": "Elite Tech Solutions",
                "category": "electrician",
                "bio": "Certified industrial electrician with premium equipment.",
                "cnic": "42101-1234567-1",
                "bank_name": "Meezan Bank",
                "account_holder": "Test Provider",
                "account_number": "PK00MEZN00123456789",
                "price_min": 1000,
                "price_max": 10000
            }
            resp = await client.post(f"{base_url}/auth/become-provider?user_id={user_id}", json=onboarding_data)
            provider_data = resp.json()
            provider_id = provider_data["id"]
            print(f"   Provider Profile Created! ID: {provider_id}")
            print(f"   Status: {provider_data['status']}, Verified: {provider_data['verified']}")

            # 3. Add Custom Service (Provider Catalog)
            print("\n[3] Testing Service Management (Add Listing)")
            service_data = {
                "name": "Smart Home Hub Installation",
                "name_urdu": "سمارٹ ہوم ہب انسٹالیشن",
                "description": "Professional setup of IoT devices and central hub.",
                "description_urdu": "آئی او ٹی ڈیوائسز اور سنٹرل ہب کا پروفیشنل سیٹ اپ۔",
                "price": 2500,
                "is_negotiable": True,
                "duration_minutes": 120,
                "category": "electrician"
            }
            resp = await client.post(f"{base_url}/provider/services?provider_id={provider_id}", json=service_data)
            service_res = resp.json()
            print(f"   Service Listed: {service_res['name']} (ID: {service_res['id']})")
            print(f"   Pricing: Rs. {service_res['price']} (Negotiable: {service_res['is_negotiable']})")

            # 4. Search & Discovery
            print("\n[4] Testing Marketplace Search")
            resp = await client.post(f"{base_url}/search", json={"query": "smart home electrician"})
            search_results = resp.json()
            print(f"   Found {search_results['total']} providers in search.")
            
            # 5. Booking Flow
            print("\n[5] Testing Booking Flow")
            booking_data = {
                "provider_id": provider_id,
                "service_id": service_res["id"],
                "service": service_res["name"],
                "address": "Elite Apartment, Block 5, Karachi",
                "city": "Karachi",
                "scheduled_date": "2026-05-10T10:00:00",
                "scheduled_time": "10:00 AM"
            }
            resp = await client.post(f"{base_url}/bookings?customer_id={user_id}", json=booking_data)
            booking_res = resp.json()
            print(f"   Booking Established! Status: {booking_res['status']}")
            print(f"   Mission: {booking_res['service']} at {booking_res['address']}")

            # 6. Provider Dashboard Refresh
            print("\n[6] Verifying Command Center Stats")
            resp = await client.get(f"{base_url}/dashboard/provider?user_id={user_id}")
            dashboard = resp.json()
            print(f"   Pending Bookings: {len(dashboard['pending_bookings'])}")
            print(f"   Total Earnings (Settled): Rs. {dashboard['total_earnings']}")

            print("\n✨ ALL SYSTEM TESTS PASSED SUCCESSFULLY!")
            print("=========================================")

        except Exception as e:
            print(f"\n❌ TEST FAILED: {str(e)}")
            if 'resp' in locals():
                print(f"   Response Status: {resp.status_code}")
                try:
                    error_json = resp.json()
                    print(f"   Error Detail: {error_json.get('detail')}")
                    print(f"   Traceback: {error_json.get('traceback')}")
                except:
                    print(f"   Response Body: {resp.text}")

if __name__ == "__main__":
    asyncio.run(run_full_system_test())
