"use client";

import React, { useState, useEffect } from "react";
import { 
  Plus, Trash2, Edit2, Loader2, Save, X, 
  Info, AlertTriangle, CheckCircle2, Globe, 
  Image as ImageIcon, DollarSign, Clock, 
  ChevronRight, Languages, AlertCircle, Lock
} from "lucide-react";
import * as api from "@/lib/api_extensions";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function ServiceManagementPage() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const router = useRouter();
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    if (!authLoading && (!isAuthenticated || user?.role !== "provider")) {
      router.push("/auth/login");
      return;
    }
    fetchServices();
  }, [authLoading, isAuthenticated, user, router]);

  const fetchServices = async () => {
    try {
      const data = await api.getProviderServices(); 
      setServices(data);
    } catch (err) {
      console.error("Error fetching services", err);
    } finally {
      setLoading(false);
    }
  };

  const [formData, setFormData] = useState({
    name: "",
    name_urdu: "",
    description: "",
    description_urdu: "",
    price: 0,
    is_negotiable: true,
    category: "",
    image_url: "",
    duration_minutes: 60
  });

  if (authLoading || (isAuthenticated && user?.role !== "provider")) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-6">
        <Loader2 className="w-12 h-12 text-secondary animate-spin" />
        <p className="text-white/30 font-black uppercase tracking-[0.2em] text-xs">Verifying Guild Credentials...</p>
      </div>
    );
  }

  const resetForm = () => {
    setFormData({
      name: "",
      name_urdu: "",
      description: "",
      description_urdu: "",
      price: 0,
      is_negotiable: true,
      category: "",
      image_url: "",
      duration_minutes: 60
    });
    setIsAdding(false);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.updateProviderService(editingId, formData);
      } else {
        await api.createProviderService(formData);
      }
      resetForm();
      fetchServices();
    } catch (err) {
      console.error("Error saving service", err);
    }
  };

  const handleEdit = (service: any) => {
    setFormData({
      name: service.name,
      name_urdu: service.name_urdu || "",
      description: service.description || "",
      description_urdu: service.description_urdu || "",
      price: service.price,
      is_negotiable: service.is_negotiable ?? true,
      category: service.category || "",
      image_url: service.image_url || "",
      duration_minutes: service.duration_minutes || 60
    });
    setEditingId(service.id);
    setIsAdding(true);
  };

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this service? This action cannot be undone.")) {
      try {
        await api.deleteProviderService(id);
        fetchServices();
      } catch (err) {
        console.error("Error deleting service", err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-white mb-2 tracking-tight">
              Manage Your <span className="text-secondary">Services.</span>
            </h1>
            <p className="text-white/40 font-medium">Define your expertise and set your rates.</p>
          </div>
          <button 
            onClick={() => { resetForm(); setIsAdding(true); }}
            className="group bg-secondary hover:bg-secondary-light text-slate-950 px-6 py-3.5 rounded-2xl font-black flex items-center gap-2 transition-all shadow-xl shadow-secondary/10"
          >
            <Plus className="w-5 h-5 group-hover:rotate-90 transition-transform" /> 
            Add New Skill
          </button>
        </div>

        {/* Warning Banner */}
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6 mb-10 flex gap-4 items-start">
          <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-6 h-6 text-amber-500" />
          </div>
          <div>
            <h4 className="text-amber-500 font-black uppercase tracking-widest text-xs mb-1">Legal Notice & Responsibility</h4>
            <p className="text-amber-500/70 text-sm leading-relaxed font-medium">
              You are free to add any service you offer. However, please note that **Sehat & Service** is not responsible for the quality, safety, or legality of custom services. By listing a service, you agree to our Service Covenant and take full responsibility for its execution.
            </p>
          </div>
        </div>

        {/* Form Modal/Section */}
        {isAdding && (
          <div className="bg-slate-900/50 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/10 mb-12 animate-reveal relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <button onClick={resetForm} className="text-white/20 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* English Info */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                      <Languages className="w-4 h-4 text-blue-500" />
                    </div>
                    <h3 className="text-white font-bold">English Details</h3>
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-white/30 uppercase tracking-widest px-1">Service Name</label>
                    <input 
                      required
                      placeholder="e.g. Master AC Service"
                      className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-secondary/20 outline-none transition-all placeholder:text-white/10"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-white/30 uppercase tracking-widest px-1">Description</label>
                    <textarea 
                      placeholder="Detail what's included in this service..."
                      rows={4}
                      className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-secondary/20 outline-none transition-all placeholder:text-white/10 resize-none"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                    />
                  </div>
                </div>

                {/* Urdu Info */}
                <div className="space-y-6">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                      <span className="text-emerald-500 font-bold">ع</span>
                    </div>
                    <h3 className="text-white font-bold">Urdu Details (اردو تفصیلات)</h3>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-white/30 uppercase tracking-widest px-1 text-right block">سروس کا نام</label>
                    <input 
                      placeholder="مثلاً: ماسٹر اے سی سروس"
                      dir="rtl"
                      className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white font-urdu text-lg focus:ring-2 focus:ring-secondary/20 outline-none transition-all placeholder:text-white/10"
                      value={formData.name_urdu}
                      onChange={(e) => setFormData({...formData, name_urdu: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-white/30 uppercase tracking-widest px-1 text-right block">تفصیل</label>
                    <textarea 
                      placeholder="اس سروس میں کیا شامل ہے؟"
                      rows={4}
                      dir="rtl"
                      className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white font-urdu text-lg focus:ring-2 focus:ring-secondary/20 outline-none transition-all placeholder:text-white/10 resize-none"
                      value={formData.description_urdu}
                      onChange={(e) => setFormData({...formData, description_urdu: e.target.value})}
                    />
                  </div>
                </div>
              </div>

              {/* Common Details */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-6 border-t border-white/5">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-widest px-1">Base Price (Rs.)</label>
                  <div className="relative">
                    <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary" />
                    <input 
                      type="number"
                      required
                      className="w-full pl-12 pr-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-secondary/20 outline-none transition-all"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: parseFloat(e.target.value)})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-widest px-1">Duration (Min)</label>
                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400" />
                    <input 
                      type="number"
                      className="w-full pl-12 pr-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-secondary/20 outline-none transition-all"
                      value={formData.duration_minutes}
                      onChange={(e) => setFormData({...formData, duration_minutes: parseInt(e.target.value)})}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                   <label className="text-[10px] font-black text-white/30 uppercase tracking-widest px-1">Pricing Model</label>
                   <button 
                    type="button"
                    onClick={() => setFormData({...formData, is_negotiable: !formData.is_negotiable})}
                    className={`w-full py-4 px-6 rounded-xl border flex items-center justify-between transition-all ${
                      formData.is_negotiable 
                      ? "bg-secondary/10 border-secondary/50 text-secondary" 
                      : "bg-white/5 border-white/10 text-white/40"
                    }`}
                   >
                     <span className="font-bold">Negotiable Price</span>
                     {formData.is_negotiable ? <CheckCircle2 className="w-5 h-5" /> : <X className="w-5 h-5" />}
                   </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-white/30 uppercase tracking-widest px-1">Portfolio / Image URL</label>
                <div className="relative">
                  <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-purple-400" />
                  <input 
                    placeholder="https://example.com/image.jpg"
                    className="w-full pl-12 pr-5 py-4 bg-white/5 border border-white/10 rounded-xl text-white focus:ring-2 focus:ring-secondary/20 outline-none transition-all"
                    value={formData.image_url}
                    onChange={(e) => setFormData({...formData, image_url: e.target.value})}
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="submit" className="flex-1 bg-secondary hover:bg-secondary-light text-slate-950 py-5 rounded-2xl font-black uppercase tracking-widest shadow-2xl shadow-secondary/20 transition-all flex items-center justify-center gap-3">
                  <Save className="w-5 h-5" />
                  {editingId ? "Update Guild Skill" : "Deploy New Skill"}
                </button>
                <button 
                  type="button" 
                  onClick={resetForm}
                  className="px-8 py-5 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-black uppercase tracking-widest transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Services List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-6">
            <Loader2 className="w-12 h-12 text-secondary animate-spin" />
            <p className="text-white/30 font-black uppercase tracking-[0.2em] text-xs">Synchronizing with Guild Registry...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((service) => (
              <div 
                key={service.id} 
                className="group bg-slate-900/40 rounded-[2rem] p-6 md:p-8 border border-white/5 hover:border-white/20 transition-all duration-500 flex flex-col hover:shadow-2xl"
              >
                <div className="flex justify-between items-start mb-6">
                   <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:bg-secondary group-hover:border-secondary group-hover:scale-110 transition-all duration-500">
                         {service.image_url ? (
                           <img src={service.image_url} className="w-full h-full object-cover rounded-2xl" />
                         ) : (
                           <Globe className="w-6 h-6 text-white group-hover:text-slate-950" />
                         )}
                      </div>
                      <div>
                         <h3 className="text-xl font-black text-white tracking-tight">{service.name}</h3>
                         <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] font-black text-secondary uppercase tracking-widest">
                               Rs. {service.price} {service.is_negotiable && "(Starting)"}
                            </span>
                            <span className="w-1 h-1 bg-white/20 rounded-full"></span>
                            <span className="text-[10px] font-bold text-white/30">{service.duration_minutes} Min</span>
                         </div>
                      </div>
                   </div>
                   <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleEdit(service)}
                        className="w-10 h-10 bg-white/5 hover:bg-blue-500/20 text-white/40 hover:text-blue-500 rounded-xl flex items-center justify-center border border-white/5 transition-all"
                      >
                         <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(service.id)}
                        className="w-10 h-10 bg-white/5 hover:bg-red-500/20 text-white/40 hover:text-red-500 rounded-xl flex items-center justify-center border border-white/5 transition-all"
                      >
                         <Trash2 className="w-4 h-4" />
                      </button>
                   </div>
                </div>

                {service.name_urdu && (
                  <p className="text-lg font-urdu text-white/60 mb-4 text-right" dir="rtl">{service.name_urdu}</p>
                )}

                <p className="text-white/40 text-sm leading-relaxed mb-8 line-clamp-2">{service.description}</p>

                <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                   <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${service.status === 'active' ? 'bg-green-500 animate-pulse' : 'bg-amber-500'}`}></div>
                      <span className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em]">
                        Status: {service.status || 'Active'}
                      </span>
                   </div>
                   <div className="flex items-center gap-2 text-white/20">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span className="text-[8px] font-bold uppercase tracking-widest">Deployments Staggered for Safety</span>
                   </div>
                </div>
              </div>
            ))}

            {services.length === 0 && !isAdding && (
              <div className="col-span-full py-20 bg-white/5 rounded-[3rem] border border-dashed border-white/10 flex flex-col items-center justify-center text-center px-10">
                 <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mb-6">
                    <AlertTriangle className="w-10 h-10 text-white/20" />
                 </div>
                 <h3 className="text-xl font-bold text-white mb-2">No active skills found.</h3>
                 <p className="text-white/40 max-w-sm font-medium mb-8">Your guild profile is empty. Add services to start receiving elite bookings.</p>
                 <button 
                   onClick={() => setIsAdding(true)}
                   className="text-secondary font-black uppercase tracking-widest text-xs flex items-center gap-2 hover:gap-4 transition-all"
                 >
                    Initialize First Service <ChevronRight className="w-4 h-4" />
                 </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
