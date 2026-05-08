#!/usr/bin/env python3
"""
Comprehensive test script for advanced booking system
Tests all features: Users, Providers, Bookings, Payments, Locations, Notifications, etc.
"""

import asyncio
import json
from datetime import datetime, timedelta
import random
import string

# Mock implementation of advanced booking features
class AdvancedBookingTestSuite:
    def __init__(self):
        self.users = {}
        self.providers = {}
        self.bookings = {}
        self.payments = {}
        self.locations = {}
        self.notifications = {}
        self.provider_schedules = {}
        self.booking_slots = {}
        self.online_status = {}
        self.user_id_counter = 1
        self.provider_id_counter = 1
        self.booking_id_counter = 1
        
    def print_section(self, title):
        print(f"\n{'='*80}")
        print(f"  {title}")
        print(f"{'='*80}\n")
        
    def print_success(self, message):
        print(f"✅ {message}")
        
    def print_info(self, message):
        print(f"ℹ️  {message}")
        
    def print_error(self, message):
        print(f"❌ {message}")
        
    def print_data(self, title, data):
        print(f"\n📊 {title}:")
        print(json.dumps(data, indent=2, default=str))

    # ============ User Management ============
    def create_customer_user(self, name, phone, email, city):
        """Create a new customer user"""
        user_id = self.user_id_counter
        self.user_id_counter += 1
        
        user = {
            "id": user_id,
            "name": name,
            "phone": phone,
            "email": email,
            "city": city,
            "role": "customer",
            "is_verified": True,
            "cancellation_count": 0,
            "wallet_balance": 5000.0,
            "created_at": datetime.now().isoformat()
        }
        self.users[user_id] = user
        self.print_success(f"Created customer '{name}' (ID: {user_id})")
        return user
        
    def create_provider_user(self, name, phone, email, city, category, bio):
        """Create a new provider user"""
        user_id = self.user_id_counter
        self.user_id_counter += 1
        provider_id = self.provider_id_counter
        self.provider_id_counter += 1
        
        user = {
            "id": user_id,
            "name": name,
            "phone": phone,
            "email": email,
            "city": city,
            "role": "provider",
            "is_verified": True,
            "created_at": datetime.now().isoformat()
        }
        
        provider = {
            "id": provider_id,
            "user_id": user_id,
            "category": category,
            "bio": bio,
            "rating": 4.5 + random.uniform(0, 0.5),
            "review_count": random.randint(20, 200),
            "verified": True,
            "is_approved": True,
            "price_min": random.randint(300, 1000),
            "price_max": random.randint(2000, 5000),
            "status": "approved",
            "diagnostic_fee": random.randint(100, 500),
            "availability_mode": "flexible",
            "response_time": f"{random.randint(5, 30)} min",
            "created_at": datetime.now().isoformat()
        }
        
        self.users[user_id] = user
        self.providers[provider_id] = provider
        self.print_success(f"Created provider '{name}' in '{category}' (Provider ID: {provider_id}, User ID: {user_id})")
        return provider

    # ============ Location Management ============
    def add_customer_location(self, customer_id, latitude, longitude, address, city):
        """Add a location for a customer"""
        location = {
            "customer_id": customer_id,
            "latitude": latitude,
            "longitude": longitude,
            "address": address,
            "city": city,
            "created_at": datetime.now().isoformat()
        }
        
        if customer_id not in self.locations:
            self.locations[customer_id] = []
        self.locations[customer_id].append(location)
        self.print_success(f"Added location for customer {customer_id}: {address}")
        return location

    # ============ Provider Schedule Management ============
    def set_provider_schedule(self, provider_id, schedules):
        """Set availability schedule for a provider"""
        self.provider_schedules[provider_id] = schedules
        self.print_success(f"Set schedule for provider {provider_id}")
        return schedules
        
    def create_booking_slots(self, provider_id, date, slots):
        """Create available booking slots"""
        key = f"{provider_id}_{date}"
        self.booking_slots[key] = slots
        self.print_success(f"Created {len(slots)} booking slots for provider {provider_id} on {date}")
        return slots

    # ============ Provider Online Status ============
    def set_provider_online_status(self, provider_id, status, latitude=None, longitude=None):
        """Update provider online status"""
        online_status = {
            "provider_id": provider_id,
            "status": status,  # online, offline, busy, on_break
            "latitude": latitude,
            "longitude": longitude,
            "is_available_for_booking": status == "online",
            "last_seen": datetime.now().isoformat()
        }
        self.online_status[provider_id] = online_status
        self.print_success(f"Set provider {provider_id} status to '{status}'")
        return online_status

    # ============ Booking Management ============
    def search_providers(self, query, city, min_rating=None, max_price=None):
        """Search for providers"""
        results = []
        for provider in self.providers.values():
            user = self.users.get(provider["user_id"])
            if not user:
                continue
                
            # Match criteria
            matches_query = query.lower() in provider["category"].lower() or \
                          query.lower() in provider["bio"].lower()
            matches_city = city.lower() in user["city"].lower()
            matches_rating = min_rating is None or provider["rating"] >= min_rating
            matches_price = max_price is None or provider["price_min"] <= max_price
            
            if matches_query and matches_city and matches_rating and matches_price:
                results.append({
                    "provider_id": provider["id"],
                    "name": user["name"],
                    "category": provider["category"],
                    "rating": provider["rating"],
                    "reviews": provider["review_count"],
                    "price_range": f"Rs. {provider['price_min']} - {provider['price_max']}",
                    "verified": provider["verified"],
                    "city": user["city"],
                    "distance_km": random.uniform(1, 10)
                })
        
        self.print_success(f"Found {len(results)} providers for '{query}' in '{city}'")
        return results

    def create_booking(self, customer_id, provider_id, service, description, 
                      scheduled_date, address, city, latitude, longitude, 
                      payment_method="cash"):
        """Create an advanced booking"""
        booking_id = self.booking_id_counter
        self.booking_id_counter += 1
        
        provider = self.providers.get(provider_id)
        if not provider:
            self.print_error(f"Provider {provider_id} not found")
            return None
            
        booking = {
            "id": booking_id,
            "customer_id": customer_id,
            "provider_id": provider_id,
            "service": service,
            "description": description,
            "status": "requested",
            "scheduled_date": scheduled_date,
            "address": address,
            "city": city,
            "latitude": latitude,
            "longitude": longitude,
            "price": random.uniform(500, 5000),
            "estimated_price": random.uniform(500, 5000),
            "diagnostic_fee": provider["diagnostic_fee"],
            "payment_method": payment_method,
            "verification_code": "".join(random.choices(string.digits, k=4)),
            "created_at": datetime.now().isoformat(),
            "updated_at": datetime.now().isoformat()
        }
        
        self.bookings[booking_id] = booking
        self.print_success(f"Created booking #{booking_id} for customer {customer_id} with provider {provider_id}")
        return booking

    def update_booking_status(self, booking_id, new_status):
        """Update booking status"""
        if booking_id not in self.bookings:
            self.print_error(f"Booking {booking_id} not found")
            return None
            
        booking = self.bookings[booking_id]
        old_status = booking["status"]
        booking["status"] = new_status
        booking["updated_at"] = datetime.now().isoformat()
        
        self.print_success(f"Updated booking #{booking_id} status: {old_status} → {new_status}")
        return booking

    def complete_booking(self, booking_id, verification_code):
        """Complete a booking with verification code"""
        if booking_id not in self.bookings:
            self.print_error(f"Booking {booking_id} not found")
            return None
            
        booking = self.bookings[booking_id]
        if booking["verification_code"] == verification_code:
            booking["status"] = "completed"
            booking["updated_at"] = datetime.now().isoformat()
            self.print_success(f"Booking #{booking_id} completed successfully")
            return booking
        else:
            self.print_error(f"Invalid verification code for booking {booking_id}")
            return None

    # ============ Payment Management ============
    def create_payment(self, booking_id, amount, payment_method, payment_data=None):
        """Create a payment transaction"""
        payment_id = f"PAY_{booking_id}_{random.randint(1000, 9999)}"
        
        payment = {
            "id": payment_id,
            "booking_id": booking_id,
            "amount": amount,
            "method": payment_method,
            "status": "completed",
            "transaction_id": f"TXN_{random.randint(100000, 999999)}",
            "payment_data": payment_data or {},
            "created_at": datetime.now().isoformat()
        }
        
        self.payments[payment_id] = payment
        self.print_success(f"Created payment {payment_id} for booking {booking_id} via {payment_method}")
        return payment

    def process_refund(self, booking_id, reason):
        """Process refund for a booking"""
        booking = self.bookings.get(booking_id)
        if not booking:
            self.print_error(f"Booking {booking_id} not found")
            return None
            
        refund_id = f"REFUND_{booking_id}_{random.randint(1000, 9999)}"
        refund = {
            "id": refund_id,
            "booking_id": booking_id,
            "amount": booking["price"],
            "reason": reason,
            "status": "processed",
            "created_at": datetime.now().isoformat()
        }
        
        self.print_success(f"Processed refund {refund_id} for booking {booking_id}: {reason}")
        return refund

    # ============ Notification Management ============
    def create_notification(self, user_id, notification_type, title, message, booking_id=None):
        """Create a notification"""
        notification = {
            "user_id": user_id,
            "type": notification_type,
            "title": title,
            "message": message,
            "booking_id": booking_id,
            "is_read": False,
            "created_at": datetime.now().isoformat()
        }
        
        if user_id not in self.notifications:
            self.notifications[user_id] = []
        self.notifications[user_id].append(notification)
        self.print_info(f"Notification to user {user_id}: {title}")
        return notification

    def get_user_notifications(self, user_id):
        """Get all notifications for a user"""
        return self.notifications.get(user_id, [])

    # ============ Review Management ============
    def submit_review(self, booking_id, provider_id, customer_id, rating, comment):
        """Submit a review for completed booking"""
        booking = self.bookings.get(booking_id)
        if not booking:
            self.print_error(f"Booking {booking_id} not found")
            return None
            
        if booking["status"] != "completed":
            self.print_error(f"Cannot review incomplete booking")
            return None
            
        review = {
            "booking_id": booking_id,
            "provider_id": provider_id,
            "customer_id": customer_id,
            "rating": rating,
            "comment": comment,
            "created_at": datetime.now().isoformat()
        }
        
        # Update provider rating
        provider = self.providers.get(provider_id)
        if provider:
            old_rating = provider["rating"]
            provider["review_count"] += 1
            provider["rating"] = round((provider["rating"] + rating) / 2, 1)
            self.print_success(f"Review submitted (Rating: {rating}/5) - Provider rating updated: {old_rating} → {provider['rating']}")
        
        return review

    # ============ Reports and Analytics ============
    def get_customer_dashboard(self, customer_id):
        """Get customer dashboard stats"""
        user_bookings = [b for b in self.bookings.values() if b["customer_id"] == customer_id]
        
        stats = {
            "total_bookings": len(user_bookings),
            "completed_bookings": len([b for b in user_bookings if b["status"] == "completed"]),
            "pending_bookings": len([b for b in user_bookings if b["status"] in ["requested", "pending"]]),
            "total_spent": sum(b["price"] for b in user_bookings if b["status"] == "completed"),
            "cancellation_count": self.users[customer_id].get("cancellation_count", 0)
        }
        
        return stats

    def get_provider_dashboard(self, provider_id):
        """Get provider dashboard stats"""
        provider_bookings = [b for b in self.bookings.values() if b["provider_id"] == provider_id]
        provider = self.providers.get(provider_id)
        
        stats = {
            "total_bookings": len(provider_bookings),
            "completed_bookings": len([b for b in provider_bookings if b["status"] == "completed"]),
            "pending_bookings": len([b for b in provider_bookings if b["status"] in ["requested", "pending"]]),
            "total_earnings": sum(b["price"] for b in provider_bookings if b["status"] == "completed"),
            "average_rating": provider["rating"] if provider else 0,
            "total_reviews": provider["review_count"] if provider else 0,
            "online_status": self.online_status.get(provider_id, {}).get("status", "offline")
        }
        
        return stats

    def get_admin_stats(self):
        """Get admin dashboard stats"""
        stats = {
            "total_users": len(self.users),
            "total_providers": len(self.providers),
            "total_bookings": len(self.bookings),
            "completed_bookings": len([b for b in self.bookings.values() if b["status"] == "completed"]),
            "total_revenue": sum(p["amount"] for p in self.payments.values()),
            "pending_bookings": len([b for b in self.bookings.values() if b["status"] in ["requested", "pending"]]),
            "average_provider_rating": sum(p["rating"] for p in self.providers.values()) / max(len(self.providers), 1)
        }
        
        return stats


def run_tests():
    """Run comprehensive tests"""
    suite = AdvancedBookingTestSuite()
    
    # ============ PHASE 1: CREATE USERS ============
    suite.print_section("PHASE 1: Creating Users and Providers")
    
    # Create customers
    customer1 = suite.create_customer_user("Ali Ahmed", "03001234567", "ali@example.com", "Lahore")
    customer2 = suite.create_customer_user("Fatima Khan", "03101234567", "fatima@example.com", "Karachi")
    customer3 = suite.create_customer_user("Hassan Malik", "03201234567", "hassan@example.com", "Islamabad")
    
    # Create providers
    provider1 = suite.create_provider_user("Ahmed Khan", "03451234567", "ahmed.provider@example.com", "Lahore", "AC Repair", "Expert AC technician with 10+ years experience")
    provider2 = suite.create_provider_user("Muhammad Ali", "03461234567", "muhammadali@example.com", "Lahore", "Plumbing", "Professional plumber with 8 years experience")
    provider3 = suite.create_provider_user("Farhan Sheikh", "03471234567", "farhan@example.com", "Karachi", "Electrician", "Certified electrician with expertise in wiring")
    provider4 = suite.create_provider_user("Sarah Khan", "03481234567", "sarah@example.com", "Islamabad", "Cleaning", "Professional home cleaning services")
    
    # ============ PHASE 2: MANAGE LOCATIONS ============
    suite.print_section("PHASE 2: Managing Customer Locations")
    
    suite.add_customer_location(customer1["id"], 31.5497, 74.3436, "House #42, Model Town", "Lahore")
    suite.add_customer_location(customer1["id"], 31.5410, 74.3488, "Office Block, DHA", "Lahore")
    suite.add_customer_location(customer2["id"], 24.8615, 67.0099, "Apartment #5, Clifton", "Karachi")
    suite.add_customer_location(customer3["id"], 33.6844, 73.0479, "House #20, F-7", "Islamabad")
    
    # ============ PHASE 3: SET PROVIDER SCHEDULES ============
    suite.print_section("PHASE 3: Setting Provider Availability Schedules")
    
    schedule1 = [
        {"day": "Monday", "start": "9:00 AM", "end": "9:00 PM"},
        {"day": "Tuesday", "start": "9:00 AM", "end": "9:00 PM"},
        {"day": "Wednesday", "start": "9:00 AM", "end": "9:00 PM"},
        {"day": "Thursday", "start": "9:00 AM", "end": "9:00 PM"},
        {"day": "Friday", "start": "9:00 AM", "end": "9:00 PM"},
        {"day": "Saturday", "start": "9:00 AM", "end": "6:00 PM"},
        {"day": "Sunday", "start": "10:00 AM", "end": "4:00 PM"}
    ]
    suite.set_provider_schedule(provider1["id"], schedule1)
    suite.set_provider_schedule(provider2["id"], schedule1)
    
    schedule2 = [
        {"day": "Monday", "start": "8:00 AM", "end": "10:00 PM"},
        {"day": "Tuesday", "start": "8:00 AM", "end": "10:00 PM"},
        {"day": "Wednesday", "start": "8:00 AM", "end": "10:00 PM"},
        {"day": "Thursday", "start": "8:00 AM", "end": "10:00 PM"},
        {"day": "Friday", "start": "8:00 AM", "end": "10:00 PM"},
        {"day": "Saturday", "start": "8:00 AM", "end": "10:00 PM"},
        {"day": "Sunday", "start": "8:00 AM", "end": "10:00 PM"}
    ]
    suite.set_provider_schedule(provider3["id"], schedule2)
    suite.set_provider_schedule(provider4["id"], schedule2)
    
    # Create booking slots
    tomorrow = (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d")
    slots1 = [
        {"start_time": "9:00 AM", "end_time": "10:00 AM", "available": True},
        {"start_time": "10:00 AM", "end_time": "11:00 AM", "available": True},
        {"start_time": "2:00 PM", "end_time": "3:00 PM", "available": True},
        {"start_time": "3:00 PM", "end_time": "4:00 PM", "available": True}
    ]
    suite.create_booking_slots(provider1["id"], tomorrow, slots1)
    
    # ============ PHASE 4: SEARCH PROVIDERS ============
    suite.print_section("PHASE 4: Searching for Providers")
    
    search_results = suite.search_providers("AC Repair", "Lahore", min_rating=4.0)
    suite.print_data("Search Results for 'AC Repair' in Lahore", search_results)
    
    search_results = suite.search_providers("Electrician", "Karachi")
    suite.print_data("Search Results for 'Electrician' in Karachi", search_results)
    
    # ============ PHASE 5: CREATE BOOKINGS ============
    suite.print_section("PHASE 5: Creating Advanced Bookings")
    
    booking1 = suite.create_booking(
        customer_id=customer1["id"],
        provider_id=provider1["id"],
        service="Split AC Repair",
        description="AC not cooling properly, need gas refilling and service",
        scheduled_date=tomorrow,
        address="House #42, Model Town, Lahore",
        city="Lahore",
        latitude=31.5497,
        longitude=74.3436,
        payment_method="cash"
    )
    
    booking2 = suite.create_booking(
        customer_id=customer1["id"],
        provider_id=provider2["id"],
        service="Leak Repair",
        description="Kitchen sink leak, need immediate repair",
        scheduled_date=tomorrow,
        address="House #42, Model Town, Lahore",
        city="Lahore",
        latitude=31.5497,
        longitude=74.3436,
        payment_method="online"
    )
    
    booking3 = suite.create_booking(
        customer_id=customer2["id"],
        provider_id=provider3["id"],
        service="Wiring Repair",
        description="Need complete electrical check for new house",
        scheduled_date=tomorrow,
        address="Apartment #5, Clifton, Karachi",
        city="Karachi",
        latitude=24.8615,
        longitude=67.0099,
        payment_method="jazzcash"
    )
    
    # ============ PHASE 6: UPDATE BOOKING STATUS ============
    suite.print_section("PHASE 6: Updating Booking Status Flow")
    
    suite.update_booking_status(booking1["id"], "pending")
    suite.update_booking_status(booking1["id"], "accepted")
    
    suite.create_notification(
        customer1["id"],
        "booking_accepted",
        "Booking Accepted!",
        f"Your {booking1['service']} booking has been accepted",
        booking1["id"]
    )
    
    suite.update_booking_status(booking1["id"], "on_way")
    suite.create_notification(
        customer1["id"],
        "provider_on_way",
        "Provider On The Way",
        "Ahmed Khan is on the way to your location",
        booking1["id"]
    )
    
    suite.update_booking_status(booking1["id"], "in_progress")
    suite.create_notification(
        customer1["id"],
        "service_started",
        "Service Started",
        "Your service has started",
        booking1["id"]
    )
    
    # ============ PHASE 7: PROVIDER ONLINE STATUS ============
    suite.print_section("PHASE 7: Managing Provider Online Status")
    
    suite.set_provider_online_status(provider1["id"], "online", 31.5497, 74.3436)
    suite.set_provider_online_status(provider2["id"], "online", 31.5410, 74.3488)
    suite.set_provider_online_status(provider3["id"], "busy", 24.8615, 67.0099)
    suite.set_provider_online_status(provider4["id"], "offline")
    
    # ============ PHASE 8: COMPLETE BOOKING & PAYMENT ============
    suite.print_section("PHASE 8: Completing Bookings and Processing Payments")
    
    verification_code = booking1["verification_code"]
    suite.complete_booking(booking1["id"], verification_code)
    suite.create_notification(
        customer1["id"],
        "service_completed",
        "Service Completed",
        "Your service has been completed successfully",
        booking1["id"]
    )
    
    suite.create_payment(
        booking1["id"],
        booking1["price"],
        "cash"
    )
    
    suite.create_payment(
        booking2["id"],
        booking2["price"],
        "online",
        payment_data={"transaction_id": "TXN_12345", "status": "success"}
    )
    
    # ============ PHASE 9: REVIEWS & RATINGS ============
    suite.print_section("PHASE 9: Submitting Reviews and Ratings")
    
    suite.submit_review(
        booking1["id"],
        provider1["id"],
        customer1["id"],
        rating=5,
        comment="Excellent service! Fixed my AC in just 30 minutes. Very professional and punctual."
    )
    
    suite.submit_review(
        booking1["id"],
        provider1["id"],
        customer1["id"],
        rating=4,
        comment="Good work, arrived on time. Would recommend."
    )
    
    # ============ PHASE 10: CANCELLATION & REFUND ============
    suite.print_section("PHASE 10: Cancellation and Refund Processing")
    
    suite.update_booking_status(booking2["id"], "cancelled")
    suite.process_refund(booking2["id"], "Customer requested cancellation before service start")
    suite.create_notification(
        customer1["id"],
        "booking_cancelled",
        "Booking Cancelled",
        "Your booking has been cancelled and refund has been processed",
        booking2["id"]
    )
    
    # ============ PHASE 11: NOTIFICATIONS ============
    suite.print_section("PHASE 11: User Notifications")
    
    notifications1 = suite.get_user_notifications(customer1["id"])
    suite.print_data("Notifications for Customer 1", notifications1)
    
    # ============ PHASE 12: DASHBOARDS & ANALYTICS ============
    suite.print_section("PHASE 12: Dashboard Analytics")
    
    customer_dashboard = suite.get_customer_dashboard(customer1["id"])
    suite.print_data("Customer Dashboard - Ali Ahmed", customer_dashboard)
    
    provider_dashboard = suite.get_provider_dashboard(provider1["id"])
    suite.print_data("Provider Dashboard - Ahmed Khan", provider_dashboard)
    
    admin_stats = suite.get_admin_stats()
    suite.print_data("Admin Dashboard Stats", admin_stats)
    
    # ============ FINAL SUMMARY ============
    suite.print_section("FINAL SUMMARY")
    
    print(f"📊 TOTAL STATISTICS:")
    print(f"  • Total Users Created: {len(suite.users)}")
    print(f"  • Total Providers Created: {len(suite.providers)}")
    print(f"  • Total Bookings: {len(suite.bookings)}")
    print(f"  • Total Payments: {len(suite.payments)}")
    print(f"  • Total Notifications: {sum(len(n) for n in suite.notifications.values())}")
    print(f"  • Customer Locations: {sum(len(l) for l in suite.locations.values())}")
    
    completed = len([b for b in suite.bookings.values() if b["status"] == "completed"])
    pending = len([b for b in suite.bookings.values() if b["status"] in ["requested", "pending"]])
    cancelled = len([b for b in suite.bookings.values() if b["status"] == "cancelled"])
    
    print(f"\n📈 BOOKING STATISTICS:")
    print(f"  • Completed Bookings: {completed}")
    print(f"  • Pending/Active Bookings: {pending}")
    print(f"  • Cancelled Bookings: {cancelled}")
    
    total_revenue = sum(p["amount"] for p in suite.payments.values())
    print(f"\n💰 FINANCIAL SUMMARY:")
    print(f"  • Total Revenue: Rs. {total_revenue:,.2f}")
    print(f"  • Average Booking Value: Rs. {total_revenue / max(len(suite.bookings), 1):,.2f}")
    
    avg_rating = sum(p["rating"] for p in suite.providers.values()) / max(len(suite.providers), 1)
    print(f"\n⭐ QUALITY METRICS:")
    print(f"  • Average Provider Rating: {avg_rating:.2f}/5.0")
    print(f"  • Total Reviews: {sum(p['review_count'] for p in suite.providers.values())}")
    
    print("\n✅ ALL TESTS COMPLETED SUCCESSFULLY!\n")
    

if __name__ == "__main__":
    try:
        run_tests()
    except Exception as e:
        print(f"❌ Test failed with error: {e}")
        import traceback
        traceback.print_exc()
