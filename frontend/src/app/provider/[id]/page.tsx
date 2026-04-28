"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  Star, ShieldCheck, Clock, MapPin, Phone, MessageCircle,
  ChevronRight, ChevronDown, Calendar, Clock3, CheckCircle, XCircle,
  AlertCircle, Send, ArrowRight, Loader2, Award, 
  ThumbsUp, Shield, Zap, Info, Share2, Heart, PlayCircle,
  ArrowUpRight, Verified
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";

export default function ProviderPage() {
  const params = useParams();
  const router = useRouter();
  const { language, t } = useLanguage();
  const { isAuthenticated, user: currentUser } = useAuth();
  
  const providerId = parseInt(params.id as string);
  const [provider, setProvider] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookingStep, setBookingStep] = useState(1);
  const [selectedService, setSelectedService] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [bookingData, setBookingData] = useState({
      date: "",
      time: "",
      address: "",
      notes: ""
  });
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    const fetchProviderData = async () => {
      setLoading(true);
      try {
        const [providerData, reviewsData, servicesData] = await Promise.all([
          api.getProviderById(providerId),
          api.getProviderReviews(providerId),
          api_ext.getProviderServices(providerId)
        ]);
        setProvider(providerData);
        setReviews(reviewsData);
        setServices(servicesData);
      } catch (error) {
        console.error("Failed to fetch provider details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (providerId) {
      fetchProviderData();
    }
  }, [providerId]);

  const handleBookNow = () => {
    if (!isAuthenticated) {
      router.push("/auth/login?redirect=" + encodeURIComponent(window.location.pathname));
      return;
    }
    setShowBookingModal(true);
  };

  const handleConfirmBooking = async () => {
    setBookingLoading(true);
    try {
      await api.createBooking({
        provider_id: providerId,
        service_id: selectedService?.id,
        service: selectedService?.name,
        description: bookingData.notes,
        scheduled_date: bookingData.date,
        scheduled_time: bookingData.time,
        address: bookingData.address,
        city: provider.user?.city || provider.city,
      });
      alert("Booking successfully established!");
      setShowBookingModal(false);
      setBookingStep(1);
      router.push("/dashboard");
    } catch (error) {
      console.error("Booking failed:", error);
      alert("Failed to establish booking. Please try again.");
    } finally {
      setBookingLoading(false);
    }
  };


  const safeParse = (data: any, fallback: any = []) => {
    if (!data) return fallback;
    if (typeof data !== 'string') return data;
    try {
      return JSON.parse(data);
    } catch (e) {
      try {
        return JSON.parse(data.replace(/'/g, '"'));
      } catch (e2) {
        return fallback;
      }
    }
  };

  const timeSlots = ["9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"];

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950">
        <div className="w-16 md:w-20 h-16 md:h-20 rounded-full border-8 border-white/5 border-t-secondary animate-spin mb-8"></div>
        <p className="text-secondary font-black uppercase tracking-[0.4em] text-[8px] md:text-[10px] animate-pulse">Requesting Expert Profile</p>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-slate-950">
        <div className="w-24 md:w-32 h-24 md:h-32 bg-white/5 rounded-[2rem] md:rounded-[3rem] border border-white/10 flex items-center justify-center mb-8 md:mb-10">
           <AlertCircle className="w-12 md:w-16 h-12 md:h-16 text-white/10" />
        </div>
        <h2 className="text-3xl md:text-4xl font-black text-white mb-4 tracking-tighter">Elite Expert Unavailable</h2>
        <p className="text-white/40 mb-10 md:mb-12 max-w-sm font-medium text-sm md:text-base">This professional is currently not listed in our elite guild.</p>
        <Link href="/search" className="btn-secondary !px-12">Browse The Collection</Link>
      </div>
    );
  }

  const skills = safeParse(provider.skills);
  const serviceAreas = safeParse(provider.service_areas);
  const availability = safeParse(provider.availability, {});

  return (
    <div className="min-h-screen bg-slate-950 pt-20 pb-20 md:pb-32 px-4">
      {/* Cinematic Profile Header */}
      <div className="bg-midnight-mesh pt-16 md:pt-24 pb-32 md:pb-40 relative border-b border-white/5 overflow-hidden -mx-4">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        <div className="container-custom relative z-10 animate-reveal">
          <div className="flex items-center gap-3 text-secondary text-[8px] md:text-[10px] font-black uppercase tracking-[0.2em] mb-8 md:mb-12">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/search" className="hover:text-white transition-colors">Marketplace</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white/40 truncate max-w-[150px]">{provider.user?.name || provider.name}</span>
          </div>
        </div>
      </div>

      <div className="container-custom -mt-24 md:-mt-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
          {/* Detailed Specifications */}
          <div className="lg:col-span-2 space-y-8 md:space-y-12">
            {/* Master Profile Card */}
            <div className="bg-slate-900 rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-16 border border-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] animate-reveal">
              <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center md:items-start text-center md:text-left">
                <div className="relative group">
                  <div className="w-40 h-40 md:w-56 md:h-56 bg-white/5 rounded-[2.5rem] md:rounded-[4rem] flex items-center justify-center overflow-hidden border-4 border-white/5 shadow-2xl transition-all duration-700 group-hover:scale-105">
                    <span className="text-7xl md:text-9xl font-black text-white/[0.03]">
                      {(provider.user?.name || provider.name).charAt(0)}
                    </span>
                  </div>
                  {provider.verified && (
                    <div className="absolute -bottom-2 md:-bottom-4 -right-2 md:-right-4 bg-secondary text-slate-950 p-3 md:p-4 rounded-xl md:rounded-[1.5rem] shadow-2xl border-[4px] md:border-[6px] border-slate-900">
                      <ShieldCheck className="w-6 h-6 md:w-8 md:h-8" />
                    </div>
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 md:gap-4 mb-6 md:mb-8">
                    <span className="px-4 md:px-5 py-1.5 md:py-2 bg-secondary/10 text-secondary text-[8px] md:text-[10px] font-black uppercase tracking-widest rounded-lg md:rounded-xl border border-secondary/20">
                      Elite {provider.category}
                    </span>
                    <div className="flex items-center gap-2 px-3 md:px-4 py-1.5 md:py-2 bg-white/5 rounded-lg md:rounded-xl border border-white/10">
                      <Star className="w-3.5 h-3.5 md:w-4 md:h-4 text-secondary fill-secondary" />
                      <span className="text-xs md:text-sm font-black text-white">{provider.rating} <span className="hidden sm:inline">Excellence</span></span>
                      <span className="text-[8px] md:text-[10px] font-bold text-white/20 uppercase tracking-widest">({provider.review_count} <span className="hidden sm:inline">Vouched</span>)</span>
                    </div>
                  </div>

                  <h1 className="text-4xl md:text-7xl font-black text-white mb-4 md:mb-6 tracking-tighter leading-none">{provider.user?.name || provider.name}</h1>
                  
                  <div className="flex flex-wrap justify-center md:justify-start gap-6 md:gap-10 mb-8 md:mb-12">
                    <div className="flex items-center gap-2 md:gap-3 text-white/30 font-black text-[8px] md:text-[10px] uppercase tracking-[0.2em]">
                      <MapPin className="w-4 h-4 md:w-5 md:h-5 text-secondary" />
                      {provider.user?.city || provider.city}
                    </div>
                    <div className="flex items-center gap-2 md:gap-3 text-white/30 font-black text-[8px] md:text-[10px] uppercase tracking-[0.2em]">
                      <Clock className="w-4 h-4 md:w-5 md:h-5 text-secondary" />
                      {provider.response_time} Response
                    </div>
                  </div>

                  <div className="flex flex-wrap justify-center md:justify-start gap-3 md:gap-4">
                    <button className="flex items-center gap-2 md:gap-3 px-6 md:px-10 py-4 md:py-5 bg-white text-slate-950 rounded-2xl md:rounded-3xl font-black uppercase tracking-widest text-[10px] md:text-xs hover:bg-secondary transition-all shadow-2xl">
                      <Share2 className="w-4 h-4" />
                      Share Profile
                    </button>
                    <button className="flex items-center gap-2 md:gap-3 px-6 md:px-10 py-4 md:py-5 bg-white/5 border border-white/10 text-white/60 rounded-2xl md:rounded-3xl font-black uppercase tracking-widest text-[10px] md:text-xs hover:bg-white/10 transition-all">
                      <Heart className="w-4 h-4" />
                      Save
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-16 md:mt-20 pt-12 md:pt-16 border-t border-white/5">
                 <h2 className="text-2xl md:text-3xl font-black text-white mb-8 md:mb-10 flex items-center justify-center md:justify-start gap-4">
                   <Info className="w-6 md:w-8 h-6 md:h-8 text-secondary" />
                   Professional Philosophy
                 </h2>
                 <p className="text-white/40 text-lg md:text-xl font-medium leading-relaxed mb-12 md:mb-16 max-w-4xl text-center md:text-left px-2">
                   {provider.bio}
                 </p>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
                   <div className="bg-white/5 p-8 md:p-10 rounded-[2rem] md:rounded-[3rem] border border-white/5">
                     <h3 className="text-[8px] md:text-[10px] font-black text-secondary uppercase tracking-[0.3em] mb-6 md:mb-8 text-center md:text-left">Master Skills</h3>
                     <div className="flex flex-wrap justify-center md:justify-start gap-2 md:gap-3">
                       {skills.map((skill: string, index: number) => (
                         <span key={index} className="px-4 md:px-6 py-2 md:py-3 bg-white/5 text-white/60 font-black uppercase tracking-widest text-[9px] md:text-[10px] rounded-xl md:rounded-2xl border border-white/5">
                           {skill}
                         </span>
                       ))}
                     </div>
                   </div>
                   <div className="bg-white/5 p-8 md:p-10 rounded-[2rem] md:rounded-[3rem] border border-white/5">
                     <h3 className="text-[8px] md:text-[10px] font-black text-secondary uppercase tracking-[0.3em] mb-6 md:mb-8 text-center md:text-left">Exclusive Districts</h3>
                     <div className="flex flex-wrap justify-center md:justify-start gap-2 md:gap-3">
                       {serviceAreas.map((area: string, index: number) => (
                         <span key={index} className="px-4 md:px-6 py-2 md:py-3 bg-secondary/5 text-secondary font-black uppercase tracking-widest text-[9px] md:text-[10px] rounded-xl md:rounded-2xl border border-secondary/10">
                           {area}
                         </span>
                       ))}
                     </div>
                   </div>
                 </div>
              </div>
            </div>

            {/* Elite Vouching System (Reviews) */}
            <div className="bg-slate-900 rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-16 border border-white/10 animate-reveal stagger-1">
               <h2 className="text-2xl md:text-3xl font-black text-white mb-10 md:mb-12 flex items-center justify-center md:justify-start gap-4">
                 <Award className="w-6 md:w-8 h-6 md:h-8 text-secondary" />
                 Verified Testimonials
               </h2>
               
               {reviews.length > 0 ? (
                <div className="space-y-10 md:space-y-12">
                  {reviews.map((review, i) => (
                    <div key={review.id} className={`pb-10 md:pb-12 ${i !== reviews.length - 1 ? "border-b border-white/5" : ""}`}>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                        <div className="flex items-center gap-4 md:gap-5">
                          <div className="w-14 h-14 md:w-16 md:h-16 bg-white/5 rounded-2xl flex items-center justify-center font-black text-white/10 text-2xl md:text-3xl">
                            {(review.user?.name || "C").charAt(0)}
                          </div>
                          <div>
                            <p className="font-black text-white text-lg md:text-xl tracking-tight">{review.user?.name || "Anonymous Elite"}</p>
                            <p className="text-[9px] md:text-[10px] font-black text-white/20 uppercase tracking-[0.2em] mt-1">{new Date(review.created_at).toLocaleDateString()}</p>
                          </div>
                        </div>
                        <div className="flex gap-1.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className={`w-4 h-4 md:w-5 md:h-5 ${i < review.rating ? "text-secondary fill-secondary" : "text-white/5"}`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-white/40 text-lg md:text-xl font-medium leading-relaxed italic pr-0 md:pr-10 text-center sm:text-left">
                        "{review.comment}"
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 md:py-24 bg-white/5 rounded-[2rem] md:rounded-[3rem] border-2 border-dashed border-white/5 px-6">
                   <p className="text-white/20 font-black uppercase tracking-[0.3em] text-[9px] md:text-[10px]">No community vouchers for this guild member yet.</p>
                </div>
              )}
            </div>
          </div>

          {/* Luxury Action Terminal (Sticky Sidebar) */}
          <div className="lg:col-span-1">
            <div className="sticky top-32 space-y-6 md:space-y-8">
              <div className="bg-slate-900 rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-12 border border-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.7)] animate-reveal stagger-2 overflow-hidden relative">
                <div className="absolute top-0 right-0 w-48 h-48 bg-secondary/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
                
                <div className="text-center mb-10 md:mb-12 relative z-10">
                  <p className="text-[9px] md:text-[10px] font-black text-white/30 uppercase tracking-[0.4em] mb-4">Base Consulting Fee</p>
                  <div className="flex items-baseline justify-center gap-2">
                    <span className="text-4xl md:text-6xl font-black text-white tracking-tighter">Rs. {provider.price_min}</span>
                    <span className="text-white/20 font-black uppercase text-[10px] md:text-xs">/hr</span>
                  </div>
                </div>
                
                <button
                  onClick={handleBookNow}
                  className="w-full btn-secondary !rounded-[1.5rem] md:!rounded-[2rem] !py-6 md:!py-7 !text-sm md:!text-base !shadow-[0_20px_50px_-5px_rgba(251,191,36,0.3)] mb-6 transition-all hover:scale-[1.05]"
                >
                  <Calendar className="w-5 h-5 md:w-6 md:h-6" />
                  Initiate Booking
                </button>

                <div className="grid grid-cols-2 gap-3 md:gap-4 mb-10 md:mb-12">
                  <a
                    href={`tel:${provider.user?.phone || "03001234567"}`}
                    className="flex flex-col items-center justify-center p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] bg-white/5 border border-white/10 text-white font-black text-[9px] md:text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all gap-3 md:gap-4"
                  >
                    <Phone className="w-5 h-5 md:w-6 md:h-6 text-secondary" />
                    Secure Call
                  </a>
                  <a
                    href={`https://wa.me/${provider.user?.phone?.replace(/^0/, '92') || "923001234567"}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center justify-center p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] bg-white/5 border border-white/10 text-white font-black text-[9px] md:text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all gap-3 md:gap-4"
                  >
                    <MessageCircle className="w-5 h-5 md:w-6 md:h-6 text-secondary" />
                    WhatsApp
                  </a>
                </div>

                <div className="space-y-5 md:space-y-6 border-t border-white/5 pt-8 md:pt-10">
                  {[
                    { icon: Shield, text: "Background Cleared", color: "text-secondary" },
                    { icon: Zap, text: "High Priority Speed", color: "text-secondary" },
                    { icon: CheckCircle, text: "Performance Bonded", color: "text-secondary" },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <div className="w-9 h-9 md:w-10 md:h-10 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                         <item.icon className={`w-4 h-4 md:w-5 md:h-5 ${item.color}`} />
                      </div>
                      <span className="text-[10px] md:text-xs font-black uppercase tracking-widest text-white/40">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Operations Schedule */}
              {Object.keys(availability).length > 0 && (
                <div className="bg-white/5 rounded-[2rem] md:rounded-[3rem] p-8 md:p-10 border border-white/5 animate-reveal stagger-3">
                  <h3 className="text-[9px] md:text-[10px] font-black text-secondary uppercase tracking-[0.4em] mb-8 md:mb-10 flex items-center gap-3">
                    <Clock3 className="w-4 h-4 md:w-5 md:h-5" />
                    Operations Deck
                  </h3>
                  <div className="space-y-4 md:space-y-5">
                    {Object.entries(availability).slice(0, 4).map(([day, time]) => (
                      <div key={day} className="flex items-center justify-between text-[10px] md:text-xs">
                        <span className="text-white/20 font-black uppercase tracking-[0.1em] capitalize">{day}</span>
                        <span className="font-black text-white tracking-widest">{time as string}</span>
                      </div>
                    ))}
                    <button className="w-full pt-6 md:pt-8 text-[8px] md:text-[9px] font-black uppercase tracking-[0.3em] text-white/20 hover:text-secondary transition-all border-t border-white/5 mt-4">
                      Inspect Full Registry
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Luxury Booking Terminal (Modal) */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-2xl flex items-center justify-center z-[100] p-4 md:p-6 animate-reveal">
          <div className="bg-slate-900 rounded-[2.5rem] md:rounded-[4rem] max-w-2xl w-full max-h-[95vh] overflow-hidden shadow-2xl border border-white/10">
            <div className="relative p-8 md:p-16 overflow-y-auto max-h-[95vh]">
              <button
                onClick={() => setShowBookingModal(false)}
                className="absolute top-6 md:top-12 right-6 md:right-12 p-3 md:p-4 bg-white/5 hover:bg-white/10 rounded-xl md:rounded-2xl transition-all text-white/30"
              >
                <XCircle className="w-6 md:w-8 h-6 md:h-8" />
              </button>

              <div className="mb-10 md:mb-16 mt-4 md:mt-0">
                <div className="inline-flex items-center gap-3 px-3 md:px-4 py-1.5 md:py-2 bg-secondary/10 text-secondary text-[8px] md:text-[10px] font-black uppercase tracking-[0.3em] rounded-lg mb-4 md:mb-6">
                  Terminal 01 // New Directive
                </div>
                <h2 className="text-3xl md:text-5xl font-black text-white tracking-tighter leading-none">Schedule Service.</h2>
              </div>

              {bookingStep === 1 && (
                <div className="space-y-8 md:space-y-10">
                  <div className="bg-white/5 p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] border border-white/5 flex items-center gap-4 md:gap-6">
                     <div className="w-16 md:w-24 h-16 md:h-24 bg-white/5 rounded-2xl md:rounded-[2rem] border border-white/10 flex items-center justify-center font-black text-white/5 text-3xl md:text-4xl">
                        {(provider.user?.name || provider.name).charAt(0)}
                     </div>
                     <div>
                        <p className="font-black text-white text-xl md:text-2xl tracking-tight leading-none mb-2">{provider.user?.name || provider.name}</p>
                        <p className="text-secondary font-black text-[8px] md:text-[10px] uppercase tracking-[0.3em]">{provider.category} Guild</p>
                     </div>
                  </div>

                  <div>
                    <label className="block text-[8px] md:text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-4 md:mb-6 ml-4">
                      Objective Type
                    </label>
                    <div className="relative group">
                       <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 pointer-events-none group-hover:text-secondary transition-all" />
                        <select 
                          value={selectedService}
                          onChange={(e) => setSelectedService(e.target.value)}
                          className="w-full px-6 md:px-8 py-5 md:py-6 bg-white/5 border-none rounded-[1.5rem] md:rounded-[2rem] text-white font-black uppercase tracking-widest text-[10px] md:text-xs focus:ring-2 focus:ring-secondary/20 appearance-none cursor-pointer"
                        >
                          <option value="" className="bg-slate-900">Select Mission Service</option>
                          {skills.map((skill: string) => (
                            <option key={skill} value={skill} className="bg-slate-900">{skill}</option>
                          ))}
                        </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[8px] md:text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-4 md:mb-6 ml-4">
                      Mission Directives
                    </label>
                    <textarea
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Specify requirements..."
                      className="w-full px-6 md:px-8 py-5 md:py-6 bg-white/5 border-none rounded-[1.5rem] md:rounded-[2.5rem] text-white font-bold text-base md:text-lg focus:ring-2 focus:ring-secondary/20 h-32 md:h-40 resize-none placeholder:text-white/10"
                    />
                  </div>

                  <button
                    onClick={() => setBookingStep(2)}
                    disabled={!selectedService}
                    className="w-full btn-secondary !rounded-[1.5rem] md:!rounded-[2.5rem] !py-6 md:!py-7 !text-base md:!text-lg shadow-2xl shadow-amber-900/40 disabled:opacity-20 disabled:grayscale transition-all"
                  >
                    Proceed to Timeline
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              )}

              {bookingStep === 2 && (
                <div className="space-y-8 md:space-y-10">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                    <div>
                      <label className="block text-[8px] md:text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-4 md:mb-6 ml-4">
                        Deployment Date
                      </label>
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-6 md:px-8 py-5 md:py-6 bg-white/5 border-none rounded-[1.5rem] md:rounded-[2rem] text-white font-black text-xs md:text-sm focus:ring-2 focus:ring-secondary/20 invert-[0.9]"
                      />
                    </div>
                    <div>
                       <label className="block text-[8px] md:text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-4 md:mb-6 ml-4">
                        Time Slot
                      </label>
                      <div className="relative group">
                        <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 pointer-events-none" />
                        <select 
                          value={selectedTime}
                          onChange={(e) => setSelectedTime(e.target.value)}
                          className="w-full px-6 md:px-8 py-5 md:py-6 bg-white/5 border-none rounded-[1.5rem] md:rounded-[2rem] text-white font-black uppercase tracking-widest text-[10px] md:text-xs focus:ring-2 focus:ring-secondary/20 appearance-none cursor-pointer"
                        >
                          <option value="" className="bg-slate-900">Select Hour</option>
                          {timeSlots.map(t => <option key={t} value={t} className="bg-slate-900">{t}</option>)}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[8px] md:text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-4 md:mb-6 ml-4">
                      Target Coordinates (Address)
                    </label>
                    <textarea
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="Street, House, Landmarks..."
                      className="w-full px-6 md:px-8 py-5 md:py-6 bg-white/5 border-none rounded-[1.5rem] md:rounded-[2.5rem] text-white font-bold text-base md:text-lg focus:ring-2 focus:ring-secondary/20 h-24 md:h-32 resize-none placeholder:text-white/10"
                    />
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 md:gap-6">
                    <button
                      onClick={() => setBookingStep(1)}
                      className="order-2 sm:order-1 flex-1 px-8 md:px-10 py-5 md:py-7 rounded-[1.5rem] md:rounded-[2.5rem] border border-white/10 text-white/40 font-black uppercase tracking-widest text-[10px] md:text-xs hover:bg-white/5 transition-all"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleConfirmBooking}
                      disabled={!selectedDate || !selectedTime || !address || bookingLoading}
                      className="order-1 sm:order-2 flex-[2] btn-secondary !rounded-[1.5rem] md:!rounded-[2.5rem] !py-5 md:!py-7 shadow-2xl disabled:opacity-20 transition-all"
                    >
                      {bookingLoading ? <Loader2 className="w-5 md:w-6 h-5 md:h-6 animate-spin" /> : <CheckCircle className="w-5 md:w-6 h-5 md:h-6" />}
                      Establish Mission
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
