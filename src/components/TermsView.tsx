import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck } from 'lucide-react';
import { SharedFooter } from './SharedFooter';

export default function TermsView({ onInquiry }: { onInquiry?: () => void }) {
  return (
    <div className="w-full h-full flex flex-col items-center justify-start px-8 md:px-28 overflow-y-auto custom-scrollbar">
      <div className="max-w-4xl w-full pt-[140px] md:pt-[200px] pb-32 md:pb-48">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-12 mb-24 text-center"
        >
          <div className="space-y-6 md:space-y-4">
            <h4 className="text-xs md:text-[10px] uppercase tracking-[0.5em] text-[#D4AF37]">Legal & Compliance</h4>
            <h2 className="text-4xl md:text-7xl font-serif italic mb-8">Terms & Conditions</h2>
          </div>
          <div className="w-20 h-px bg-[#D4AF37] mx-auto"></div>
          <p className="max-w-2xl mx-auto text-lg font-light leading-relaxed opacity-70 italic whitespace-pre-wrap">
            Our standard terms and conditions of purchase, bespoke commissions, and lifetime buyback guarantees.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-12 font-light text-white/80"
        >
          <div className="p-8 border border-white/5 bg-[#050505] space-y-6 group hover:border-[#D4AF37]/30 transition-all">
            <div className="flex items-center space-x-4 mb-4">
               <ShieldCheck className="text-[#D4AF37] opacity-60 group-hover:opacity-100 transition-opacity" size={28} />
               <h3 className="text-2xl font-serif italic">1. Certification & Quality</h3>
            </div>
            <p className="text-sm leading-relaxed opacity-80">
              Kirthi Diamonds guarantees that all diamonds above 0.30 carats are accompanied by an independent grading report from the Gemological Institute of America (GIA) or the International Gemological Institute (IGI). Our gold is stamped with BIS Hallmarks. Any discrepancy in weight or quality as described on the certificate will be addressed immediately by our Diamond Specialist.
            </p>
          </div>

          <div className="p-8 border border-white/5 bg-[#050505] space-y-6 group hover:border-[#D4AF37]/30 transition-all">
            <div className="flex items-center space-x-4 mb-4">
               <span className="text-2xl font-serif italic text-[#D4AF37] opacity-60 group-hover:opacity-100 transition-opacity">02</span>
               <h3 className="text-2xl font-serif italic">2. Bespoke Commissions</h3>
            </div>
            <p className="text-sm leading-relaxed opacity-80">
              For bespoke and custom-designed pieces, a non-refundable deposit of 50% is required to commence work, following final CAD approval. Production timelines are estimates and may vary based on the complexity of the design and the global sourcing timeline of the required stones. We do not accept returns on personalized bespoke commissions, but will rework pieces that do not meet the finalized specifications.
            </p>
          </div>

          <div className="p-8 border border-white/5 bg-[#050505] space-y-6 group hover:border-[#D4AF37]/30 transition-all">
             <div className="flex items-center space-x-4 mb-4">
               <span className="text-2xl font-serif italic text-[#D4AF37] opacity-60 group-hover:opacity-100 transition-opacity">03</span>
               <h3 className="text-2xl font-serif italic">3. Lifetime Exchange & Buyback</h3>
            </div>
            <p className="text-sm leading-relaxed opacity-80">
               We offer a lifetime exchange policy on certified diamond jewellery. The exchange value is determined based on the current market price of the diamonds and metal, minus making charges and taxes, subject to quality inspection. For a full breakdown of the percentage value retained during buyback versus exchange, please consult your physical invoice or speak to our Diamond Specialist.
            </p>
          </div>

          <div className="p-8 border border-white/5 bg-[#050505] space-y-6 group hover:border-[#D4AF37]/30 transition-all">
             <div className="flex items-center space-x-4 mb-4">
               <span className="text-2xl font-serif italic text-[#D4AF37] opacity-60 group-hover:opacity-100 transition-opacity">04</span>
               <h3 className="text-2xl font-serif italic">4. Shipping & Insurance</h3>
            </div>
            <p className="text-sm leading-relaxed opacity-80">
               All high-value deliveries domestic and international are fully insured directly by Kirthi Diamonds until signed for by the recipient. Customers are responsible for any applicable customs, duties, or local taxes on international shipments. Once signed for, the responsibility of the item transfers entirely to the buyer.
            </p>
          </div>
        </motion.div>

        <div className="mt-32 text-center border-t border-white/5 pt-16">
          <p className="text-xs md:text-[10px] uppercase tracking-[0.3em] opacity-40 mb-4">Questions regarding our policies?</p>
          <button 
             onClick={onInquiry}
             className="text-[#D4AF37] hover:text-white transition-colors tracking-widest text-sm uppercase opacity-90 border-b border-[#D4AF37]/30 pb-1"
          >
             Contact the Diamond Specialist
          </button>
        </div>
      </div>
      <SharedFooter />
    </div>
  );
}
