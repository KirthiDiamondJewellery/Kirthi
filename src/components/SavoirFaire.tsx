import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useContent } from '../contexts/ContentContext';
import { FastImage } from './FastImage';
import { VideoFacade } from './VideoFacade';
import { SharedFooter } from './SharedFooter';

export default function SavoirFaire({ onInquiry, onGoHome }: { onInquiry?: () => void, onGoHome?: () => void }) {
  const { content } = useContent();
  const steps = content.methodologySteps || [];
      
  const pageVideo = content.pageVideos?.find(v => v.id === 'methodology');
  const videoUrl = content.methodologyVideoUrl || 'https://youtu.be/cGrZrg3_BQw';
  const videoIdMatch = videoUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/i);
  const videoIdStr = videoIdMatch ? videoIdMatch[1] : "cGrZrg3_BQw";
  
  const [expandedStep, setExpandedStep] = useState<string | null>(null);


  const toggleExpand = (id: string, index: number) => {
    const key = id || String(index);
    setExpandedStep(prev => prev === key ? null : key);
  };
  
  return (
    <div className="w-full h-full flex flex-col items-center justify-start overflow-y-auto custom-scrollbar relative">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([
      {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": "Methodology & Craftsmanship | Kirthi Diamonds",
        "description": "The journey from rough diamond to finished high-jewellery masterpiece at Kirthi Diamonds, involving geological intelligence, artisanal crafting, and precision setting.",
        "url": "https://kirthidiamonds.com/methodology"
      },
      {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": "The Kirthi Diamonds Methodology",
        "description": "Our rigorous progression that marries geological intelligence with generational hand-craftsmanship to create bespoke high-jewellery masterpieces.",
        "step": [
          {
            "@type": "HowToStep",
            "name": "Stone Selection",
            "text": "Every diamond is hand-selected against its individual GIA or IGI certificate."
          },
          {
            "@type": "HowToStep",
            "name": "Design Adaptation",
            "text": "Designs are adapted to the exact dimensions and proportions of the specific stone."
          },
          {
            "@type": "HowToStep",
            "name": "Hand Fabrication",
            "text": "The foundation is built using hand-finished wax and precision casting or from sheet and drawn wire."
          },
          {
            "@type": "HowToStep",
            "name": "Master Setting",
            "text": "The master setter mounts the stone under loupe magnification with individually cut prongs."
          },
          {
            "@type": "HowToStep",
            "name": "Polish & Presentation",
            "text": "Final polish and rigorous quality control inspection before presentation."
          }
        ]
      },
      ...(videoUrl ? [{
        "@context": "https://schema.org",
        "@type": "VideoObject",
        "name": pageVideo?.title || "Kirthi Diamonds Methodology",
        "description": pageVideo?.description || "The proprietary crafting methodology used by Kirthi Diamonds.",
        "thumbnailUrl": videoIdStr ? `https://img.youtube.com/vi/${videoIdStr}/maxresdefault.jpg` : "",
        "uploadDate": pageVideo?.uploadDate || "2024-01-01T08:00:00+08:00",
        "duration": pageVideo?.duration || "PT5M",
        "embedUrl": videoIdStr ? `https://www.youtube-nocookie.com/embed/${videoIdStr}` : ""
      }] : [])
    ]) }} />
      

      <div className={`relative z-20 w-full flex flex-col items-center ${videoUrl ? '' : 'bg-[#050505]'}`}>
        {videoUrl && (
          <section className="relative w-full min-h-[90vh] flex flex-col justify-center items-center px-6 md:px-28 shrink-0">
            <div className="relative z-20 w-full max-w-7xl pt-[20vh] pb-16">
              <div className="text-center max-w-4xl mx-auto px-4 mt-8 md:mt-16">
                <h4 className="text-xs md:text-[10px] uppercase tracking-[0.5em] text-[#D4AF37] mb-8 drop-shadow-2xl font-semibold">Our Craftsmanship Process</h4>
                <h1 className="text-5xl md:text-7xl lg:text-[100px] font-serif italic text-white drop-shadow-2xl leading-none">Kirthi Diamonds Methodology: From Concept to Masterpiece</h1>
                <div className="h-px w-32 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mt-16 mb-12 opacity-80" />
                <p className="text-sm md:text-base tracking-[0.15em] text-white/90 leading-[2.2] drop-shadow-xl max-w-4xl mx-auto font-light mb-6 text-justify">
                  The journey from a rough diamond to a finished high-jewellery masterpiece at Kirthi Diamonds is a rigorous progression that marries geological intelligence with generational hand-craftsmanship. This legacy of excellence dates back to 1975, when our grandfather established the first diamond cutting factory of its kind in South India, located in Irinjalakuda, Kerala. From this pioneering facility, our masterfully cut stones reached clients globally, from Japan to the United States. Today, we continue this tradition by selecting only the upper-echelon of rough gems—prioritizing those with exceptional lattice purity, Internally Flawless to VVS1 clarity, and colourless grades (E/F on the GIA scale). Once ethically sourced through audited channels adhering strictly to the Kimberley Process, each gem undergoes a meticulous transformation in our dedicated workshops.
                </p>
                <p className="text-sm md:text-base tracking-[0.15em] text-white/90 leading-[2.2] drop-shadow-xl max-w-4xl mx-auto font-light text-justify">
                  Our process is defined by an uncompromising commitment to artisanal, low-volume production. Unlike mass-manufactured commercial jewellery that relies on rapid, high-volume automated casting and generic setting templates, we restrict our studio to a handful of bespoke creations per month. This deliberate low-volume approach is central to our setting quality. When gold or platinum is cast to hold diamonds, micro-variations in the stone's dimensions must be accounted for on a sub-millimetre level. In commercial factories, stones are pressed into pre-moulded settings, creating micro-tensions that compromise structural integrity and limit the diamond's light refraction. At Kirthi, our bench jewellers dedicate dozens of hours to a single setting, hand-drawing wire and hand-carving the metal around the specific proportions of each unique stone. Master setters secure each diamond under high-magnification microscopes using manual claw techniques, ensuring perfect, non-destructive pressure and exposing the maximum possible surface area to ambient light. The result is a structurally flawless setting with unmatched fire, brilliance, and lifetime durability.
                </p>
                <div className="mt-16 w-full">
                   <VideoFacade videoId={videoIdStr} title="Kirthi Diamonds Methodology" />
                </div>
              </div>
            </div>
          </section>
        )}
        
        {/* If no videoUrl, we use the alternative layout for the hero text */}
        {!videoUrl && (
          <div className="w-full max-w-7xl pt-[140px] md:pt-[200px] px-6 md:px-28 flex flex-col items-center">
            <div className="text-center mb-24 max-w-3xl mx-auto mt-16">
              <h4 className="text-xs md:text-[10px] uppercase tracking-[0.5em] text-[#D4AF37] mb-6">Our Craftsmanship Process</h4>
              <h2 className="text-3xl md:text-5xl lg:text-7xl font-serif italic text-white/90">Kirthi Diamonds Methodology: From Concept to Masterpiece</h2>
              <div className="h-px w-24 bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent mx-auto mt-8 mb-8" />
              <p className="text-sm tracking-[0.15em] text-white/70 leading-relaxed mb-6 text-justify">
                The journey from a rough diamond to a finished high-jewellery masterpiece at Kirthi Diamonds is a rigorous progression that marries geological intelligence with generational hand-craftsmanship. This legacy of excellence dates back to 1975, when our grandfather established the first diamond cutting factory of its kind in South India, located in Irinjalakuda, Kerala. From this pioneering facility, our masterfully cut stones reached clients globally, from Japan to the United States. Today, we continue this tradition by selecting only the upper-echelon of rough gems—prioritizing those with exceptional lattice purity, Internally Flawless to VVS1 clarity, and colourless grades (E/F on the GIA scale). Once ethically sourced through audited channels adhering strictly to the Kimberley Process, each gem undergoes a meticulous transformation in our dedicated workshops.
              </p>
              <p className="text-sm tracking-[0.15em] text-white/70 leading-relaxed text-justify">
                Our process is defined by an uncompromising commitment to artisanal, low-volume production. Unlike mass-manufactured commercial jewellery that relies on rapid, high-volume automated casting and generic setting templates, we restrict our studio to a handful of bespoke creations per month. This deliberate low-volume approach is central to our setting quality. When gold or platinum is cast to hold diamonds, micro-variations in the stone's dimensions must be accounted for on a sub-millimetre level. In commercial factories, stones are pressed into pre-moulded settings, creating micro-tensions that compromise structural integrity and limit the diamond's light refraction. At Kirthi, our bench jewellers dedicate dozens of hours to a single setting, hand-drawing wire and hand-carving the metal around the specific proportions of each unique stone. Master setters secure each diamond under high-magnification microscopes using manual claw techniques, ensuring perfect, non-destructive pressure and exposing the maximum possible surface area to ambient light. The result is a structurally flawless setting with unmatched fire, brilliance, and lifetime durability.
              </p>
              <div className="mt-16 w-full">
                 <VideoFacade videoId={videoIdStr} title="Kirthi Diamonds Methodology" />
              </div>
            </div>
          </div>
        )}

      <div className="w-full max-w-7xl px-6 md:px-28 pt-24 pb-32">
        <div className="space-y-40">
          {steps.map((step: any, index: number) => {
            const stepId = step.id || String(index);
            const isExpanded = expandedStep === stepId;
            
            return (
              <motion.div 
                key={stepId}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.8 }}
                className={`flex flex-col ${index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'} items-start md:items-center gap-12 md:gap-24`}
              >
                <div className="w-full md:w-1/2">
                  {step.image ? (
                    <div className="aspect-[4/5] overflow-hidden bg-[#0A0A0A] relative group">
                      <FastImage 
                        src={step.image} 
                        alt={step.title}
                        className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-all duration-1000 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 border border-white/5 m-4 pointer-events-none" />
                    </div>
                  ) : (
                    <div className="aspect-[4/5] bg-[#0A0A0A] border border-white/10 flex items-center justify-center">
                      <span className="font-serif italic text-2xl text-white/20">Archive Image Pending</span>
                    </div>
                  )}
                </div>
                
                <div className="w-full md:w-1/2 ">
                  <span className="text-xs tracking-[0.3em] text-[#D4AF37]">PHASE {String(index + 1).padStart(2, '0')}</span>
                  <style>{`
                    .blog-content p {
                      margin-bottom: 0.5rem;
                      font-weight: 300;
                    }
                  `}</style>
                  <h3 className="text-2xl md:text-4xl font-serif text-white/90 mt-4 mb-2">{step.title}</h3>
                  {step.subtitle && (
                    <h4 className="text-lg md:text-xl font-serif italic text-[#D4AF37] opacity-90 mb-6">{step.subtitle}</h4>
                  )}
                  <div className="h-px w-12 bg-[#D4AF37]/30 mb-6" />
                  
                  <div className="text-sm tracking-wider text-white/60 leading-relaxed font-light mb-6">
                    {step.text || step.description}
                  </div>

                  {step.detail && (
                    <div>
                      <div className="text-sm tracking-widest text-white/40 font-light leading-loose pb-6 blog-content border-t border-white/10 pt-6 mt-4 whitespace-pre-wrap">
                              
                              {step.detail}
                            
                            </div>
                      
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
      </div>
      <SharedFooter />
    </div>
  );
}
