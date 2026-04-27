"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft, Search, Send, Phone, Video, MoreVertical, Check, CheckCheck,
  Image, Paperclip, Smile, Mic, ArrowRight, User, Clock
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";

// Mock conversations
const mockConversations = [
  {
    id: 1,
    provider: { id: 1, name: "Ahmed Khan", photo: null, category: "AC Repair" },
    lastMessage: "I'll be there in 30 minutes",
    time: "10:30 AM",
    unread: 2,
    isOnline: true,
  },
  {
    id: 2,
    provider: { id: 2, name: "Muhammad Ali", photo: null, category: "Plumbing" },
    lastMessage: "Thank you for booking!",
    time: "Yesterday",
    unread: 0,
    isOnline: false,
  },
  {
    id: 3,
    provider: { id: 3, name: "Farhan Sheikh", photo: null, category: "Electrician" },
    lastMessage: "Can you send the address again?",
    time: "2 days ago",
    unread: 0,
    isOnline: true,
  },
];

// Mock messages for conversation 1
const mockMessages = [
  { id: 1, sender: "customer", message: "Hello, I need AC repair service", time: "10:00 AM", status: "read" },
  { id: 2, sender: "provider", message: "Hello! Sure, I can help with AC repair. What seems to be the problem?", time: "10:02 AM", status: "read" },
  { id: 3, sender: "customer", message: "My AC is not cooling properly. It makes weird noise too.", time: "10:05 AM", status: "read" },
  { id: 4, sender: "provider", message: "I see. It could be a refrigerant leak or compressor issue. I can come and check it for you.", time: "10:08 AM", status: "read" },
  { id: 5, sender: "customer", message: "Yes please, when can you come?", time: "10:10 AM", status: "read" },
  { id: 6, sender: "provider", message: "I can come today between 2-4 PM. Would that work for you?", time: "10:12 AM", status: "read" },
  { id: 7, sender: "customer", message: "Perfect! Please come at 3 PM", time: "10:15 AM", status: "read" },
  { id: 8, sender: "provider", message: "Great! I'll be there at 3 PM. Please make sure someone is at home.", time: "10:18 AM", status: "read" },
  { id: 9, sender: "provider", message: "I'll be there in 30 minutes", time: "10:30 AM", status: "delivered" },
];

export default function ChatPage() {
  const searchParams = useSearchParams();
  const conversationId = searchParams.get("id");
  const { language, t } = useLanguage();
  const { isAuthenticated } = useAuth();
  
  const [selectedConversation, setSelectedConversation] = useState<number | null>(
    conversationId ? parseInt(conversationId) : null
  );
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const currentConversation = mockConversations.find(c => c.id === selectedConversation);
  const messages = selectedConversation === 1 ? mockMessages : [];

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // In production, this would call the API
      alert("Message sent!");
      setNewMessage("");
    }
  };

  const filteredConversations = mockConversations.filter(c =>
    c.provider.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {language === "en" ? "Please Login" : "براہ کرم لاگ ان کریں"}
          </h1>
          <p className="text-gray-600 mb-4">
            {language === "en" 
              ? "You need to be logged in to view your messages" 
              : "اپنے پیغامات دیکھنے کے لیے لاگ ان ہونا ضروری ہے"}
          </p>
          <Link
            href="/auth/login"
            className="inline-block px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors"
          >
            {language === "en" ? "Login" : "لاگ ان"}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-16 md:top-0 z-40">
        <div className="container-custom py-4">
          <div className="flex items-center gap-3">
            <Link href="/dashboard" className="p-2 hover:bg-gray-100 rounded-lg">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                {language === "en" ? "Messages" : "پیغامات"}
              </h1>
              <p className="text-sm text-gray-500">
                {language === "en" ? "Chat with your service providers" : "اپنے سروس فراہم کنندوں سے چیٹ کریں"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom py-4">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3 min-h-[600px]">
            {/* Conversations List */}
            <div className={`md:col-span-1 border-r border-gray-200 ${selectedConversation ? 'hidden md:block' : 'block'}`}>
              {/* Search */}
              <div className="p-4 border-b border-gray-200">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={language === "en" ? "Search conversations..." : "پیغامات تلاش کریں..."}
                    className="w-full pl-10 pr-4 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Conversations */}
              <div className="overflow-y-auto max-h-[500px]">
                {filteredConversations.map((conversation) => (
                  <button
                    key={conversation.id}
                    onClick={() => setSelectedConversation(conversation.id)}
                    className={`w-full p-4 flex items-start gap-3 hover:bg-gray-50 transition-colors text-left ${
                      selectedConversation === conversation.id ? "bg-primary/5" : ""
                    }`}
                  >
                    <div className="relative">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-lg font-semibold text-primary">
                          {conversation.provider.name.charAt(0)}
                        </span>
                      </div>
                      {conversation.isOnline && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900 truncate">
                          {conversation.provider.name}
                        </h3>
                        <span className="text-xs text-gray-500">{conversation.time}</span>
                      </div>
                      <p className="text-sm text-gray-500 truncate">{conversation.category}</p>
                      <p className="text-sm text-gray-600 truncate mt-1">{conversation.lastMessage}</p>
                    </div>
                    {conversation.unread > 0 && (
                      <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-xs text-white font-medium">{conversation.unread}</span>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Area */}
            <div className={`md:col-span-2 ${!selectedConversation ? 'hidden md:block' : 'block'}`}>
              {selectedConversation && currentConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setSelectedConversation(null)}
                        className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
                      >
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                      </button>
                      <div className="relative">
                        <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                          <span className="text-lg font-semibold text-primary">
                            {currentConversation.provider.name.charAt(0)}
                          </span>
                        </div>
                        {currentConversation.isOnline && (
                          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {currentConversation.provider.name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {currentConversation.isOnline 
                            ? language === "en" ? "Online" : "آن لائن"
                            : language === "en" ? "Offline" : "آف لائن"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded-lg">
                        <Phone className="w-5 h-5 text-gray-600" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg">
                        <Video className="w-5 h-5 text-gray-600" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg">
                        <MoreVertical className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="p-4 overflow-y-auto max-h-[400px] space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === "customer" ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-[80%] px-4 py-2 rounded-2xl ${
                            message.sender === "customer"
                              ? "bg-primary text-white rounded-br-md"
                              : "bg-gray-100 text-gray-900 rounded-bl-md"
                          }`}
                        >
                          <p className="text-sm">{message.message}</p>
                          <div className={`flex items-center justify-end gap-1 mt-1 ${
                            message.sender === "customer" ? "text-white/70" : "text-gray-500"
                          }`}>
                            <span className="text-xs">{message.time}</span>
                            {message.sender === "customer" && (
                              message.status === "read" 
                                ? <CheckCheck className="w-3.5 h-3.5" />
                                : <Check className="w-3.5 h-3.5" />
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center gap-2">
                      <button className="p-2 hover:bg-gray-100 rounded-lg">
                        <Paperclip className="w-5 h-5 text-gray-500" />
                      </button>
                      <button className="p-2 hover:bg-gray-100 rounded-lg">
                        <Image className="w-5 h-5 text-gray-500" />
                      </button>
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                        placeholder={language === "en" ? "Type a message..." : "پیغام لکھیں..."}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <button className="p-2 hover:bg-gray-100 rounded-lg">
                        <Smile className="w-5 h-5 text-gray-500" />
                      </button>
                      <button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                        className="p-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Send className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="h-full flex items-center justify-center p-8">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <User className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {language === "en" ? "Select a conversation" : "پیغام کا انتخاب کریں"}
                    </h3>
                    <p className="text-gray-500">
                      {language === "en" 
                        ? "Choose from your existing conversations or start a new one" 
                        : "اپنے موجودہ پیغامات کا انتخاب کریں یا نیا پیغام شروع کریں"}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}