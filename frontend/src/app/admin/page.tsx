"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard, Users, Wrench, Calendar, Star, AlertTriangle,
  DollarSign, TrendingUp, CheckCircle, XCircle, MoreVertical,
  BarChart3, PieChart, Activity
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

// Mock admin data
const stats = {
  total_users: 1250,
  total_providers: 156,
  total_bookings: 3420,
  total_revenue: 2850000,
  pending_providers: 12,
  pending_reviews: 8,
  open_complaints: 5,
};

const recentBookings = [
  { id: 1, customer: "Sarah A.", provider: "Ahmed Khan", service: "AC Repair", status: "completed", amount: 1500, date: "2 hours ago" },
  { id: 2, customer: "Muhammad K.", provider: "Muhammad Ali", service: "Plumbing", status: "in_progress", amount: 800, date: "4 hours ago" },
  { id: 3, customer: "Fatima R.", provider: "Farhan Sheikh", service: "Electrician", status: "pending", amount: 2000, date: "6 hours ago" },
  { id: 4, customer: "Ali S.", provider: "Sajid Mehmood", service: "Carpenter", status: "accepted", amount: 3500, date: "1 day ago" },
];

const pendingProviders = [
  { id: 1, name: "Imran Ahmed", category: "AC Repair", submitted: "2 days ago" },
  { id: 2, name: "Kashif Mehmood", category: "Plumbing", submitted: "3 days ago" },
  { id: 3, name: "Rashid Khan", category: "Electrician", submitted: "1 week ago" },
];

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  accepted: "bg-blue-100 text-blue-800",
  in_progress: "bg-orange-100 text-orange-800",
  completed: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

export default function AdminDashboardPage() {
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState("overview");

  const tabs = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "users", label: "Users", icon: Users },
    { id: "providers", label: "Providers", icon: Wrench },
    { id: "bookings", label: "Bookings", icon: Calendar },
    { id: "reviews", label: "Reviews", icon: Star },
    { id: "complaints", label: "Complaints", icon: AlertTriangle },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
  ];

  const statCards = [
    { label: "Total Users", value: stats.total_users.toLocaleString(), icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Total Providers", value: stats.total_providers.toString(), icon: Wrench, color: "text-green-600", bg: "bg-green-50" },
    { label: "Total Bookings", value: stats.total_bookings.toLocaleString(), icon: Calendar, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Total Revenue", value: `Rs. ${(stats.total_revenue / 100000).toFixed(1)}L`, icon: DollarSign, color: "text-yellow-600", bg: "bg-yellow-50" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container-custom py-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">س</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-sm text-gray-500">Sehat & Service Admin Panel</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom py-6">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <nav className="space-y-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? "bg-primary/10 text-primary"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-4 space-y-6">
            {activeTab === "overview" && (
              <>
                {/* Stats Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {statCards.map((stat, index) => (
                    <div key={index} className="bg-white rounded-xl p-4 shadow-sm">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-500">{stat.label}</p>
                          <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
                        </div>
                        <div className={`w-12 h-12 ${stat.bg} rounded-xl flex items-center justify-center`}>
                          <stat.icon className={`w-6 h-6 ${stat.color}`} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Pending Actions */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900">Pending Providers</h3>
                      <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                        {stats.pending_providers}
                      </span>
                    </div>
                    <div className="space-y-3">
                      {pendingProviders.map((provider) => (
                        <div key={provider.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-sm">{provider.name}</p>
                            <p className="text-xs text-gray-500">{provider.category}</p>
                          </div>
                          <div className="flex gap-2">
                            <button className="p-1.5 bg-green-100 text-green-600 rounded-lg hover:bg-green-200">
                              <CheckCircle className="w-4 h-4" />
                            </button>
                            <button className="p-1.5 bg-red-100 text-red-600 rounded-lg hover:bg-red-200">
                              <XCircle className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button className="w-full mt-4 text-sm text-primary font-medium hover:underline">
                      View All
                    </button>
                  </div>

                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900">Pending Reviews</h3>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
                        {stats.pending_reviews}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mb-4">Reviews awaiting moderation</p>
                    <button className="w-full mt-4 text-sm text-primary font-medium hover:underline">
                      Moderate Reviews
                    </button>
                  </div>

                  <div className="bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-semibold text-gray-900">Open Complaints</h3>
                      <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                        {stats.open_complaints}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 mb-4">Complaints need attention</p>
                    <button className="w-full mt-4 text-sm text-primary font-medium hover:underline">
                      Handle Complaints
                    </button>
                  </div>
                </div>

                {/* Recent Bookings */}
                <div className="bg-white rounded-xl p-6 shadow-sm">
                  <h3 className="font-semibold text-gray-900 mb-4">Recent Bookings</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Customer</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Provider</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Service</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Amount</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentBookings.map((booking) => (
                          <tr key={booking.id} className="border-b border-gray-100">
                            <td className="py-3 px-4 text-sm">{booking.customer}</td>
                            <td className="py-3 px-4 text-sm">{booking.provider}</td>
                            <td className="py-3 px-4 text-sm">{booking.service}</td>
                            <td className="py-3 px-4">
                              <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[booking.status]}`}>
                                {booking.status}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-sm">Rs. {booking.amount}</td>
                            <td className="py-3 px-4 text-sm text-gray-500">{booking.date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            )}

            {activeTab === "analytics" && (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-4">Analytics</h3>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500">Analytics charts coming soon</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab !== "overview" && activeTab !== "analytics" && (
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-4 capitalize">{activeTab}</h3>
                <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <Activity className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                    <p className="text-gray-500 capitalize">{activeTab} management coming soon</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}