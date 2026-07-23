import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MapPin, Users, Award, ShieldCheck, Mail, Phone, X } from 'lucide-react';
import { useContent } from '../contexts/ContentContext';
import { FastImage } from './FastImage';
import { SharedFooter } from './SharedFooter';

export default function MaisonView({ onInquiry, onGoHome }: { onInquiry?: () => void, onGoHome?: () => void }) {
  const { content } = useContent();
  const [showManifesto, setShowManifesto] = useState(false);
  
  const stats = [
    { label: 'Founded', value: '2006 (Heritage since 1975)', icon: Award },
    { label: 'Master Artisans', value: '50', icon: Users },
    { label: 'Exclusive Boutiques', value: '2', icon: MapPin },
    { label: 'Ethical Standards', value: '100%', icon: ShieldCheck },
  ];

  return (
    <div className="w-full h-full flex flex-col items-center justify-start px-8 md:px-28 overflow-y-auto custom-scrollbar">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "JewelryStore",
        "@id": "https://kirthidiamonds.com/#organization",
        "name": "Kirthi Diamonds",
        "alternateName": "Kirthi Diamond Jewellery",
        "url": "https://kirthidiamonds.com",
        "foundingDate": "2006",
        "description": "Bespoke diamond jewellery house in Kochi and Calicut, Kerala. GIA and IGI certified diamonds, BIS hallmarked 18K and 22K gold, custom bridal commissions, and a lifetime exchange policy. Rooted in a family diamond trade since 1975.",
        "hasOfferCatalog": {
          "@type": "OfferCatalog",
          "name": "Kirthi Diamonds Collections",
          "itemListElement": [
            {
              "@type": "Offer",
              "itemOffered": {
                "@type": "Product",
                "name": "Bespoke Diamond Jewellery",
                "image": "/logo.png",
                "description": "Custom-designed diamond jewellery with GIA and IGI certified stones, set in BIS hallmarked 18K and 22K gold.",
                "sku": "KD-BESPOKE-JW",
                "mpn": "KD-BESPOKE-JW",
                "brand": { "@type": "Brand", "name": "Kirthi Diamonds" },
                "material": "GIA/IGI certified diamonds, 18K gold, 22K gold",
                 "offers": {
                  "@type": "AggregateOffer",
                  "priceCurrency": "INR",
                  "lowPrice": 50000,
                  "highPrice": 5000000,
                  "offerCount": 120,
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
                "name": "Bridal Diamond Jewellery",
                "image": "/logo.png",
                "description": "Bespoke bridal diamond sets crafted to commission with bespoke consultation service.",
                "sku": "KD-BRIDAL-JW",
                "mpn": "KD-BRIDAL-JW",
                "brand": { "@type": "Brand", "name": "Kirthi Diamonds" },
                "offers": {
                  "@type": "AggregateOffer",
                  "priceCurrency": "INR",
                  "lowPrice": 150000,
                  "highPrice": 10000000,
                  "offerCount": 80,
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
                "name": "High Jewellery Commissions",
                "image": "/logo.png",
                "description": "One-of-a-kind high-jewellery bespoke acquisitions crafted by master artisans.",
                "sku": "KD-HIGH-JW",
                "mpn": "KD-HIGH-JW",
                "brand": { "@type": "Brand", "name": "Kirthi Diamonds" },
                "offers": {
                  "@type": "AggregateOffer",
                  "priceCurrency": "INR",
                  "lowPrice": 500000,
                  "highPrice": 50000000,
                  "offerCount": 30,
                  "priceValidUntil": "2027-12-31",
                  "availability": "https://schema.org/InStock",
                  "itemCondition": "https://schema.org/NewCondition"
                },
                
              }
            }
          ]
        },
        "location": [
          {
            "@type": "JewelryStore",
            "@id": "https://kirthidiamonds.com/#kochi",
            "name": "Kirthi Diamonds Kochi",
            "url": "https://kirthidiamonds.com/kochi",
            "telephone": "+91 98470 86990",
            "priceRange": "$$$$",
            "image": "/logo.png",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "34/572, By Pass Road, Palarivattom",
              "addressLocality": "Kochi",
              "addressRegion": "Kerala",
              "postalCode": "682024",
              "addressCountry": "IN"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": 10.006514026736081,
              "longitude": 76.31314780185147
            },
            "openingHoursSpecification": [
              {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                "opens": "10:00",
                "closes": "20:00"
              }
            ],
            "parentOrganization": {
              "@id": "https://kirthidiamonds.com/#organization"
            },
            
            
          },
          {
            "@type": "JewelryStore",
            "@id": "https://kirthidiamonds.com/#calicut",
            "name": "Kirthi Diamonds Calicut",
            "url": "https://kirthidiamonds.com/calicut",
            "telephone": "+91 98470 86002",
            "priceRange": "$$$$",
            "image": "/logo.png",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "61/11508A, opposite Federal Bank, Puthiyara",
              "addressLocality": "Calicut",
              "addressRegion": "Kerala",
              "postalCode": "673004",
              "addressCountry": "IN"
            },
            "geo": {
              "@type": "GeoCoordinates",
              "latitude": 11.255769028405163,
              "longitude": 75.78914260997904
            },
            "openingHoursSpecification": [
              {
                "@type": "OpeningHoursSpecification",
                "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                "opens": "10:00",
                "closes": "20:00"
              }
            ],
            "parentOrganization": {
              "@id": "https://kirthidiamonds.com/#organization"
            },
            
            
          }
        ],
        "areaServed": {
          "@type": "State",
          "name": "Kerala"
        }
      }) }} />
      <div className="max-w-6xl w-full pt-[140px] md:pt-[200px] pb-32 md:pb-48">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-20 items-start mb-32"
        >
          <div className="space-y-8">
            <div className="space-y-6 md:space-y-4">
              <h4 className="text-xs md:text-[10px] uppercase tracking-[0.5em] text-[#D4AF37]">The Maison</h4>
              <h2 className="text-4xl md:text-7xl font-serif italic mb-8">A Legacy of Brilliance</h2>
            </div>
            <div className="w-20 h-px bg-[#D4AF37]"></div>
            <div className="space-y-6 text-lg font-light leading-relaxed opacity-70 italic">
              {content.maisonDetails ? (
                 <p className="whitespace-pre-wrap">{content.maisonDetails}</p>
              ) : (
                <>
                  <p className="text-sm md:text-base tracking-wide leading-relaxed font-light text-justify opacity-80 not-italic">
                    Established in 2006 and built upon a family heritage in the diamond trade since 1975, Kirthi Diamonds operates as a premier boutique house dedicated to the preservation of high jewellery as an art form. From our main design atelier to our exclusive boutiques in Kochi and Calicut, we reject the commercialized, high-throughput model of modern retailing in favor of deliberate, low-volume, artisanal craftsmanship. We believe that true luxury cannot be mass-produced; it requires time, intimacy, and an uncompromising focus on singular creations.
                  </p>
                  <p className="text-sm md:text-base tracking-wide leading-relaxed font-light text-justify opacity-80 not-italic">
                    By maintaining a strict limit on our monthly workshop output, we ensure that every creation receives the undivided attention of our master bench jewellers, who possess decades of specialized experience. This low-volume philosophy directly influences the setting outcomes of our jewellery. Rather than using automated assembly lines, our artisans hand-pull platinum wires and individually forge 18kt and 22kt gold mounts to fit the precise, unique physical characteristics of each certified diamond. This bespoke tailoring prevents the microscopic misalignments common in mass-produced items, resulting in settings that are not only remarkably durable but also designed to optimize light transmission. Our diamonds sit perfectly secure, catching and refracting light from every angle with maximum brilliance.
                  </p>
                  <p className="text-sm md:text-base tracking-wide leading-relaxed font-light text-justify opacity-80 not-italic">
                    Our relationship with our patrons is equally personal. We operate primarily by appointment, offering a slow-paced, advisory-led environment where clients collaborate directly with diamond specialists and designers. Every piece created under our roof is thoroughly documented and registered in our permanent archive, securing its provenance and ensuring it remains a cherished heirloom for generations. Through our transparent sourcing, independent GIA/IGI certification, and legendary lifetime buyback policy, Kirthi Diamonds stands as a sanctuary of trust and artistic integrity in the world of luxury jewellery.
                  </p>
                </>
              )}
            </div>
            
            <div className="mt-12 pt-8 border-t border-white/5 space-y-6">
              <h3 className="text-2xl font-serif italic text-[#D4AF37]">Why Shop at Kirthi</h3>
              <p className="text-sm font-light opacity-70 leading-relaxed">
                Kirthi Diamonds is a bespoke diamond house est. 2006, rooted in a family diamond trade since 1975. We differ from volume retailers in five concrete ways:
              </p>
              <ul className="space-y-4 text-sm font-light opacity-70 leading-relaxed list-none">
                <li className="flex items-start"><span className="text-[#D4AF37] mr-3 mt-1">•</span><span><strong>Individually certified diamonds.</strong> Every stone above 0.30 carats has its own GIA or IGI report — never graded to a range.</span></li>
                <li className="flex items-start"><span className="text-[#D4AF37] mr-3 mt-1">•</span><span><strong>Master artisanal craftsmanship.</strong> Each piece is hand-finished by a bench jeweller with 15+ years at our workshop.</span></li>
                <li className="flex items-start"><span className="text-[#D4AF37] mr-3 mt-1">•</span><span><strong>Lifetime buyback and exchange.</strong> Written on the invoice, honoured at both boutiques, for the life of the piece.</span></li>
                <li className="flex items-start"><span className="text-[#D4AF37] mr-3 mt-1">•</span><span><strong>Direct sourcing.</strong> We source loose diamonds directly from Antwerp, Surat and Mumbai cutting centres — bypassing the wholesale layer that adds margin at chain stores.</span></li>
                <li className="flex items-start"><span className="text-[#D4AF37] mr-3 mt-1">•</span><span><strong>Diamond Specialist experience.</strong> by-appointment boutique visits, dedicated consultant, no high-street showroom pressure.</span></li>
              </ul>
            </div>
            

          </div>
          <div className="relative aspect-square">
            <FastImage 
              src={content.maisonImage || undefined} 
              alt="Maison Workshop" 
              initial={{ filter: "grayscale(100%) brightness(0.75)" }}
              whileInView={{ filter: "grayscale(0%) brightness(1)" }}
              viewport={{ amount: 0.5, once: false }}
              transition={{ duration: 1.5 }}
              className="w-full h-full object-cover rounded-sm shadow-2xl transition-all duration-[2000ms]"
            />
            <div className="absolute -bottom-6 -right-6 w-48 h-48 border border-[#D4AF37]/20 p-8 bg-[#050505] hidden md:block">
              <span className="text-xs md:text-[10px] uppercase tracking-[0.4em] opacity-40 block mb-2">Heritage</span>
              <span className="text-3xl font-serif italic">Est. 2006</span>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-24">
          {stats.map((stat, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="p-8 border border-white/5 bg-white/[0.01] text-center space-y-6 md:space-y-4"
            >
              <stat.icon className="mx-auto text-[#D4AF37] opacity-40" size={24} />
              <div>
                <div className="text-3xl font-serif italic mb-1">{stat.value}</div>
                <div className="text-xs md:text-[10px] uppercase tracking-[0.3em] opacity-40">{stat.label}</div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto space-y-8 mb-32 border border-[#D4AF37]/20 p-8 md:p-16 bg-[#0A0A0A]"
        >
          <div className="text-center space-y-4 mb-12">
            <h4 className="text-xs md:text-[10px] uppercase tracking-[0.5em] text-[#D4AF37]">Guided Experience</h4>
            <h3 className="text-3xl md:text-4xl font-serif italic text-white">What to Expect — The Kirthi Boutique Experience</h3>
            <div className="w-16 h-px bg-[#D4AF37] mx-auto mt-6"></div>
          </div>
          
          <p className="text-sm md:text-base font-light opacity-70 leading-relaxed text-center mb-12 max-w-2xl mx-auto">
            Visiting Kirthi is intentionally unhurried. A typical first-time visit runs:
          </p>

          <div className="space-y-8">
            {[
              { title: "Welcome and consultation", desc: "Your Diamond Specialist understands what you're looking for, whether it's an engagement ring, bridal commission, or investment-grade stone." },
              { title: "one-on-one consultation room", desc: "Pieces are brought to you, not displayed under counter glass. You handle, try on, and inspect under loupe." },
              { title: "Certificate verification", desc: <>Every diamond's report number is verified live directly on <a href="https://www.gia.edu" target="_blank" rel="noopener noreferrer" className="text-[#D4AF37] hover:underline">gia.edu</a> or <a href="https://www.igi.org" target="_blank" rel="noopener noreferrer" className="text-[#D4AF37] hover:underline">igi.org</a>, in front of you.</> },
              { title: "Transparent pricing", desc: "Stone cost, gold weight, making charge and policy are itemised separately on the invoice." },
              { title: "No-pressure decision", desc: "There is no obligation to buy on the day. We hold pieces for return visits with family." }
            ].map((step, idx) => (
              <div key={idx} className="flex items-start space-x-6">
                <div className="text-2xl font-serif italic text-[#D4AF37] opacity-60 mt-1">0{idx + 1}</div>
                <div>
                  <h4 className="text-lg font-serif italic mb-2">{step.title}</h4>
                  <p className="text-sm font-light opacity-70 leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <p className="text-sm font-light opacity-70 leading-relaxed text-center italic mt-12 bg-[#D4AF37]/5 p-6 border border-[#D4AF37]/10">
            For bespoke commissions and bridal sets, we recommend a by-appointment boutique visit booked at least a week in advance.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          className="text-center space-y-12 py-20 border-t border-white/5 pb-32"
        >
          <div className="max-w-2xl mx-auto space-y-6">
            <h3 className="text-2xl font-serif italic">Our Ethical Commitment</h3>
            <p className="text-sm font-light opacity-50 italic leading-relaxed">
              Kirthi Diamonds is a signatory of the Kimberley Process and a leader in the movement for sustainable luxury. We ensure that 100% of our materials are sourced from mines that prioritize geological preservation and community upliftment.
            </p>
          </div>
          <button 
            onClick={() => setShowManifesto(true)}
            className="px-6 md:px-12 py-5 border border-[#D4AF37]/30 text-xs md:text-[10px] uppercase tracking-[0.4em] hover:bg-[#D4AF37] hover:text-black transition-all"
          >
            Read Corporate Manifesto
          </button>
        </motion.div>


      </div>

      <AnimatePresence>
        {showManifesto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center p-4 md:p-12"
          >
            <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={() => setShowManifesto(false)} />
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              className="relative w-full max-w-4xl bg-[#080808] border border-white/10 p-6 pt-12 md:p-20 shadow-2xl z-10 flex flex-col max-h-full"
            >
              <button 
                onClick={() => setShowManifesto(false)}
                className="absolute top-4 right-4 md:top-8 md:right-8 text-white/40 hover:text-white transition-colors z-[100] p-2 bg-[#080808] rounded-full"
              >
                <X size={24} />
              </button>
              
              <div className="absolute top-6 left-6 md:top-8 md:left-8 z-20">
                <div className="flex items-center space-x-2 text-[10px] md:text-xs uppercase tracking-[0.2em] opacity-40 hover:opacity-100 transition-all mb-8">
                  <span onClick={() => setShowManifesto(false)} className="cursor-pointer hover:text-[#D4AF37]">← Back</span>
                  <span>/</span>
                  <span className="text-[#D4AF37]">Manifesto</span>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar pr-4 mt-16 md:mt-0">
                <div className="space-y-12">
                  <div className="text-center space-y-6 md:space-y-4">
                     <h4 className="text-xs md:text-[10px] uppercase tracking-[0.5em] text-[#D4AF37]">Official Declaration</h4>
                     <h2 className="text-3xl md:text-5xl lg:text-6xl font-serif italic mb-8">Corporate Manifesto</h2>
                     <div className="w-16 h-px bg-[#D4AF37] mx-auto"></div>
                  </div>

                  <div className="space-y-8 text-sm md:text-base font-light opacity-80 leading-relaxed max-w-3xl mx-auto">
                    <p className="italic text-lg text-white/90 text-center">
                      "To capture the ephemeral beauty of light through the absolute precision of geological science and artisanal mastery."
                    </p>
                    
                    <div className="space-y-6 pt-4">
                      <h3 className="text-lg font-serif italic text-[#D4AF37]">I. Our Founding Principle</h3>
                      <p>
                        A bespoke diamond house est. 2006, rooted in a family diamond trade since 1975, Kirthi Diamonds was born from a profound respect for Earth's most enduring treasures. We do not merely sell jewellery; we curate modern history. 
                      </p>

                      <h3 className="text-lg font-serif italic text-[#D4AF37]">II. The Mastery of Craft</h3>
                      <p>
                        We believe that true luxury lies in the unseen details. It is the marriage of ancestral goldsmithing techniques with modern precision engineering. Every facet polished and every prong set is a dedication to our standard of perfection. We refuse the ordinary, creating pieces that stand the test of time, designed to be passed down through generations.
                      </p>

                      <h3 className="text-lg font-serif italic text-[#D4AF37]">III. Ethical & Sustainable Luxury</h3>
                      <p>
                        We recognize that brilliance must not come at the cost of humanity or the environment. Kirthi Diamonds stands firmly as a signatory of the Kimberley Process. Our ethical commitment ensures that 100% of our diamonds are conflict-free. 
                      </p>
                      <p>
                        Furthermore, we are dedicated to sustainable luxury. We selectively partner with sourcing entities that prioritize geological preservation, minimizing environmental impact while actively engaging in the community upliftment of mining regions.
                      </p>

                      <h3 className="text-lg font-serif italic text-[#D4AF37]">IV. Customer as Curator</h3>
                      <p>
                        Our patrons are not merely clients; they are curators of their own legacies. We promise transparency, unparalleled bespoke services, and a relationship built on the absolute integrity of our word and our craft.
                      </p>
                    </div>
                    
                    <div className="pt-12 text-center pb-8 border-t border-white/5 mt-12 mb-24">
                       <span className="text-2xl font-serif italic text-[#D4AF37]">Kirthi Diamonds</span>
                       <span className="block mt-2 text-xs md:text-[10px] uppercase tracking-[0.4em] opacity-40">Since 2006</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <SharedFooter />
    </div>
  );
}
