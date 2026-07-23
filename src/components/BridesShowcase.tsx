import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { BRIDE_GALLERY } from '../constants';
import { useContent } from '../contexts/ContentContext';
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';
import BridalSubmissionModal from './BridalSubmissionModal';
import { SharedFooter } from './SharedFooter';

function BrideCard({ bride }: { bride: any; key?: React.Key }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [direction, setDirection] = useState(0);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [showLightbox, setShowLightbox] = useState(false);
  const images = bride.images?.length > 0 ? bride.images : [bride.image];

  const getOptimizedUrl = (url: string, width: number = 2400) => {
    if (!url || url.includes('unsplash.com') || url.includes('images.unsplash')) {
      return '/logo.png';
    }
    if (url.startsWith('data:')) return url;
    return url;
  };

  const getSrcSet = (url: string) => {
    if (!url || url.startsWith('data:') || url.includes('unsplash.com') || url.includes('images.unsplash')) return undefined;
    return undefined;
  };

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    let nextIndex = currentIdx + newDirection;
    if (nextIndex < 0) nextIndex = images.length - 1;
    if (nextIndex >= images.length) nextIndex = 0;
    setCurrentIdx(nextIndex);
  };

  const variants = {
    enter: (direction: number) => {
      return {
        x: direction > 0 ? 300 : -300,
        opacity: 0
      };
    },
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => {
      return {
        zIndex: 0,
        x: direction < 0 ? 300 : -300,
        opacity: 0
      };
    }
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "200px" }}
      onViewportEnter={() => setShouldLoad(true)}
      className="space-y-8 group/item"
    >
      <div className="aspect-[16/20] overflow-hidden relative group rounded-sm shadow-xl bg-white/5">
        <AnimatePresence initial={false} custom={direction}>
          {shouldLoad && (
            <motion.img 
              key={currentIdx}
              src={getOptimizedUrl(images[currentIdx])} 
              srcSet={getSrcSet(images[currentIdx])}
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              alt={bride.name} 
              fetchPriority="high"
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 }
              }}
              drag={images.length > 1 ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={1}
              onDragEnd={(e, { offset, velocity }) => {
                const swipe = swipePower(offset.x, velocity.x);
                if (swipe < -swipeConfidenceThreshold) {
                  paginate(1);
                } else if (swipe > swipeConfidenceThreshold) {
                  paginate(-1);
                }
              }}
              loading="lazy"
              className="w-full h-full object-cover absolute inset-0 cursor-grab active:cursor-grabbing transform scale-100 group-hover/item:scale-110 transition-transform duration-[2000ms] ease-out"
            />
          )}
        </AnimatePresence>
        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-all pointer-events-none" />
        
        {/* Expand Icon */}
        <button
          onClick={() => setShowLightbox(true)}
          className="absolute top-4 right-4 w-10 h-10 rounded-full bg-black/40 backdrop-blur border border-white/20 flex items-center justify-center opacity-0 group-hover/item:opacity-100 transition-opacity hover:bg-black/70 z-20 text-white shadow-lg"
          aria-label="Expand image"
        >
          <Maximize2 size={18} />
        </button>

        {images.length > 1 && (
          <>
            <button
              className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/40 backdrop-blur border border-white/20 flex items-center justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity hover:bg-black/70 z-20 text-white shadow-lg"
              onClick={() => paginate(-1)}
            >
              <ChevronLeft size={24} />
            </button>
            <button
              className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black/40 backdrop-blur border border-white/20 flex items-center justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity hover:bg-black/70 z-20 text-white shadow-lg"
              onClick={() => paginate(1)}
            >
              <ChevronRight size={24} />
            </button>
            <div className="absolute bottom-6 left-0 right-0 flex justify-center space-x-2 z-10">
              {images.map((_: any, idx: number) => (
                <button
                  key={idx}
                  onClick={() => {
                    setDirection(idx > currentIdx ? 1 : -1);
                    setCurrentIdx(idx);
                  }}
                  className={`h-1.5 rounded-full transition-all ${idx === currentIdx ? 'bg-white w-6' : 'bg-white/30 w-1.5 hover:bg-white/60'}`}
                />
              ))}
            </div>
          </>
        )}
      </div>
      <div className="text-center opacity-100 md:opacity-0 group-hover/item:opacity-100 transition-all duration-700 md:translate-y-4 group-hover/item:translate-y-0">
        <h3 className="text-[14px] uppercase tracking-[0.4em] font-medium mb-4">{bride.name}</h3>
        {bride.weddingDate && (
          <p className="text-xs tracking-widest uppercase opacity-40 mb-4">{bride.weddingDate}</p>
        )}
        <p className="text-sm md:text-lg font-light italic opacity-60 max-w-sm mx-auto leading-relaxed mb-4">
          "{bride.story}"
        </p>
        {bride.description && (
          <p className="text-xs md:text-sm font-light opacity-50 max-w-md mx-auto leading-relaxed">
            {bride.description}
          </p>
        )}
      </div>

      <AnimatePresence>
        {showLightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-sm"
          >
            <button
              onClick={() => setShowLightbox(false)}
              className="absolute top-4 right-4 md:top-6 md:right-6 w-12 h-12 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors z-[100] text-white"
            >
              <X size={24} />
            </button>
            <div className="relative w-full h-full flex items-center justify-center p-4 md:p-12">
              <img
                src={getOptimizedUrl(images[currentIdx])}
                alt={bride.name}
                loading="lazy"
                referrerPolicy="no-referrer"
                width={1200}
                height={1600}
                className="max-w-full max-h-full object-contain"
              />
              
              {images.length > 1 && (
                <>
                  <button
                    className="absolute left-4 md:left-12 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-black/50 border border-white/20 flex items-center justify-center hover:bg-black/80 transition-colors z-20 text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      paginate(-1);
                    }}
                  >
                    <ChevronLeft size={32} />
                  </button>
                  <button
                    className="absolute right-4 md:right-12 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-black/50 border border-white/20 flex items-center justify-center hover:bg-black/80 transition-colors z-20 text-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      paginate(1);
                    }}
                  >
                    <ChevronRight size={32} />
                  </button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function BridesShowcase({ onInquiry, onGoHome }: { onInquiry?: () => void, onGoHome?: () => void }) {
  console.log("Rendering BridesShowcase");
  const { content } = useContent();
  const gallery = content.brideGallery || [];
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);

  return (
    <div className="w-full h-full flex flex-col items-center justify-start px-4 sm:px-6 md:px-28 overflow-y-auto custom-scrollbar">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Service",
        "name": "Kirthi Brides - Bespoke Bridal Diamond Jewellery",
        "description": "Fully bespoke bridal diamond jewellery crafted to commission by Kirthi Diamonds. bespoke consultations at Kochi and Calicut boutiques. GIA and IGI certified diamonds, BIS hallmarked gold, lifetime exchange policy.",
        "provider": {
          "@type": "JewelryStore",
          "@id": "https://kirthidiamonds.com/#organization",
          "name": "Kirthi Diamonds"
        },
        "serviceType": "Bespoke Bridal Jewellery",
        "areaServed": {
          "@type": "State",
          "name": "Kerala"
        },
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Bridal Jewellery Collections",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Product",
                "name": "Diamond Engagement Rings",
                "image": "/logo.png",
                "description": "Custom diamond engagement rings with GIA and IGI certified stones, crafted to commission at Kirthi Diamonds Kochi and Calicut.",
                "sku": "KD-ENG-RING",
                "mpn": "KD-ENG-RING",
                "brand": { "@type": "Brand", "name": "Kirthi Diamonds" },
                "offers": {
                  "@type": "AggregateOffer",
                  "priceCurrency": "INR",
                  "lowPrice": 75000,
                  "highPrice": 3000000,
                  "offerCount": 40,
                  "priceValidUntil": "2027-12-31",
                  "availability": "https://schema.org/InStock",
                  "itemCondition": "https://schema.org/NewCondition"
                },
                
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Product",
                "name": "Bridal Diamond Sets",
                "image": "/logo.png",
                "description": "Complete bespoke bridal diamond jewellery sets including necklace, earrings, and bangles. Kerala traditional and contemporary designs available.",
                "sku": "KD-BRIDAL-SET",
                "mpn": "KD-BRIDAL-SET",
                "brand": { "@type": "Brand", "name": "Kirthi Diamonds" },
                "offers": {
                  "@type": "AggregateOffer",
                  "priceCurrency": "INR",
                  "lowPrice": 300000,
                  "highPrice": 15000000,
                  "offerCount": 60,
                  "priceValidUntil": "2027-12-31",
                  "availability": "https://schema.org/InStock",
                  "itemCondition": "https://schema.org/NewCondition"
                },
                
              }
            },
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Product",
                "name": "Polki and Uncut Diamond Bridal Jewellery",
                "image": "/logo.png",
                "description": "Traditional Polki and uncut diamond bridal sets crafted to commission for Kerala weddings.",
                "sku": "KD-POLKI-SET",
                "mpn": "KD-POLKI-SET",
                "brand": { "@type": "Brand", "name": "Kirthi Diamonds" },
                "offers": {
                  "@type": "AggregateOffer",
                  "priceCurrency": "INR",
                  "lowPrice": 250000,
                  "highPrice": 12000000,
                  "offerCount": 35,
                  "priceValidUntil": "2027-12-31",
                  "availability": "https://schema.org/InStock",
                  "itemCondition": "https://schema.org/NewCondition"
                },
                
              }
            }
          ]
        }
      }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Does Kirthi Diamonds make custom engagement rings?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes. Kirthi Diamonds specialises in fully bespoke engagement rings crafted to commission. Each ring begins with a bespoke consultation at our Kochi or Calicut boutique, where our designers work with you to create a ring that reflects your vision. All diamonds are GIA or IGI certified."
            }
          },
          {
            "@type": "Question",
            "name": "What bridal jewellery services does Kirthi Diamonds offer?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Kirthi Diamonds offers complete bespoke bridal jewellery services including engagement rings, necklace sets, earrings, bangles, and full bridal ensembles. We work across Kerala traditional designs, contemporary solitaire settings, Polki and uncut diamond sets, and fully custom high-jewellery commissions."
            }
          },
          {
            "@type": "Question",
            "name": "Are Kirthi Diamonds bridal sets certified?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes. Every diamond above 0.30 carats in a Kirthi bridal set is certified by GIA or IGI. All gold is BIS hallmarked in 18K or 22K. Every piece is backed by a lifetime buyback and exchange policy."
            }
          },
          {
            "@type": "Question",
            "name": "How do I book a bridal consultation at Kirthi Diamonds?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Kirthi Diamonds offers bespoke consultations at our boutiques in Kochi and Calicut, Kerala. Appointments can be arranged directly through our boutiques for a personalised bridal jewellery experience."
            }
          }
        ]
      }) }} />
      <div className="max-w-6xl w-full pt-[140px] md:pt-[200px] pb-32 md:pb-48">
        <div className="text-center mb-24">
          <h4 className="text-xs md:text-[10px] uppercase tracking-[0.5em] text-[#D4AF37] mb-4">Bespoke Bridal Jewellery & Diamond Masterpieces</h4>
          <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif italic mb-8">Bridal Stories: Celebrating Unique Love Stories with Kirthi Diamonds</h2>
          <div className="max-w-4xl mx-auto space-y-6 text-sm md:text-base font-light leading-relaxed opacity-85 text-justify">
            <p>
              At Kirthi Diamonds, we believe that bridal jewellery should be as unique as the love story it represents. Our dedicated bridal service is built entirely upon a foundation of low-volume, highly personalized commissions. Rather than presenting brides with mass-manufactured, generic designs, we welcome families into our private consultation rooms in Kochi and Calicut for a slow-paced, collaborative experience. Here, our designers work hand-in-hand with the bride to sketch and render a custom-tailored ensemble—spanning from the center engagement ring to the complete necklace and bangle set—ensuring every piece harmonizes beautifully with her bridal attire and personal style.
            </p>
            <p>
              This deliberate low-volume approach is vital to achieving a perfect, durable setting outcome for bridal jewellery, which is designed to be worn and cherished for a lifetime. Commercial bridal sets are often cast using standard molds that force pre-selected diamonds into rigid claw positions. This cookie-cutter method creates micro-stress points in the metal and frequently leads to loose stones or compromised brilliance. At Kirthi, every bridal mounting is hand-forged and custom-sculpted around the exact contours and proportions of its certified GIA or IGI diamond. Our master setters spend hours under high magnification precisely placing and adjusting each individual claw. This painstaking technique ensures the diamonds sit securely with balanced tension while opening the stone to maximum ambient light, releasing the ultimate fire, brilliance, and scintillation.
            </p>
            <p>
              Whether crafting traditional Kerala-inspired masterpieces, modern solitaire rings, or intricate Polki and uncut diamond sets, we commit to absolute material transparency. Every diamond above 0.30 carats features its own independent laboratory certificate, and every gram of gold is BIS-hallmarked for absolute purity. Backed by our lifetime buyback and exchange policy, a Kirthi bridal commission is not just a stunning accessory for a single day, but a structurally perfect generational heirloom designed to be passed down with pride.
            </p>
          </div>
          <p className="max-w-2xl mx-auto text-sm md:text-base font-light leading-relaxed italic opacity-50 mt-10">
            A tribute to the exceptional stories and masterpieces created for our patrons' most precious moments.
          </p>
        </div>

        {gallery.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-full py-20 flex flex-col items-center justify-center text-center space-y-12 min-h-[40vh]"
          >
            <div className="relative">
              <div className="w-24 h-24 border border-[#D4AF37]/20 rounded-full animate-pulse flex items-center justify-center">
                <div className="w-12 h-12 rotate-45 border border-[#D4AF37]/40" />
              </div>
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(212,175,55,0.1),transparent)] blur-xl" />
            </div>
            
            <div className="space-y-6 max-w-3xl px-6">
              <h3 className="text-2xl md:text-4xl lg:text-5xl font-serif italic text-white/90">Exclusive Custom Diamond Creations for Your Most Special Moments</h3>
              <div className="h-px w-24 bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent mx-auto" />
              <p className="text-sm md:text-[11px] md:text-[13px] uppercase tracking-[0.3em] md:tracking-[0.4em] text-white/40 leading-loose mx-auto">
                Our digital atelier is currently preparing its next selection of patron stories.
                <br /><br />
                We will soon unveil our exclusive showcase—a tribute to the exceptional stories and masterpieces created for our patrons' most precious moments. We cordially invite you to return shortly.
              </p>
            </div>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
            {gallery.map((bride: any) => (
              <BrideCard key={bride.id} bride={bride} />
            ))}
          </div>
        )}

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="mt-32 text-center py-20 border-t border-white/5 pb-32"
        >
          <button
            onClick={() => setIsSubmitModalOpen(true)}
            className="mb-12 px-8 py-4 border border-[#D4AF37]/50 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-colors text-xs md:text-[10px] uppercase tracking-[0.3em]"
          >
            Submit Your Story
          </button>
          <h4 className="text-xs md:text-[10px] uppercase tracking-[0.5em] opacity-40 mb-12 block">Every Diamond Is A Promise</h4>
        </motion.div>
      </div>

      <SharedFooter />
      <BridalSubmissionModal isOpen={isSubmitModalOpen} onClose={() => setIsSubmitModalOpen(false)} />
    </div>
  );
}
