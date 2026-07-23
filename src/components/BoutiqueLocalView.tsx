import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import BreadcrumbNavigation from './BreadcrumbNavigation';
import { SharedFooter } from './SharedFooter';
import { Link } from 'react-router-dom';
import { useContent } from '../contexts/ContentContext';

export default function BoutiqueLocalView({ location }: { location: 'kochi' | 'calicut' }) {
  const isKochi = location === 'kochi';
  const { content } = useContent();
  
  useEffect(() => {
    
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) metaDescription.setAttribute("content", `Visit Kirthi Diamonds ${isKochi ? 'Kochi' : 'Calicut'} boutique. Experience our one-on-one consultation model, BIS hallmarked gold, and GIA/IGI certified bespoke bridal jewellery.`);
    
    // OG tags per Task 2
    const ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage) ogImage.setAttribute('content', 'https://kirthidiamonds.com/og-cover.jpg');
    
    const ogWidth = document.querySelector('meta[property="og:image:width"]');
    if (ogWidth) ogWidth.setAttribute('content', '1200');
    
    const ogHeight = document.querySelector('meta[property="og:image:height"]');
    if (ogHeight) ogHeight.setAttribute('content', '630');
    
    const twitterImage = document.querySelector('meta[name="twitter:image"]');
    if (twitterImage) twitterImage.setAttribute('content', 'https://kirthidiamonds.com/og-cover.jpg');
    
    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute('href', `https://kirthidiamonds.com/${location}`);
    
    window.scrollTo(0, 0);
  }, [location, isKochi]);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#D4AF37] selection:text-black">
      <header className="fixed top-[env(safe-area-inset-top,0px)] w-full flex justify-between items-center px-4 sm:px-6 md:px-12 py-4 sm:py-6 md:py-10 z-[70] pointer-events-none bg-gradient-to-b from-black/80 via-black/40 to-transparent backdrop-blur-[2px]">
        <a href="/" className="pointer-events-auto">
          {content?.logoUrl ? (
            <img src={content.logoUrl} alt="Kirthi Diamonds" className="h-6 sm:h-8 md:h-10 w-auto filter brightness-125 drop-shadow-lg object-contain opacity-80 hover:opacity-100 transition-opacity" />
          ) : (
            <img src="/logo.png" alt="Kirthi Diamonds" className="h-6 opacity-80" />
          )}
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
              <h1 className="text-4xl md:text-6xl font-serif italic mb-6 leading-tight">
                Kirthi Diamonds, {isKochi ? 'Kochi' : 'Calicut'}
              </h1>
              <div className="text-sm md:text-base font-light leading-relaxed opacity-80 max-w-xl space-y-4">
                <p>
                  Our {isKochi ? 'Palarivattom' : 'Puthiyara'} boutique represents the heart of Kirthi Diamonds' design philosophy. Situated in a premier district, this showroom offers our most extensive collection of GIA and IGI certified loose diamonds, alongside an exclusive bridal suite for one-on-one consultation.
                </p>
                <p>
                  We operate on an uncompromising standard of 100% BIS hallmarked gold (18kt and 22kt), crafting heirloom-quality bespoke jewellery. We reject the commercialized, high-throughput model of modern retailing in favor of deliberate, low-volume, artisanal craftsmanship.
                </p>
                <p>
                  The {isKochi ? 'Kochi' : 'Calicut'} atelier houses our master craftsmen, allowing clients commissioning bespoke heirlooms to witness the precision of diamond setting and gold forging firsthand.
                </p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <a 
                href="/contact"
                className="px-6 py-3 border border-[#D4AF37]/50 hover:border-[#D4AF37] text-xs uppercase tracking-[0.2em] text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-colors"
              >
                Arrange a Visit
              </a>
              <a 
                href="/shop" 
                className="px-6 py-3 border border-white/20 hover:border-white/50 text-xs uppercase tracking-[0.2em] text-white/80 hover:text-white transition-colors"
              >
                Explore Collections
              </a>
            </div>
          </div>
          
          <div className="space-y-12">
            <div className="p-10 border border-white/5 bg-[#050505] space-y-6">
              <h4 className="text-xl font-serif italic text-[#D4AF37]">Boutique Details</h4>
              <div className="text-sm font-light leading-relaxed opacity-80">
                <p>{isKochi ? '34/572, By Pass Road, Palarivattom, Kochi, Kerala' : '61/11508A, Opposite Federal Bank, Puthiyara, Calicut, Kerala'}</p>
                <p className="mt-2">Hours: Mon–Sat {isKochi ? '10:00–19:30' : '10:00–19:30'}</p>
                <p className="mt-2">
                  <a href={`tel:${isKochi ? '+919847086990' : '+919847086002'}`} className="hover:text-[#D4AF37] transition-colors inline-block mr-4">Call: {isKochi ? '+919847086990' : '+919847086002'}</a>
                  <a href={`https://wa.me/${isKochi ? '919847086990' : '919847086002'}?text=Hello%2C%20I%20would%20like%20to%20arrange%20a%20bespoke%20consultation%20at%20Kirthi%20Diamonds.`} target="_blank" rel="noopener noreferrer" className="hover:text-[#D4AF37] transition-colors">WhatsApp Us</a>
                </p>
              </div>
              <div className="w-full h-64 border border-white/10 mt-6 relative filter grayscale hover:grayscale-0 transition-all duration-700">
                {isKochi ? (
                  <iframe 
                    src="https://maps.google.com/maps?q=Kirthi%20Diamonds,%20Kochi&t=&z=15&ie=UTF8&iwloc=&output=embed" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen={false} 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                ) : (
                  <iframe 
                    src="https://maps.google.com/maps?q=Kirthi%20Diamonds,%20Calicut&t=&z=15&ie=UTF8&iwloc=&output=embed" 
                    width="100%" 
                    height="100%" 
                    style={{ border: 0 }} 
                    allowFullScreen={false} 
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      <SharedFooter />
    </div>
  );
}
