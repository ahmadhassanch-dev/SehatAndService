"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search, MapPin, Snowflake, Droplet, Zap, Hammer,
  WashingMachine, Sparkles, Truck, GraduationCap, Scissors,
  Laptop, Shield, MoreHorizontal, Star, ArrowRight,
  Clock, CheckCircle, Phone, MessageCircle, ChevronRight,
  ShieldCheck, Award, Users, Wrench, Loader2, Sparkle,
  ArrowUpRight, PlayCircle, Heart, ChevronDown, Globe,
  ShieldAlert, Verified, History, TrendingUp, Lightbulb, X
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import api from "@/lib/api";

const iconMap: Record<string, any> = {
  snowflake: Snowflake,
  droplet: Droplet,
  zap: Zap,
  hammer: Hammer,
  "washing-machine": WashingMachine,
  sparkles: Sparkles,
  truck: Truck,
  "graduation-cap": GraduationCap,
  scissors: Scissors,
  laptop: Laptop,
  shield: Shield,
  "more-horizontal": MoreHorizontal,
};

const colorMap: Record<string, string> = {
  "ac-repair": "from-blue-600 to-indigo-700",
  "plumbing": "from-cyan-600 to-blue-700",
  "electrician": "from-amber-500 to-orange-700",
  "carpenter": "from-orange-700 to-red-900",
  "appliance-repair": "from-slate-600 to-slate-800",
  "cleaning": "from-purple-600 to-indigo-800",
  "moving": "from-emerald-600 to-teal-800",
  "tutoring": "from-indigo-600 to-purple-800",
  "beauty": "from-pink-500 to-rose-700",
  "tech-help": "from-slate-800 to-black",
};

const cities = ["Lahore", "Karachi", "Islamabad", "Rawalpindi", "Faisalabad", "Multan", "Peshawar", "Quetta"];

const popularSearches = [
  "AC Gas Refilling", "Emergency Plumber", "Electrician for Wiring", 
  "Furniture Polishing", "Math Tutor for O-Levels", "Deep Home Cleaning"
];

export default function HomePage() {
  const router = useRouter();
  const { language, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  
  const [categories, setCategories] = useState<any[]>([]);
  const [topProviders, setTopProviders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cats, providersRes] = await Promise.all([
          api.getCategories(),
          api.getProviders({ limit: 4, sort_by: "rating" })
        ]);
        setCategories(cats);
        setTopProviders(providersRes.providers);
      } catch (error) {
        console.error("Failed to fetch home data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearchSubmit = (e?: React.FormEvent, term?: string) => {
    if (e) e.preventDefault();
    const finalTerm = term || searchQuery;
    if (finalTerm.trim()) {
      setShowSuggestions(false);
      router.push(`/search?q=${encodeURIComponent(finalTerm)}&city=${selectedCity}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 font-sans overflow-x-hidden">
      {/* Dynamic Luxury Hero */}
      <section className="relative min-h-screen flex items-center pt-24 md:pt-32 pb-32 md:pb-48 bg-midnight-mesh">
        {/* Abstract Light Particles - Overflow restricted to this container */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
           {[...Array(5)].map((_, i) => (
             <div key={i} className={`absolute w-64 md:w-96 h-64 md:h-96 bg-secondary/5 rounded-full blur-[80px] md:blur-[120px] animate-pulse-soft stagger-${i+1}`} style={{
               top: `${Math.random() * 100}%`,
               left: `${Math.random() * 100}%`,
             }}></div>
           ))}
        </div>

        <div className="container-custom relative z-10">
          <div className="max-w-5xl mx-auto text-center animate-reveal">
            <div className="inline-flex items-center gap-2 md:gap-3 px-4 md:px-6 py-2 md:py-2.5 rounded-full bg-white/5 backdrop-blur-2xl border border-white/10 text-secondary text-[10px] md:text-xs font-black uppercase tracking-[0.2em] mb-6 md:mb-10 stagger-1 mx-auto">
              <Sparkle className="w-3 h-3 md:w-4 md:h-4 fill-secondary" />
              Pakistan's Elite Service Network
            </div>
            
            <h1 className="text-4xl sm:text-5xl md:text-8xl font-black text-white mb-6 md:mb-8 tracking-tighter leading-[1.1] md:leading-[0.95] stagger-2 px-2">
              The Gold Standard <br className="hidden sm:block" />
              <span className="text-secondary">Of Home Services.</span>
            </h1>
            
            <p className="text-lg md:text-2xl text-white/50 mb-10 md:mb-14 max-w-2xl mx-auto font-medium leading-relaxed stagger-3 px-4">
              Elite, verified professionals delivered to your doorstep. <br className="hidden md:block" />
              Trusted by thousands of premium households.
            </p>

            {/* Premium Search Hub */}
            <div className="relative max-w-4xl mx-auto" ref={searchRef}>
              <div className="bg-white/5 backdrop-blur-3xl p-2 md:p-4 rounded-[2rem] md:rounded-[3rem] border border-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] stagger-4 mx-4">
                <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-2 md:gap-4">
                  <div className="flex-[2] relative group">
                    <Search className="absolute left-5 md:left-6 top-1/2 -translate-y-1/2 w-5 h-5 md:w-6 md:h-6 text-white/20 group-focus-within:text-secondary transition-colors" />
                    <input
                      type="text"
                      value={searchQuery}
                      onFocus={() => setShowSuggestions(true)}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="What service do you need?"
                      className="w-full pl-12 md:pl-16 pr-4 md:pr-8 py-4 md:py-6 bg-white/5 border-none rounded-[1.5rem] md:rounded-[2rem] text-white font-bold text-base md:text-lg focus:ring-2 focus:ring-secondary/20 transition-all placeholder:text-white/20"
                    />
                  </div>

                  <div className="flex-1 relative">
                    <MapPin className="absolute left-5 md:left-6 top-1/2 -translate-y-1/2 w-5 h-5 md:w-6 md:h-6 text-secondary" />
                    <button
                      type="button"
                      onClick={() => setShowCityDropdown(!showCityDropdown)}
                      className="w-full pl-12 md:pl-16 pr-10 py-4 md:py-6 bg-white/5 hover:bg-white/10 text-white text-left rounded-[1.5rem] md:rounded-[2rem] transition-all font-black uppercase tracking-widest text-[10px] md:text-xs relative overflow-hidden group"
                    >
                      <span className="truncate block pr-2">{selectedCity || "Select City"}</span>
                      <ChevronDown className="absolute right-5 md:right-6 top-1/2 -translate-y-1/2 w-4 h-4 md:w-5 md:h-5 text-white/30 group-hover:text-secondary transition-all" />
                    </button>
                    {showCityDropdown && (
                      <div className="absolute top-full left-0 right-0 mt-2 md:mt-4 bg-slate-900/95 backdrop-blur-3xl rounded-[1.5rem] md:rounded-[2rem] shadow-2xl border border-white/10 z-50 max-h-60 md:max-h-80 overflow-y-auto p-2 md:p-3 animate-reveal">
                        {cities.map((city) => (
                          <button
                            key={city}
                            type="button"
                            onClick={() => { setSelectedCity(city); setShowCityDropdown(false); }}
                            className="w-full px-4 md:px-6 py-3 md:py-4 text-left text-white/60 hover:text-secondary hover:bg-white/5 rounded-xl md:rounded-2xl font-black uppercase tracking-widest text-[9px] md:text-[10px] transition-all"
                          >
                            {city}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  <button type="submit" className="btn-secondary !rounded-[1.5rem] md:!rounded-[2rem] !px-8 md:!px-12 !py-4 md:!py-6 shadow-secondary/20">
                    <span className="font-black text-sm md:text-base">Deploy Search</span>
                  </button>
                </form>
              </div>

              {/* Suggestions Panel */}
              {showSuggestions && (
                <div className="absolute top-full left-0 right-0 mt-6 bg-slate-900 rounded-[2.5rem] border border-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] z-[70] overflow-hidden animate-reveal p-6 md:p-10 mx-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                     <div className="text-left">
                        <h4 className="text-[10px] font-black text-secondary uppercase tracking-[0.3em] mb-6 flex items-center gap-3 px-2">
                           <TrendingUp className="w-4 h-4" />
                           Trending Expertise
                        </h4>
                        <div className="space-y-2">
                           {popularSearches.map((s, i) => (
                             <button 
                               key={i}
                               onClick={() => handleSearchSubmit(undefined, s)}
                               className="w-full flex items-center gap-4 p-3 rounded-2xl text-white/60 hover:text-white hover:bg-white/5 font-bold text-sm transition-all text-left"
                             >
                                <History className="w-4 h-4 text-white/20" />
                                <span>{s}</span>
                             </button>
                           ))}
                        </div>
                     </div>
                     <div className="border-l border-white/5 pl-10 hidden md:block text-left">
                        <h4 className="text-[10px] font-black text-secondary uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                           <Lightbulb className="w-4 h-4" />
                           Guild Directives
                        </h4>
                        <div className="bg-white/5 rounded-3xl p-6 border border-white/5">
                           <p className="text-white/40 text-sm leading-relaxed mb-6 font-medium italic">
                             "Natural language search enabled. You can type things like 'Need someone to fix my AC' or 'I need a math tutor'."
                           </p>
                           <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center">
                                 <ShieldCheck className="w-5 h-5 text-secondary" />
                              </div>
                              <span className="text-[9px] font-black text-white/60 uppercase tracking-widest leading-tight">Elite Background <br /> Checks Passed</span>
                           </div>
                        </div>
                     </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Hero Background Glow */}
        <div className="absolute bottom-0 left-0 right-0 h-[20vh] md:h-[30vh] bg-gradient-to-t from-slate-950 to-transparent"></div>
      </section>

      {/* Modern High-Contrast Categories */}
      <section className="py-16 md:py-32 bg-slate-950 relative overflow-hidden">
        <div className="container-custom relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 md:mb-20 gap-6 md:gap-8 px-4">
            <div className="max-w-2xl text-center md:text-left">
              <h2 className="text-3xl md:text-5xl font-black text-white mb-4 md:mb-6 leading-tight">
                Our Specialized <br className="hidden md:block" /> <span className="text-secondary">Service Guilds.</span>
              </h2>
              <p className="text-white/40 text-base md:text-xl font-medium">
                Every technician is hand-picked and undergoes rigorous background checks for your ultimate peace of mind.
              </p>
            </div>
            <Link href="/search" className="group flex items-center gap-3 md:gap-4 text-secondary font-black uppercase tracking-widest text-[10px] md:text-xs mx-auto md:mx-0">
              View Entire Collection
              <div className="w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl border border-white/10 flex items-center justify-center group-hover:bg-secondary group-hover:text-slate-950 transition-all duration-500 group-hover:rotate-12 group-hover:scale-110">
                <ArrowRight className="w-5 h-5 md:w-6 md:h-6" />
              </div>
            </Link>
          </div>

          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-12 h-12 border-4 border-secondary/20 border-t-secondary rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6 px-4">
              {categories.map((cat, index) => {
                const Icon = iconMap[cat.icon] || MoreHorizontal;
                const colorClass = colorMap[cat.slug] || "from-slate-700 to-black";
                return (
                  <Link
                    key={cat.slug}
                    href={`/search?q=${cat.slug}`}
                    className="group relative bg-white/5 p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] border border-white/5 hover:border-white/20 transition-all duration-700 overflow-hidden"
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${colorClass} opacity-0 group-hover:opacity-40 transition-all duration-700`}></div>
                    
                    <div className="relative z-10">
                       <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-white/5 flex items-center justify-center mb-6 md:mb-8 border border-white/10 group-hover:bg-secondary group-hover:border-secondary transition-all duration-500 group-hover:scale-110 mx-auto md:mx-0">
                        <Icon className="w-6 h-6 md:w-8 md:h-8 text-white group-hover:text-slate-950 transition-colors" />
                      </div>
                      <h3 className="text-base md:text-xl font-black text-white mb-2 group-hover:text-white transition-colors text-center md:text-left">
                        {language === "en" ? cat.name : cat.name_urdu}
                      </h3>
                      <p className="text-[8px] md:text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] text-center md:text-left">Verified Experts Only</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Elite Providers Showcase */}
      <section className="py-16 md:py-32 bg-slate-900/50 relative border-y border-white/5">
        <div className="container-custom">
          <div className="text-center mb-16 md:mb-24 px-4">
            <h2 className="text-3xl md:text-5xl font-black text-white mb-4 md:mb-6">
              Ranked <span className="text-secondary">#1</span> Professionals.
            </h2>
            <p className="text-white/40 text-sm md:text-lg font-bold uppercase tracking-widest">Selected by performance, skill, and trust.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8 px-4">
            {topProviders.map((provider) => (
              <div
                key={provider.id}
                className="group bg-slate-950 rounded-[2.5rem] md:rounded-[3.5rem] p-6 md:p-8 border border-white/5 hover:border-secondary/30 transition-all duration-700 flex flex-col h-full hover:shadow-[0_50px_100px_-20px_rgba(0,0,0,0.7)]"
              >
                <div className="relative mb-6 md:mb-8">
                  <div className="w-full aspect-square rounded-[2rem] md:rounded-[2.5rem] bg-white/5 flex items-center justify-center overflow-hidden border border-white/5 group-hover:scale-105 transition-transform duration-700">
                    <span className="text-5xl md:text-7xl font-black text-white/5">
                      {(provider.user?.name || provider.name || "?").charAt(0)}
                    </span>
                  </div>
                  {provider.verified && (
                    <div className="absolute -bottom-2 -right-2 bg-secondary text-slate-950 p-2 md:p-2.5 rounded-xl md:rounded-2xl shadow-2xl border-[3px] md:border-4 border-slate-950">
                      <ShieldCheck className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                  )}
                </div>

                <div className="flex-1">
                   <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-white/5 rounded-full border border-white/10">
                        <Star className="w-3 h-3 md:w-3.5 md:h-3.5 text-secondary fill-secondary" />
                        <span className="text-[10px] md:text-xs font-black text-white">{provider.rating}</span>
                      </div>
                      <span className="text-[8px] md:text-[10px] font-black text-secondary uppercase tracking-widest">{provider.category}</span>
                   </div>
                   <h3 className="text-xl md:text-2xl font-black text-white mb-2 group-hover:text-secondary transition-colors tracking-tight">
                    {provider.user?.name || provider.name}
                  </h3>
                  <p className="text-white/30 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 mb-4 md:mb-6">
                    <MapPin className="w-3 h-3 md:w-3.5 md:h-3.5 text-secondary" />
                    {provider.user?.city || provider.city}
                  </p>
                  <p className="text-white/50 text-xs md:text-sm leading-relaxed mb-6 md:mb-10 line-clamp-2">
                    {provider.bio}
                  </p>
                </div>

                <div className="pt-6 md:pt-8 border-t border-white/5 mt-auto flex items-center justify-between">
                  <div>
                    <p className="text-[8px] md:text-[9px] font-black text-white/30 uppercase tracking-[0.2em] mb-1">Fee Starts From</p>
                    <p className="text-lg md:text-2xl font-black text-white">Rs. {provider.price_min}</p>
                  </div>
                  <Link
                    href={`/provider/${provider.id}`}
                    className="w-12 h-12 md:w-14 md:h-14 bg-white/5 text-white rounded-xl md:rounded-2xl flex items-center justify-center hover:bg-secondary hover:text-slate-950 transition-all shadow-xl hover:rotate-12"
                  >
                    <ArrowUpRight className="w-6 h-6 md:w-7 md:h-7" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Emergency Response Unit */}
      <section className="py-16 md:py-32 bg-slate-950 relative">
         <div className="container-custom">
            <div className="bg-gradient-to-r from-red-600 to-rose-900 rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-24 text-center relative overflow-hidden shadow-2xl shadow-rose-900/40 mx-4">
               <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
               <div className="relative z-10">
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-white/10 rounded-2xl md:rounded-[2rem] flex items-center justify-center mx-auto mb-6 md:mb-10 backdrop-blur-xl border border-white/20">
                     <ShieldAlert className="w-8 h-8 md:w-10 md:h-10 text-white animate-pulse" />
                  </div>
                  <h2 className="text-3xl md:text-7xl font-black text-white mb-6 md:mb-8 tracking-tighter">Emergency? <br className="md:hidden" /> <span className="text-white/70">Consider it done.</span></h2>
                  <p className="text-white/60 text-base md:text-xl font-medium mb-8 md:mb-12 max-w-2xl mx-auto">Our Rapid Response Unit is available 24/7 for critical home repairs. Average response time under 15 minutes.</p>
                  <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center">
                     <a href="tel:03001234567" className="px-8 md:px-10 py-4 md:py-5 bg-white text-rose-600 rounded-2xl md:rounded-3xl font-black uppercase tracking-widest text-xs md:text-sm hover:scale-105 transition-all shadow-2xl">Call 0300-1234567</a>
                     <a href="https://wa.me/923001234567" className="px-8 md:px-10 py-4 md:py-5 bg-black/30 backdrop-blur-xl text-white border border-white/20 rounded-2xl md:rounded-3xl font-black uppercase tracking-widest text-xs md:text-sm hover:bg-black/50 transition-all">WhatsApp SOS</a>
                  </div>
               </div>
            </div>
         </div>
      </section>

      {/* Luxury Footer */}
      <footer className="py-16 md:py-32 bg-black border-t border-white/5 px-4">
        <div className="container-custom">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-16 mb-16 md:mb-24">
            <div className="lg:col-span-1 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-8 md:mb-10">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-secondary rounded-xl flex items-center justify-center flex-shrink-0">
                  <span className="text-slate-950 font-black text-xl md:text-2xl">س</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-black text-white tracking-tighter leading-none">Sehat <span className="text-secondary">&</span> Service</h1>
              </div>
              <p className="text-white/40 mb-8 md:mb-10 font-bold leading-relaxed text-sm md:text-base">
                Defining the pinnacle of home service excellence in Pakistan. Hand-picking only the best, for the best.
              </p>
              <div className="flex justify-center md:justify-start gap-4">
                {[Globe, Heart, Shield, Award].map((Icon, i) => (
                  <div key={i} className="w-10 h-10 md:w-12 md:h-12 bg-white/5 rounded-xl md:rounded-2xl flex items-center justify-center border border-white/10 hover:border-secondary hover:text-secondary transition-all cursor-pointer group">
                    <Icon className="w-4 h-4 md:w-5 md:h-5" />
                  </div>
                ))}
              </div>
            </div>
            {/* Quick Links */}
            <div className="text-center md:text-left">
              <h4 className="text-secondary font-black uppercase tracking-[0.2em] text-[10px] mb-8 md:mb-10">Discovery</h4>
              <ul className="space-y-4 md:space-y-6 font-bold text-white/50 text-xs md:text-sm">
                <li><Link href="/search" className="hover:text-white transition-colors">Elite Experts</Link></li>
                <li><Link href="/auth/signup?role=provider" className="hover:text-white transition-colors">Join the Guild</Link></li>
                <li><Link href="/about" className="hover:text-white transition-colors">Our Legacy</Link></li>
                <li><Link href="/contact" className="hover:text-white transition-colors">Concierge Support</Link></li>
              </ul>
            </div>
            <div className="text-center md:text-left">
              <h4 className="text-secondary font-black uppercase tracking-[0.2em] text-[10px] mb-8 md:mb-10">Guilds</h4>
              <ul className="space-y-4 md:space-y-6 font-bold text-white/50 text-xs md:text-sm">
                <li><Link href="/search?q=ac-repair" className="hover:text-white transition-colors">Climate Control</Link></li>
                <li><Link href="/search?q=electrician" className="hover:text-white transition-colors">Power & Grid</Link></li>
                <li><Link href="/search?q=plumbing" className="hover:text-white transition-colors">Fluid Dynamics</Link></li>
                <li><Link href="/search?q=cleaning" className="hover:text-white transition-colors">Sanitary Elite</Link></li>
              </ul>
            </div>
            <div className="text-center md:text-left">
              <h4 className="text-secondary font-black uppercase tracking-[0.2em] text-[10px] mb-8 md:mb-10">Headquarters</h4>
              <ul className="space-y-6 md:space-y-8 font-bold text-white/50 text-xs md:text-sm">
                <li className="flex items-center justify-center md:justify-start gap-4"><Phone className="w-4 h-4 md:w-5 md:h-5 text-secondary flex-shrink-0" /> 0300-1234567</li>
                <li className="flex items-center justify-center md:justify-start gap-4"><MessageCircle className="w-4 h-4 md:w-5 md:h-5 text-secondary flex-shrink-0" /> info@sehatservice.pk</li>
                <li className="flex items-start justify-center md:justify-start gap-4 text-center md:text-left"><MapPin className="w-4 h-4 md:w-5 md:h-5 text-secondary flex-shrink-0 mt-1" /> Gulberg III, Lahore</li>
              </ul>
            </div>
          </div>
          <div className="pt-12 md:pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 md:gap-8">
            <p className="text-white/20 font-black uppercase tracking-[0.1em] text-[8px] md:text-[10px] text-center md:text-left">© 2026 Sehat & Service Luxury Marketplace. All rights reserved.</p>
            <div className="flex gap-6 md:gap-10 text-white/20 font-black uppercase tracking-[0.1em] text-[8px] md:text-[10px]">
              <Link href="/privacy" className="hover:text-white transition-colors">Privacy Charter</Link>
              <Link href="/terms" className="hover:text-white transition-colors">Service Covenant</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
