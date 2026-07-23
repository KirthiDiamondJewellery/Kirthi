import React from 'react';

export function SharedFooter() {
  return (
    <footer className="relative w-full bg-black border-t border-white/5 py-24 px-8 md:px-32 flex justify-center mt-20 shrink-0 snap-end">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "JewelryStore",
            "@id": "https://kirthidiamonds.com/#kochi",
            "name": "Kirthi Diamonds — Kochi",
            "image": "https://kirthidiamonds.com/og-cover.jpg",
            "url": "https://kirthidiamonds.com/",
            "telephone": "+919847086990",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "34/572, By Pass Road, Palarivattom",
              "addressLocality": "Kochi",
              "addressRegion": "Kerala",
              "addressCountry": "IN"
            },
            "openingHoursSpecification": [{
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
              "opens": "10:00", "closes": "19:30"
            }],
            "priceRange": "$$",
            "parentOrganization": { "@id": "https://kirthidiamonds.com/#org" }
          },
          {
            "@type": "JewelryStore",
            "@id": "https://kirthidiamonds.com/#calicut",
            "name": "Kirthi Diamonds — Calicut",
            "image": "https://kirthidiamonds.com/og-cover.jpg",
            "url": "https://kirthidiamonds.com/",
            "telephone": "+919847086990",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "61/11508A, Opposite Federal Bank, Puthiyara",
              "addressLocality": "Calicut",
              "addressRegion": "Kerala",
              "addressCountry": "IN"
            },
            "openingHoursSpecification": [{
              "@type": "OpeningHoursSpecification",
              "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
              "opens": "10:00", "closes": "19:30"
            }],
            "priceRange": "$$",
            "parentOrganization": { "@id": "https://kirthidiamonds.com/#org" }
          },
          {
            "@type": "Organization",
            "@id": "https://kirthidiamonds.com/#org",
            "name": "Kirthi Diamonds",
            "url": "https://kirthidiamonds.com/",
            "logo": "/logo.png",
            "foundingDate": "2006",
            "description": "A bespoke diamond house established 2006, rooted in a family diamond trade since 1975. GIA and IGI certified diamonds, BIS Hallmarked gold, boutiques in Kochi and Calicut."
          }
        ]
      }) }} />
      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-4 gap-12 md:gap-16">
        <div className="space-y-6 md:col-span-2">
          <h4 className="text-xl font-serif italic text-white/90">Kirthi Diamonds</h4>
          <p className="text-xs font-light text-white/40 leading-relaxed max-w-lg">
            A bespoke diamond house est. 2006, rooted in a family diamond trade since 1975. We forge heirloom-quality bespoke jewellery. As certified purveyors of <a href="https://www.gia.edu" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#D4AF37]">GIA</a> and <a href="https://www.igi.org" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#D4AF37]">IGI</a> diamonds, and an uncompromising standard of 100% <a href="https://www.bis.gov.in/hallmarking/" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#D4AF37]">BIS hallmarked</a> gold (18kt and 22kt), the Maison represents absolute integrity. Every solitaire, custom bridal masterpiece, and signature collection is meticulously crafted to an Internally Flawless standard using exclusively 100% natural diamonds—bridging centuries of savoir-faire with contemporary vision. 
          </p>
          <div className="pt-4 border-t border-white/10 max-w-md">
            <h4 className="text-xs md:text-[10px] uppercase tracking-widest text-[#D4AF37] mb-4">Discreet Enquiry</h4>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
              <a 
                href="tel:+919847086990" 
                className="inline-flex items-center gap-3 text-lg font-serif italic text-white/95 hover:text-[#D4AF37] transition-colors duration-300 group"
              >
                <span className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-[#D4AF37]/50 group-hover:bg-[#D4AF37]/5 transition-all">
                  <svg className="w-3.5 h-3.5 text-[#D4AF37]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.94.725l.548 2.2a1 1 0 01-.321.988l-1.305.98a10.582 10.582 0 004.872 4.872l.98-1.305a1 1 0 01.988-.321l2.2.548a1 1 0 01.725.94V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </span>
                <span>+91 98470 86990</span>
              </a>
              <span className="text-[10px] uppercase tracking-widest text-white/30 hidden sm:inline">— Direct Line</span>
            </div>

            <a 
              href="/contact"
              className="inline-flex border border-[#D4AF37]/50 hover:border-[#D4AF37] text-[#D4AF37] px-6 py-3 text-xs uppercase tracking-widest transition-colors hover:bg-[#D4AF37] hover:text-black whitespace-nowrap"
            >
              Arrange a visit
            </a>
          </div>
        </div>
        <div className="space-y-6 flex flex-col">
          <div>
            <h4 className="text-xs md:text-[10px] uppercase tracking-widest text-[#D4AF37]">Maison Masterworks</h4>
            <ul className="space-y-4 text-xs font-light text-white/40 mt-6">
              <li>High-Jewellery Bridal Collections</li>
              <li>Bespoke Solitaire Engagement Rings</li>
              <li>GIA & IGI Certified Loose Diamonds</li>
              <li>Hand-crafted Platinum & 18K Gold</li>
              <li>Heirloom Restoration & Curation</li>
            </ul>
          </div>
          <div className="pt-8 mt-auto">
            <h4 className="text-xs md:text-[10px] uppercase tracking-widest text-[#D4AF37]">Information</h4>
            <ul className="space-y-4 text-xs font-light text-white/40 mt-6 flex flex-col items-start">
              <li><a href="/shop" className="hover:text-white transition-colors">Diamond Jewellery</a></li>
              <li><a href="/pages/certified-diamonds" className="hover:text-white transition-colors">Certified Diamonds</a></li>
              <li><a href="/pages/exchange-policy" className="hover:text-white transition-colors">Buyback & Exchange</a></li>
              <li><a href="/pages/policies" className="hover:text-white transition-colors">Policies & Ethics</a></li>
              <li><a href="/contact" className="hover:text-white transition-colors">Contact</a></li>
            </ul>
          </div>
        </div>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="text-xs md:text-[10px] uppercase tracking-widest text-[#D4AF37]">Boutique Locations</h4>
            <a href="/find-a-store" className="text-[10px] uppercase tracking-widest text-white/50 hover:text-[#D4AF37] transition-colors border-b border-white/20 hover:border-[#D4AF37]">Find a Store Map</a>
          </div>
          <ul className="space-y-6 text-xs font-light text-white/40">
            <li>
              <a href="/kochi" className="block text-white/80 hover:text-[#D4AF37] transition-colors mb-2">Kochi Boutique</a>
              34/572, By Pass Road, Palarivattom, Kochi, Kerala, India
              <br/><span className="text-white/50 block mt-1">Mon–Sat 10:00 AM – 8:00 PM<br/>Closed on Sundays</span>
            </li>
            <li>
              <a href="/calicut" className="block text-white/80 hover:text-[#D4AF37] transition-colors mb-2">Calicut Boutique</a>
              61/11508A, Opposite Federal Bank, Puthiyara, Kozhikode, Kerala, India
              <br/><span className="text-white/50 block mt-1">Mon–Sat 10:00 AM – 8:00 PM<br/>Closed on Sundays</span>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
