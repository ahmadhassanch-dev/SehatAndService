"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft, Star, Filter, SlidersHorizontal, ThumbsUp, ThumbsDown,
  MessageCircle, MoreVertical, CheckCircle
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

// Mock reviews data
const mockReviews = [
  {
    id: 1,
    provider_id: 1,
    user: { name: "Sarah Ahmed", photo: null, city: "Lahore" },
    rating: 5,
    comment: "Excellent service! Fixed my AC in just 30 minutes. Very professional and punctual. The technician was knowledgeable and explained the issue clearly before starting the repair.",
    date: "2 days ago",
    helpful: 12,
    service: "AC Repair",
    is_verified: true,
  },
  {
    id: 2,
    provider_id: 1,
    user: { name: "Muhammad K.", photo: null, city: "Lahore" },
    rating: 5,
    comment: "Great experience overall. The technician arrived on time and completed the work efficiently. Would definitely recommend to others.",
    date: "1 week ago",
    helpful: 8,
    service: "AC Gas Refilling",
    is_verified: true,
  },
  {
    id: 3,
    provider_id: 1,
    user: { name: "Fatima R.", photo: null, city: "Rawalpindi" },
    rating: 4,
    comment: "Good work, arrived on time. The AC is working much better now. Slightly expensive but the service quality was good.",
    date: "2 weeks ago",
    helpful: 5,
    service: "AC Maintenance",
    is_verified: true,
  },
  {
    id: 4,
    provider_id: 1,
    user: { name: "Ali S.", photo: null, city: "Lahore" },
    rating: 5,
    comment: "Very satisfied with the service. AC is working perfectly now after the repair. The technician was very professional and clean.",
    date: "3 weeks ago",
    helpful: 15,
    service: "AC Repair",
    is_verified: true,
  },
  {
    id: 5,
    provider_id: 1,
    user: { name: "Usman M.", photo: null, city: "Faisalabad" },
    rating: 5,
    comment: "Best AC repair service in Lahore. Fair pricing and quality work. Highly recommended!",
    date: "1 month ago",
    helpful: 20,
    service: "AC Installation",
    is_verified: true,
  },
];

const ratingBreakdown = [
  { stars: 5, count: 120, percentage: 77 },
  { stars: 4, count: 25, percentage: 16 },
  { stars: 3, count: 8, percentage: 5 },
  { stars: 2, count: 2, percentage: 1 },
  { stars: 1, count: 1, percentage: 1 },
];

export default function ReviewsPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>}>
      <ReviewsContent />
    </React.Suspense>
  );
}

function ReviewsContent() {
  const searchParams = useSearchParams();
  const providerId = searchParams.get("provider");
  const { language, t } = useLanguage();
  
  const [sortBy, setSortBy] = useState("recent");
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const averageRating = 4.8;
  const totalReviews = mockReviews.length;

  const filteredReviews = mockReviews
    .filter(r => {
      if (filterRating && r.rating !== filterRating) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "recent") return 0; // Already sorted by date
      if (sortBy === "highest") return b.rating - a.rating;
      if (sortBy === "lowest") return a.rating - b.rating;
      if (sortBy === "helpful") return b.helpful - a.helpful;
      return 0;
    });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container-custom py-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Link href="/" className="hover:text-primary">Home</Link>
            <ArrowLeft className="w-4 h-4 rotate-180" />
            <span className="text-gray-900">{language === "en" ? "Reviews" : "جائزے"}</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mt-2">
            {language === "en" ? "Customer Reviews" : "گاہک کی جائزے"}
          </h1>
        </div>
      </div>

      <div className="container-custom py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Rating Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
              {/* Average Rating */}
              <div className="text-center mb-6">
                <div className="text-5xl font-bold text-primary mb-2">{averageRating}</div>
                <div className="flex items-center justify-center gap-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${i < Math.floor(averageRating) ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
                    />
                  ))}
                </div>
                <p className="text-gray-600">{totalReviews} {language === "en" ? "reviews" : "جائزے"}</p>
              </div>

              {/* Rating Breakdown */}
              <div className="space-y-3">
                {ratingBreakdown.map((item) => (
                  <div key={item.stars} className="flex items-center gap-3">
                    <span className="text-sm text-gray-600 w-6">{item.stars}</span>
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-500 rounded-full"
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm text-gray-500 w-12 text-right">{item.count}</span>
                  </div>
                ))}
              </div>

              {/* Write Review CTA */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-center text-gray-600 text-sm mb-4">
                  {language === "en" 
                    ? "Have you used this service?" 
                    : "کیا آپ نے یہ سروس استعمال کی ہے؟"}
                </p>
                <Link
                  href="/auth/login"
                  className="block w-full py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors text-center"
                >
                  {language === "en" ? "Write a Review" : "جائزہ لکھیں"}
                </Link>
              </div>
            </div>
          </div>

          {/* Reviews List */}
          <div className="lg:col-span-2 space-y-6">
            {/* Filters */}
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="p-2 hover:bg-gray-100 rounded-lg lg:hidden"
                  >
                    <SlidersHorizontal className="w-5 h-5 text-gray-600" />
                  </button>
                  <span className="text-gray-600">
                    {filteredReviews.length} {language === "en" ? "reviews" : "جائزے"}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {/* Rating Filter */}
                  <div className={`${showFilters ? "block" : "hidden"} sm:block`}>
                    <select
                      value={filterRating || ""}
                      onChange={(e) => setFilterRating(e.target.value ? Number(e.target.value) : null)}
                      className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="">{language === "en" ? "All Ratings" : "تمام درجے"}</option>
                      <option value="5">5 {language === "en" ? "Stars" : "ستارے"}</option>
                      <option value="4">4+ {language === "en" ? "Stars" : "ستارے"}</option>
                      <option value="3">3+ {language === "en" ? "Stars" : "ستارے"}</option>
                    </select>
                  </div>

                  {/* Sort */}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="recent">{language === "en" ? "Most Recent" : "حالیہ"}</option>
                    <option value="highest">{language === "en" ? "Highest Rated" : "سب سے زیادہ"}</option>
                    <option value="lowest">{language === "en" ? "Lowest Rated" : "سب سے کم"}</option>
                    <option value="helpful">{language === "en" ? "Most Helpful" : "زیادہ مددگار"}</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div className="space-y-4">
              {filteredReviews.map((review) => (
                <div key={review.id} className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="text-lg font-semibold text-primary">
                          {review.user.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                          {review.user.name}
                          {review.is_verified && (
                            <CheckCircle className="w-4 h-4 text-green-500" />
                          )}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {review.user.city} • {review.date}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < review.rating ? "text-yellow-500 fill-yellow-500" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="mb-3">
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                      {review.service}
                    </span>
                  </div>

                  <p className="text-gray-700 mb-4">{review.comment}</p>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary transition-colors">
                      <ThumbsUp className="w-4 h-4" />
                      <span>{language === "en" ? "Helpful" : "مددگار"} ({review.helpful})</span>
                    </button>
                    <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary transition-colors">
                      <MessageCircle className="w-4 h-4" />
                      <span>{language === "en" ? "Reply" : "جواب دیں"}</span>
                    </button>
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                      <MoreVertical className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filteredReviews.length === 0 && (
              <div className="text-center py-12 bg-white rounded-xl shadow-sm">
                <Star className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {language === "en" ? "No reviews found" : "کوئی جائزہ نہیں ملی"}
                </h3>
                <p className="text-gray-600">
                  {language === "en" 
                    ? "Try adjusting your filters" 
                    : "اپنے فلٹرز تبدیل کریں"}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}