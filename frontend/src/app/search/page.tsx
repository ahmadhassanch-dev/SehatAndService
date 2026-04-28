"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Search, MapPin, Star, ShieldCheck, Clock, ChevronRight,
  Filter, SlidersHorizontal, Loader2, Heart, ArrowUpRight,
  ChevronDown, CheckCircle, Award, Sparkle, X, History,
  TrendingUp, Lightbulb
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import api from "@/lib/api";

const cities = ["Lahore", "Karachi", "Islamabad", "Rawalpindi", "Faisalabad", "Multan", "Peshawar", "Quetta"];

const popularSearches = [
  "AC Gas Refilling", "Emergency Plumber", "Electrician for Wiring", 
  "Furniture Polishing", "Math Tutor for O-Levels", "Deep Home Cleaning"
];

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const cityParam = searchParams.get("city") || "";
  const { language, t } = useLanguage();
  
  const [searchInput, setSearchQuery] = useState(query);
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  
  const [sortBy, setSortBy] = useState("rating");
  const [minRating, setMinRating] = useState<number | null>(null);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCity, setSelectedCity] = useState(cityParam);
  const [showCityDropdown, setShowCityDropdown] = useState(false);

  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

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
    const fetchResults = async () => {
      setLoading(true);
      try {
        const response = await api.getProviders({
          category: query,
          city: selectedCity,
          min_rating: minRating || undefined,
          verified_only: verifiedOnly,
          sort_by: sortBy,
        });
        setResults(response.providers);
        setTotal(response.total);
      } catch (error) {
        console.error("Failed to fetch providers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query, selectedCity, sortBy, minRating, verifiedOnly]);

  const handleSearchSubmit = (e?: React.FormEvent, term?: string) => {
    if (e) e.preventDefault();
    const finalTerm = term || searchInput;
    if (finalTerm.trim()) {
      setShowSuggestions(false);
      router.push(`/search?q=${encodeURIComponent(finalTerm)}&city=${selectedCity}`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 pt-20">
      {/* Advanced Search Hub - Luxury Banner */}
      <div className="bg-midnight-mesh pt-20 pb-40 border-b border-white/5 relative px-4">
        <div className="container-custom">
          <div className="max-w-5xl mx-auto animate-reveal text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center md:items-end justify-between gap-10 mb-12">
               <div>
                  <div className="flex items-center justify-center md:justify-start gap-3 text-secondary text-[10px] font-black uppercase tracking-[0.3em] mb-6">
                    <Sparkle className="w-4 h-4 fill-secondary" />
                    Elite Marketplace Terminal
                  </div>
                  <h1 className="text-5xl md:text-8xl font-black text-white tracking-tighter leading-none mb-6">
                    Guild <span className="text-secondary">Search.</span>
                  </h1>
                  <p className="text-white/40 text-xl font-medium max-w-2xl">
                    Deploying the most skilled experts to your coordinates.
                  </p>
               </div>
               
               <div className="hidden lg:flex items-center gap-4 bg-white/5 p-4 rounded-3xl border border-white/10 backdrop-blur-xl">
                  <div className="w-12 h-12 rounded-2xl bg-secondary/10 flex items-center justify-center border border-secondary/20">
                     <TrendingUp className="w-6 h-6 text-secondary" />
                  </div>
                  <div className="pr-6">
                     <p className="text-[10px] font-black text-white/20 uppercase tracking-widest">Active Experts</p>
                     <p className="text-xl font-black text-white">1,200+</p>
                  </div>
               </div>
            </div>

            {/* Advanced Search Bar Component */}
            <div className="relative max-w-4xl" ref={searchRef}>
              <form onSubmit={handleSearchSubmit} className="bg-slate-900 rounded-[2.5rem] p-3 border border-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.7)] flex flex-col md:flex-row gap-3">
                <div className="flex-[2] relative group">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-white/20 group-focus-within:text-secondary transition-colors" />
                  <input
                    type="text"
                    value={searchInput}
                    onFocus={() => setShowSuggestions(true)}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search mission type (e.g. AC Repair, Plumbing)"
                    className="w-full pl-16 pr-8 py-5 md:py-6 bg-white/5 border-none rounded-[1.5rem] md:rounded-[2rem] text-white font-bold text-lg focus:ring-2 focus:ring-secondary/20 transition-all placeholder:text-white/10"
                  />
                  {searchInput && (
                    <button 
                      onClick={() => setSearchQuery("")}
                      className="absolute right-6 top-1/2 -translate-y-1/2 p-2 hover:bg-white/5 rounded-xl text-white/20 hover:text-white transition-all"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>

                <div className="flex-1 relative">
                  <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-secondary" />
                  <button
                    type="button"
                    onClick={() => setShowCityDropdown(!showCityDropdown)}
                    className="w-full pl-16 pr-10 py-5 md:py-6 bg-white/5 hover:bg-white/10 text-white text-left rounded-[1.5rem] md:rounded-[2rem] transition-all font-black uppercase tracking-widest text-[10px] md:text-xs"
                  >
                    <span className="truncate block">{selectedCity || "Pakistan"}</span>
                    <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                  </button>
                  {showCityDropdown && (
                    <div className="absolute top-full left-0 right-0 mt-4 bg-slate-900 rounded-3xl shadow-2xl border border-white/10 z-[60] max-h-80 overflow-y-auto p-3 animate-reveal">
                      {cities.map((city) => (
                        <button
                          key={city}
                          type="button"
                          onClick={() => { setSelectedCity(city); setShowCityDropdown(false); }}
                          className="w-full px-6 py-4 text-left text-white/60 hover:text-secondary hover:bg-white/5 rounded-2xl font-black uppercase tracking-widest text-[10px] transition-all"
                        >
                          {city}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <button type="submit" className="btn-secondary !rounded-[1.5rem] md:!rounded-[2rem] !px-12 shadow-secondary/20">
                  <span className="font-black">Deploy Search</span>
                </button>
              </form>

              {/* Advanced Suggestions Panel */}
              {showSuggestions && (
                <div className="absolute top-full left-0 right-0 mt-6 bg-slate-900 rounded-[3rem] border border-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.8)] z-[70] overflow-hidden animate-reveal p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                     <div>
                        <h4 className="text-[10px] font-black text-secondary uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                           <TrendingUp className="w-4 h-4" />
                           Trending Expertise
                        </h4>
                        <div className="space-y-4">
                           {popularSearches.map((s, i) => (
                             <button 
                               key={i}
                               onClick={() => handleSearchSubmit(undefined, s)}
                               className="w-full flex items-center gap-4 text-white/60 hover:text-white font-bold text-sm group transition-all"
                             >
                                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center group-hover:bg-secondary group-hover:text-slate-950 transition-all">
                                   <History className="w-4 h-4" />
                                </div>
                                <span>{s}</span>
                             </button>
                           ))}
                        </div>
                     </div>
                     <div className="border-l border-white/5 pl-12 hidden md:block">
                        <h4 className="text-[10px] font-black text-secondary uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                           <Lightbulb className="w-4 h-4" />
                           Quick Insights
                        </h4>
                        <div className="bg-white/5 rounded-3xl p-6 border border-white/5">
                           <p className="text-white/40 text-sm leading-relaxed mb-6 font-medium italic">
                             "Finding the right expert is about more than just a search. Look for the Guild Verified badge for absolute security."
                           </p>
                           <div className="flex items-center gap-4">
                              <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center">
                                 <ShieldCheck className="w-5 h-5 text-secondary" />
                              </div>
                              <span className="text-[10px] font-black text-white/60 uppercase tracking-widest leading-tight">Identity & Skill <br /> Guaranteed</span>
                           </div>
                        </div>
                     </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom -mt-20 relative z-10 pb-32 px-4">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Sidebar Filter - Luxury Dark */}
          <aside className={`lg:w-80 transition-all ${showFilters ? "block" : "hidden lg:block"}`}>
            <div className="bg-slate-900 rounded-[3rem] p-10 border border-white/10 shadow-2xl sticky top-32">
              <h3 className="text-white font-black uppercase tracking-widest text-xs mb-10 flex items-center gap-3">
                <Filter className="w-4 h-4 text-secondary" />
                Refine Search
              </h3>
              
              <div className="space-y-10">
                <div className="group">
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-4 block group-hover:text-secondary transition-colors">Sort Collection</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full bg-white/5 px-6 py-4 border-none rounded-2xl text-white font-bold text-sm focus:ring-2 focus:ring-secondary/20 cursor-pointer appearance-none"
                  >
                    <option value="rating" className="bg-slate-900">Top Rated Professionals</option>
                    <option value="price" className="bg-slate-900">Fee: Lowest to Highest</option>
                  </select>
                </div>

                <div className="group">
                  <label className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-4 block group-hover:text-secondary transition-colors">Rating Threshold</label>
                  <div className="flex flex-col gap-3">
                    {[4.5, 4, 3].map(rating => (
                      <button
                        key={rating}
                        onClick={() => setMinRating(minRating === rating ? null : rating)}
                        className={`flex items-center justify-between px-6 py-4 rounded-2xl text-sm font-black transition-all border-2 ${
                          minRating === rating 
                            ? "bg-secondary text-slate-950 border-secondary shadow-lg shadow-amber-900/20" 
                            : "bg-white/5 border-white/5 text-white/40 hover:border-white/10"
                        }`}
                      >
                        <span>{rating}+ Excellence</span>
                        <Star className={`w-4 h-4 ${minRating === rating ? "fill-slate-950" : "fill-white/10"}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setVerifiedOnly(!verifiedOnly)}
                  className={`w-full flex items-center justify-between p-6 rounded-3xl border-2 transition-all group ${
                    verifiedOnly ? "bg-emerald-500/10 border-emerald-500/50" : "bg-white/5 border-white/5"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <ShieldCheck className={`w-5 h-5 ${verifiedOnly ? "text-emerald-400" : "text-white/20"}`} />
                    <span className={`text-xs font-black uppercase tracking-widest ${verifiedOnly ? "text-emerald-400" : "text-white/40"}`}>Verified Identity</span>
                  </div>
                  <div className={`w-5 h-5 rounded-full border-2 transition-all flex items-center justify-center ${verifiedOnly ? "bg-emerald-500 border-emerald-500" : "border-white/10"}`}>
                     {verifiedOnly && <CheckCircle className="w-3 h-3 text-slate-950" />}
                  </div>
                </button>
              </div>
            </div>
          </aside>

          {/* Luxury Results Feed */}
          <main className="flex-1">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden w-full mb-8 py-6 px-10 bg-slate-900 border border-white/10 rounded-[2.5rem] flex items-center justify-between shadow-2xl text-white animate-reveal"
            >
              <span className="font-black uppercase tracking-[0.2em] text-[10px] flex items-center gap-4">
                <SlidersHorizontal className="w-5 h-5 text-secondary" />
                Refine Directive
              </span>
              <ChevronDown className={`w-5 h-5 transition-transform duration-500 ${showFilters ? "rotate-180" : ""}`} />
            </button>

            {loading ? (
              <div className="flex flex-col items-center justify-center py-40 space-y-8 animate-reveal">
                 <div className="w-20 h-20 rounded-full border-[6px] border-white/5 border-t-secondary animate-spin"></div>
                 <p className="text-secondary font-black uppercase tracking-[0.3em] text-[10px]">Curating Elite Professionals</p>
              </div>
            ) : (
              <div className="space-y-8">
                {results.map((provider, index) => (
                  <Link
                    key={provider.id}
                    href={`/provider/${provider.id}`}
                    className="group block bg-white/5 rounded-[3.5rem] p-4 md:pr-10 border border-white/5 hover:border-white/10 hover:bg-white/[0.07] transition-all duration-700 animate-reveal shadow-2xl"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex flex-col md:flex-row gap-10">
                      {/* Elite Visual */}
                      <div className="w-full md:w-64 aspect-square rounded-[3rem] bg-white/5 flex items-center justify-center relative overflow-hidden group-hover:scale-95 transition-transform duration-700">
                        <span className="text-9xl font-black text-white/[0.03] group-hover:text-secondary/10 transition-colors">
                          {(provider.user?.name || provider.name || "?").charAt(0)}
                        </span>
                        {provider.verified && (
                          <div className="absolute top-6 left-6 bg-secondary text-slate-950 p-3 rounded-2xl shadow-2xl border-4 border-slate-900">
                            <ShieldCheck className="w-6 h-6" />
                          </div>
                        )}
                      </div>

                      {/* Professional Specs */}
                      <div className="flex-1 py-6 flex flex-col justify-between px-4 md:px-0">
                        <div>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-6">
                             <div className="flex items-center gap-4">
                                <span className="px-5 py-2 bg-secondary/10 text-secondary text-[10px] font-black uppercase tracking-widest rounded-xl border border-secondary/20">
                                  {provider.category}
                                </span>
                                <div className="flex items-center gap-2">
                                  <Star className="w-4 h-4 text-secondary fill-secondary" />
                                  <span className="text-sm font-black text-white">{provider.rating} Excellence</span>
                                </div>
                             </div>
                             <p className="text-white font-black text-3xl tracking-tighter">Rs. {provider.price_min}+</p>
                          </div>

                          <h3 className="text-3xl md:text-5xl font-black text-white mb-4 group-hover:text-secondary transition-colors tracking-tighter leading-none">
                            {provider.user?.name || provider.name}
                          </h3>
                          
                          <p className="text-white/40 text-xl leading-relaxed line-clamp-2 mb-10 font-medium">
                            {provider.bio}
                          </p>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-8 border-t border-white/5 mt-auto gap-8">
                          <div className="flex flex-wrap gap-10">
                            <div className="flex items-center gap-3 text-white/30 font-black text-[10px] uppercase tracking-[0.2em]">
                                <MapPin className="w-4 h-4 text-secondary" />
                                {provider.user?.city || provider.city}
                            </div>
                            <div className="flex items-center gap-3 text-white/30 font-black text-[10px] uppercase tracking-[0.2em]">
                                <Clock className="w-4 h-4 text-secondary" />
                                {provider.response_time} Response
                            </div>
                            <div className="flex items-center gap-3 text-white/30 font-black text-[10px] uppercase tracking-[0.2em]">
                                <Award className="w-4 h-4 text-secondary" />
                                Top Expert
                            </div>
                          </div>
                          <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center group-hover:bg-secondary group-hover:text-slate-950 transition-all group-hover:rotate-12 group-hover:scale-110 border border-white/5 self-end sm:self-auto">
                            <ArrowUpRight className="w-7 h-7" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
