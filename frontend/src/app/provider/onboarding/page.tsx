"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  ShieldCheck, ArrowRight, CheckCircle2, 
  User, Briefcase, FileText, Landmark, 
  Loader2, AlertCircle, ChevronLeft
} from "lucide-react";
import * as api_ext from "@/lib/api_extensions";
import { useAuth } from "@/contexts/AuthContext";

export default function ProviderOnboardingPage() {
  const router = useRouter();
  const { user, updateUser } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    business_name: "",
    category: "",
    bio: "",
    cnic: "",
    bank_name: "",
    account_holder: "",
    account_number: "",
    price_min: 500,
    price_max: 5000
  });

  const categories = [
    { id: "ac-repair", label: "AC Repair" },
    { id: "plumbing", label: "Plumbing" },
    { id: "electrician", label: "Electrician" },
    { id: "carpenter", label: "Carpenter" },
    { id: "cleaning", label: "Cleaning" },
    { id: "beauty", label: "Beauty" }
  ];

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await api_ext.becomeProvider(formData);
      // Update local user role
      if (user) {
        updateUser({ ...user, role: "provider" });
      }
      router.push("/dashboard");
    } catch (err) {
      console.error("Onboarding failed", err);
      alert("Registration failed. Please check your data.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 pt-20 pb-32 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Progress Stepper */}
        <div className="flex justify-between items-center mb-16 px-4">
           {[1, 2, 3].map((s) => (
             <div key={s} className="flex items-center">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black transition-all ${step >= s ? 'bg-secondary text-slate-950 scale-110 shadow-lg shadow-secondary/20' : 'bg-white/5 text-white/20'}`}>
                   {step > s ? <CheckCircle2 className="w-5 h-5" /> : s}
                </div>
                {s < 3 && <div className={`w-16 md:w-24 h-1 mx-2 rounded-full ${step > s ? 'bg-secondary' : 'bg-white/5'}`}></div>}
             </div>
           ))}
        </div>

        <div className="bg-slate-900 rounded-[3rem] p-8 md:p-16 border border-white/10 shadow-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 w-64 h-64 bg-secondary/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
           
           {/* Step 1: Professional Identity */}
           {step === 1 && (
             <div className="space-y-10 animate-reveal">
                <div className="mb-12">
                   <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-4 leading-tight">Professional <span className="text-secondary">Identity.</span></h1>
                   <p className="text-white/40 font-medium text-lg">Tell us about your professional expertise.</p>
                </div>

                <div className="space-y-8">
                   <div className="group">
                      <label className="block text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-4 ml-4">Business / Trade Name</label>
                      <input 
                        placeholder="e.g. Master Cooling Solutions"
                        className="w-full px-8 py-6 bg-white/5 border-none rounded-[2rem] text-white font-bold text-lg focus:ring-2 focus:ring-secondary/20 transition-all"
                        value={formData.business_name}
                        onChange={(e) => setFormData({...formData, business_name: e.target.value})}
                      />
                   </div>

                   <div className="group">
                      <label className="block text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-4 ml-4">Primary Category</label>
                      <select 
                        className="w-full px-8 py-6 bg-white/5 border-none rounded-[2rem] text-white font-bold text-lg focus:ring-2 focus:ring-secondary/20 appearance-none cursor-pointer"
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                      >
                         <option value="" className="bg-slate-900">Select Your Craft</option>
                         {categories.map(c => <option key={c.id} value={c.id} className="bg-slate-900">{c.label}</option>)}
                      </select>
                   </div>

                   <div className="group">
                      <label className="block text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-4 ml-4">Professional Bio</label>
                      <textarea 
                        placeholder="Describe your experience and work ethic..."
                        className="w-full px-8 py-6 bg-white/5 border-none rounded-[2.5rem] text-white font-bold text-lg focus:ring-2 focus:ring-secondary/20 h-40 resize-none"
                        value={formData.bio}
                        onChange={(e) => setFormData({...formData, bio: e.target.value})}
                      />
                   </div>
                </div>

                <button 
                  onClick={() => setStep(2)}
                  disabled={!formData.business_name || !formData.category}
                  className="w-full bg-secondary text-slate-950 py-7 rounded-[2.5rem] font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 shadow-2xl shadow-secondary/20 disabled:opacity-20 transition-all"
                >
                  Continue to Verification <ArrowRight className="w-5 h-5" />
                </button>
             </div>
           )}

           {/* Step 2: Verification & Compliance */}
           {step === 2 && (
             <div className="space-y-10 animate-reveal">
                <div className="mb-12">
                   <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-4">Guild <span className="text-secondary">Verification.</span></h1>
                   <p className="text-white/40 font-medium text-lg">We maintain high standards for our elite network.</p>
                </div>

                <div className="space-y-8">
                   <div className="group">
                      <label className="block text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-4 ml-4">CNIC Number</label>
                      <input 
                        placeholder="XXXXX-XXXXXXX-X"
                        className="w-full px-8 py-6 bg-white/5 border-none rounded-[2rem] text-white font-bold text-lg focus:ring-2 focus:ring-secondary/20 transition-all"
                        value={formData.cnic}
                        onChange={(e) => setFormData({...formData, cnic: e.target.value})}
                      />
                      <p className="mt-4 px-4 text-[10px] text-white/20 font-medium">Your data is encrypted and used only for professional verification.</p>
                   </div>

                   <div className="bg-white/5 p-8 rounded-[2rem] border border-white/5 flex gap-4 items-start">
                      <ShieldCheck className="w-6 h-6 text-secondary flex-shrink-0" />
                      <div>
                         <h4 className="text-white font-black text-xs uppercase tracking-widest mb-1">Elite Verification Process</h4>
                         <p className="text-white/40 text-xs leading-relaxed">By submitting your CNIC, you agree to a professional background check. Once approved, you will receive the "Verified Professional" badge.</p>
                      </div>
                   </div>
                </div>

                <div className="flex gap-4">
                  <button onClick={() => setStep(1)} className="px-8 py-7 bg-white/5 text-white/40 rounded-[2.5rem] font-black uppercase tracking-widest text-xs">Back</button>
                  <button 
                    onClick={() => setStep(3)}
                    disabled={!formData.cnic}
                    className="flex-1 bg-secondary text-slate-950 py-7 rounded-[2.5rem] font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 shadow-2xl shadow-secondary/20 disabled:opacity-20 transition-all"
                  >
                    Setup Financial Repository <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
             </div>
           )}

           {/* Step 3: Financial Settlement */}
           {step === 3 && (
             <div className="space-y-10 animate-reveal">
                <div className="mb-12">
                   <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-4 leading-tight">Financial <span className="text-secondary">Terminal.</span></h1>
                   <p className="text-white/40 font-medium text-lg">Where should we settle your earnings?</p>
                </div>

                <div className="space-y-8">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="group">
                        <label className="block text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-4 ml-4">Settlement Bank</label>
                        <input 
                          placeholder="e.g. Meezan Bank"
                          className="w-full px-8 py-6 bg-white/5 border-none rounded-[2rem] text-white font-bold text-lg focus:ring-2 focus:ring-secondary/20 transition-all"
                          value={formData.bank_name}
                          onChange={(e) => setFormData({...formData, bank_name: e.target.value})}
                        />
                      </div>
                      <div className="group">
                        <label className="block text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-4 ml-4">Account Holder</label>
                        <input 
                          placeholder="Legal Name"
                          className="w-full px-8 py-6 bg-white/5 border-none rounded-[2rem] text-white font-bold text-lg focus:ring-2 focus:ring-secondary/20 transition-all"
                          value={formData.account_holder}
                          onChange={(e) => setFormData({...formData, account_holder: e.target.value})}
                        />
                      </div>
                   </div>

                   <div className="group">
                      <label className="block text-[10px] font-black text-white/20 uppercase tracking-[0.4em] mb-4 ml-4">IBAN / Account Number</label>
                      <input 
                        placeholder="PK00..."
                        className="w-full px-8 py-6 bg-white/5 border-none rounded-[2rem] text-white font-bold text-lg focus:ring-2 focus:ring-secondary/20 transition-all"
                        value={formData.account_number}
                        onChange={(e) => setFormData({...formData, account_number: e.target.value})}
                      />
                   </div>

                   <div className="bg-amber-500/10 border border-amber-500/20 rounded-[2rem] p-8 flex gap-4 items-start">
                      <AlertCircle className="w-6 h-6 text-amber-500 flex-shrink-0" />
                      <div>
                         <h4 className="text-amber-500 font-black text-xs uppercase tracking-widest mb-1">Security Warning</h4>
                         <p className="text-amber-500/60 text-xs leading-relaxed">Ensure your bank details match your CNIC. Mismatched data will delay earnings settlement.</p>
                      </div>
                   </div>
                </div>

                <div className="flex gap-4">
                  <button onClick={() => setStep(2)} className="px-8 py-7 bg-white/5 text-white/40 rounded-[2.5rem] font-black uppercase tracking-widest text-xs">Back</button>
                  <button 
                    onClick={handleSubmit}
                    disabled={!formData.bank_name || !formData.account_number || loading}
                    className="flex-1 bg-secondary text-slate-950 py-7 rounded-[2.5rem] font-black uppercase tracking-widest text-sm flex items-center justify-center gap-3 shadow-2xl shadow-secondary/20 disabled:opacity-20 transition-all"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
                    Complete Activation
                  </button>
                </div>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
