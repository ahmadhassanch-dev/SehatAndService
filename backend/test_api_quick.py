import asyncio
import httpx
import json

async def test_api():
    base_url = 'http://127.0.0.1:8001/api/v1'
    phone = '03001234567'
    
    print('=== Testing API Endpoints ===')
    async with httpx.AsyncClient() as client:
        # 1. Test Categories
        print('\n[1] GET /categories')
        resp = await client.get(f'{base_url}/categories')
        print(f'   Status: {resp.status_code}')
        cats = resp.json()
        print(f'   Categories: {len(cats)} found')
        
        # 2. Test OTP Send
        print('\n[2] POST /auth/otp/send')
        resp = await client.post(f'{base_url}/auth/otp/send', json={'phone': phone})
        print(f'   Status: {resp.status_code}')
        data = resp.json()
        print(f'   Response: {json.dumps(data)[:200]}')
        otp = data.get('otp')
        
        if otp:
            # 3. Test OTP Verify
            print('\n[3] POST /auth/otp/verify')
            resp = await client.post(f'{base_url}/auth/otp/verify', json={'phone': phone, 'otp': otp})
            print(f'   Status: {resp.status_code}')
            auth_data = resp.json()
            user_id = auth_data['user']['id']
            print(f'   User ID: {user_id}, Role: {auth_data["user"]["role"]}')
            
            # 4. Test Become Provider
            print('\n[4] POST /auth/become-provider')
            provider_data = {
                'business_name': 'Test Services',
                'category': 'plumber',
                'bio': 'Test bio',
                'cnic': '1234567890123',
                'price_min': 500,
                'price_max': 5000
            }
            resp = await client.post(f'{base_url}/auth/become-provider?user_id={user_id}', json=provider_data)
            print(f'   Status: {resp.status_code}')
            prov = resp.json()
            print(f'   Provider ID: {prov.get("id")}, Status: {prov.get("status")}')
            
            # 5. Test Dashboard
            print('\n[5] GET /dashboard/customer')
            resp = await client.get(f'{base_url}/dashboard/customer?user_id={user_id}')
            print(f'   Status: {resp.status_code}')
            
    print('\n✅ API Tests Complete!')

if __name__ == "__main__":
    asyncio.run(test_api())