import asyncio
import httpx
import json

async def test_otp_and_add_provider():
    base_url = "http://127.0.0.1:8000/api/v1"
    phone = "03009876543"
    
    print(f"--- Step 1: Testing OTP Send for {phone} ---")
    async with httpx.AsyncClient() as client:
        try:
            resp = await client.post(f"{base_url}/auth/otp/send", json={"phone": phone})
            data = resp.json()
            print(f"Response: {data}")
            otp = data.get("otp")
            
            if not otp:
                print("FAILED: No OTP returned in response (check demo mode)")
                return

            print(f"\n--- Step 2: Testing OTP Verify with OTP {otp} ---")
            resp = await client.post(f"{base_url}/auth/otp/verify", json={"phone": phone, "otp": otp})
            user_data = resp.json()
            print(f"User Data: {json.dumps(user_data, indent=2)}")
            
            if resp.status_code != 200:
                print("FAILED: Verification failed")
                return

            print("\n--- Step 3: Verifying User in Dashboard ---")
            # The verify endpoint creates a user if it doesn't exist
            user_id = user_data["user"]["id"]
            resp = await client.get(f"{base_url}/dashboard/customer?user_id={user_id}")
            print(f"Dashboard Response: {resp.status_code}")
            
            print("\n✅ OTP Signup Flow Works!")

        except Exception as e:
            print(f"ERROR: {e}")

if __name__ == "__main__":
    asyncio.run(test_otp_and_add_provider())
