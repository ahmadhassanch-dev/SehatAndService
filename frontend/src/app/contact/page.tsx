"use client";

import React from "react";
import { 
  Phone, MessageCircle, MapPin, Send, Mail, 
  Clock, Globe, ShieldCheck, Zap, ChevronRight,
  Headphones, PlayCircle
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function ContactPage() {
  const { language, t } = useLanguage();

  return (
    <div className="min-h-screen bg-slate-950 pt-20 pb-32">
      {/* Cinematic Contact Header */}
      <section className="relative pt-24 pb-40 overflow-hidden bg-midnight-mesh border-b border-white/5">
        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        <div className="container-custom relative z-10 text-center animate-reveal">
          <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-white/5 backdrop-blur-2xl border border-white/10 text-secondary text-xs font-black uppercase tracking-[0.3em] mb-12">
            Concierge Support
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-white mb-10 tracking-tighter leading-none">
            Secure <span className="text-secondary">Line.</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/40 max-w-2xl mx-auto font-medium leading-relaxed">
            Our support officers are available 24/7 for mission-critical assistance and high-priority inquiries.
          </p>
        </div>
      </section>

      <div className="container-custom -mt-24 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Contact Terminal (Form) */}
          <div className="lg:col-span-2">
            <div className="bg-slate-900 rounded-[4rem] p-10 md:p-16 border border-white/10 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] animate-reveal stagger-1">
               <h2 className="text-4xl font-black text-white mb-10 tracking-tighter">Direct Message.</h2>
               
               <form className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                     <div className="group">
                        <label className="block text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-4 ml-4">Full Identity</label>
                        <input
                          type="text"
                          placeholder="Your Name"
                          className="w-full px-8 py-6 bg-white/5 border-none rounded-[2rem] text-white font-bold text-lg focus:ring-2 focus:ring-secondary/20 transition-all placeholder:text-white/10"
                        />
                     </div>
                     <div className="group">
                        <label className="block text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-4 ml-4">Access Email</label>
                        <input
                          type="email"
                          placeholder="your@email.com"
                          className="w-full px-8 py-6 bg-white/5 border-none rounded-[2rem] text-white font-bold text-lg focus:ring-2 focus:ring-secondary/20 transition-all placeholder:text-white/10"
                        />
                     </div>
                  </div>

                  <div className="group">
                    <label className="block text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-4 ml-4">Subject Directive</label>
                    <select className="w-full px-8 py-6 bg-white/5 border-none rounded-[2rem] text-white font-black uppercase tracking-widest text-[10px] focus:ring-2 focus:ring-secondary/20 appearance-none cursor-pointer">
                       <option className="bg-slate-900">General Inquiry</option>
                       <option className="bg-slate-900">Mission Support</option>
                       <option className="bg-slate-900">Expert Verification</option>
                       <option className="bg-slate-900">Partnership Proposal</option>
                    </select>
                  </div>

                  <div className="group">
                    <label className="block text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-4 ml-4">Intelligence / Details</label>
                    <textarea
                      placeholder="Specify your requirements in detail..."
                      className="w-full px-8 py-6 bg-white/5 border-none rounded-[3rem] text-white font-bold text-lg focus:ring-2 focus:ring-secondary/20 h-56 resize-none placeholder:text-white/10"
                    />
                  </div>

                  <button type="submit" className="w-full btn-secondary !rounded-[2.5rem] !py-8 !text-base shadow-2xl">
                    <Send className="w-6 h-6" />
                    Transmit Message
                  </button>
               </form>
            </div>
          </div>

          {/* Quick Access Sidebar */}
          <div className="space-y-10">
            {/* Headquarters Card */}
            <div className="bg-slate-900 rounded-[3rem] p-10 border border-white/10 shadow-xl animate-reveal stagger-2">
               <h3 className="text-[10px] font-black text-secondary uppercase tracking-[0.4em] mb-10 flex items-center gap-3">
                 <Globe className="w-5 h-5" />
                 Global HQ
               </h3>
               <div className="space-y-8">
                  <div className="flex items-start gap-5 group">
                     <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:bg-secondary group-hover:scale-110 transition-all duration-500">
                        <MapPin className="w-5 h-5 text-white group-hover:text-slate-950" />
                     </div>
                     <div>
                        <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] mb-2">Primary Coordinates</p>
                        <p className="text-white font-bold text-sm leading-relaxed">Gulberg III, Main Boulevard, <br /> Lahore, Pakistan</p>
                     </div>
                  </div>

                  <div className="flex items-start gap-5 group">
                     <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:bg-secondary group-hover:scale-110 transition-all duration-500">
                        <Phone className="w-5 h-5 text-white group-hover:text-slate-950" />
                     </div>
                     <div>
                        <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] mb-2">Voice Comms</p>
                        <p className="text-white font-bold text-lg leading-none tracking-widest">0300-1234567</p>
                     </div>
                  </div>

                  <div className="flex items-start gap-5 group">
                     <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 group-hover:bg-secondary group-hover:scale-110 transition-all duration-500">
                        <Mail className="w-5 h-5 text-white group-hover:text-slate-950" />
                     </div>
                     <div>
                        <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] mb-2">Secure Email</p>
                        <p className="text-white font-bold text-sm leading-none">concierge@sehatservice.pk</p>
                     </div>
                  </div>
               </div>
            </div>

            {/* Rapid Response Unit Card */}
            <div className="bg-gradient-to-br from-red-600 to-rose-900 rounded-[3rem] p-10 text-white animate-reveal stagger-3 shadow-2xl shadow-rose-900/40 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
               <h3 className="text-[10px] font-black uppercase tracking-[0.4em] mb-10 flex items-center gap-3">
                 <Zap className="w-5 h-5" />
                 Emergency Unit
               </h3>
               <p className="text-white/70 font-medium mb-10 leading-relaxed text-sm">Facing a critical home emergency? Our Rapid Dispatch Unit is on standby 24/7.</p>
               <a href="tel:03001234567" className="w-full flex items-center justify-center gap-3 py-5 bg-white text-rose-600 rounded-[1.5rem] font-black uppercase tracking-widest text-xs shadow-2xl hover:scale-[1.05] transition-all">
                  Request SOS Dispatch
               </a>
            </div>

            {/* Availability Deck */}
            <div className="bg-white/5 rounded-[3rem] p-10 border border-white/5 animate-reveal stagger-4">
               <h3 className="text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-8">Uptime Registry</h3>
               <div className="space-y-4">
                  <div className="flex items-center justify-between text-xs">
                     <span className="text-white/20 font-black uppercase tracking-widest">Customer Support</span>
                     <span className="font-black text-emerald-400 tracking-tighter uppercase">Always Online</span>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                     <span className="text-white/20 font-black uppercase tracking-widest">Office Hours</span>
                     <span className="font-black text-white/40 tracking-tighter uppercase">09:00 - 21:00</span>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
