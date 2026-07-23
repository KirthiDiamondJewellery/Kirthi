import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ChevronDown, Box, Clock, Gem } from 'lucide-react';
import { useContent } from '../contexts/ContentContext';
import { FastImage } from './FastImage';
import { HeritageItem } from '../constants';
import { SharedFooter } from './SharedFooter';

const HeritageItemCard = ({ item, isEven }: { item: HeritageItem, isEven: boolean }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 200;
  
  const shouldTruncate = item.description.length > maxLength;
  const displayText = isExpanded ? item.description : (shouldTruncate ? `${item.description.substring(0, maxLength).trim()}...` : item.description);

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center ${isEven ? '' : 'md:grid-flow-col-dense'}`}>
      <motion.div 
        initial={{ opacity: 0, x: isEven ? -30 : 30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        className={`space-y-6 ${!isEven ? 'md:col-start-2' : ''}`}
      >
        <div className="flex items-center space-x-4">
          <span className="text-[#D4AF37] font-serif italic text-2xl md:text-3xl">{item.year}</span>
          <div className="h-px bg-[#D4AF37]/30 flex-grow" />
        </div>
        <h3 className="text-3xl md:text-5xl font-serif leading-tight">{item.title}</h3>
        <div className="w-12 h-px bg-[#D4AF37]/50 my-6"></div>
        <div className="space-y-4">
          <p className="font-light opacity-70 leading-relaxed text-sm md:text-base whitespace-pre-line">
            {displayText}
          </p>
          {shouldTruncate && (
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-[#D4AF37] text-xs uppercase tracking-widest hover:text-white transition-colors"
            >
              {isExpanded ? 'Read Less' : 'Read More'}
            </button>
          )}
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        className={`aspect-[4/5] relative bg-white/5 border border-white/10 overflow-hidden group ${!isEven ? 'md:col-start-1' : ''}`}
      >
        {item.image ? (
            <FastImage
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-105"
            />
        ) : (
            <div className="w-full h-full flex flex-col justify-center items-center text-center p-8 bg-[#030303]">
                <Gem className="text-[#D4AF37] opacity-60 mb-6" size={32} />
                <span className="text-xs font-light text-white/30 uppercase tracking-widest">Archival Document</span>
            </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
      </motion.div>
    </div>
  );
};

export default function HeritageArchive({ onInquiry, onGoHome }: { onInquiry?: () => void, onGoHome?: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  const { content } = useContent();
  const heritageItems: HeritageItem[] = content.heritageItems || [];

  const titleY = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);

  return (
    <div ref={containerRef} className="w-full h-full overflow-y-auto custom-scrollbar relative">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute w-[800px] h-[800px] bg-[#D4AF37]/5 rounded-full blur-[120px] top-[-200px] -right-[200px]" />
      </div>

      <div className="max-w-6xl mx-auto px-8 md:px-28 pt-[140px] md:pt-[200px] pb-32 md:pb-48 relative z-10">
        <motion.div 
          style={{ y: titleY, opacity }}
          className="space-y-6 md:space-y-4 mb-32 md:mb-48 border-b border-white/10 pb-16"
        >
          <span className="text-xs md:text-[10px] uppercase tracking-[0.5em] text-[#D4AF37]">Archive</span>
          <h2 className="text-4xl md:text-7xl lg:text-[80px] font-serif italic mb-8">The Heritage</h2>
          <div className="max-w-4xl space-y-6 text-sm md:text-base font-light leading-relaxed opacity-75 mt-8 text-justify">
            <p>
              The heritage of Kirthi Diamonds is a story of dedication to the diamond trade, beginning with our family's foundational roots in loose diamond sourcing and distribution in 1975. For over three decades, we supplied some of the country's most prominent jewellery retailers, mastering the complex global supply chain from Antwerp and Surat before establishing our bespoke high-jewellery house in 2006. This deep-seated expertise in gemological grading and direct procurement became the cornerstone of Kirthi, enabling us to curate loose diamonds of exceptional purity and make them accessible directly to discerning collectors.
            </p>
            <p>
              Throughout our history, we have remained steadfast in our belief that high jewellery should be built on artisanal, low-volume craftsmanship. In an era dominated by rapid commercial fabrication, our heritage is preserved by master craftsmen who hand-finish every setting in our exclusive Kerala workshops. This traditional method allows us to achieve far superior setting outcomes than mass-production lines. A hand-carved setting is built slowly, letting the jeweller adapt the precious metal to the precise optical dimensions of the specific diamond. This eliminates micro-stresses within the gold or platinum, ensuring the claws hold the gemstone with absolute symmetry and security while allowing maximum light to penetrate the stone from all directions.
            </p>
            <p>
              Over the last twenty years, our archive has grown to include historic bridal commissions, bespoke heirloom restorations, and award-winning contemporary designs that celebrate the natural brilliance of conflict-free solitaires. Each milestone in our archive represents an unyielding commitment to BIS-hallmarked purity, GIA and IGI certified authenticity, and the preservation of Indian artisanal heritage. Our journey is not merely about marking time; it is about cementing a legacy of trust, precision, and timeless elegance, from our foundational roots in 1975 to our establishment as a bespoke Maison in 2006, and continuing to inspire into 2026 and beyond.
            </p>
          </div>
        </motion.div>

        <div className="space-y-32 md:space-y-48">
          {heritageItems.length > 0 ? (
            heritageItems.map((item, index) => {
              const isEven = index % 2 === 0;
              return (
                <HeritageItemCard key={item.id} item={item} isEven={isEven} />
              );
            })
          ) : (
            <div className="text-center py-24 text-white/40 font-light italic">
                Archives are currently being curated.
            </div>
          )}
        </div>

        <div className="mt-32 text-center border-t border-white/5 pt-16 flex flex-col items-center gap-8 mb-24">
           <button 
             onClick={onInquiry}
             className="px-8 py-4 border border-[#D4AF37]/30 text-xs md:text-[10px] uppercase tracking-[0.6em] hover:bg-[#D4AF37] hover:text-black transition-all"
           >
             Inquire About Bespoke
           </button>
           <button 
             onClick={onGoHome}
             className="text-[10px] uppercase tracking-[0.2em] text-white/40 hover:text-white transition-colors pb-1 border-b border-white/10 hover:border-white/50"
           >
             Return Home
           </button>
        </div>
      </div>
      <SharedFooter />
    </div>
  );
}
