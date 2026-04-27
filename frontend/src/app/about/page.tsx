"use client";

import React from "react";
import Link from "next/link";
import { 
  ShieldCheck, Award, Users, Target, CheckCircle, 
  ArrowRight, Globe, Star, Zap, Heart, Shield
} from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function AboutPage() {
  const { language, t } = useLanguage();

  return (
    <div className="min-h-screen bg-slate-950 pt-20 pb-32">
      {/* Luxury Cinematic Header */}
      <section className="relative pt-24 pb-40 overflow-hidden bg-midnight-mesh">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
        <div className="container-custom relative z-10 text-center animate-reveal">
          <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-white/5 backdrop-blur-2xl border border-white/10 text-secondary text-xs font-black uppercase tracking-[0.3em] mb-12">
            Establishing the Standard
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-white mb-10 tracking-tighter leading-none">
            About the <span className="text-secondary">Guild.</span>
          </h1>
          <p className="text-xl md:text-2xl text-white/40 max-w-3xl mx-auto font-medium leading-relaxed">
            Sehat & Service isn't just a marketplace. It's a selective guild of the finest service professionals in Pakistan, dedicated to absolute excellence.
          </p>
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="container-custom -mt-24 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div className="luxury-card group animate-reveal stagger-1">
             <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mb-8 border border-secondary/20 group-hover:bg-secondary group-hover:scale-110 transition-all duration-500">
               <Target className="w-8 h-8 text-secondary group-hover:text-slate-950" />
             </div>
             <h2 className="text-3xl font-black text-white mb-6 tracking-tight">Our Mission.</h2>
             <p className="text-lg font-medium text-white/40 leading-relaxed italic">
               "To redefine home services by connecting discerning households with only the most skilled, verified, and reliable experts in the nation."
             </p>
          </div>
          <div className="luxury-card group animate-reveal stagger-2">
             <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mb-8 border border-white/10 group-hover:bg-white/10 group-hover:scale-110 transition-all duration-500">
               <Shield className="w-8 h-8 text-white/50" />
             </div>
             <h2 className="text-3xl font-black text-white mb-6 tracking-tight">Elite Standards.</h2>
             <p className="text-lg font-medium text-white/40 leading-relaxed italic">
               We reject 80% of applicants. Only those who pass our multi-stage background and skill verification earn the right to carry the Guild badge.
             </p>
          </div>
        </div>
      </section>

      {/* The Guild Protocol (Features) */}
      <section className="py-40">
        <div className="container-custom">
          <div className="text-center mb-24 animate-reveal">
             <h2 className="text-5xl font-black text-white mb-6">The Guild <span className="text-secondary">Protocol.</span></h2>
             <p className="text-white/30 font-black uppercase tracking-[0.3em] text-xs">Our Uncompromising Operating Standards</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { 
                icon: ShieldCheck, 
                title: "Vetted Identity", 
                desc: "Every expert undergoes rigorous CNIC and face-to-face verification before deployment.",
                color: "text-blue-400"
              },
              { 
                icon: Award, 
                title: "Skill Mastery", 
                desc: "We verify technical certifications and perform random quality audits on completed missions.",
                color: "text-secondary"
              },
              { 
                icon: Zap, 
                title: "Rapid Dispatch", 
                desc: "Our real-time grid ensures your directive is accepted by a nearby expert in under 15 minutes.",
                color: "text-emerald-400"
              }
            ].map((item, i) => (
              <div key={i} className="bg-slate-900/50 p-12 rounded-[3.5rem] border border-white/5 hover:border-white/10 transition-all duration-700 animate-reveal" style={{ animationDelay: `${i * 0.1}s` }}>
                 <item.icon className={`w-12 h-12 ${item.color} mb-8`} />
                 <h3 className="text-2xl font-black text-white mb-4">{item.title}</h3>
                 <p className="text-white/40 font-medium leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Stats - High Contrast */}
      <section className="bg-white rounded-[5rem] py-32 mx-4 md:mx-10 animate-reveal">
         <div className="container-custom">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
               {[
                 { val: "10K+", label: "Elite Experts" },
                 { val: "50K+", label: "Satisfied Clients" },
                 { val: "45K+", label: "Missions Logged" },
                 { val: "4.9", label: "Quality Index" },
               ].map((s, i) => (
                 <div key={i} className="text-center">
                    <p className="text-6xl md:text-8xl font-black text-slate-950 mb-2 tracking-tighter">{s.val}</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em]">{s.label}</p>
                 </div>
               ))}
            </div>
         </div>
      </section>

      {/* Join the Guild CTA */}
      <section className="py-40 text-center container-custom animate-reveal">
         <h2 className="text-5xl md:text-7xl font-black text-white mb-10 tracking-tighter">Ready to experience <br /> <span className="text-secondary">the pinnacle?</span></h2>
         <div className="flex flex-wrap gap-6 justify-center">
            <Link href="/search" className="btn-secondary !px-12 !py-6">
              Search Guild Experts
            </Link>
            <Link href="/auth/signup?role=provider" className="px-12 py-6 bg-white/5 border border-white/10 text-white font-black uppercase tracking-widest text-xs rounded-[2rem] hover:bg-white/10 transition-all">
              Apply to join as Expert
            </Link>
         </div>
      </section>
    </div>
  );
}
