"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard, Calendar, Clock, CheckCircle, XCircle,
  Star, MessageCircle, Phone, MapPin, Settings, LogOut,
  ChevronRight, ChevronDown, Package, Wallet, Heart, Bell, Loader2,
  ShieldCheck, ArrowUpRight, Award, Zap
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";

const statusColors: Record<string, string> = {
  pending: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  accepted: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  on_way: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  in_progress: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  completed: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  cancelled: "bg-rose-500/10 text-rose-500 border-rose-500/20",
};

export default function DashboardPage() {
  const router = useRouter();
  const { language, t } = useLanguage();
  const { user, logout, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState("bookings");
  
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }

    const fetchBookings = async () => {
      try {
        const data = await api.getBookings(user?.id, user?.role);
        setBookings(data);
      } catch (error) {
        console.error("Failed to fetch bookings:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [isAuthenticated, user, router]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  const tabs = [
    { id: "bookings", label: language === "en" ? "Missions" : "میری بکنگز", icon: Calendar },
    { id: "saved", label: language === "en" ? "Vault" : "محفوظ شدہ", icon: Heart },
    { id: "wallet", label: language === "en" ? "Credits" : "والیٹ", icon: Wallet },
    { id: "settings", label: language === "en" ? "Security" : "ترتیبات", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-slate-950 pt-28 pb-20">
      <div className="container-custom">
        {/* Luxury Profile Header */}
        <div className="bg-slate-900 rounded-[3rem] p-10 md:p-12 mb-12 border border-white/10 shadow-2xl relative overflow-hidden animate-reveal">
           <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
           
           <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
              <div className="relative">
                <div className="w-32 h-32 md:w-40 md:h-40 bg-white/5 rounded-[2.5rem] border-4 border-white/5 flex items-center justify-center overflow-hidden shadow-2xl">
                  <span className="text-7xl font-black text-white/5">
                    {user?.name?.charAt(0) || "U"}
                  </span>
                </div>
                <div className="absolute -bottom-2 -right-2 bg-secondary text-slate-950 p-2.5 rounded-2xl shadow-xl border-4 border-slate-900">
                  <ShieldCheck className="w-6 h-6" />
                </div>
              </div>

              <div className="flex-1 text-center md:text-left">
                 <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 rounded-lg border border-white/10 mb-4">
                    <span className="text-[10px] font-black text-secondary uppercase tracking-[0.2em]">Verified Account</span>
                 </div>
                 <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-4">{user?.name || "User"}</h1>
                 <div className="flex flex-wrap justify-center md:justify-start gap-8">
                    <div className="flex items-center gap-2 text-white/30 text-[10px] font-black uppercase tracking-[0.2em]">
                       <Phone className="w-4 h-4 text-secondary" />
                       {user?.phone}
                    </div>
                    <div className="flex items-center gap-2 text-white/30 text-[10px] font-black uppercase tracking-[0.2em]">
                       <Award className="w-4 h-4 text-secondary" />
                       Elite Member
                    </div>
                 </div>
              </div>

              <div className="flex gap-4">
                 <div className="bg-white/5 p-6 rounded-3xl border border-white/10 text-center min-w-[120px]">
                    <p className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-1">Missions</p>
                    <p className="text-2xl font-black text-white">{bookings.length}</p>
                 </div>
                 <div className="bg-white/5 p-6 rounded-3xl border border-white/10 text-center min-w-[120px]">
                    <p className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-1">Credits</p>
                    <p className="text-2xl font-black text-secondary">Rs. 0</p>
                 </div>
              </div>
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Dashboard Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-slate-900 rounded-[3rem] p-6 border border-white/10 shadow-2xl sticky top-32">
              <nav className="space-y-3">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center justify-between p-5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all ${
                      activeTab === tab.id
                        ? "bg-secondary text-slate-950 shadow-xl shadow-amber-900/20"
                        : "text-white/40 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <tab.icon className="w-5 h-5" />
                      <span>{tab.label}</span>
                    </div>
                    {activeTab === tab.id && <ChevronRight className="w-4 h-4" />}
                  </button>
                ))}
                <div className="h-px bg-white/5 my-6 mx-4"></div>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-4 p-5 rounded-2xl text-xs font-black uppercase tracking-widest text-rose-500 hover:bg-rose-500/10 transition-all"
                >
                  <LogOut className="w-5 h-5" />
                  <span>{t("nav.logout")}</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Activity Terminal */}
          <div className="lg:col-span-3">
            {activeTab === "bookings" && (
              <div className="space-y-8 animate-reveal stagger-1">
                <div className="flex items-center justify-between mb-4 px-4">
                  <h2 className="text-3xl font-black text-white tracking-tighter">Mission Control</h2>
                  <Link href="/search" className="text-[10px] font-black uppercase tracking-widest text-secondary hover:underline">New Mission +</Link>
                </div>

                {loading ? (
                  <div className="flex flex-col items-center justify-center py-32 space-y-6">
                    <div className="w-16 h-16 rounded-full border-4 border-white/5 border-t-secondary animate-spin"></div>
                    <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Accessing Secure Records</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-6">
                    {bookings.map((booking, index) => (
                      <div
                        key={booking.id}
                        className="group bg-slate-900 rounded-[2.5rem] p-8 border border-white/5 hover:border-white/20 transition-all duration-500 animate-reveal"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                          <div className="flex items-center gap-6">
                            <div className="w-20 h-20 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center font-black text-white/5 text-3xl">
                              {(booking.provider?.user?.name || "P").charAt(0)}
                            </div>
                            <div>
                              <div className="flex items-center gap-3 mb-2">
                                <h3 className="text-2xl font-black text-white tracking-tight">
                                  {booking.provider?.user?.name || "Expert Professional"}
                                </h3>
                                <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${statusColors[booking.status] || "border-white/10 text-white/40"}`}>
                                  {booking.status}
                                </span>
                              </div>
                              <div className="flex gap-6 text-[10px] font-black uppercase tracking-widest text-white/30">
                                 <span className="flex items-center gap-2"><Zap className="w-3.5 h-3.5 text-secondary" /> {booking.service}</span>
                                 <span className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5 text-secondary" /> {new Date(booking.scheduled_date).toLocaleDateString()}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-4">
                             <div className="text-right mr-4 hidden md:block">
                                <p className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-1">Contract Value</p>
                                <p className="text-xl font-black text-white">Rs. {booking.price || booking.estimated_price}</p>
                             </div>
                             <Link 
                                href={`/chat?booking=${booking.id}`}
                                className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 hover:bg-secondary hover:text-slate-950 transition-all shadow-xl group-hover:rotate-12"
                              >
                                <MessageCircle className="w-6 h-6" />
                              </Link>
                              <button className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 hover:bg-white/10 transition-all">
                                <ChevronRight className="w-6 h-6 text-white/40" />
                              </button>
                          </div>
                        </div>

                        <div className="mt-8 pt-8 border-t border-white/5 grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
                           <div className="flex items-start gap-4">
                              <MapPin className="w-5 h-5 text-secondary flex-shrink-0 mt-1" />
                              <div>
                                 <p className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-1">Deployment Zone</p>
                                 <p className="text-white/60 font-bold leading-relaxed">{booking.address}</p>
                              </div>
                           </div>
                           <div className="flex items-start gap-4">
                              <Clock className="w-5 h-5 text-secondary flex-shrink-0 mt-1" />
                              <div>
                                 <p className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-1">Operation Window</p>
                                 <p className="text-white/60 font-bold uppercase tracking-widest">{booking.scheduled_time}</p>
                              </div>
                           </div>
                        </div>
                      </div>
                    ))}

                    {bookings.length === 0 && (
                      <div className="bg-slate-900 rounded-[3rem] p-24 text-center border border-white/5 border-dashed">
                        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8">
                          <Package className="w-10 h-10 text-white/10" />
                        </div>
                        <h3 className="text-2xl font-black text-white mb-2">No Active Missions</h3>
                        <p className="text-white/30 font-medium mb-10">Your operational log is currently empty.</p>
                        <Link
                          href="/search"
                          className="btn-secondary !px-12"
                        >
                          Book Your First Expert
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {activeTab === "saved" && (
              <div className="bg-slate-900 rounded-[3rem] p-24 text-center border border-white/5 animate-reveal">
                <Heart className="w-16 h-16 text-white/10 mx-auto mb-8" />
                <h3 className="text-2xl font-black text-white mb-2">The Vault is Empty</h3>
                <p className="text-white/30 font-medium mb-10">Save elite professionals here for instant access.</p>
                <Link href="/search" className="btn-secondary !px-12">Search Marketplace</Link>
              </div>
            )}

            {activeTab === "wallet" && (
              <div className="animate-reveal">
                <div className="bg-gradient-to-br from-slate-900 to-black rounded-[3rem] p-12 border border-white/10 shadow-2xl relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
                   <h2 className="text-[10px] font-black text-secondary uppercase tracking-[0.4em] mb-10">Credit Repository</h2>
                   <div className="flex items-baseline gap-3 mb-12">
                      <span className="text-7xl font-black text-white tracking-tighter">Rs. 0</span>
                      <span className="text-white/20 font-black uppercase text-xs tracking-widest">Available</span>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <button className="py-6 bg-secondary text-slate-950 rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-xl shadow-amber-900/20 hover:scale-[1.02] transition-all">Reload Credits</button>
                      <button className="py-6 bg-white/5 text-white/60 border border-white/10 rounded-[2rem] font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all">Audit History</button>
                   </div>
                </div>
              </div>
            )}

            {activeTab === "settings" && (
              <div className="bg-slate-900 rounded-[3rem] p-12 border border-white/10 animate-reveal">
                <h2 className="text-3xl font-black text-white tracking-tighter mb-12">Security & Identity</h2>
                
                <div className="space-y-10 max-w-2xl">
                  <div className="group">
                    <label className="block text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-4 ml-4">Legal Name</label>
                    <input
                      type="text"
                      defaultValue={user?.name}
                      className="w-full px-8 py-6 bg-white/5 border-none rounded-[2rem] text-white font-bold text-lg focus:ring-2 focus:ring-secondary/20 transition-all"
                    />
                  </div>
                  
                  <div className="group opacity-50">
                    <label className="block text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-4 ml-4">Secure Phone (Read Only)</label>
                    <input
                      type="tel"
                      defaultValue={user?.phone}
                      className="w-full px-8 py-6 bg-white/5 border-none rounded-[2rem] text-white font-bold text-lg cursor-not-allowed"
                      readOnly
                    />
                  </div>
                  
                  <div className="group">
                    <label className="block text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-4 ml-4">Emergency Email</label>
                    <input
                      type="email"
                      defaultValue={user?.email}
                      className="w-full px-8 py-6 bg-white/5 border-none rounded-[2rem] text-white font-bold text-lg focus:ring-2 focus:ring-secondary/20 transition-all"
                    />
                  </div>

                  <button className="btn-secondary !w-full !rounded-[2.5rem] !py-7 !shadow-xl shadow-amber-900/20">
                    Update Security Clearance
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
