import asyncio
import httpx
import json

async def test_signup_api():
    base_url = 'http://127.0.0.1:8003/api/v1'
    
    print("--- Testing /auth/signup endpoint ---")
    async with httpx.AsyncClient() as client:
        # 1. Signup a new user
        signup_data = {
            "name": "API Test User",
            "phone": "03112223334",
            "password": "apipassword123",
            "role": "customer",
            "city": "Lahore"
        }
        
        print(f"Sending signup request for: {signup_data['phone']}")
        try:
            resp = await client.post(f"{base_url}/auth/signup", json=signup_data)
            print(f"Status: {resp.status_code}")
            if resp.status_code == 200:
                print(f"Response: {json.dumps(resp.json(), indent=2)}")
            else:
                print(f"Error: {resp.text}")
        except Exception as e:
            print(f"Connection error: {e}")

if __name__ == "__main__":
    asyncio.run(test_signup_api())
