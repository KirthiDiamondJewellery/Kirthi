import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import { SharedFooter } from './SharedFooter';
import { updateSiteSEO } from '../utils/seo';
import { useIsMobile } from '../hooks/useIsMobile';
import { useContent } from '../contexts/ContentContext';
import { HeadlessVideoPlayer } from './HeadlessVideoPlayer';

export default function BespokeView({ onContact, onGoHome }: { onContact?: () => void, onGoHome?: () => void }) {
  const { content: siteContent } = useContent();
  const pageVideo = siteContent.pageVideos?.find(v => v.id === "bespoke");

  const isMobile = useIsMobile();
  const videoUrlToUse = (isMobile && pageVideo?.mobileVideoUrl) ? pageVideo.mobileVideoUrl : (pageVideo?.videoUrl || pageVideo?.youtubeUrl);

  useEffect(() => {
    updateSiteSEO({
      title: "Bespoke Diamond Commissions | Kirthi Diamonds",
      description: "Information on commissioning bespoke diamond and gold jewellery at Kirthi Diamonds Kochi and Calicut.",
      canonicalUrl: "https://kirthidiamonds.com/bespoke",
      type: "website",
      pathname: "/bespoke",
      blogPosts: [],
      sections: [],
      viewMode: "page",
      currentSection: { id: "bespoke" }
    });
  }, []);

  return (
    <div className="w-full min-h-screen bg-black text-white relative font-sans pt-[60px] flex flex-col">
      <main className="flex-1 w-full max-w-4xl mx-auto px-6 py-20 pb-32 space-y-16">
        
        <header className="space-y-6 text-center max-w-2xl mx-auto">
          <h1 className="text-3xl md:text-5xl font-serif text-[#D4AF37] leading-tight">Bespoke Commissions</h1>
          <p className="text-lg md:text-xl font-light opacity-80 leading-relaxed text-justify">
            A piece of jewellery should be as unique as the milestone it commemorates. At Kirthi Diamonds, bespoke commissions are at the heart of our practice. We collaborate directly with our clients to design and forge pieces that mass-production simply cannot replicate.
          </p>
        </header>

        <section className="space-y-6">
          <h2 className="text-2xl font-serif text-[#D4AF37]">The Consultation</h2>
          <p className="text-base font-light opacity-80 leading-relaxed text-justify">
            Every bespoke journey begins with a one-on-one consultation at our Kochi or Calicut boutique. During this session, we discuss your vision, preferred aesthetics, and structural requirements. This is an exploratory dialogue where our diamond specialists guide you through stone selection, explaining the precise nuances of GIA and IGI certified diamonds that fit your design.
          </p>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-serif text-[#D4AF37]">Design and Sketching</h2>
          <p className="text-base font-light opacity-80 leading-relaxed text-justify">
            Following the initial consultation, our designers translate your vision into precise technical sketches. These illustrations detail the exact proportions, stone placements, and structural mechanics of the setting. We do not proceed until the sketch perfectly aligns with your expectations.
          </p>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-serif text-[#D4AF37]">Sourcing and Selection</h2>
          <p className="text-base font-light opacity-80 leading-relaxed text-justify">
            We source the central diamonds specifically for your commission. Because we operate outside the commercial volume-retail model, we can source specific cuts, clarities, and colours directly from cutting centres. You are invited back to the boutique to inspect the loose stones under magnification and review their independent grading certificates before they are set.
          </p>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-serif text-[#D4AF37]">The Crafting Process</h2>
          <p className="text-base font-light opacity-80 leading-relaxed text-justify">
            Once the stones are approved, the piece moves to our bench jewellers. Depending on the design, the gold or platinum is hand-pulled and forged. The setting is carved specifically for the microscopic dimensions of your chosen diamonds, ensuring maximum structural integrity and light return. Every bespoke piece is BIS hallmarked to guarantee gold purity.
          </p>
        </section>

        <section className="space-y-6">
          <h2 className="text-2xl font-serif text-[#D4AF37]">Final Reveal and Archiving</h2>
          <p className="text-base font-light opacity-80 leading-relaxed text-justify">
            The finished piece undergoes a rigorous quality control inspection before being presented to you. At this stage, the piece is registered in the Kirthi Diamonds permanent archive, securing its provenance and establishing its eligibility for our lifetime buyback and exchange policy.
          </p>
        </section>

        
        {pageVideo && videoUrlToUse && (
          <section className="pt-8">
            <h2 className="text-2xl font-serif text-[#D4AF37] mb-6">Inside the Workshop</h2>
            <div className="w-full aspect-video border border-white/10 relative">
              <HeadlessVideoPlayer url={videoUrlToUse} brightnessClass="brightness-[0.8]" />
            </div>
          </section>
        )}
        <section className="pt-12 border-t border-white/10 space-y-8">

          <h2 className="text-2xl font-serif text-[#D4AF37]">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-serif text-white/90">How long does a bespoke commission take?</h3>
              <p className="text-base font-light opacity-80 leading-relaxed text-justify mt-2">
                Typically, a bespoke piece requires 3 to 6 weeks from the approval of the final sketch to completion. Complex high-jewellery commissions may require additional time.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-serif text-white/90">Do I need to pay a premium for bespoke design?</h3>
              <p className="text-base font-light opacity-80 leading-relaxed text-justify mt-2">
                No. Our bespoke pieces are priced based on the exact material cost—the certified diamonds and the gold weight—plus standard making charges. The design consultation itself is part of our standard service.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-serif text-white/90">Can you reset a diamond I already own?</h3>
              <p className="text-base font-light opacity-80 leading-relaxed text-justify mt-2">
                Yes. We frequently work with family heirlooms, resetting existing diamonds into modern, structurally secure settings while preserving the provenance of the stones.
              </p>
            </div>
          </div>
        </section>

        <div className="pt-12 text-center">
          <button 
            onClick={onContact}
            className="px-8 py-4 bg-[#D4AF37] text-black text-sm uppercase tracking-widest font-medium hover:bg-white transition-colors"
          >
            Arrange a Consultation
          </button>
        </div>
      </main>

      <SharedFooter />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(
        {
          "@context": "https://schema.org",
          "@type": "WebPage",
          "@id": "https://kirthidiamonds.com/bespoke",
          "url": "https://kirthidiamonds.com/bespoke",
          "name": "Bespoke Diamond Commissions | Kirthi Diamonds",
          "description": "Information on commissioning bespoke diamond and gold jewellery at Kirthi Diamonds Kochi and Calicut.",
          "isPartOf": { "@type": "WebSite", "url": "https://kirthidiamonds.com" }
        }
      )}} />
      
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(
        {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "How long does a bespoke commission take?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Typically, a bespoke piece requires 3 to 6 weeks from the approval of the final sketch to completion. Complex high-jewellery commissions may require additional time."
              }
            },
            {
              "@type": "Question",
              "name": "Do I need to pay a premium for bespoke design?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "No. Our bespoke pieces are priced based on the exact material cost—the certified diamonds and the gold weight—plus standard making charges. The design consultation itself is part of our standard service."
              }
            },
            {
              "@type": "Question",
              "name": "Can you reset a diamond I already own?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes. We frequently work with family heirlooms, resetting existing diamonds into modern, structurally secure settings while preserving the provenance of the stones."
              }
            }
          ]
        }
      )}} />
    </div>
  );
}
