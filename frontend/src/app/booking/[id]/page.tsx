"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft, Calendar, Clock, MapPin, Phone, MessageCircle,
  CheckCircle, XCircle, Clock3, User, Wrench, ChevronRight,
  Star, AlertTriangle, Send, MoreVertical
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";

// Mock booking data
const mockBookings: Record<number, any> = {
  1: {
    id: 1,
    provider: { id: 1, name: "Ahmed Khan", photo: null, phone: "03001234567" },
    category: "AC Repair",
    service: "Split AC Repair",
    status: "in_progress",
    date: "2024-01-15",
    time: "10:00 AM",
    price: 1500,
    address: "House #42, Model Town, Lahore",
    city: "Lahore",
    description: "AC not cooling properly, need gas refilling and service",
    created_at: "2024-01-14T10:00:00Z",
    customer: { name: "Customer User", phone: "03011234567" }
  },
  2: {
    id: 2,
    provider: { id: 2, name: "Muhammad Ali", photo: null, phone: "03019876543" },
    category: "Plumbing",
    service: "Leak Repair",
    status: "completed",
    date: "2024-01-10",
    time: "2:00 PM",
    price: 800,
    address: "House #42, Model Town, Lahore",
    city: "Lahore",
    description: "Kitchen sink leak",
    created_at: "2024-01-09T08:00:00Z",
    customer: { name: "Customer User", phone: "03011234567" }
  },
  3: {
    id: 3,
    provider: { id: 3, name: "Farhan Sheikh", photo: null, phone: "03031234567" },
    category: "Electrician",
    service: "Wiring Repair",
    status: "pending",
    date: "2024-01-20",
    time: "11:00 AM",
    price: 2000,
    address: "House #42, Model Town, Lahore",
    city: "Lahore",
    description: "Need complete wiring check for new house",
    created_at: "2024-01-18T14:00:00Z",
    customer: { name: "Customer User", phone: "03011234567" }
  },
};

// Mock chat messages
const mockChats: Record<number, any[]> = {
  1: [
    { id: 1, sender: "provider", message: "Hello! I'll be at your location in 30 minutes.", time: "09:30 AM" },
    { id: 2, sender: "customer", message: "Okay, I'll be waiting. Please call when you arrive.", time: "09:35 AM" },
    { id: 3, sender: "provider", message: "I'm on my way now. The traffic is light.", time: "09:45 AM" },
  ],
  2: [
    { id: 1, sender: "provider", message: "Thank you for booking our service!", time: "02:00 PM" },
    { id: 2, sender: "customer", message: "Thanks! When can you come?", time: "02:05 PM" },
    { id: 3, sender: "provider", message: "I can come tomorrow between 2-4 PM. Would that work?", time: "02:10 PM" },
  ],
};

const statusConfig: Record<string, { label: string; label_urdu: string; color: string; icon: any }> = {
  pending: { label: "Pending", label_urdu: "زیر غور", color: "bg-yellow-100 text-yellow-800", icon: Clock3 },
  accepted: { label: "Accepted", label_urdu: "قبول شدہ", color: "bg-blue-100 text-blue-800", icon: CheckCircle },
  on_way: { label: "On the Way", label_urdu: "راستے میں", color: "bg-purple-100 text-purple-800", icon: Wrench },
  in_progress: { label: "In Progress", label_urdu: "کام جاری", color: "bg-orange-100 text-orange-800", icon: Wrench },
  completed: { label: "Completed", label_urdu: "مکمل", color: "bg-green-100 text-green-800", icon: CheckCircle },
  cancelled: { label: "Cancelled", label_urdu: "منسوخ", color: "bg-red-100 text-red-800", icon: XCircle },
};

export default function BookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { language, t } = useLanguage();
  const { isAuthenticated } = useAuth();
  
  const bookingId = parseInt(params.id as string);
  const booking = mockBookings[bookingId] || mockBookings[1];
  const status = statusConfig[booking.status] || statusConfig.pending;
  const StatusIcon = status.icon;
  
  const [newMessage, setNewMessage] = useState("");
  const [showChat, setShowChat] = useState(false);
  const chats = mockChats[bookingId] || [];

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // In production, this would call the API
      alert("Message sent!");
      setNewMessage("");
    }
  };

  const handleCancelBooking = () => {
    if (confirm("Are you sure you want to cancel this booking?")) {
      alert("Booking cancelled!");
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-16 md:top-0 z-40">
        <div className="container-custom py-4">
          <div className="flex items-center gap-3">
            <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-gray-900">
                {language === "en" ? "Booking Details" : "بکنگ کی تفصیلات"}
              </h1>
              <p className="text-sm text-gray-500">#{booking.id}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom py-6">
        {/* Status Card */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${status.color}`}>
              <StatusIcon className="w-5 h-5" />
              <span className="font-medium">{language === "en" ? status.label : status.label_urdu}</span>
            </div>
            <span className="text-sm text-gray-500">
              {new Date(booking.created_at).toLocaleDateString()}
            </span>
          </div>

          <h2 className="text-xl font-bold text-gray-900 mb-2">{booking.service}</h2>
          <p className="text-gray-600 mb-4">{booking.category}</p>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>{booking.date}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Clock className="w-4 h-4" />
              <span>{booking.time}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-600 col-span-2">
              <MapPin className="w-4 h-4" />
              <span>{booking.address}</span>
            </div>
          </div>
        </div>

        {/* Provider Card */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <h3 className="font-semibold text-gray-900 mb-4">
            {language === "en" ? "Service Provider" : "سروس فراہم کنندہ"}
          </h3>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-primary">{booking.provider.name.charAt(0)}</span>
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900">{booking.provider.name}</h4>
              <p className="text-sm text-gray-500">{booking.category}</p>
            </div>
            <div className="flex gap-2">
              <a
                href={`tel:${booking.provider.phone}`}
                className="p-3 bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors"
              >
                <Phone className="w-5 h-5 text-primary" />
              </a>
              <a
                href={`https://wa.me/${booking.provider.phone.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 bg-green-500/10 rounded-lg hover:bg-green-500/20 transition-colors"
              >
                <MessageCircle className="w-5 h-5 text-green-600" />
              </a>
            </div>
          </div>
        </div>

        {/* Description Card */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <h3 className="font-semibold text-gray-900 mb-4">
            {language === "en" ? "Problem Description" : "مسئلے کی تفصیل"}
          </h3>
          <p className="text-gray-600">{booking.description}</p>
        </div>

        {/* Price Card */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
          <h3 className="font-semibold text-gray-900 mb-4">
            {language === "en" ? "Payment Details" : "ادائیگی کی تفصیلات"}
          </h3>
          <div className="flex justify-between items-center py-3 border-b border-gray-100">
            <span className="text-gray-600">{language === "en" ? "Service Charge" : "سروس چارج"}</span>
            <span className="font-semibold">Rs. {booking.price.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center py-3">
            <span className="font-medium text-gray-900">{language === "en" ? "Total" : "کل"}</span>
            <span className="text-xl font-bold text-primary">Rs. {booking.price.toLocaleString()}</span>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {language === "en" ? "Pay cash after service completion" : "سروس مکمل ہونے کے بعد نقد ادائیگی کریں"}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {booking.status === "pending" && (
            <button
              onClick={handleCancelBooking}
              className="w-full py-3 px-4 bg-red-50 text-red-600 rounded-lg font-medium hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
            >
              <XCircle className="w-5 h-5" />
              {language === "en" ? "Cancel Booking" : "بکنگ منسوخ کریں"}
            </button>
          )}
          
          {booking.status === "completed" && (
            <Link
              href={`/provider/${booking.provider.id}`}
              className="block w-full py-3 px-4 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors text-center"
            >
              {language === "en" ? "Leave a Review" : "رائے دیں"}
            </Link>
          )}

          <button
            onClick={() => setShowChat(!showChat)}
            className="w-full py-3 px-4 bg-white border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
          >
            <MessageCircle className="w-5 h-5" />
            {language === "en" ? "Chat with Provider" : "فراہم کنندہ سے چیٹ کریں"}
          </button>
        </div>

        {/* Chat Section */}
        {showChat && (
          <div className="mt-6 bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-200">
              <h3 className="font-semibold text-gray-900">
                {language === "en" ? "Chat" : "چیٹ"}
              </h3>
            </div>
            
            <div className="h-64 overflow-y-auto p-4 space-y-4">
              {chats.map((chat) => (
                <div
                  key={chat.id}
                  className={`flex ${chat.sender === "customer" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                      chat.sender === "customer"
                        ? "bg-primary text-white rounded-br-md"
                        : "bg-gray-100 text-gray-900 rounded-bl-md"
                    }`}
                  >
                    <p className="text-sm">{chat.message}</p>
                    <p className={`text-xs mt-1 ${chat.sender === "customer" ? "text-white/70" : "text-gray-500"}`}>
                      {chat.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-gray-200">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder={language === "en" ? "Type a message..." : "پیغام لکھیں..."}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  onClick={handleSendMessage}
                  className="p-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}