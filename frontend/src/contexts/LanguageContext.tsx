"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Language = "en" | "ur";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.services": "Services",
    "nav.about": "About",
    "nav.contact": "Contact",
    "nav.login": "Login",
    "nav.signup": "Sign Up",
    "nav.dashboard": "Dashboard",
    "nav.logout": "Logout",
    
    // Home Page
    "home.title": "Sehat & Service",
    "home.subtitle": "Your Trusted Local Services Marketplace",
    "home.search.placeholder": "Search for services (e.g., AC repair, plumber...)",
    "home.search.button": "Search",
    "home.location.placeholder": "Select City",
    "home.how_it_works": "How It Works",
    "home.step1.title": "Search",
    "home.step1.desc": "Find the service you need",
    "home.step2.title": "Book",
    "home.step2.desc": "Book a trusted provider",
    "home.step3.title": "Relax",
    "home.step3.desc": "Get your job done",
    "home.top_rated": "Top Rated Providers",
    "home.nearby_services": "Nearby Services",
    "home.emergency": "Emergency Services",
    "home.testimonials": "What Our Customers Say",
    "home.faq": "Frequently Asked Questions",
    "home.trust_badges": "Trusted by Thousands",
    
    // Categories
    "cat.ac_repair": "AC Repair",
    "cat.plumbing": "Plumbing",
    "cat.electrician": "Electrician",
    "cat.carpenter": "Carpenter",
    "cat.appliance": "Appliance Repair",
    "cat.cleaning": "Cleaning",
    "cat.moving": "Moving",
    "cat.tutoring": "Tutoring",
    "cat.beauty": "Beauty",
    "cat.tech_help": "Tech Help",
    "cat.home_security": "Home Security",
    "cat.other": "Other Services",
    
    // Provider
    "provider.verified": "Verified",
    "provider.rating": "Rating",
    "provider.reviews": "Reviews",
    "provider.response_time": "Response Time",
    "provider.about": "About",
    "provider.services": "Services",
    "provider.reviews_title": "Customer Reviews",
    "provider.book_now": "Book Now",
    "provider.call_now": "Call Now",
    "provider.whatsapp": "WhatsApp",
    "provider.chat": "Chat",
    
    // Booking
    "booking.title": "Book Service",
    "booking.service": "Service Type",
    "booking.description": "Describe your problem",
    "booking.date": "Preferred Date",
    "booking.time": "Preferred Time",
    "booking.address": "Your Address",
    "booking.notes": "Additional Notes",
    "booking.confirm": "Confirm Booking",
    "booking.cancel": "Cancel",
    
    // Auth
    "auth.login_title": "Welcome Back",
    "auth.signup_title": "Create Account",
    "auth.phone": "Phone Number",
    "auth.email": "Email",
    "auth.password": "Password",
    "auth.name": "Full Name",
    "auth.otp": "Enter OTP",
    "auth.otp_sent": "OTP sent to your phone",
    "auth.verify": "Verify",
    "auth.resend_otp": "Resend OTP",
    "auth.continue_google": "Continue with Google",
    "auth.or": "OR",
    
    // Dashboard
    "dash.my_bookings": "My Bookings",
    "dash.active": "Active",
    "dash.pending": "Pending",
    "dash.completed": "Completed",
    "dash.cancelled": "Cancelled",
    "dash.earnings": "Earnings",
    "dash.profile": "Profile",
    "dash.settings": "Settings",
    
    // Common
    "common.view_all": "View All",
    "common.see_more": "See More",
    "common.loading": "Loading...",
    "common.error": "Something went wrong",
    "common.retry": "Retry",
    "common.cancel": "Cancel",
    "common.confirm": "Confirm",
    "common.save": "Save",
    "common.delete": "Delete",
    "common.edit": "Edit",
    "common.close": "Close",
  },
  ur: {
    // Navigation
    "nav.home": "ہوم",
    "nav.services": "خدمات",
    "nav.about": "ہماري متعلق",
    "nav.contact": "رابطہ",
    "nav.login": "لاگ ان",
    "nav.signup": "سائن اپ",
    "nav.dashboard": "ڈیش بورڈ",
    "nav.logout": "لاگ آؤٹ",
    
    // Home Page
    "home.title": "سیہت اینڈ سروس",
    "home.subtitle": "آپ کا بھروسہ مند مقامی خدمات کا بازار",
    "home.search.placeholder": "خدمات تلاش کریں (مثلاً اے سی مرمت، پلمینگ...)",
    "home.search.button": "تلاش",
    "home.location.placeholder": "شہر کا انتخاب کریں",
    "home.how_it_works": "یہ کیسے کام کرتا ہے",
    "home.step1.title": "تلاش",
    "home.step1.desc": "آپ کو درکار خدمات تلاش کریں",
    "home.step2.title": "بکنگ",
    "home.step2.desc": "بھروسہ مند فراہم کنندہ کو بک کریں",
    "home.step3.title": "آرام",
    "home.step3.desc": "اپنا کام کروائیں",
    "home.top_rated": "بہترین درجہ بندی والے فراہم کنندہ",
    "home.nearby_services": "قریبی خدمات",
    "home.emergency": "ایمرجنسی خدمات",
    "home.testimonials": "ہمارے گاہک کیا کہتے ہیں",
    "home.faq": "اکثر پوچھے گئے سوالات",
    "home.trust_badges": "ہزاروں کا بھروسہ",
    
    // Categories
    "cat.ac_repair": "اے سی مرمت",
    "cat.plumbing": "پلمبنگ",
    "cat.electrician": "الیکٹریشین",
    "cat.carpenter": "کارپینٹر",
    "cat.appliance": "ایپلائنس مرمت",
    "cat.cleaning": "کلیننگ",
    "cat.moving": "موونگ",
    "cat.tutoring": "ٹیوشن",
    "cat.beauty": "بیوٹی",
    "cat.tech_help": "ٹیک ہیلپ",
    "cat.home_security": "ہوم سیکیورٹی",
    "cat.other": "دیگر خدمات",
    
    // Provider
    "provider.verified": "تصدیق شدہ",
    "provider.rating": "درجہ بندی",
    "provider.reviews": "جائزے",
    "provider.response_time": "جواب کا وقت",
    "provider.about": "متعلق",
    "provider.services": "خدمات",
    "provider.reviews_title": "گاہک کے جائزے",
    "provider.book_now": "اب بک کریں",
    "provider.call_now": "اب کال کریں",
    "provider.whatsapp": "واہٹس ایپ",
    "provider.chat": "چیٹ",
    
    // Booking
    "booking.title": "سروس بک کریں",
    "booking.service": "سروس کی قسم",
    "booking.description": "اپنے مسئلے کی وضاحت کریں",
    "booking.date": "ترجیحی تاریخ",
    "booking.time": "ترجیحی وقت",
    "booking.address": "آپ کا پتہ",
    "booking.notes": "اضافی نوٹس",
    "booking.confirm": "بکنگ کی تصدیق",
    "booking.cancel": "منسوخ",
    
    // Auth
    "auth.login_title": "خوش آمدید",
    "auth.signup_title": "اکاؤنٹ بنائیں",
    "auth.phone": "فون نمبر",
    "auth.email": "ای میل",
    "auth.password": "پاس ورڈ",
    "auth.name": "پورا نام",
    "auth.otp": "OTP درج کریں",
    "auth.otp_sent": "آپ کے فون پر OTP بھیجی گئی",
    "auth.verify": "تصدیق کریں",
    "auth.resend_otp": "OTP دوبارہ بھیجیں",
    "auth.continue_google": "گوگل کے ساتھ جاری رکھیں",
    "auth.or": "یا",
    
    // Dashboard
    "dash.my_bookings": "میری بکنگز",
    "dash.active": "فعال",
    "dash.pending": "زیر التوا",
    "dash.completed": "مکمل",
    "dash.cancelled": "منسوخ",
    "dash.earnings": "کمائی",
    "dash.profile": "پروفائل",
    "dash.settings": "ترتیبات",
    
    // Common
    "common.view_all": "سب دیکھیں",
    "common.see_more": "اور دیکھیں",
    "common.loading": "لوڈ ہو رہا ہے...",
    "common.error": "کچھ غلط ہو گیا",
    "common.retry": "دوبارہ کوشش کریں",
    "common.cancel": "منسوخ",
    "common.confirm": "تصدیق",
    "common.save": "محفوظ کریں",
    "common.delete": "حذف",
    "common.edit": "ترمیم",
    "common.close": "بند",
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>("en");

  useEffect(() => {
    const saved = localStorage.getItem("language") as Language;
    if (saved) {
      setLanguage(saved);
    }
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem("language", lang);
  };

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.en] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}