"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  Menu, X, User, ChevronDown, LogOut, LayoutDashboard, Globe, Sparkles
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/contexts/AuthContext";

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { language, setLanguage, t } = useLanguage();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isMenuOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
  }, [isMenuOpen]);

  const toggleLanguage = () => setLanguage(language === "en" ? "ur" : "en");

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-700 ${
        scrolled || isMenuOpen
          ? "bg-slate-950/80 backdrop-blur-2xl py-4 border-b border-white/5" 
          : "bg-transparent py-8"
      }`}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <Link href="/" className="flex items-center gap-4 group">
            <div className="w-12 h-12 bg-gold rounded-2xl flex items-center justify-center transition-all duration-700 shadow-[0_0_30px_-5px_rgba(251,191,36,0.5)] group-hover:rotate-[15deg] group-hover:scale-110">
              <span className="text-slate-950 font-black text-3xl">س</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="text-2xl font-black tracking-tighter text-white">
                SEHAT <span className="text-gold">&</span> SERVICE
              </h1>
              <p className="text-[9px] uppercase tracking-[0.4em] font-black text-gold/60">
                Premium Guild
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-12">
            {[
              { href: "/", label: t("nav.home") },
              { href: "/search", label: t("nav.services") },
              { href: "/about", label: t("nav.about") },
              { href: "/contact", label: t("nav.contact") }
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 hover:text-gold ${
                  pathname === link.href ? "text-gold" : "text-white/50"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-6">
            <button
              onClick={toggleLanguage}
              className="hidden md:flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-gold transition-all"
            >
              <Globe className="w-3.5 h-3.5" />
              {language === "en" ? "Urdu" : "EN"}
            </button>

            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-3 p-1 rounded-2xl bg-white/5 border border-white/10 hover:border-gold/30 transition-all"
                >
                  <div className="w-9 h-9 bg-gold rounded-xl flex items-center justify-center shadow-lg">
                    <User className="w-5 h-5 text-slate-950" />
                  </div>
                  <ChevronDown className={`w-4 h-4 transition-transform duration-500 ${isProfileOpen ? "rotate-180" : ""} text-white/30`} />
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-4 w-72 bg-slate-900/95 backdrop-blur-3xl rounded-[2rem] border border-white/10 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)] py-4 animate-reveal overflow-hidden">
                    <div className="px-8 py-4 border-b border-white/5 mb-2">
                       <p className="font-black text-white text-lg tracking-tight truncate">{user?.name}</p>
                       <p className="text-[9px] font-bold text-white/30 uppercase tracking-widest mt-1">{user?.phone}</p>
                    </div>
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-4 px-8 py-4 text-[10px] font-black uppercase tracking-widest text-white/60 hover:text-gold hover:bg-white/5 transition-all"
                      onClick={() => setIsProfileOpen(false)}
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Command Center
                    </Link>
                    <button
                      onClick={() => { logout(); setIsProfileOpen(false); }}
                      className="flex items-center gap-4 w-full px-8 py-4 text-[10px] font-black uppercase tracking-widest text-rose-500 hover:bg-rose-500/10 transition-all"
                    >
                      <LogOut className="w-4 h-4" />
                      Terminate Session
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-4">
                <Link
                  href="/auth/login"
                  className="text-[10px] font-black uppercase tracking-widest text-white/50 hover:text-white transition-all px-4"
                >
                  {t("nav.login")}
                </Link>
                <Link
                  href="/auth/signup"
                  className="btn-gold !py-3 !px-6 !text-[9px]"
                >
                  Join the Guild
                </Link>
              </div>
            )}

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-3 rounded-xl bg-white/5 border border-white/10 text-white hover:text-gold transition-all"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Full Screen Mobile Menu */}
      <div className={`fixed inset-0 bg-slate-950 transition-all duration-700 z-[90] lg:hidden ${isMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-full pointer-events-none"}`}>
        <div className="absolute inset-0 bg-midnight-mesh opacity-50"></div>
        <div className="relative h-full flex flex-col items-center justify-center p-12 text-center">
           <div className="space-y-8">
             {[
              { href: "/", label: t("nav.home") },
              { href: "/search", label: t("nav.services") },
              { href: "/about", label: t("nav.about") },
              { href: "/contact", label: t("nav.contact") }
            ].map((link, i) => (
               <Link
                 key={i}
                 href={link.href}
                 onClick={() => setIsMenuOpen(false)}
                 className="block text-4xl font-black text-white hover:text-gold transition-all tracking-tighter"
               >
                 {link.label}
               </Link>
             ))}
           </div>
           
           <div className="mt-20 flex flex-col gap-4 w-full max-w-xs">
              {!isAuthenticated ? (
                <>
                  <Link href="/auth/signup" onClick={() => setIsMenuOpen(false)} className="btn-gold !text-sm">Initiate Enrollment</Link>
                  <Link href="/auth/login" onClick={() => setIsMenuOpen(false)} className="btn-outline !text-sm">Access Terminal</Link>
                </>
              ) : (
                <Link href="/dashboard" onClick={() => setIsMenuOpen(false)} className="btn-gold !text-sm">Command Center</Link>
              )}
              <button onClick={toggleLanguage} className="text-[10px] font-black uppercase tracking-[0.4em] text-white/30 pt-6">
                 Switch Language: {language === "en" ? "اردو" : "English"}
              </button>
           </div>
        </div>
      </div>
    </nav>
  );
}
