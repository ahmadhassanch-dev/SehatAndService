"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Phone, Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, ChevronDown, CheckCircle, XCircle, Sparkle } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";

export default function LoginPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-slate-950 flex items-center justify-center text-white">Loading...</div>}>
      <LoginContent />
    </React.Suspense>
  );
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/dashboard";
  const { language, t } = useLanguage();
  const { login } = useAuth();
  
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [showOtp, setShowOtp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
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
        router.push(redirect);
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
      <div className="absolute top-0 right-0 w-full h-full bg-midnight-mesh opacity-40"></div>
      
      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-12 animate-reveal">
          <Link href="/" className="inline-flex items-center gap-3 mb-10 group">
            <div className="w-16 h-16 bg-secondary rounded-[1.5rem] flex items-center justify-center transition-all duration-500 shadow-2xl shadow-amber-900/20 group-hover:rotate-6">
              <span className="text-slate-950 font-black text-4xl">س</span>
            </div>
          </Link>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 rounded-lg border border-white/10 mb-6">
             <Sparkle className="w-3 h-3 text-secondary fill-secondary" />
             <span className="text-[9px] font-black text-white/50 uppercase tracking-[0.3em]">Secure Terminal Entry</span>
          </div>
          <h1 className="text-5xl font-black text-white mb-4 tracking-tighter">{t("auth.login_title")}</h1>
          <p className="text-white/30 font-medium text-lg">
            Access your elite service dashboard.
          </p>
        </div>

        <div className="bg-slate-900 rounded-[3.5rem] p-10 md:p-14 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] border border-white/10 animate-reveal stagger-1">
          {!showOtp ? (
            <form onSubmit={handleSendOTP} className="space-y-8">
              <div>
                <label className="block text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-4 ml-4">
                  Registered Phone
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
                    <span className="font-black">Request Secure Code</span>
                    <ArrowRight className="w-6 h-6" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="space-y-10 animate-reveal">
              <div className="text-center p-8 bg-white/5 rounded-[2.5rem] border border-white/5">
                <p className="text-sm font-bold text-white/40 mb-3">
                  Verification sent to <span className="text-white">{phone}</span>
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
                    <span className="font-black uppercase tracking-widest">Establish Identity</span>
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

          <div className="mt-12 pt-12 border-t border-white/5">
            <button
              type="button"
              className="w-full flex items-center justify-center gap-4 p-6 rounded-[2rem] bg-white/5 border border-white/5 font-black uppercase tracking-widest text-[10px] text-white/40 hover:bg-white/10 hover:text-white transition-all"
            >
              <svg className="w-5 h-5 text-secondary" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Biometric Google Login
            </button>
          </div>
        </div>

        <p className="text-center mt-12 text-white/20 font-black uppercase tracking-[0.2em] text-[10px]">
          New Recruit?
          <Link href="/auth/signup" className="text-secondary hover:underline ml-3">
            Initiate Enrollment
          </Link>
        </p>
      </div>
    </div>
  );
}
