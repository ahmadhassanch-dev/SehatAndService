"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Phone, Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, User, ChevronDown, ShieldCheck, CheckCircle, XCircle, Sparkle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";

export default function SignupPage() {
  const router = useRouter();
  const { language, t } = useLanguage();
  const { login } = useAuth();
  
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [role, setRole] = useState<"customer" | "provider">("customer");
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || name.length < 2) {
      setError("Please enter your name");
      return;
    }
    if (!phone || phone.length < 10) {
      setError("Please enter a valid phone number");
      return;
    }
    
    setIsLoading(true);
    setError("");
    
    try {
      const response = await api.sendOTP(phone);
      if (response.otp) {
        console.log("OTP for demo:", response.otp);
        alert("Your OTP is: " + response.otp);
      }
      setShowOtp(true);
    } catch (err: any) {
      setError(err.message || "Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) {
      setError("Please enter the 6-digit OTP");
      return;
    }
    
    setIsLoading(true);
    setError("");
    
    try {
      const success = await login(phone, otp);
      if (success) {
        router.push("/dashboard");
      } else {
        setError("Invalid OTP. Please try again.");
      }
    } catch (err: any) {
      setError(err.message || "Verification failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center py-24 px-4 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full bg-midnight-mesh opacity-40"></div>
      
      <div className="max-w-xl w-full relative z-10">
        <div className="text-center mb-12 animate-reveal">
          <Link href="/" className="inline-flex items-center gap-3 mb-10 group">
            <div className="w-16 h-16 bg-secondary rounded-[1.5rem] flex items-center justify-center transition-all duration-500 shadow-2xl shadow-amber-900/20 group-hover:rotate-6">
              <span className="text-slate-950 font-black text-4xl">س</span>
            </div>
          </Link>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 rounded-lg border border-white/10 mb-6">
             <Sparkle className="w-3 h-3 text-secondary fill-secondary" />
             <span className="text-[9px] font-black text-white/50 uppercase tracking-[0.3em]">Identity Enrollment</span>
          </div>
          <h1 className="text-5xl font-black text-white mb-4 tracking-tighter">{t("auth.signup_title")}</h1>
          <p className="text-white/30 font-medium text-lg">
            Join Pakistan's most elite service guild.
          </p>
        </div>

        <div className="bg-slate-900 rounded-[3.5rem] p-10 md:p-14 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border border-white/10 animate-reveal stagger-1">
          {!showOtp ? (
            <form onSubmit={handleSendOTP} className="space-y-10">
              {/* Role Selection - Luxury Dark */}
              <div>
                <label className="block text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-6 ml-4 text-center">
                  Account Specification
                </label>
                <div className="grid grid-cols-2 gap-6">
                  <button
                    type="button"
                    onClick={() => setRole("customer")}
                    className={`group p-8 rounded-[2.5rem] border-2 text-center transition-all duration-500 ${
                      role === "customer"
                        ? "border-secondary bg-secondary/5 shadow-2xl shadow-amber-900/10"
                        : "border-white/5 bg-white/[0.02] hover:border-white/10"
                    }`}
                  >
                    <div className={`w-14 h-14 mx-auto mb-4 rounded-2xl flex items-center justify-center transition-all duration-500 ${role === "customer" ? "bg-secondary text-slate-950 scale-110" : "bg-white/5 text-white/20"}`}>
                       <User className="w-7 h-7" />
                    </div>
                    <span className={`text-xs font-black uppercase tracking-widest ${role === "customer" ? "text-secondary" : "text-white/20"}`}>
                      {language === "en" ? "I am User" : "میں صارف ہوں"}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole("provider")}
                    className={`group p-8 rounded-[2.5rem] border-2 text-center transition-all duration-500 ${
                      role === "provider"
                        ? "border-secondary bg-secondary/5 shadow-2xl shadow-amber-900/10"
                        : "border-white/5 bg-white/[0.02] hover:border-white/10"
                    }`}
                  >
                    <div className={`w-14 h-14 mx-auto mb-4 rounded-2xl flex items-center justify-center transition-all duration-500 ${role === "provider" ? "bg-secondary text-slate-950 scale-110" : "bg-white/5 text-white/20"}`}>
                       <ShieldCheck className="w-7 h-7" />
                    </div>
                    <span className={`text-xs font-black uppercase tracking-widest ${role === "provider" ? "text-secondary" : "text-white/20"}`}>
                      {language === "en" ? "I am Expert" : "میں ماہر ہوں"}
                    </span>
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-4 ml-4">
                    {t("auth.name")}
                  </label>
                  <div className="relative group">
                    <User className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-white/10 group-focus-within:text-secondary transition-colors" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Full Legal Name"
                      className="w-full pl-16 pr-8 py-6 bg-white/5 border-none rounded-[2rem] text-white font-bold text-xl focus:ring-2 focus:ring-secondary/20 transition-all placeholder:text-white/5"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-4 ml-4">
                    {t("auth.phone")}
                  </label>
                  <div className="relative group">
                    <Phone className="absolute left-6 top-1/2 -translate-y-1/2 w-6 h-6 text-white/10 group-focus-within:text-secondary transition-colors" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="0300 1234567"
                      className="w-full pl-16 pr-8 py-6 bg-white/5 border-none rounded-[2rem] text-white font-bold text-xl focus:ring-2 focus:ring-secondary/20 transition-all placeholder:text-white/5"
                    />
                  </div>
                </div>
              </div>

              {error && (
                <div className="p-5 bg-rose-500/10 text-rose-500 text-xs font-black uppercase tracking-widest rounded-2xl border border-rose-500/20 flex items-center gap-4">
                  <XCircle className="w-6 h-6 flex-shrink-0" />
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-secondary !rounded-[2rem] !py-7 !text-base shadow-2xl shadow-amber-900/40 disabled:opacity-20 transition-all"
              >
                {isLoading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    <span className="font-black">Request Access Key</span>
                    <ArrowRight className="w-6 h-6" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-10 animate-reveal">
              <div className="text-center p-8 bg-white/5 rounded-[2.5rem] border border-white/5">
                <p className="text-sm font-bold text-white/40 mb-3">
                  Authorization code sent to <span className="text-white">{phone}</span>
                </p>
                <button
                  type="button"
                  onClick={() => setShowOtp(false)}
                  className="text-[10px] font-black uppercase tracking-[0.2em] text-secondary hover:underline"
                >
                  Edit Coordinates
                </button>
              </div>

              <div>
                <label className="block text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-4 text-center">
                  Terminal Key (6-Digit OTP)
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  placeholder="0 0 0 0 0 0"
                  maxLength={6}
                  className="w-full text-center text-5xl font-black tracking-[0.4em] py-8 bg-white/5 border-none rounded-[2rem] text-secondary placeholder:text-white/5 focus:ring-2 focus:ring-secondary/20"
                />
              </div>

              {error && (
                <div className="p-5 bg-rose-500/10 text-rose-500 text-xs font-black uppercase tracking-widest rounded-2xl border border-rose-500/20 flex items-center gap-4">
                  <XCircle className="w-6 h-6 flex-shrink-0" />
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full btn-secondary !rounded-[2rem] !py-7 shadow-2xl disabled:opacity-20 transition-all"
              >
                {isLoading ? (
                  <Loader2 className="w-6 h-6 animate-spin" />
                ) : (
                  <>
                    <CheckCircle className="w-6 h-6" />
                    <span className="font-black uppercase tracking-widest">Verify & Establish Identity</span>
                  </>
                )}
              </button>

              <button
                type="button"
                className="w-full text-[10px] font-black uppercase tracking-[0.3em] text-white/20 hover:text-white transition-colors"
                onClick={handleSendOTP}
              >
                {t("auth.resend_otp")}
              </button>
            </form>
          )}
        </div>

        <p className="text-center mt-12 text-white/20 font-black uppercase tracking-[0.2em] text-[10px]">
          Member of the Guild?
          <Link href="/auth/login" className="text-secondary hover:underline ml-3">
            Secure Terminal Login
          </Link>
        </p>
      </div>
    </div>
  );
}
