"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard, Calendar, Clock, CheckCircle, XCircle,
  Star, MessageCircle, Phone, MapPin, Settings, LogOut,
  ChevronRight, ChevronDown, Package, Wallet, Heart, Bell, Loader2,
  ShieldCheck, ArrowUpRight, Award, Zap, TrendingUp, Users,
  Plus, Trash2, Edit2, Globe, Image as ImageIcon, DollarSign,
  AlertTriangle, CheckCircle2, Languages, AlertCircle, ShoppingBag, 
  BarChart3, Layers
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";
import * as api_ext from "@/lib/api_extensions";

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
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Service Management State
  const [isAddingService, setIsAddingService] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<number | null>(null);
  const [serviceFormData, setServiceFormData] = useState({
    name: "", name_urdu: "", description: "", description_urdu: "",
    price: 0, is_negotiable: true, category: "", image_url: "", duration_minutes: 60
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth/login");
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        if (user?.role === "provider") {
          const [dashboard, missions] = await Promise.all([
            api.getProviderDashboard(),
            api.getBookings()
          ]);
          setDashboardData(dashboard);
          setBookings(missions);
          
          const svcData = await api_ext.getProviderServices();
          setServices(svcData);
          setActiveTab("command-center");
        } else {
          const missions = await api.getBookings();
          setBookings(missions);
          setActiveTab("bookings");
        }
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isAuthenticated, user, router]);

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  // Provider Service Actions
  const handleServiceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingServiceId) {
        await api_ext.updateProviderService(editingServiceId, serviceFormData);
      } else {
        await api_ext.createProviderService(serviceFormData);
      }
      setIsAddingService(false);
      setEditingServiceId(null);
      alert(editingServiceId ? "Service updated." : "New service listing published.");
      setServiceFormData({
        name: "", name_urdu: "", description: "", description_urdu: "",
        price: 0, is_negotiable: true, category: "", image_url: "", duration_minutes: 60
      });
      // Refresh services
      const svcData = await api_ext.getProviderServices();
      setServices(svcData);
    } catch (err) {
      console.error("Error saving service", err);
      alert("Failed to synchronize listing with the registry.");
    }
  };

  const handleEditService = (service: any) => {
    setServiceFormData({
      name: service.name, name_urdu: service.name_urdu || "",
      description: service.description || "", description_urdu: service.description_urdu || "",
      price: service.price, is_negotiable: service.is_negotiable ?? true,
      category: service.category || "", image_url: service.image_url || "",
      duration_minutes: service.duration_minutes || 60
    });
    setEditingServiceId(service.id);
    setIsAddingService(true);
  };

  const handleDeleteService = async (id: number) => {
    if (confirm("Delete this service permanently?")) {
      try {
        await api_ext.deleteProviderService(id);
        const svcData = await api_ext.getProviderServices();
        setServices(svcData);
        alert("Listing decommissioned.");
      } catch (err) {
        console.error("Delete failed", err);
      }
    }
  };

  const tabs = user?.role === "provider" ? [
    { id: "command-center", label: "Command Center", icon: LayoutDashboard },
    { id: "services", label: "Service Catalog", icon: ShoppingBag },
    { id: "bookings", label: "Operations", icon: Calendar },
    { id: "wallet", label: "Earnings", icon: Wallet },
    { id: "settings", label: "Profile", icon: Settings },
  ] : [
    { id: "bookings", label: "Missions", icon: Calendar },
    { id: "saved", label: "Vault", icon: Heart },
    { id: "wallet", label: "Credits", icon: Wallet },
    { id: "settings", label: "Security", icon: Settings },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center">
        <Loader2 className="w-16 h-16 text-secondary animate-spin mb-6" />
        <p className="text-secondary font-black uppercase tracking-[0.4em] text-[10px] animate-pulse">Initializing Dashboard Terminal</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 pt-28 pb-20">
      <div className="container-custom">
        {/* Profile Summary Header */}
        <div className="bg-slate-900 rounded-[3rem] p-10 md:p-12 mb-12 border border-white/10 shadow-2xl relative overflow-hidden animate-reveal">
           <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
           
           <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
              <div className="relative">
                <div className="w-32 h-32 md:w-40 md:h-40 bg-white/5 rounded-[2.5rem] border-4 border-white/5 flex items-center justify-center overflow-hidden shadow-2xl">
                  {user?.photo ? (
                    <img src={user.photo} className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-7xl font-black text-white/5">{user?.name?.charAt(0)}</span>
                  )}
                </div>
                <div className="absolute -bottom-2 -right-2 bg-secondary text-slate-950 p-2.5 rounded-2xl shadow-xl border-4 border-slate-900">
                  <ShieldCheck className="w-6 h-6" />
                </div>
              </div>

              <div className="flex-1 text-center md:text-left">
                 <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 rounded-lg border border-white/10 mb-4">
                    <span className="text-[10px] font-black text-secondary uppercase tracking-[0.2em]">
                      {user?.role === 'provider' ? 'Verified Guild Member' : 'Elite Account'}
                    </span>
                 </div>
                 <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-4">{user?.name}</h1>
                 <div className="flex flex-wrap justify-center md:justify-start gap-8">
                    <div className="flex items-center gap-2 text-white/30 text-[10px] font-black uppercase tracking-[0.2em]">
                       <Phone className="w-4 h-4 text-secondary" />
                       {user?.phone}
                    </div>
                    <div className="flex items-center gap-2 text-white/30 text-[10px] font-black uppercase tracking-[0.2em]">
                       <Award className="w-4 h-4 text-secondary" />
                       {user?.role === 'provider' ? 'Top Rated Expert' : 'Elite Status'}
                    </div>
                 </div>
              </div>

              {user?.role === 'provider' ? (
                <div className="flex gap-4">
                   <div className="bg-white/5 p-6 rounded-3xl border border-white/10 text-center min-w-[120px]">
                      <p className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-1">Rating</p>
                      <div className="flex items-center justify-center gap-1 text-secondary">
                        <Star className="w-4 h-4 fill-secondary" />
                        <p className="text-2xl font-black text-white">{dashboardData?.average_rating || '5.0'}</p>
                      </div>
                   </div>
                   <div className="bg-white/5 p-6 rounded-3xl border border-white/10 text-center min-w-[120px]">
                      <p className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-1">Total Earnings</p>
                      <p className="text-2xl font-black text-secondary">Rs. {dashboardData?.total_earnings || '0'}</p>
                   </div>
                </div>
              ) : (
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
              )}
           </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
          {/* Navigation Sidebar */}
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
                  <span>Log Out</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Main Dashboard Terminal */}
          <div className="lg:col-span-3">
            {/* Provider Command Center View */}
            {activeTab === "command-center" && user?.role === "provider" && (
              <div className="space-y-10 animate-reveal">
                 <div className="flex items-center justify-between">
                    <h2 className="text-3xl font-black text-white tracking-tighter">Command Center</h2>
                    <span className="text-[10px] font-black text-white/20 uppercase tracking-[0.2em]">Operational Status: Optimal</span>
                 </div>

                 {/* Daraz/OLX Style Stats Cards */}
                 <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-slate-900 p-8 rounded-[2rem] border border-white/10 hover:border-secondary/30 transition-all">
                       <p className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-4">Pending Orders</p>
                       <div className="flex items-center justify-between">
                          <p className="text-4xl font-black text-white">{dashboardData?.pending_bookings?.length || 0}</p>
                          <div className="w-12 h-12 bg-amber-500/10 rounded-xl flex items-center justify-center">
                             <Clock className="w-6 h-6 text-amber-500" />
                          </div>
                       </div>
                    </div>
                    <div className="bg-slate-900 p-8 rounded-[2rem] border border-white/10 hover:border-secondary/30 transition-all">
                       <p className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-4">Active Services</p>
                       <div className="flex items-center justify-between">
                          <p className="text-4xl font-black text-white">{services.length}</p>
                          <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center">
                             <Layers className="w-6 h-6 text-blue-500" />
                          </div>
                       </div>
                    </div>
                    <div className="bg-slate-900 p-8 rounded-[2rem] border border-white/10 hover:border-secondary/30 transition-all">
                       <p className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-4">Success Rate</p>
                       <div className="flex items-center justify-between">
                          <p className="text-4xl font-black text-white">98%</p>
                          <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center">
                             <TrendingUp className="w-6 h-6 text-emerald-500" />
                          </div>
                       </div>
                    </div>
                    <div className="bg-slate-900 p-8 rounded-[2rem] border border-white/10 hover:border-secondary/30 transition-all">
                       <p className="text-[9px] font-black text-white/20 uppercase tracking-widest mb-4">Customer Chat</p>
                       <div className="flex items-center justify-between">
                          <p className="text-4xl font-black text-white">4</p>
                          <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center">
                             <MessageCircle className="w-6 h-6 text-purple-500" />
                          </div>
                       </div>
                    </div>
                 </div>

                 {/* Quick Actions */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-gradient-to-br from-slate-900 to-black p-10 rounded-[3rem] border border-white/10 relative overflow-hidden group">
                       <div className="absolute top-0 right-0 w-32 h-32 bg-secondary/5 rounded-full blur-3xl group-hover:bg-secondary/10 transition-all"></div>
                       <h3 className="text-2xl font-black text-white mb-4">Expand Your Reach</h3>
                       <p className="text-white/40 mb-8 font-medium">Add new skills or services to your catalog to attract more customers.</p>
                       <button 
                        onClick={() => setActiveTab("services")}
                        className="bg-secondary text-slate-950 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center gap-3"
                       >
                         <Plus className="w-5 h-5" /> Add New Service
                       </button>
                    </div>
                    <div className="bg-white/5 p-10 rounded-[3rem] border border-white/5 flex flex-col justify-center">
                       <h3 className="text-xl font-black text-white mb-6 flex items-center gap-3">
                          <BarChart3 className="w-6 h-6 text-secondary" />
                          Market Analytics
                       </h3>
                       <div className="space-y-4">
                          <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5">
                             <span className="text-xs font-bold text-white/40 uppercase tracking-widest">Search Visibility</span>
                             <span className="text-xs font-black text-emerald-500">+12% this week</span>
                          </div>
                          <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5">
                             <span className="text-xs font-bold text-white/40 uppercase tracking-widest">Conversion Rate</span>
                             <span className="text-xs font-black text-white">4.2%</span>
                          </div>
                       </div>
                    </div>
                 </div>
              </div>
            )}

            {/* Service Catalog View (The Provider's "OLX/Daraz" Listings) */}
            {activeTab === "services" && user?.role === "provider" && (
              <div className="space-y-10 animate-reveal">
                 <div className="flex items-center justify-between">
                    <div>
                      <h2 className="text-3xl font-black text-white tracking-tighter">Service Catalog</h2>
                      <p className="text-white/30 text-xs font-bold uppercase tracking-widest mt-1">Manage your professional listings</p>
                    </div>
                    <button 
                      onClick={() => { setEditingServiceId(null); setIsAddingService(true); }}
                      className="bg-secondary text-slate-950 px-6 py-3.5 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center gap-2"
                    >
                      <Plus className="w-4 h-4" /> Add Listing
                    </button>
                 </div>

                 {/* Warning Banner */}
                 <div className="bg-amber-500/10 border border-amber-500/20 rounded-[1.5rem] p-6 flex gap-4 items-start">
                   <AlertTriangle className="w-6 h-6 text-amber-500 flex-shrink-0" />
                   <p className="text-amber-500/70 text-xs leading-relaxed font-medium">
                     You are free to add any service. **Sehat & Service** is not responsible for the quality or legality of custom services. Use professional descriptions for better reach.
                   </p>
                 </div>

                 {/* Add/Edit Form */}
                 {isAddingService && (
                   <div className="bg-slate-900 p-8 rounded-[2.5rem] border border-white/10 animate-reveal">
                      <div className="flex justify-between items-center mb-8">
                         <h3 className="text-xl font-black text-white">{editingServiceId ? 'Edit Listing' : 'New Listing'}</h3>
                         <button onClick={() => setIsAddingService(false)} className="text-white/20 hover:text-white"><XCircle /></button>
                      </div>
                      <form onSubmit={handleServiceSubmit} className="space-y-6">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                               <label className="text-[10px] font-black text-white/20 uppercase tracking-widest ml-4">Service Name (English)</label>
                               <input 
                                required
                                className="w-full px-6 py-4 bg-white/5 border-none rounded-2xl text-white focus:ring-2 focus:ring-secondary/20"
                                value={serviceFormData.name}
                                onChange={(e) => setServiceFormData({...serviceFormData, name: e.target.value})}
                               />
                            </div>
                            <div className="space-y-2">
                               <label className="text-[10px] font-black text-white/20 uppercase tracking-widest ml-4 text-right block">نام (اردو)</label>
                               <input 
                                dir="rtl"
                                className="w-full px-6 py-4 bg-white/5 border-none rounded-2xl text-white font-urdu text-lg focus:ring-2 focus:ring-secondary/20"
                                value={serviceFormData.name_urdu}
                                onChange={(e) => setServiceFormData({...serviceFormData, name_urdu: e.target.value})}
                               />
                            </div>
                         </div>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                               <label className="text-[10px] font-black text-white/20 uppercase tracking-widest ml-4">Price (Rs.)</label>
                               <input 
                                type="number"
                                required
                                className="w-full px-6 py-4 bg-white/5 border-none rounded-2xl text-white focus:ring-2 focus:ring-secondary/20"
                                value={serviceFormData.price}
                                onChange={(e) => setServiceFormData({...serviceFormData, price: parseFloat(e.target.value)})}
                               />
                            </div>
                            <div className="flex items-center gap-4 pt-8">
                               <button 
                                type="button"
                                onClick={() => setServiceFormData({...serviceFormData, is_negotiable: !serviceFormData.is_negotiable})}
                                className={`flex-1 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] border transition-all ${serviceFormData.is_negotiable ? 'bg-secondary/10 border-secondary text-secondary' : 'bg-white/5 border-white/5 text-white/30'}`}
                               >
                                 Negotiable Price
                               </button>
                            </div>
                         </div>
                         <div className="space-y-2">
                            <label className="text-[10px] font-black text-white/20 uppercase tracking-widest ml-4">Description</label>
                            <textarea 
                              className="w-full px-6 py-4 bg-white/5 border-none rounded-2xl text-white focus:ring-2 focus:ring-secondary/20 h-32 resize-none"
                              value={serviceFormData.description}
                              onChange={(e) => setServiceFormData({...serviceFormData, description: e.target.value})}
                            />
                         </div>
                         <div className="flex gap-4">
                            <button type="submit" className="flex-1 bg-secondary text-slate-950 py-5 rounded-2xl font-black uppercase tracking-widest text-xs">Deploy Listing</button>
                            <button type="button" onClick={() => setIsAddingService(false)} className="px-8 bg-white/5 text-white/40 rounded-2xl font-black uppercase tracking-widest text-xs">Cancel</button>
                         </div>
                      </form>
                   </div>
                 )}

                 {/* Listings Grid */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {services.map((service) => (
                      <div key={service.id} className="bg-slate-900/60 p-8 rounded-[2rem] border border-white/5 group hover:border-secondary/30 transition-all flex flex-col">
                         <div className="flex justify-between items-start mb-6">
                            <div className="w-16 h-16 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center">
                               {service.image_url ? (
                                 <img src={service.image_url} className="w-full h-full object-cover rounded-2xl" />
                               ) : (
                                 <ShoppingBag className="w-8 h-8 text-white/10" />
                               )}
                            </div>
                            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                               <button onClick={() => handleEditService(service)} className="p-3 bg-white/5 hover:bg-white/10 rounded-xl text-white/40 hover:text-white transition-all"><Edit2 className="w-4 h-4" /></button>
                               <button onClick={() => handleDeleteService(service.id)} className="p-3 bg-white/5 hover:bg-red-500/20 rounded-xl text-white/40 hover:text-red-500 transition-all"><Trash2 className="w-4 h-4" /></button>
                            </div>
                         </div>
                         <h3 className="text-xl font-black text-white mb-2">{service.name}</h3>
                         <div className="flex items-center gap-3 mb-6">
                            <span className="text-xl font-black text-secondary">Rs. {service.price}</span>
                            <span className="text-[9px] font-black text-white/20 uppercase tracking-widest">{service.is_negotiable ? 'Negotiable' : 'Fixed'}</span>
                         </div>
                         <p className="text-white/40 text-xs leading-relaxed line-clamp-2 mb-8">{service.description}</p>
                         <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                               <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                               <span className="text-[9px] font-black text-white/30 uppercase tracking-widest">Active & Visible</span>
                            </div>
                            <div className="flex items-center gap-1 text-white/20">
                               <Star className="w-3 h-3 fill-white/20" />
                               <span className="text-[9px] font-bold">No Ratings yet</span>
                            </div>
                         </div>
                      </div>
                    ))}
                    {services.length === 0 && !isAddingService && (
                      <div className="col-span-full py-20 bg-white/5 rounded-[2.5rem] border border-dashed border-white/10 text-center">
                         <ShoppingBag className="w-12 h-12 text-white/10 mx-auto mb-4" />
                         <p className="text-white/40 font-bold uppercase tracking-widest text-[10px]">No listings in your catalog</p>
                         <button onClick={() => setIsAddingService(true)} className="text-secondary font-black uppercase tracking-widest text-[10px] mt-4 hover:underline">Add Your First Skill +</button>
                      </div>
                    )}
                 </div>
              </div>
            )}

            {/* Standard Missions/Bookings View */}
            {activeTab === "bookings" && (
              <div className="space-y-8 animate-reveal stagger-1">
                <div className="flex items-center justify-between mb-4 px-4">
                  <h2 className="text-3xl font-black text-white tracking-tighter">
                    {user?.role === 'provider' ? 'Mission Control' : 'Operation History'}
                  </h2>
                  <Link href="/search" className="text-[10px] font-black uppercase tracking-widest text-secondary hover:underline">
                    {user?.role === 'provider' ? 'Browse Board' : 'New Mission +'}
                  </Link>
                </div>

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
                            {(user?.role === 'provider' ? (booking.customer?.name || "C") : (booking.provider?.user?.name || "P")).charAt(0)}
                          </div>
                          <div>
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-2xl font-black text-white tracking-tight">
                                {user?.role === 'provider' ? (booking.customer?.name || "Client") : (booking.provider?.user?.name || "Expert Professional")}
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
                    </div>
                  ))}

                  {bookings.length === 0 && (
                    <div className="bg-slate-900 rounded-[3rem] p-24 text-center border border-white/5 border-dashed">
                      <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-8">
                        <Package className="w-10 h-10 text-white/10" />
                      </div>
                      <h3 className="text-2xl font-black text-white mb-2">No Active Missions</h3>
                      <p className="text-white/30 font-medium mb-10">Your operational log is currently empty.</p>
                      <Link href="/search" className="btn-secondary !px-12">Search Marketplace</Link>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Other tabs (Wallet, Settings, etc.) */}
            {activeTab === "wallet" && (
               <div className="animate-reveal space-y-8">
                  <div className="bg-gradient-to-br from-slate-900 to-black rounded-[3rem] p-12 border border-white/10 shadow-2xl relative overflow-hidden">
                     <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
                     <h2 className="text-[10px] font-black text-secondary uppercase tracking-[0.4em] mb-10">Credit Repository</h2>
                     <div className="flex items-baseline gap-3 mb-12">
                        <span className="text-7xl font-black text-white tracking-tighter">Rs. {dashboardData?.total_earnings || '0'}</span>
                        <span className="text-white/20 font-black uppercase text-xs tracking-widest">Settled Balance</span>
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button className="py-6 bg-secondary text-slate-950 rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-xl shadow-amber-900/20 hover:scale-[1.02] transition-all">Withdraw Funds</button>
                        <button className="py-6 bg-white/5 text-white/60 border border-white/10 rounded-[2rem] font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all">Audit History</button>
                     </div>
                  </div>
               </div>
            )}

            {activeTab === "settings" && (
              <div className="bg-slate-900 rounded-[3rem] p-12 border border-white/10 animate-reveal">
                <h2 className="text-3xl font-black text-white tracking-tighter mb-12">
                  {user?.role === 'provider' ? 'Business Operations Deck' : 'Personal Security & Identity'}
                </h2>
                
                <div className="space-y-12 max-w-2xl">
                  {/* Common Settings */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="group">
                      <label className="block text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-4 ml-4">Legal Name</label>
                      <input type="text" defaultValue={user?.name} className="w-full px-8 py-6 bg-white/5 border-none rounded-[2rem] text-white font-bold text-lg focus:ring-2 focus:ring-secondary/20 transition-all" />
                    </div>
                    <div className="group opacity-50">
                      <label className="block text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-4 ml-4">Secure Phone</label>
                      <input type="tel" defaultValue={user?.phone} className="w-full px-8 py-6 bg-white/5 border-none rounded-[2rem] text-white font-bold text-lg cursor-not-allowed" readOnly />
                    </div>
                  </div>

                  {/* Provider-Specific Business Settings */}
                  {user?.role === 'provider' && (
                    <div className="space-y-12 pt-12 border-t border-white/5 animate-reveal">
                       <div>
                          <h3 className="text-secondary font-black uppercase tracking-[0.3em] text-xs mb-8">Seller Center: Financial Repository</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                             <div className="group">
                                <label className="block text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-4 ml-4">Bank Name</label>
                                <input placeholder="e.g. HBL, Alfalah" className="w-full px-8 py-6 bg-white/5 border-none rounded-[2rem] text-white font-bold transition-all" />
                             </div>
                             <div className="group">
                                <label className="block text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-4 ml-4">Account Number / IBAN</label>
                                <input placeholder="PK00..." className="w-full px-8 py-6 bg-white/5 border-none rounded-[2rem] text-white font-bold transition-all" />
                             </div>
                          </div>
                       </div>

                       <div>
                          <h3 className="text-secondary font-black uppercase tracking-[0.3em] text-xs mb-8">Guild Verification (CNIC)</h3>
                          <div className="group">
                             <label className="block text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-4 ml-4">Identity Number</label>
                             <input placeholder="XXXXX-XXXXXXX-X" className="w-full px-8 py-6 bg-white/5 border-none rounded-[2rem] text-white font-bold transition-all" />
                          </div>
                       </div>
                    </div>
                  )}

                  {/* Customer Option to Become Provider */}
                  {user?.role === 'customer' && (
                    <div className="bg-gradient-to-br from-secondary/10 to-transparent p-10 rounded-[3rem] border border-secondary/20 mt-12">
                       <h3 className="text-xl font-black text-white mb-4">Start Your Professional Guild</h3>
                       <p className="text-white/40 mb-8 font-medium">Ready to offer your skills to the community? Join our elite network of verified professionals.</p>
                       <button 
                        onClick={() => router.push('/provider/onboarding')}
                        className="bg-secondary text-slate-950 px-10 py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs flex items-center gap-3 shadow-xl shadow-secondary/10"
                       >
                         Initialize Provider Protocol
                       </button>
                    </div>
                  )}

                  <button className="btn-secondary !w-full !rounded-[2.5rem] !py-7 !shadow-xl shadow-amber-900/20">
                    {user?.role === 'provider' ? 'Synchronize Business Profile' : 'Update Security Clearance'}
                  </button>
                </div>
              </div>
            )}

            {/* Vault View for Customers */}
            {activeTab === "saved" && user?.role === "customer" && (
              <div className="bg-slate-900 rounded-[3rem] p-24 text-center border border-white/5 animate-reveal">
                <Heart className="w-16 h-16 text-white/10 mx-auto mb-8" />
                <h3 className="text-2xl font-black text-white mb-2">The Vault is Empty</h3>
                <p className="text-white/30 font-medium mb-10">Save elite professionals here for instant access.</p>
                <Link href="/search" className="btn-secondary !px-12">Search Marketplace</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
