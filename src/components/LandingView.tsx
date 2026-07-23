import React, { useRef } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
} from "motion/react";
import { ArrowRight, MapPin } from "lucide-react";
import { useContent } from "../contexts/ContentContext";
import { SharedFooter } from "./SharedFooter";

export default function LandingView({ onExplore, nextSectionId }: { onExplore: () => void, nextSectionId?: string }) {
  const { content } = useContent();
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    container: containerRef,
    offset: ["start start", "end end"],
  });

  const springScroll = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
  });

  // 3D Motion Elements
  const diamondY = useTransform(
    springScroll,
    [0, 0.5, 1],
    ["0%", "150%", "300%"],
  );
  const diamondRotate = useTransform(springScroll, [0, 1], [0, 360]);
  const heroOpacity = useTransform(springScroll, [0, 0.2], [1, 0]);
  const heroScale = useTransform(springScroll, [0, 0.2], [1, 0.8]);

  // 3D Tilt Effect for Hero
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [10, -10]), {
    stiffness: 100,
    damping: 30,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-10, 10]), {
    stiffness: 100,
    damping: 30,
  });

  function handleMouseMove(e: React.MouseEvent) {
    const x = e.clientX / window.innerWidth - 0.5;
    const y = e.clientY / window.innerHeight - 0.5;
    mouseX.set(x);
    mouseY.set(y);
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="w-full h-full relative overflow-y-auto overflow-x-hidden snap-y snap-mandatory custom-scrollbar"
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": "Diamond Jewellery Collection | Kirthi Diamonds",
        "description": "Bespoke diamond jewellery by Kirthi Diamonds, Kochi and Calicut. GIA and IGI certified diamonds, 18K and 22K BIS hallmarked gold, custom bridal and high-jewellery commissions. Est. 2006.",
        "url": "https://kirthidiamonds.com/projects/diamond-jewellery-",
        "provider": {
          "@type": "JewelryStore",
          "@id": "https://kirthidiamonds.com/#organization",
          "name": "Kirthi Diamonds",
          "url": "https://kirthidiamonds.com",
          "foundingDate": "2006",
          "description": "Bespoke diamond jewellery house rooted in a family diamond trade since 1975. Boutiques in Kochi and Calicut, Kerala.",
          "hasOfferCatalog": {
            "@type": "OfferCatalog",
            "name": "Diamond Jewellery Collections",
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
                  "brand": {
                    "@type": "Brand",
                    "name": "Kirthi Diamonds"
                  },
                  "material": "GIA/IGI certified diamonds, 18K gold, 22K gold",
                  "certification": {
                    "@type": "Certification",
                    "name": "GIA / IGI Diamond Certification"
                  },
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
                  "description": "Bespoke bridal diamond sets crafted to commission. bespoke consultation service available at Kochi and Calicut boutiques.",
                  "sku": "KD-BRIDAL-JW",
                  "mpn": "KD-BRIDAL-JW",
                  "brand": {
                    "@type": "Brand",
                    "name": "Kirthi Diamonds"
                  },
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
              }
            ]
          },
          "address": [
            {
              "@type": "PostalAddress",
              "addressLocality": "Kochi",
              "addressRegion": "Kerala",
              "addressCountry": "IN"
            },
            {
              "@type": "PostalAddress",
              "addressLocality": "Calicut",
              "addressRegion": "Kerala",
              "addressCountry": "IN"
            }
          ],
          "areaServed": {
            "@type": "State",
            "name": "Kerala"
          }
        }
      }) }} />

      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Are Kirthi Diamonds GIA or IGI certified?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes. Every diamond above 0.30 carats at Kirthi Diamonds is certified by GIA (Gemological Institute of America) or IGI (International Gemological Institute), with full grading documentation for cut, colour, clarity, and carat weight."
            }
          },
          {
            "@type": "Question",
            "name": "Is Kirthi Diamonds gold BIS hallmarked?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes. All gold jewellery at Kirthi Diamonds is BIS hallmarked, guaranteeing purity in 18K and 22K alloy configurations."
            }
          },
          {
            "@type": "Question",
            "name": "Does Kirthi Diamonds offer a buyback or exchange policy?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Yes. Kirthi Diamonds offers a lifetime buyback and exchange policy on all pieces purchased from their Kochi and Calicut boutiques."
            }
          },
          {
            "@type": "Question",
            "name": "Where are Kirthi Diamonds boutiques located?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Kirthi Diamonds has boutiques in Kochi and Calicut, Kerala, offering one-on-one bespoke consultation and bespoke commission services."
            }
          }
        ]
      }) }} />
      {/* Stage 1: The Cinematic Entry */}
      <section className="relative w-full min-h-[100dvh] pt-32 pb-24 md:pt-40 md:pb-12 flex flex-col justify-center items-center px-4 sm:px-6 md:px-32 snap-start">
        {/* Video / Background Layer */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <motion.div
            style={{ opacity: heroOpacity, scale: heroScale }}
            className="w-full h-full absolute inset-0 z-0 bg-black"
          >
            {content.heroVideoUrl?.includes("youtube.com") ||
            content.heroVideoUrl?.includes("youtu.be") ? (
              (() => {
                const videoId = content.heroVideoUrl?.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/i)?.[1];
                const originStr = typeof window !== "undefined" && window.location.origin ? `&origin=${encodeURIComponent(window.location.origin)}` : "";
                return videoId ? (
                  <iframe
                    src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playsinline=1&playlist=${videoId}&controls=0&disablekb=1${originStr}`}
                    title="Hero Background Video"
                    width="100%"
                    height="100%"
                    className="w-[150vw] h-[150vh] -ml-[25vw] -mt-[25vh] absolute top-0 left-0 object-cover grayscale brightness-[0.35] pointer-events-none"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                ) : null;
              })()
            ) : content.heroVideoUrl?.includes("vimeo.com") && !content.heroVideoUrl?.includes(".mp4") ? (
              <iframe
                src={
                  content.heroVideoUrl.includes("player.vimeo.com")
                    ? `${content.heroVideoUrl}&autoplay=1&muted=1&loop=1`
                    : `https://player.vimeo.com/video/${content.heroVideoUrl.match(/(?:vimeo\.com\/)(\d+)/i)?.[1]}?autoplay=1&muted=1&loop=1`
                }
                title="Hero Background Video"
                width="100%"
                height="100%"
                className="w-[150vw] h-[150vh] -ml-[25vw] -mt-[25vh] absolute top-0 left-0 object-cover grayscale brightness-[0.35] pointer-events-none"
                allow="autoplay; fullscreen"
              />
            ) : content.heroVideoUrl?.includes("drive.google.com") ? (
              <div className="w-[150vw] h-[150vh] -ml-[25vw] -mt-[25vh] absolute top-0 left-0 z-0">
                <iframe
                  src={content.heroVideoUrl.includes("/file/d/") ? `https://drive.google.com/file/d/${content.heroVideoUrl.split('/file/d/')[1].split('/')[0]}/preview?autoplay=1&mute=1` : `${content.heroVideoUrl}?autoplay=1&mute=1`}
                  title="Hero Background Video"
                  width="100%"
                  height="100%"
                  className="w-[150vw] h-[150vh] absolute top-0 left-0 object-cover grayscale brightness-[0.35] pointer-events-none"
                  allow="autoplay; fullscreen"
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-50">
                  <span className="bg-[#D4AF37]/20 text-[#D4AF37] text-xs uppercase tracking-[0.2em] px-6 py-3 border border-[#D4AF37]/30 mt-[25vh] backdrop-blur-md text-center max-w-md leading-relaxed">
                    Google Drive blocks background Auto-play. <br/>
                    Please use YouTube, Vimeo, or an MP4 link.
                  </span>
                </div>
              </div>
            ) : content.heroVideoUrl?.match(/\.(jpeg|jpg|gif|png|webp|avif)$/i) || content.heroVideoUrl?.includes('unsplash') || content.heroVideoUrl?.includes('image') ? (
              (() => {
                let imgUrl = content.heroVideoUrl;
                if (imgUrl?.includes('unsplash.com') || imgUrl?.includes('images.unsplash')) {
                  imgUrl = '/logo.png';
                }
                const isLogo = imgUrl === '/logo.png';
                return (
                  <picture>
                    <source media="(max-width: 768px)" srcSet={imgUrl} />
                    <source media="(min-width: 769px)" srcSet={imgUrl} />
                    <img
                      key={imgUrl}
                      src={imgUrl}
                      alt="Hero Background"
                      width={1920}
                      height={1080}
                      loading="eager"
                      fetchPriority="high"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      className={`w-full h-full grayscale brightness-[0.35] pointer-events-none ${isLogo ? 'object-contain max-h-[50%]' : 'object-cover'}`}
                    />
                  </picture>
                );
              })()
            ) : (
              <video
                key={content.heroVideoUrl || "default"}
                autoPlay
                muted
                controls={false}
                loop
                playsInline
                preload="auto"
                poster={undefined}
                className="w-full h-full object-cover grayscale brightness-[0.35] pointer-events-none"
              >
                <source
                  src={
                    content.heroVideoUrl ||
                    undefined
                  }
                />
              </video>
            )}
          </motion.div>
          <div className="absolute inset-0 bg-black/40 z-10 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0A0A0A] via-transparent to-[#050505] z-10 pointer-events-none" />
        </div>

        <motion.div
          style={{ rotateX, rotateY, perspective: 1000 }}
          className="relative z-20 w-full max-w-7xl"
        >
          <div className="space-y-12 md:space-y-20">
            <motion.div
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6 md:space-y-8"
            >
              <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
                <span className="text-[10px] md:text-xs uppercase tracking-[0.4em] md:tracking-[0.6em] text-[#D4AF37] leading-loose text-center md:text-left max-w-[90vw] md:max-w-2xl">
                  A bespoke diamond house est. 2006, rooted in a family diamond trade since 1975.
                </span>
                <div className="hidden md:block w-12 md:w-20 h-px bg-[#D4AF37]/30 shrink-0"></div>
              </div>
              <p
                className="block text-5xl sm:text-7xl md:text-8xl lg:text-[7.5rem] xl:text-[9rem] font-serif italic leading-[0.85] tracking-tighter mix-blend-difference pb-2 text-center md:text-left whitespace-normal sm:whitespace-nowrap"
              >
                Our Diamond <br />
                <span className="not-italic font-light opacity-90 text-4xl sm:text-6xl md:text-7xl lg:text-[6rem] xl:text-[7.5rem]">
                  Heritage
                </span>
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1, duration: 1 }}
              className="flex flex-col md:flex-row items-end justify-between gap-12"
            >
              <div className="max-w-md min-h-[80px]">
                <AnimatePresence mode="wait">
                  <motion.p
                    key={content.landingSubtitle}
                    initial={{ opacity: 0, filter: "blur(4px)" }}
                    animate={{ opacity: 1, filter: "blur(0px)" }}
                    exit={{ opacity: 0, filter: "blur(4px)" }}
                    transition={{ duration: 0.8 }}
                    className="text-sm md:text-lg font-light leading-relaxed italic opacity-40 mb-8"
                  >
                    {content.landingSubtitle}
                  </motion.p>
                </AnimatePresence>
                <div className="flex gap-4">
                   <button
                     onClick={(e) => {
                       e.preventDefault();
                       // Use a custom event to open the consultation modal since LandingView doesn't have isContactOpen
                       window.dispatchEvent(new CustomEvent('open-consultation'));
                     }}
                     className="px-6 py-4 bg-[#D4AF37] text-black text-xs md:text-[10px] uppercase tracking-[0.3em] hover:bg-white transition-all shadow-lg flex items-center gap-3 font-medium"
                   >
                     Book a Bespoke Consultation <ArrowRight size={14} />
                   </button>
                </div>
              </div>

              <div className="flex flex-col items-start md:items-end flex-wrap gap-6 md:gap-4 mt-8 md:mt-0">
                <nav className="flex flex-wrap gap-4 md:gap-6">
                  <button
                    onClick={(e) => { e.preventDefault(); document.getElementById('philosophy')?.scrollIntoView({ behavior: 'smooth' }); }}
                    className="text-xs md:text-[10px] uppercase tracking-[0.4em] opacity-50 hover:opacity-100 transition-opacity cursor-pointer text-left"
                  >
                    The Philosophy
                  </button>
                  <button
                    onClick={(e) => { e.preventDefault(); document.getElementById('pillars-of-trust')?.scrollIntoView({ behavior: 'smooth' }); }}
                    className="text-xs md:text-[10px] uppercase tracking-[0.4em] opacity-50 hover:opacity-100 transition-opacity cursor-pointer text-left"
                  >
                    Pillars of Trust
                  </button>
                </nav>
                <div className="flex flex-col items-start md:items-center md:items-end space-y-4 md:space-y-4 mt-8 md:mt-0">
                  <span className="text-xs md:text-[10px] uppercase tracking-[0.4em] opacity-30">
                    Scroll to Immersion
                  </span>
                  <motion.div
                    animate={{ y: [0, 10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="w-px h-16 bg-gradient-to-b from-[#D4AF37] to-transparent"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Stage 2: The Philosophy */}
      <section
        id="philosophy"
        className="relative w-full min-h-[100dvh] py-24 flex items-center px-4 md:px-32 snap-start bg-[#080808]"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-24 items-center w-full max-w-7xl mx-auto">
          <div className="space-y-12">
            <div className="space-y-6">
              <span className="text-xs md:text-[10px] uppercase tracking-[0.6em] text-[#D4AF37]">
                {content.philosophyTitle || "The Philosophy"}
              </span>
              <h2 className="text-3xl sm:text-4xl md:text-6xl lg:text-[80px] font-serif italic leading-none whitespace-pre-line">
                {content.philosophySubtitle || "Purity in\nevery facet"}
              </h2>
            </div>
            <div className="space-y-6">
              <p className="text-xl md:text-2xl font-light leading-relaxed opacity-60">
                {content.philosophyDescription}
              </p>
              <p className="text-sm md:text-base font-light leading-relaxed tracking-wide opacity-40">
                Legacy meets avant-garde precision. Founded in 2006 and backed by a family heritage in the diamond trade since 1975, our bespoke house creates fine jewellery that outlasts trends. We pair exceptionally sourced gemstones with master craftsmanship, guiding each piece from a raw sketch to a brilliant, final polish. Whether it is a curated collection piece or a custom commission, we craft with a singular goal: to translate your personal narrative into an heirloom. These aren't just objects of beauty to be worn—they are designed to be inherited.
              </p>
            </div>
            <div className="pt-8 relative group">
              {content?.logoUrl ? (
                <img
                  src={content.logoUrl || undefined}
                  width="300"
                  height="128"
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  className="absolute -left-12 -top-12 h-32 w-[300px] opacity-[0.03] grayscale pointer-events-none group-hover:opacity-[0.08] transition-opacity duration-1000"
                  alt=""
                />
              ) : (
                <div className="absolute -left-12 -top-12 h-32 w-32 rounded-full border border-white/5 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-1000 pointer-events-none" />
              )}
              <div className="grid grid-cols-2 gap-12 relative z-10">
                <div className="space-y-2">
                  <span className="text-4xl font-serif italic text-[#D4AF37]">
                    {content.philosophyStat1Value || "45+"}
                  </span>
                  <span className="text-xs md:text-[10px] uppercase tracking-widest opacity-30 block">
                    {content.philosophyStat1Label || "Years of Mastery"}
                  </span>
                </div>
                <div className="space-y-2">
                  <span className="text-4xl font-serif italic text-[#D4AF37]">
                    {content.philosophyStat2Value || "Inter."}
                  </span>
                  <span className="text-xs md:text-[10px] uppercase tracking-widest opacity-30 block">
                    {content.philosophyStat2Label || "Flawless Standard"}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="relative aspect-square">
            <div className="absolute inset-0 border border-white/5 rounded-full animate-pulse" />
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="absolute inset-4 md:inset-8 bg-white/[0.02] backdrop-blur-3xl overflow-hidden flex items-center justify-center p-4 md:p-8"
            >
              {content.philosophyImage ? (
                <motion.img
                  loading="lazy"
                  src={content.philosophyImage}
                  initial={{ filter: "grayscale(100%)" }}
                  whileInView={{ filter: "grayscale(0%)" }}
                  viewport={{ amount: 0.5, once: false }}
                  transition={{ duration: 1.5 }}
                  width={1000}
                  height={1000}
                  className="w-full h-full object-cover"
                  alt="Diamond Detail"
                />
              ) : (
                <div className="w-full h-full bg-white/5" />
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stage 3: Trust & Heritage */}
      <section
        id="pillars-of-trust"
        className="relative w-full min-h-[100dvh] flex items-center px-4 md:px-32 snap-start bg-[#030303] py-24"
      >
        <div className="max-w-7xl mx-auto w-full space-y-24">
          <div className="text-center space-y-6 max-w-3xl mx-auto">
            <span className="text-xs md:text-[10px] uppercase tracking-[0.6em] text-[#D4AF37]">
              Our Foundation
            </span>
            <h2 className="text-4xl md:text-5xl font-serif italic text-white/90">
              The Pillars of Trust
            </h2>
            <div className="space-y-6 pt-4">
              <p className="text-sm md:text-base font-light text-white/50 leading-relaxed">
                Every Kirthi piece is an uncompromised promise. From ethically sourced origins to the final intricately hallmarked masterpiece, our commitment to absolute transparency and ethical practice has remained unwavering. A bespoke diamond house est. 2006, rooted in a family diamond trade since 1975.
              </p>
              <p className="text-sm md:text-base font-light text-white/50 leading-relaxed">
                We believe that true luxury lies in the unseen details and the rigorous standards we hold ourselves to. Through our exclusive boutiques in Kochi and Calicut, we offer an immersive, bespoke consultation experience tailored to connoisseurs who demand nothing less than perfection. Explore our definitive pillars that uphold everything we create.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {[
              {
                title: "Certified Brilliance",
                desc: "Every diamond above 0.30 carats is certified by GIA or IGI, ensuring internationally recognized grading for cut, color, clarity, and carat.",
                icon: "✦",
              },
              {
                title: "100% BIS Hallmarked",
                desc: "Our gold is rigorously tested and stamped with the BIS Hallmark, guaranteeing purity in 18K and 22K alloy configurations.",
                icon: "◆",
              },
              {
                title: "Lifetime Exchange",
                desc: "We honor the enduring value of our jewels with a transparent, lifetime buyback and exchange policy for all Kirthi creations.",
                icon: "⟲",
              },
              {
                title: "Maison Heritage",
                desc: "Serving patrons through our Kochi and Calicut boutiques with bespoke consultation services and bespoke artisan craftsmanship.",
                icon: "🏛",
              },
            ].map((pillar, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="flex flex-col space-y-6 p-8 border border-white/5 bg-white/[0.01] hover:bg-white/[0.03] transition-colors"
              >
                <div className="text-3xl text-[#D4AF37] opacity-80">
                  {pillar.icon}
                </div>
                <div className="space-y-3">
                  <h3 className="text-sm uppercase tracking-widest text-white/90 font-medium">
                    {pillar.title}
                  </h3>
                  <p className="text-xs font-light text-white/50 leading-relaxed">
                    {pillar.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stage 4: The Transition */}
      <section className="relative w-full min-h-[60vh] py-24 flex flex-col justify-center items-center text-center px-4 md:px-32 snap-start bg-[#050505]">
        <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           transition={{ duration: 1 }}
           className="w-full flex flex-col items-center space-y-12"
        >
          <div className="space-y-6 md:space-y-8 text-center pb-8 border-b border-white/5 max-w-2xl mx-auto">
            <span className="text-xs md:text-[10px] uppercase tracking-[0.6em] text-[#D4AF37]">
              Begin Journey
            </span>
            <h3 className="text-2xl md:text-4xl font-serif italic">
              Enter the Collections
            </h3>
            <p className="text-sm font-light text-center text-white/40 leading-relaxed italic opacity-80 pt-4">
              Embark on a visual odyssey through our curated selections. Experience the transcendent beauty of our signature bridal masterpieces, the understated elegance of our everyday luxury lines, and the unparalleled singularity of our high-jewellery bespoke acquisitions. Every piece awaits its intended wearer.
            </p>
          </div>

          <a
            href={nextSectionId ? (nextSectionId === 'home' ? '/' : `/${nextSectionId}`) : undefined}
            onClick={(e) => { e.preventDefault(); onExplore(); }}
            className="px-8 md:px-16 py-4 md:py-6 border border-[#D4AF37]/30 text-xs md:text-[10px] uppercase tracking-[0.6em] hover:bg-[#D4AF37] hover:text-black transition-all relative overflow-hidden group inline-block"
          >
            <span className="relative z-10 flex items-center gap-4">
              Continue Exploration
              <span className="inline-block transform group-hover:translate-x-2 transition-transform duration-500">
                →
              </span>
            </span>
            <div className="absolute inset-0 bg-[#D4AF37] translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
          </a>
        </motion.div>
      </section>

      <SharedFooter />
    </div>
  );
}
