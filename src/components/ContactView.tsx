import React, { useState } from 'react';
import { motion } from 'framer-motion';
import BreadcrumbNavigation from './BreadcrumbNavigation';
import { SharedFooter } from './SharedFooter';
import { useContent } from '../contexts/ContentContext';

export default function ContactView() {
  const { content } = useContent();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    boutique: "kochi",
    date: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch('/api/consultation', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: formData.name, 
          email: formData.email, 
          phone: formData.phone, 
          message: formData.message
        })
      });
      if (response.ok) {
        setIsSuccess(true);
        setFormData({ name: "", email: "", phone: "", message: "" });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#D4AF37] selection:text-black">
      <header className="fixed top-[env(safe-area-inset-top,0px)] w-full flex justify-between items-center px-4 sm:px-6 md:px-12 py-4 sm:py-6 md:py-10 z-[70] pointer-events-none bg-gradient-to-b from-black/80 via-black/40 to-transparent backdrop-blur-[2px]">
        <a href="/" className="pointer-events-auto">
          <img src={content.logoUrl || "/logo.png"} alt="Kirthi Diamonds" className="h-6 opacity-80" />
        </a>
      </header>
      <div className="max-w-7xl mx-auto pt-32 px-4 sm:px-6 md:px-12 pb-32">
        <BreadcrumbNavigation className="relative justify-start pb-8 px-0" />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-16 md:gap-24"
        >
          <div className="space-y-12">
            <div>
              <h1 className="text-4xl md:text-6xl font-serif italic mb-6 leading-tight">Contact Kirthi Diamonds</h1>
              <p className="text-sm md:text-base font-light leading-relaxed opacity-80 max-w-xl">
                One-on-one consultation appointments available at both locations.
              </p>
            </div>
            
            <div className="bg-[#050505] border border-white/5 p-8 space-y-6">
              <h3 className="text-2xl font-serif italic mb-4">Book a Consultation</h3>
              {isSuccess ? (
                <div className="p-4 bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#D4AF37]">
                  Thank you for reaching out. Our diamond specialist will contact you shortly.
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <input required type="text" placeholder="Full Name" className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#D4AF37] outline-none" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                  </div>
                  <div>
                    <input required type="tel" placeholder="Phone Number" className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#D4AF37] outline-none" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                  </div>
                  <div>
                    <select required className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#D4AF37] outline-none text-white/80" value={formData.boutique} onChange={e => setFormData({...formData, boutique: e.target.value})}>
                      <option value="kochi">Kochi Boutique</option>
                      <option value="calicut">Calicut Boutique</option>
                    </select>
                  </div>
                  <div>
                    <input type="date" placeholder="Preferred Date" className="w-full bg-black/50 border border-white/10 p-3 text-sm focus:border-[#D4AF37] outline-none text-white/80" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
                  </div>
                  <div>
                    <textarea placeholder="Message or Bespoke Inquiry..." className="w-full h-32 bg-black/50 border border-white/10 p-3 text-sm focus:border-[#D4AF37] outline-none" value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})}></textarea>
                  </div>
                  <button type="submit" disabled={isSubmitting} className="w-full py-4 bg-[#D4AF37] text-black text-xs uppercase tracking-[0.2em] font-medium hover:bg-white transition-colors disabled:opacity-50">
                    {isSubmitting ? "Submitting..." : "Send Request"}
                  </button>
                </form>
              )}
            </div>
          </div>
          
          <div className="space-y-12">
            <h3 className="text-2xl font-serif italic mb-8">Boutique Locations</h3>
            
            <div className="space-y-8">
              <div className="p-10 border border-white/5 bg-[#050505] space-y-6">
                <h4 className="text-xl font-serif italic text-[#D4AF37]">Kochi</h4>
                <div className="text-sm font-light leading-relaxed opacity-80">
                  <p>34/572, By Pass Road, Palarivattom, Kochi, Kerala 682024.</p>
                  <p className="mt-2">Hours: Mon–Sat 10:00–19:30 (Closed on Sundays).</p>
                  <p className="mt-2 flex gap-4">
                    <a href="tel:+919847086990" className="hover:text-[#D4AF37] transition-colors underline underline-offset-4">Call Store</a>
                    
                  </p>
                </div>
              </div>
              
              <div className="p-10 border border-white/5 bg-[#050505] space-y-6">
                <h4 className="text-xl font-serif italic text-[#D4AF37]">Calicut</h4>
                <div className="text-sm font-light leading-relaxed opacity-80">
                  <p>61/11508A, Opposite Federal Bank, Puthiyara, Kozhikode, Kerala 673004.</p>
                  <p className="mt-2">Hours: Mon–Sat 10:00–19:30 (Closed on Sundays).</p>
                  <p className="mt-2 flex gap-4">
                    <a href="tel:+919847086002" className="hover:text-[#D4AF37] transition-colors underline underline-offset-4">Call Store</a>
                    
                  </p>
                </div>
              </div>

                            <div className="p-10 border border-white/5 bg-[#050505] space-y-6">
                <h4 className="text-xl font-serif italic text-[#D4AF37]">General Enquiries</h4>
                <div className="text-sm font-light leading-relaxed opacity-80 space-y-4">
                  <p>Email: <a href="mailto:info@kirthidiamonds.com" className="hover:text-[#D4AF37] transition-colors underline underline-offset-4">info@kirthidiamonds.com</a></p>
                  <p>
                    <a href="https://wa.me/919847086998?text=Hello%2C%20I%20would%20like%20to%20arrange%20a%20bespoke%20consultation%20at%20Kirthi%20Diamond%20Jewellery." target="_blank" rel="noopener noreferrer" className="inline-block py-3 px-6 bg-[#D4AF37] text-black text-xs uppercase tracking-[0.2em] font-medium hover:bg-white transition-colors">
                      WhatsApp Us
                    </a>
                  </p>
                </div>
              </div></div></div></motion.div>
      </div>
      <SharedFooter />
    </div>
  );
}
