"use client";

import React, { useState } from "react";
import { ChevronDown, ChevronUp, Search, MessageCircle, Phone, Mail } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function FAQPage() {
  const { language, t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: language === "en" ? "How do I book a service?" : "میں سروس کیسے بک کروائیں؟",
      a: language === "en"
        ? "Simply search for the service you need, browse through verified providers, and click 'Book Now' to schedule your appointment. You can choose between instant booking or schedule for a later date."
        : "بس اپنی ضرورت کی خدمات تلاش کریں، تصدیق شدہ فراہم کنندگان کو دیکھیں، اور اپنی ملاقات کا وقت طے کرنے کے لیے 'اب بک کریں' پر کلک کریں۔ آپ فوری بکنگ یا بعد کی تاریخ کے لیے شیڈول کا انتخاب کر سکتے ہیں۔"
    },
    {
      q: language === "en" ? "How are providers verified?" : "فراہم کنندگان کیسے تصدیق ہوتے ہیں؟",
      a: language === "en"
        ? "All providers go through a rigorous verification process including phone verification, CNIC verification, and background checks. Only verified providers are shown with a trusted badge."
        : "تمام فراہم کنندگان سخت تصدیق کے عمل سے گزرتے ہیں جن میں فون تصدیق، سی این آئی سی تصدیق، اور پس منظر کی جانچ شامل ہے۔ صرف تصدیق شدہ فراہم کنندے بھروسہ بیج کے ساتھ دکھائے جاتے ہیں۔"
    },
    {
      q: language === "en" ? "What payment methods are available?" : "کن ادائیگی کے طریقے دستیاب ہیں؟",
      a: language === "en"
        ? "We support multiple payment methods including Cash on Delivery, JazzCash, EasyPaisa, and bank transfers. You can pay after the service is completed to your satisfaction."
        : "ہم متعدد ادائیگی کے طریقے سپورٹ کرتے ہیں جن میں کیش آن ڈیلیوری، جاز کیش، ایزی پیسہ، اور بینک ٹرانسفر شامل ہیں۔ آپ سروس مکمل ہونے کے بعد اپنی اطمینان کے بعد ادائیگی کر سکتے ہیں۔"
    },
    {
      q: language === "en" ? "How can I become a service provider?" : "میں سروس فراہم کنندہ کیسے بن سکتا ہوں؟",
      a: language === "en"
        ? "To become a provider, sign up with your phone number, complete your profile with skills and services, upload required documents (CNIC), and wait for verification. Once approved, you can start receiving bookings."
        : "فراہم کنندہ بننے کے لیے، اپنے فون نمبر سائن اپ کریں، اپنے پروفائل کو ہنر اور خدمات کے ساتھ مکمل کریں، ضروری دستاویزات (سی این آئی سی) اپلوڈ کریں، اور تصدیق کا انتظار کریں۔ منظور ہونے کے بعد، آپ بکنگز وصول کرنا شروع کر سکتے ہیں۔"
    },
    {
      q: language === "en" ? "What is the cancellation policy?" : "منسوخی کی پالیسی کیا ہے؟",
      a: language === "en"
        ? "You can cancel a booking up to 24 hours before the scheduled time without any charges. For cancellations within 24 hours, a small fee may apply. In case of provider cancellation, you'll get a full refund."
        : "آپ شیڈول کے وقت سے 24 گھنٹے پہلے کسی بھی چارجز کے بغیر بکنگ منسوخ کر سکتے ہیں۔ 24 گھنٹوں کے اندر منسوخی کے لیے ایک چھوٹا فیس لاگو ہو سکتا ہے۔ فراہم کنندہ کی منسوخی کی صورت میں، آپ کو مکمل ریفنڈ ملے گا۔"
    },
    {
      q: language === "en" ? "How do I leave a review?" : "میں جائزہ کیسے چھوڑ سکتا ہوں؟",
      a: language === "en"
        ? "After your booking is completed, you'll receive a prompt to leave a review. You can rate the service from 1-5 stars and write a comment about your experience. Your feedback helps other customers make informed decisions."
        : "آپ کی بکنگ مکمل ہونے کے بعد، آپ کو جائزہ چھوڑنے کا اشارہ ملے گا۔ آپ سروس کو 1-5 ستاروں سے درجہ دے سکتے ہیں اور اپنے تجربے کے بارے میں تبصرہ لکھ سکتے ہیں۔ آپ کی رائے دوسرے گاہکوں کو باخبر فیصلے کرنے میں مدد کرتی ہے۔"
    },
    {
      q: language === "en" ? "How can I report a problem?" : "میں ایک مسئلے کی رپورٹ کیسے کر سکتا ہوں؟",
      a: language === "en"
        ? "If you encounter any issues with a service or provider, you can report it through the app or contact our support team. We take all complaints seriously and will investigate promptly."
        : "اگر آپ کو کسی سروس یا فراہم کنندہ کے ساتھ کوئی مسئلہ درپیش ہو، تو آپ اسے ایپ کے ذریعے رپورٹ کر سکتے ہیں یا ہماری سپورٹ ٹیم سے رابطہ کر سکتے ہیں۔ ہم تمام شکایات کو سنجیدگی سے لیتے ہیں اور فوری تحقیق کریں گے۔"
    },
    {
      q: language === "en" ? "Is my personal information secure?" : "کیا میری ذاتی معلومات محفوظ ہے؟",
      a: language === "en"
        ? "Yes, we take data privacy seriously. Your personal information is encrypted and stored securely. We never share your data with third parties without your consent."
        : "ہاں، ہم ڈیٹا کی رازداری کو سنجیدگی سے لیتے ہیں۔ آپ کی ذاتی معلومات انکرپٹڈ اور محفوظ طریقے سے محفوظ ہیں۔ ہم آپ کی رضامنی کے بغیر کبھی بھی آپ کا ڈیٹا تیسرے فریق کے ساتھ شیئر نہیں کرتے۔"
    },
  ];

  const filteredFaqs = searchQuery
    ? faqs.filter(faq => 
        faq.q.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.a.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : faqs;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container-custom py-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {language === "en" ? "Frequently Asked Questions" : "اکثر پوچھے گئے سوالات"}
          </h1>
          <p className="text-gray-600">
            {language === "en"
              ? "Find answers to common questions about our services"
              : "ہماری خدمات کے بارے میں عام سوالات کے جوابات تلاش کریں"}
          </p>
        </div>
      </div>

      <div className="container-custom py-12">
        {/* Search */}
        <div className="max-w-xl mx-auto mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === "en" ? "Search FAQs..." : "سوالات تلاش کریں..."}
              className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>

        {/* FAQ List */}
        <div className="max-w-2xl mx-auto space-y-3">
          {filteredFaqs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-xl overflow-hidden shadow-sm"
            >
              <button
                onClick={() => setOpenFaq(openFaq === index ? null : index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
              >
                <span className="font-medium text-gray-900">{faq.q}</span>
                {openFaq === index ? (
                  <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0" />
                )}
              </button>
              {openFaq === index && (
                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                  <p className="text-gray-700">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredFaqs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No FAQs found matching your search.</p>
          </div>
        )}

        {/* Contact CTA */}
        <div className="max-w-2xl mx-auto mt-12">
          <div className="bg-primary rounded-xl p-6 text-center">
            <h3 className="text-lg font-semibold text-white mb-2">
              {language === "en" ? "Still have questions?" : "پھر بھی سوال ہیں؟"}
            </h3>
            <p className="text-white/90 mb-4">
              {language === "en"
                ? "Contact our support team for more help"
                : "مزید مدد کے لیے ہماری سپورٹ ٹیم سے رابطہ کریں"}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href="tel:03001234567"
                className="inline-flex items-center justify-center gap-2 bg-white text-primary px-6 py-2 rounded-lg font-medium hover:bg-gray-100"
              >
                <Phone className="w-4 h-4" />
                0300-1234567
              </a>
              <a
                href="mailto:support@sehat service.com"
                className="inline-flex items-center justify-center gap-2 bg-white text-primary px-6 py-2 rounded-lg font-medium hover:bg-gray-100"
              >
                <Mail className="w-4 h-4" />
                Email Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}