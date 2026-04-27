"use client";

import React from "react";
import Link from "next/link";
import { 
  Phone, MessageCircle, MapPin, Globe, 
  Heart, Shield, Award, ArrowUpRight,
  Instagram, Twitter, Facebook, Linkedin
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Footer() {
  const { language, t } = useLanguage();

  return (
    <footer className="bg-black pt-32 pb-16 border-t border-white/5 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[1000px] h-96 bg-secondary/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20 mb-24">
          {/* Brand Identity */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-4 mb-10">
              <div className="w-14 h-14 bg-secondary rounded-[1.2rem] flex items-center justify-center shadow-[0_0_30px_-5px_rgba(251,191,36,0.3)]">
                <span className="text-slate-950 font-black text-3xl">س</span>
              </div>
              <h1 className="text-3xl font-black text-white tracking-tighter leading-none">
                Sehat <br /> <span className="text-secondary">&</span> Service
              </h1>
            </div>
            <p className="text-white/40 mb-12 font-bold leading-relaxed text-lg">
              Defining the pinnacle of home service excellence in Pakistan. Hand-picking only the best, for the best.
            </p>
            <div className="flex gap-4">
              {[Instagram, Twitter, Facebook, Linkedin].map((Icon, i) => (
                <div key={i} className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 hover:border-secondary hover:text-secondary transition-all cursor-pointer group">
                  <Icon className="w-5 h-5 transition-transform group-hover:scale-110" />
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Guilds */}
          <div>
            <h4 className="text-secondary font-black uppercase tracking-[0.3em] text-[10px] mb-12">Discovery</h4>
            <ul className="space-y-6">
              {[
                { label: "Elite Experts", href: "/search" },
                { label: "Join the Guild", href: "/auth/signup?role=provider" },
                { label: "Our Story", href: "/about" },
                { label: "Concierge Support", href: "/contact" }
              ].map((link, i) => (
                <li key={i}>
                  <Link href={link.href} className="text-white/50 hover:text-white font-black uppercase tracking-widest text-[11px] transition-colors flex items-center justify-between group">
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all translate-y-1 group-hover:translate-y-0" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Service Guilds */}
          <div>
            <h4 className="text-secondary font-black uppercase tracking-[0.3em] text-[10px] mb-12">The Guilds</h4>
            <ul className="space-y-6">
              {[
                { label: "Climate Control", q: "ac-repair" },
                { label: "Power & Grid", q: "electrician" },
                { label: "Fluid Dynamics", q: "plumbing" },
                { label: "Sanitary Elite", q: "cleaning" }
              ].map((link, i) => (
                <li key={i}>
                  <Link href={`/search?q=${link.q}`} className="text-white/50 hover:text-white font-black uppercase tracking-widest text-[11px] transition-colors flex items-center justify-between group">
                    {link.label}
                    <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-all translate-y-1 group-hover:translate-y-0" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Headquarters */}
          <div>
            <h4 className="text-secondary font-black uppercase tracking-[0.3em] text-[10px] mb-12">Intelligence</h4>
            <ul className="space-y-8">
              <li className="flex items-start gap-5">
                 <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-4 h-4 text-secondary" />
                 </div>
                 <div>
                    <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-1">Voice Terminal</p>
                    <p className="text-white font-bold text-sm tracking-widest">0300-1234567</p>
                 </div>
              </li>
              <li className="flex items-start gap-5">
                 <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-4 h-4 text-secondary" />
                 </div>
                 <div>
                    <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-1">Secure Comms</p>
                    <p className="text-white font-bold text-sm">concierge@sehatservice.pk</p>
                 </div>
              </li>
              <li className="flex items-start gap-5">
                 <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-4 h-4 text-secondary" />
                 </div>
                 <div>
                    <p className="text-[9px] font-black text-white/30 uppercase tracking-widest mb-1">Coordinates</p>
                    <p className="text-white font-bold text-sm">Gulberg III, Lahore, PK</p>
                 </div>
              </li>
            </ul>
          </div>
        </div>

        {/* Final Legal Deck */}
        <div className="pt-16 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="flex flex-col md:flex-row items-center gap-10">
             <p className="text-white/20 font-black uppercase tracking-[0.2em] text-[10px]">© 2026 Sehat & Service Luxury Marketplace.</p>
             <div className="flex gap-10">
                <Link href="/privacy" className="text-white/20 hover:text-white font-black uppercase tracking-[0.2em] text-[10px] transition-colors">Privacy Charter</Link>
                <Link href="/terms" className="text-white/20 hover:text-white font-black uppercase tracking-[0.2em] text-[10px] transition-colors">Service Covenant</Link>
             </div>
          </div>
          <div className="flex items-center gap-4 text-white/20">
             <Shield className="w-5 h-5" />
             <Award className="w-5 h-5" />
             <span className="h-px w-10 bg-white/10"></span>
             <p className="text-[9px] font-black uppercase tracking-[0.3em]">End of Transmission</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
