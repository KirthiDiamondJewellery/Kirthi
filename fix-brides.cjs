const fs = require('fs');

let fileContent = fs.readFileSync('src/components/BridesShowcase.tsx', 'utf8');

const targetSection = `<div className="max-w-4xl mx-auto space-y-6 text-sm md:text-base font-light leading-relaxed opacity-85 text-justify">
            <p>
              At Kirthi Diamonds, we believe that bridal jewellery should be as unique as the love story it represents. Our dedicated bridal service is built entirely upon a foundation of low-volume, highly personalised commissions. Rather than presenting brides with mass-manufactured, generic designs, we welcome families into our private consultation rooms in Kochi and Calicut for a slow-paced, collaborative experience. Here, our designers work hand-in-hand with the bride to sketch and render a custom-tailored ensemble—spanning from the centre engagement ring to the complete necklace and bangle set—ensuring every piece harmonizes beautifully with her bridal attire and personal style.
            </p>
            <p>
              This deliberate low-volume approach is vital to achieving a perfect, durable setting outcome for bridal jewellery, which is designed to be worn and cherished for a lifetime. Commercial bridal sets are often cast using standard moulds that force pre-selected diamonds into rigid claw positions. This cookie-cutter method creates micro-stress points in the metal and frequently leads to loose stones or compromised brilliance. At Kirthi, every bridal mounting is hand-forged and custom-sculpted around the exact contours and proportions of its certified GIA or IGI diamond. Our master setters spend hours under high magnification precisely placing and adjusting each individual claw. This painstaking technique ensures the diamonds sit securely with balanced tension while opening the stone to maximum ambient light, releasing the ultimate fire, brilliance, and scintillation.
            </p>
            <p>
              Whether crafting traditional Kerala-inspired masterpieces, modern solitaire rings, or intricate Polki and uncut diamond sets, we commit to absolute material transparency. Every diamond above 0.30 carats features its own independent laboratory certificate, and every gram of gold is BIS-hallmarked for absolute purity. Backed by our lifetime buyback and exchange policy, a Kirthi bridal commission is not just a stunning accessory for a single day, but a structurally perfect generational heirloom designed to be passed down with pride.
            </p>
          </div>`;

const newSection = `<div className="max-w-4xl mx-auto space-y-6 text-sm md:text-base font-light leading-relaxed opacity-85 text-justify">
            <p>
              A Kirthi bridal creation begins with a private consultation, not a catalogue selection. Each piece is designed around your story, your ceremony, and the diamond itself - shaped with the precision of our family diamond heritage and finished by artisans who understand the weight of a wedding jewel.
            </p>
            <p>
              From sculptural diamond chokers to refined bridal necklaces and engagement rings, every Kirthi piece is crafted with certified natural diamonds and BIS hallmarked gold. The result is jewellery with presence, permanence, and the intimacy of something made only for you.
            </p>
            <h3 className="text-xl md:text-2xl font-serif italic mt-8 mb-4 text-center">A Lifetime Promise, Written with Every Piece</h3>
            <p>
              True luxury should carry certainty. Every Kirthi bridal creation is supported by our written lifetime buyback and exchange policy, documented clearly at purchase.
            </p>
            <p>
              Your certified diamonds are assessed with reference to their original certificate and prevailing valuation terms, while gold is exchanged against weight and the prevailing gold rate. This gives your bridal jewellery a life beyond the wedding day - as a treasured heirloom, a store of value, and a piece of family history.
            </p>
            <div className="text-center pt-4">
              <Link to="/policies" className="inline-block border-b border-[#D4AF37] text-[#D4AF37] hover:text-white hover:border-white transition-colors pb-1">
                View the lifetime buyback and exchange policy
              </Link>
            </div>
          </div>
          
          {/* Premium trust strip */}
          <div className="mt-16 pt-16 border-t border-white/10">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8 text-center max-w-5xl mx-auto">
              <div className="space-y-2">
                <span className="block text-[#D4AF37] text-xl mb-3">⟡</span>
                <span className="text-xs md:text-sm tracking-wider uppercase font-light text-white/80 block">Family diamond heritage since 1975</span>
              </div>
              <div className="space-y-2">
                <span className="block text-[#D4AF37] text-xl mb-3">⟡</span>
                <span className="text-xs md:text-sm tracking-wider uppercase font-light text-white/80 block">Bespoke bridal house established in 2006</span>
              </div>
              <div className="space-y-2">
                <span className="block text-[#D4AF37] text-xl mb-3">⟡</span>
                <span className="text-xs md:text-sm tracking-wider uppercase font-light text-white/80 block">Certified natural diamonds</span>
              </div>
              <div className="space-y-2">
                <span className="block text-[#D4AF37] text-xl mb-3">⟡</span>
                <span className="text-xs md:text-sm tracking-wider uppercase font-light text-white/80 block">BIS hallmarked gold</span>
              </div>
              <div className="space-y-2">
                <span className="block text-[#D4AF37] text-xl mb-3">⟡</span>
                <span className="text-xs md:text-sm tracking-wider uppercase font-light text-white/80 block">Private bridal consultations in Kochi and Calicut</span>
              </div>
              <div className="space-y-2">
                <span className="block text-[#D4AF37] text-xl mb-3">⟡</span>
                <span className="text-xs md:text-sm tracking-wider uppercase font-light text-white/80 block">Written lifetime buyback and exchange promise</span>
              </div>
            </div>
          </div>`;

fileContent = fileContent.replace(targetSection, newSection);
fileContent = fileContent.replace('Bridal Stories: Celebrating Unique Love Stories with Kirthi Diamonds', 'Bespoke Bridal Jewellery, Made to Be Inherited');

const targetCTA = `<button
            onClick={() => setIsSubmitModalOpen(true)}
            className="mb-12 px-8 py-4 border border-[#D4AF37]/50 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-colors text-xs md:text-[10px] uppercase tracking-[0.3em]"
          >
            Submit Your Story
          </button>
          <h4 className="text-xs md:text-[10px] uppercase tracking-[0.5em] opacity-40 mb-12 block">Every Diamond Is A Promise</h4>`;

const newCTA = `<h3 className="text-2xl md:text-4xl font-serif italic mb-6">Made for the wedding. Kept for generations.</h3>
          <p className="max-w-2xl mx-auto text-sm md:text-base font-light leading-relaxed opacity-80 mb-12">
            Create your bridal jewellery through a private Kirthi consultation, with certified natural diamonds, BIS hallmarked gold, and a written lifetime buyback and exchange promise documented at purchase.
          </p>
          <Link
            to="/contact"
            className="mb-12 inline-block px-8 py-4 border border-[#D4AF37]/50 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-colors text-xs md:text-[10px] uppercase tracking-[0.3em]"
          >
            Book a Consultation
          </Link>`;

fileContent = fileContent.replace(targetCTA, newCTA);

if (!fileContent.includes("import { Link }")) {
  fileContent = fileContent.replace("import React,", "import React, { useState, useEffect } from 'react';\\nimport { Link } from 'react-router-dom';\\n//");
}

fs.writeFileSync('src/components/BridesShowcase.tsx', fileContent);
