"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Search, MapPin, Star, ShieldCheck, Clock, ChevronRight,
  Filter, SlidersHorizontal
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

// Mock categories data
const categoriesData: Record<string, any> = {
  "ac-repair": { name: "AC Repair", name_urdu: "اے سی مرمت", icon: "❄️", description: "Air conditioning repair and maintenance services" },
  "plumbing": { name: "Plumbing", name_urdu: "پلمبنگ", icon: "💧", description: "Pipe fitting, leak repair, and drainage services" },
  "electrician": { name: "Electrician", name_urdu: "الیکٹریشین", icon: "⚡", description: "Electrical wiring and repairs" },
  "carpenter": { name: "Carpenter", name_urdu: "کارپینٹر", icon: "🔨", description: "Furniture repair and custom work" },
  "appliance-repair": { name: "Appliance Repair", name_urdu: "ایپلائنس مرمت", icon: "🔌", description: "Home appliance repairs" },
  "cleaning": { name: "Cleaning", name_urdu: "کلیننگ", icon: "✨", description: "Home and office cleaning services" },
  "moving": { name: "Moving", name_urdu: "موونگ", icon: "🚚", description: "Packers and movers" },
  "tutoring": { name: "Tutoring", name_urdu: "ٹیوشن", icon: "🎓", description: "Home tutors and coaching" },
  "beauty": { name: "Beauty", name_urdu: "بیوٹی", icon: "✂️", description: "Salon and beauty services" },
  "tech-help": { name: "Tech Help", name_urdu: "ٹیک ہیلپ", icon: "💻", description: "Computer and phone repair" },
  "home-security": { name: "Home Security", name_urdu: "ہوم سیکیورٹی", icon: "🛡️", description: "CCTV and security systems" },
  "other": { name: "Other Services", name_urdu: "دیگر خدمات", icon: "➕", description: "Miscellaneous services" },
};

// Mock providers
const mockProviders = [
  {
    id: 1,
    name: "Ahmed Khan",
    category: "ac-repair",
    rating: 4.8,
    reviews: 156,
    verified: true,
    price_min: 500,
    price_max: 5000,
    price: "Rs. 500 - 5000",
    city: "Lahore",
    response_time: "15 min",
    bio: "Expert AC technician with 10+ years experience. Specialized in all brands including Samsung, LG, Panasonic, and Haier.",
  },
  {
    id: 11,
    name: "Imran AC Services",
    category: "ac-repair",
    rating: 4.6,
    reviews: 89,
    verified: true,
    price_min: 600,
    price_max: 4000,
    price: "Rs. 600 - 4000",
    city: "Karachi",
    response_time: "30 min",
    bio: "Professional AC repair services for all brands. Quick turnaround and quality parts.",
  },
  {
    id: 12,
    name: "Cool Tech Solutions",
    category: "ac-repair",
    rating: 4.5,
    reviews: 67,
    verified: true,
    price_min: 700,
    price_max: 6000,
    price: "Rs. 700 - 6000",
    city: "Islamabad",
    response_time: "45 min",
    bio: "Authorized service center for major AC brands. Gas refilling and maintenance experts.",
  },
  {
    id: 13,
    name: "Ali Cooling Systems",
    category: "ac-repair",
    rating: 4.4,
    reviews: 45,
    verified: false,
    price_min: 400,
    price_max: 3500,
    price: "Rs. 400 - 3500",
    city: "Lahore",
    response_time: "1 hour",
    bio: "Affordable AC repair services. Specializing in window and split AC units.",
  },
  {
    id: 14,
    name: "Fast Cool Services",
    category: "ac-repair",
    rating: 4.3,
    reviews: 34,
    verified: true,
    price_min: 550,
    price_max: 4500,
    price: "Rs. 550 - 4500",
    city: "Rawalpindi",
    response_time: "20 min",
    bio: "Emergency AC repair services. 24/7 availability for urgent repairs.",
  },
  {
    id: 15,
    name: "Premier AC Care",
    category: "ac-repair",
    rating: 4.9,
    reviews: 234,
    verified: true,
    price_min: 800,
    price_max: 8000,
    price: "Rs. 800 - 8000",
    city: "Lahore",
    response_time: "10 min",
    bio: "Premium AC services with warranty. All brands serviced with genuine parts.",
  },
];

export default function ServicesPage() {
  const params = useParams();
  const category = params.category as string;
  const { language, t } = useLanguage();
  
  const [sortBy, setSortBy] = useState("rating");
  const [minRating, setMinRating] = useState<number | null>(null);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const categoryInfo = categoriesData[category] || categoriesData["other"];
  const providers = mockProviders.filter(p => p.category === category);

  // Sort providers
  const sortedProviders = [...providers].sort((a, b) => {
    if (sortBy === "rating") return b.rating - a.rating;
    if (sortBy === "price") return a.price_min - b.price_min;
    return 0;
  }).filter(p => {
    if (minRating && p.rating < minRating) return false;
    if (verifiedOnly && !p.verified) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container-custom py-6">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <Link href="/" className="hover:text-primary">Home</Link>
            <ChevronRight className="w-4 h-4" />
            <Link href="/services" className="hover:text-primary">Services</Link>
            <ChevronRight className="w-4 h-4" />
            <span className="text-gray-900">{language === "en" ? categoryInfo.name : categoryInfo.name_urdu}</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-4xl">{categoryInfo.icon}</div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                {language === "en" ? categoryInfo.name : categoryInfo.name_urdu}
              </h1>
              <p className="text-gray-600">{categoryInfo.description}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container-custom py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <div className={`lg:w-64 ${showFilters ? "block" : "hidden lg:block"}`}>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Filters
              </h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Sort By</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="rating">Highest Rated</option>
                    <option value="price">Lowest Price</option>
                    <option value="reviews">Most Reviews</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-2 block">Minimum Rating</label>
                  <select
                    value={minRating || ""}
                    onChange={(e) => setMinRating(e.target.value ? Number(e.target.value) : null)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Any Rating</option>
                    <option value="4">4+ Stars</option>
                    <option value="4.5">4.5+ Stars</option>
                  </select>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="verified"
                    checked={verifiedOnly}
                    onChange={(e) => setVerifiedOnly(e.target.checked)}
                    className="w-4 h-4 text-primary rounded focus:ring-primary"
                  />
                  <label htmlFor="verified" className="text-sm text-gray-700">
                    Verified Only
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Providers Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-4">
              <p className="text-gray-600">
                {sortedProviders.length} {language === "en" ? "providers found" : "فراہم کنندے ملے"}
              </p>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sortedProviders.map((provider) => (
                <Link
                  key={provider.id}
                  href={`/provider/${provider.id}`}
                  className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-all card-hover"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
                      <span className="text-2xl font-bold text-primary">{provider.name.charAt(0)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-gray-900 truncate">{provider.name}</h3>
                        {provider.verified && (
                          <ShieldCheck className="w-4 h-4 text-primary flex-shrink-0" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                        <div className="flex items-center gap-1">
                          <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                          <span className="font-medium">{provider.rating}</span>
                        </div>
                        <span>({provider.reviews} reviews)</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                        <MapPin className="w-4 h-4" />
                        <span>{provider.city}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock className="w-4 h-4" />
                        <span>{provider.response_time} response</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-primary font-semibold">{provider.price}</span>
                    <span className="text-primary text-sm font-medium">
                      {language === "en" ? "View Profile" : "پروفائل دیکھیں"}
                      <ChevronRight className="w-4 h-4 inline" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {sortedProviders.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">{language === "en" ? "No providers found" : "کوئی فراہم کنندہ نہیں ملا"}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}