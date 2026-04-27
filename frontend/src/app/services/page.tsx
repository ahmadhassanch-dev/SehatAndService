"use client";

import React from "react";
import Link from "next/link";
import {
  Snowflake, Droplet, Zap, Hammer, WashingMachine, Sparkles,
  Truck, GraduationCap, Scissors, Laptop, Shield, MoreHorizontal
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const categories = [
  { slug: "ac-repair", name: "AC Repair", name_urdu: "اے سی مرمت", icon: Snowflake, color: "bg-blue-500", count: 156 },
  { slug: "plumbing", name: "Plumbing", name_urdu: "پلمبنگ", icon: Droplet, color: "bg-cyan-500", count: 234 },
  { slug: "electrician", name: "Electrician", name_urdu: "الیکٹریشین", icon: Zap, color: "bg-yellow-500", count: 189 },
  { slug: "carpenter", name: "Carpenter", name_urdu: "کارپینٹر", icon: Hammer, color: "bg-amber-700", count: 145 },
  { slug: "appliance-repair", name: "Appliance Repair", name_urdu: "ایپلائنس مرمت", icon: WashingMachine, color: "bg-gray-600", count: 167 },
  { slug: "cleaning", name: "Cleaning", name_urdu: "کلیننگ", icon: Sparkles, color: "bg-purple-500", count: 98 },
  { slug: "moving", name: "Moving", name_urdu: "موونگ", icon: Truck, color: "bg-green-600", count: 76 },
  { slug: "tutoring", name: "Tutoring", name_urdu: "ٹیوشن", icon: GraduationCap, color: "bg-indigo-500", count: 312 },
  { slug: "beauty", name: "Beauty", name_urdu: "بیوٹی", icon: Scissors, color: "bg-pink-500", count: 134 },
  { slug: "tech-help", name: "Tech Help", name_urdu: "ٹیک ہیلپ", icon: Laptop, color: "bg-slate-700", count: 87 },
  { slug: "home-security", name: "Home Security", name_urdu: "ہوم سیکیورٹی", icon: Shield, color: "bg-red-600", count: 45 },
  { slug: "other", name: "Other Services", name_urdu: "دیگر خدمات", icon: MoreHorizontal, color: "bg-gray-400", count: 67 },
];

export default function ServicesIndexPage() {
  const { language, t } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container-custom py-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {language === "en" ? "Our Services" : "ہماری خدمات"}
          </h1>
          <p className="text-gray-600">
            {language === "en"
              ? "Browse all service categories and find what you need"
              : "تمام سروس کیٹیگریز براؤز کریں اور جو آپ کو چاہیے وہ تلاش کریں"}
          </p>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((cat, index) => (
            <Link
              key={cat.slug}
              href={`/services/${cat.slug}`}
              className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-all card-hover animate-fadeIn"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className={`w-14 h-14 ${cat.color} rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                <cat.icon className="w-7 h-7 text-white" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">
                {language === "en" ? cat.name : cat.name_urdu}
              </h3>
              <p className="text-sm text-gray-500">
                {cat.count} {language === "en" ? "providers" : "فراہم کنندے"}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}