import { uploadImage } from './AdminView';
import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, ChevronRight, ChevronLeft, Gem, CheckCircle2, UploadCloud, Paperclip } from "lucide-react";
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';

const CATEGORIES = ["Ring", "Necklace", "Earrings", "Bracelet / Bangle", "Bridal Set", "Undecided"];
const METALS = ["18K Yellow Gold", "18K Rose Gold", "18K White Gold", "Platinum", "Undecided"];
const STYLES = ["Classic & Timeless", "Modern & Minimalist", "Vintage & Heirloom", "Statement / Cocktail"];
const BUDGETS = ["Under ₹5 Lakhs", "₹5L - ₹15L", "₹15L - ₹30L", "₹30L+", "To Be Discussed"];
const OCCASIONS = ["Wedding / Bridal", "Anniversary", "Special Milestone", "Everyday Luxury", "Other"];

interface ConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ConsultationModal({ isOpen, onClose }: ConsultationModalProps) {
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    category: "",
    style: "",
    metal: "",
    budget: "",
    occasion: "",
    name: "",
    email: "",
    phone: "",
    message: "",
    attachment: ""
  });

  // Handle file upload by converting to base64
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert("File size exceeds 5MB limit.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      updateForm("attachment", event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const removeAttachment = () => {
    updateForm("attachment", "");
  };

  const updateForm = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const checkStepValid = () => {
    if (step === 1) return formData.category !== "" && formData.style !== "";
    if (step === 2) return formData.metal !== "";
    if (step === 3) return formData.budget !== "" && formData.occasion !== "";
    if (step === 4) return formData.name !== "" && formData.email !== "" && formData.phone !== "";
    return true;
  };

  const handleNext = () => {
    if (checkStepValid() && step < 4) {
      setStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(prev => prev - 1);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkStepValid()) return;
    
    setIsSubmitting(true);
    try {
      try {
        await addDoc(collection(db, 'consultations'), {
          ...formData,
          createdAt: new Date().toISOString(),
          status: 'pending' // Initial status
        });
      } catch (err) {
        console.error("Error saving to Firebase", err);
      }

      const response = await fetch("/api/consultation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setIsSuccess(true);
        setTimeout(() => {
          onClose();
          // Reset after close
          setTimeout(() => {
            setStep(1);
            setIsSuccess(false);
            setFormData({ category: "", style: "", metal: "", budget: "", occasion: "", name: "", email: "", phone: "", message: "", attachment: "" });
          }, 500);
        }, 3000);
      } else {
        alert("There was an error submitting your request. Please try again.");
      }
    } catch (error) {
      console.error(error);
      alert("There was an error submitting your request. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderSelection = (options: string[], selectedValue: string, fieldKey: string) => {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {options.map(option => (
          <button
            key={option}
            type="button"
            onClick={() => updateForm(fieldKey, option)}
            className={`py-6 px-4 text-xs md:text-[10px] tracking-[0.2em] uppercase transition-all duration-300 border relative overflow-hidden group ${
              selectedValue === option 
                ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.15)]' 
                : 'border-white/10 hover:border-[#D4AF37]/50 hover:bg-white/[0.02] hover:shadow-[0_0_10px_rgba(212,175,55,0.05)] text-white/70'
            }`}
          >
            {/* Subtle glow effect on selected or hover */}
            <div className={`absolute inset-0 bg-gradient-to-br from-[#D4AF37]/20 to-transparent opacity-0 transition-opacity duration-300 ${selectedValue === option ? 'opacity-100' : 'group-hover:opacity-50'}`} />
            
            <span className="relative z-10 font-medium">{option}</span>
          </button>
        ))}
      </div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-2xl flex items-start justify-center p-4 md:p-12 overflow-y-auto custom-scrollbar pt-20 md:pt-32"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="max-w-4xl w-full bg-[#0A0A0A] border border-white/10 p-6 md:p-16 relative overflow-hidden mb-20"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent opacity-50" />
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/[0.05] blur-[80px] rounded-full mix-blend-screen pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/[0.02] blur-[60px] rounded-full mix-blend-screen pointer-events-none" />

            <button
              onClick={onClose}
              className="absolute top-4 right-4 md:top-6 md:right-6 opacity-40 hover:opacity-100 hover:rotate-90 transition-all duration-300 z-50 p-2"
            >
              <X size={24} />
            </button>

            {isSuccess ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex flex-col items-center justify-center space-y-8 py-20 text-center relative z-10"
              >
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  className="w-20 h-20 rounded-full border border-[#D4AF37] flex items-center justify-center text-[#D4AF37] bg-[#D4AF37]/5 shadow-[0_0_30px_rgba(212,175,55,0.2)]"
                >
                  <CheckCircle2 size={40} />
                </motion.div>
                <div className="space-y-4">
                  <h2 className="text-3xl md:text-5xl font-serif italic text-white/90">Inquiry Dispatched</h2>
                  <p className="text-sm font-light italic opacity-60 leading-relaxed max-w-md mx-auto">
                    Your bespoke consultation request has been received. A dedicated Maison Diamond Specialist will contact you shortly.
                  </p>
                </div>
              </motion.div>
            ) : (
              <div className="relative z-10">
                <div className="text-center space-y-4 mb-20">
                  <div className="inline-flex items-center justify-center p-3 rounded-full bg-white/[0.02] border border-white/5 mb-4">
                    <Gem size={20} className="text-[#D4AF37]" strokeWidth={1} />
                  </div>
                  <h4 className="text-xs md:text-[10px] uppercase tracking-[0.5em] text-[#D4AF37]">
                    Bespoke Commission
                  </h4>
                  <p className="max-w-xl mx-auto text-sm font-light leading-relaxed opacity-80 text-white pb-4">
                     Schedule a private consultation at our Kochi or Calicut showrooms to explore GIA/IGI certified masterpiece collections, or command a bespoke, 18K/22K BIS hallmarked creation crafted by our in-house artisans without traditional retail markups.
                  </p>
                  <h2 className="text-3xl md:text-5xl font-serif italic font-light tracking-wide">
                    {step === 1 && "What are we creating?"}
                    {step === 2 && "Material Preferences"}
                    {step === 3 && "Scope & Occasion"}
                    {step === 4 && "Contact Details"}
                  </h2>
                  <div className="flex items-center justify-center space-x-3 mt-12">
                    {[1, 2, 3, 4].map(s => (
                      <div key={s} className="flex items-center">
                        <div className={`transition-all duration-500 ease-in-out rounded-full ${
                          step === s ? 'w-8 h-1.5 bg-[#D4AF37] shadow-[0_0_10px_rgba(212,175,55,0.4)]' : 
                          step > s ? 'w-2 h-1.5 bg-[#D4AF37] opacity-60' : 'w-1.5 h-1.5 bg-white/20'
                        }`} />
                        {s < 4 && <div className={`w-8 h-[1px] mx-2 transition-all duration-500 ${step > s ? 'bg-[#D4AF37]/40' : 'bg-transparent'}`} />}
                      </div>
                    ))}
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-16">
                  <AnimatePresence mode="wait">
                    {step === 1 && (
                      <motion.div key="step1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="space-y-12">
                        <div className="space-y-6">
                          <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xs md:text-[10px] uppercase tracking-widest text-[#D4AF37]">Jewellery Category</h3>
                            <span className="text-[10px] tracking-[0.2em] uppercase text-white/30">Step 1A</span>
                          </div>
                          {renderSelection(CATEGORIES, formData.category, "category")}
                        </div>
                        <div className="space-y-6 pt-6 border-t border-white/5">
                          <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xs md:text-[10px] uppercase tracking-widest text-[#D4AF37]">Aesthetic Direction</h3>
                            <span className="text-[10px] tracking-[0.2em] uppercase text-white/30">Step 1B</span>
                          </div>
                          {renderSelection(STYLES, formData.style, "style")}
                        </div>
                      </motion.div>
                    )}

                    {step === 2 && (
                      <motion.div key="step2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="space-y-12">
                        <div className="space-y-6">
                          <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xs md:text-[10px] uppercase tracking-widest text-[#D4AF37]">Metal Preference</h3>
                            <span className="text-[10px] tracking-[0.2em] uppercase text-white/30">Step 2A</span>
                          </div>
                          {renderSelection(METALS, formData.metal, "metal")}
                        </div>
                        <div className="bg-[#111] border border-white/5 p-8 flex flex-col md:flex-row items-center gap-8 group">
                          <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center shrink-0 group-hover:border-[#D4AF37]/50 transition-colors">
                            <Gem size={20} className="text-white/50 group-hover:text-[#D4AF37] transition-colors" />
                          </div>
                          <div className="space-y-2 text-center md:text-left">
                            <h4 className="text-xs uppercase tracking-widest text-white/90">Diamond Sourcing</h4>
                            <p className="text-sm font-light text-white/50 leading-relaxed max-w-lg">
                              Kirthi Diamonds exclusively sources internally flawless natural diamonds. Our gemologists will curate a bespoke selection of GIA/IGI certified stones tailored to your chosen design.
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {step === 3 && (
                      <motion.div key="step3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="space-y-12">
                        <div className="space-y-6">
                          <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xs md:text-[10px] uppercase tracking-widest text-[#D4AF37]">Estimated Budget Range</h3>
                            <span className="text-[10px] tracking-[0.2em] uppercase text-white/30">Step 3A</span>
                          </div>
                          {renderSelection(BUDGETS, formData.budget, "budget")}
                        </div>
                        <div className="space-y-6 pt-6 border-t border-white/5">
                          <div className="flex items-center justify-between mb-8">
                            <h3 className="text-xs md:text-[10px] uppercase tracking-widest text-[#D4AF37]">Purpose / Occasion</h3>
                            <span className="text-[10px] tracking-[0.2em] uppercase text-white/30">Step 3B</span>
                          </div>
                          {renderSelection(OCCASIONS, formData.occasion, "occasion")}
                        </div>
                      </motion.div>
                    )}

                    {step === 4 && (
                      <motion.div key="step4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.3 }} className="space-y-8 max-w-2xl mx-auto">
                        <div className="text-center mb-10">
                          <p className="text-sm font-light text-white/50 leading-relaxed">
                            Please provide your contact information. A dedicated design consultant will reach out to schedule your private consultation.
                          </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                          <div className="relative group">
                            <input
                              type="text"
                              id="given-name"
                              value={formData.name}
                              onChange={(e) => updateForm("name", e.target.value)}
                              className="peer w-full bg-transparent border-b border-white/20 py-4 text-xs md:text-[10px] tracking-widest uppercase focus:border-[#D4AF37] outline-none transition-all placeholder-transparent"
                              placeholder="GIVEN NAME"
                              required
                            />
                            <label htmlFor="given-name" className="absolute left-0 -top-3 text-[9px] uppercase tracking-widest text-[#D4AF37] transition-all peer-placeholder-shown:text-xs peer-placeholder-shown:text-white/30 peer-placeholder-shown:top-4 peer-focus:-top-3 peer-focus:text-[9px] peer-focus:text-[#D4AF37] cursor-text">
                              Given Name
                            </label>
                          </div>
                          <div className="relative group">
                            <input
                              type="email"
                              id="email-addr"
                              value={formData.email}
                              onChange={(e) => updateForm("email", e.target.value)}
                              className="peer w-full bg-transparent border-b border-white/20 py-4 text-xs md:text-[10px] tracking-widest uppercase focus:border-[#D4AF37] outline-none transition-all placeholder-transparent"
                              placeholder="EMAIL ADDRESS"
                              required
                            />
                            <label htmlFor="email-addr" className="absolute left-0 -top-3 text-[9px] uppercase tracking-widest text-[#D4AF37] transition-all peer-placeholder-shown:text-xs peer-placeholder-shown:text-white/30 peer-placeholder-shown:top-4 peer-focus:-top-3 peer-focus:text-[9px] peer-focus:text-[#D4AF37] cursor-text">
                              Email Address
                            </label>
                          </div>
                        </div>
                        <div className="relative group mt-8">
                          <input
                            type="tel"
                            id="phone-num"
                            value={formData.phone}
                            onChange={(e) => updateForm("phone", e.target.value)}
                            className="peer w-full bg-transparent border-b border-white/20 py-4 text-xs md:text-[10px] tracking-widest uppercase focus:border-[#D4AF37] outline-none transition-all placeholder-transparent"
                            placeholder="PHONE NUMBER"
                            required
                          />
                          <label htmlFor="phone-num" className="absolute left-0 -top-3 text-[9px] uppercase tracking-widest text-[#D4AF37] transition-all peer-placeholder-shown:text-xs peer-placeholder-shown:text-white/30 peer-placeholder-shown:top-4 peer-focus:-top-3 peer-focus:text-[9px] peer-focus:text-[#D4AF37] cursor-text">
                            Phone Number
                          </label>
                        </div>
                        <div className="relative group mt-8">
                          <textarea
                            id="add-details"
                            rows={3}
                            value={formData.message}
                            onChange={(e) => updateForm("message", e.target.value)}
                            className="peer w-full bg-transparent border-b border-white/20 py-4 text-xs leading-relaxed focus:border-[#D4AF37] outline-none transition-all placeholder-transparent resize-none custom-scrollbar"
                            placeholder="ANY ADDITIONAL DETAILS OR INSTRUCTIONS?"
                          ></textarea>
                          <label htmlFor="add-details" className="absolute left-0 -top-3 text-[9px] uppercase tracking-widest text-[#D4AF37] transition-all peer-placeholder-shown:text-xs peer-placeholder-shown:text-white/30 peer-placeholder-shown:top-4 peer-focus:-top-3 peer-focus:text-[9px] peer-focus:text-[#D4AF37] cursor-text">
                            Additional Details (Optional)
                          </label>
                        </div>
                        
                        <div className="mt-8 border border-dashed border-white/20 hover:border-[#D4AF37]/50 transition-colors p-6 flex flex-col items-center justify-center text-center cursor-pointer group relative">
                          <input 
                            type="file" 
                            accept="image/*,.pdf" 
                            onChange={handleFileUpload}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                          />
                          {!formData.attachment ? (
                            <>
                              <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mb-3 group-hover:bg-[#D4AF37]/10 transition-colors">
                                <UploadCloud size={18} className="text-white/50 group-hover:text-[#D4AF37] transition-colors" />
                              </div>
                              <p className="text-xs uppercase tracking-widest text-white/70 font-medium mb-1">Select Reference Image</p>
                              <p className="text-[10px] text-white/30 uppercase tracking-wider">Drag & drop or click to upload</p>
                              <p className="text-[9px] text-white/20 uppercase tracking-widest mt-2 block">Sketches, inspiration, or previous designs (Max 5MB)</p>
                            </>
                          ) : (
                            <div className="w-full flex items-center justify-between bg-white/5 p-4 z-20">
                              <div className="flex items-center space-x-3">
                                <Paperclip size={16} className="text-[#D4AF37]" />
                                <span className="text-xs text-white/70 uppercase tracking-widest">Document Attached</span>
                              </div>
                              <button 
                                type="button" 
                                onClick={(e) => {
                                  e.preventDefault();
                                  removeAttachment();
                                }}
                                className="text-[10px] opacity-50 hover:opacity-100 hover:text-red-400 uppercase tracking-widest p-2"
                              >
                                Remove
                              </button>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="flex items-center justify-between pt-12 mt-12 border-t border-white/5 relative z-20">
                    {step > 1 ? (
                      <button
                        type="button"
                        onClick={handleBack}
                        className="flex items-center space-x-3 text-xs md:text-[10px] tracking-[0.2em] uppercase opacity-50 hover:opacity-100 hover:text-[#D4AF37] transition-all group py-2"
                      >
                        <ChevronLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                        <span>Previous Step</span>
                      </button>
                    ) : (
                      <div />
                    )}

                    {step < 4 ? (
                      <button
                        type="button"
                        onClick={handleNext}
                        disabled={!checkStepValid()}
                        className={`flex items-center space-x-3 text-xs md:text-[10px] tracking-[0.2em] uppercase transition-all px-10 py-4 group ${
                          checkStepValid() ? 'bg-[#D4AF37] text-black hover:bg-white shadow-[0_4px_20px_rgba(212,175,55,0.2)] hover:shadow-[0_4px_25px_rgba(255,255,255,0.3)]' : 'bg-white/5 text-white/30 cursor-not-allowed'
                        }`}
                      >
                        <span>Next Phase</span>
                        <ChevronRight size={14} className={checkStepValid() ? "group-hover:translate-x-1 transition-transform" : ""} />
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={!checkStepValid() || isSubmitting}
                        className={`flex items-center space-x-2 text-xs md:text-[10px] tracking-[0.2em] uppercase transition-all px-12 py-5 relative overflow-hidden group ${
                          checkStepValid() && !isSubmitting ? 'bg-[#D4AF37] text-black hover:bg-white shadow-[0_0_30px_rgba(212,175,55,0.25)]' : 'bg-white/5 text-white/30 cursor-not-allowed'
                        }`}
                      >
                        <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                        <span className="relative z-10">{isSubmitting ? 'Dispatching Inquiry...' : 'Complete Inquiry'}</span>
                      </button>
                    )}
                  </div>
                </form>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

