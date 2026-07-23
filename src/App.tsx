/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Menu as MenuIcon,
  X,
  MapPin,
  ArrowRight,
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
  MessageCircle,
  Twitter,
  Facebook,
  Instagram
} from "lucide-react";
import { useContent } from "./contexts/ContentContext";
import { SECTIONS } from "./constants";
import { articleSchemas } from "./seoSchemas";
import { Suspense, lazy, memo } from "react";
import { useSwipeable } from "react-swipeable";
import LandingView from "./components/LandingView";
import JournalView from "./components/JournalView";
import HeritageArchive from "./components/HeritageArchive";
import TermsView from "./components/TermsView";
import { FastImage } from "./components/FastImage";
import SavoirFaire from "./components/SavoirFaire";
import MaisonView from "./components/MaisonView";
import ShopExperience from "./components/ShopExperience";
import BridesShowcase from "./components/BridesShowcase";
import ContactView from "./components/ContactView";
import AdminView from "./components/AdminView";
import PageView from "./components/PageView";
import BoutiqueView from "./components/BoutiqueView";
import StoreLocatorView from "./components/StoreLocatorView";

// Memoized section rendering components to prevent unnecessary re-renders
const MemoizedLandingView = LandingView;
const MemoizedJournalView = JournalView;
const MemoizedHeritageArchive = HeritageArchive;
const MemoizedTermsView = TermsView;
const MemoizedSavoirFaire = SavoirFaire;
const MemoizedMaisonView = MaisonView;
const MemoizedShopExperience = ShopExperience;
const MemoizedContactView = ContactView;
const MemoizedBridesShowcase = BridesShowcase;
const MemoizedBoutiqueView = BoutiqueView;
import { doc, getDoc, setDoc, updateDoc, increment } from "firebase/firestore";
import { db } from "./lib/firebase";
import { useAppStore } from "./store";
import { ErrorBoundary } from "./ErrorBoundary";
import ConsultationModal from "./components/ConsultationModal";
import BreadcrumbNavigation from "./components/BreadcrumbNavigation";
import { updateSiteSEO } from "./utils/seo";
import { logSEODiagnostics } from "./utils/debug";

function Shimmer({ className = "" }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden bg-white/[0.03] rounded ${className}`}>
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-[#D4AF37]/10 to-transparent"
        initial={{ x: "-100%" }}
        animate={{ x: "100%" }}
        transition={{
          repeat: Infinity,
          duration: 1.8,
          ease: "linear",
        }}
      />
    </div>
  );
}

function LoadingFallback() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="fixed inset-0 bg-[#050505] z-[99999] flex flex-col pointer-events-none custom-scrollbar"
    >
      {/* Skeleton Top Nav */}
      <div className="absolute top-0 left-0 w-full p-6 md:p-12 flex justify-between items-start z-50">
        <div className="flex gap-6">
          <Shimmer className="w-10 h-10 rounded-full" />
        </div>
        
        <div className="flex flex-col items-center">
          <div className="relative overflow-hidden w-32 md:w-48 h-8 md:h-12 bg-gradient-to-r from-transparent via-white/5 to-transparent rounded mb-2">
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-[#D4AF37]/15 to-transparent blur-sm"
              initial={{ x: "-100%" }}
              animate={{ x: "100%" }}
              transition={{
                repeat: Infinity,
                duration: 2,
                ease: "linear",
              }}
            />
          </div>
          <Shimmer className="hidden md:block w-32 h-3" />
        </div>

        <Shimmer className="w-24 h-4 hidden md:block mt-3" />
      </div>

      {/* Skeleton Hero Content */}
      <div className="w-full h-[100dvh] flex flex-col justify-end p-6 md:p-12 md:px-32 relative">
        <div className="relative z-20 w-full max-w-7xl pb-24">
          <div className="space-y-12 md:space-y-20">
            <div className="space-y-6 md:space-y-8">
              <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6">
                <Shimmer className="h-3 w-64 md:w-96" />
                <div className="hidden md:block w-12 md:w-20 h-px bg-[#D4AF37]/20 shrink-0"></div>
              </div>
              
              <div className="space-y-4">
                <Shimmer className="h-16 sm:h-24 md:h-32 lg:h-40 xl:h-48 w-3/4 sm:w-2/3 rounded-lg" />
                <Shimmer className="h-12 sm:h-20 md:h-24 lg:h-32 xl:h-40 w-1/2 sm:w-1/3 rounded-lg" />
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-end justify-between gap-12 mt-12 md:mt-0">
              <div className="space-y-3 w-full max-w-md">
                <Shimmer className="h-3 w-full" />
                <Shimmer className="h-3 w-5/6" />
                <Shimmer className="h-3 w-4/6" />
              </div>

              <div className="flex flex-col items-start md:items-end flex-wrap gap-6 md:gap-4 mt-8 md:mt-0">
                <div className="flex gap-4 md:gap-6">
                   <Shimmer className="h-3 w-24" />
                   <Shimmer className="h-3 w-24" />
                </div>
                <div className="flex flex-col items-start md:items-center md:items-end space-y-4 md:space-y-4 mt-8 md:mt-0">
                  <Shimmer className="h-2 w-32" />
                  <div className="relative overflow-hidden w-px h-16 bg-[#D4AF37]/20">
                    <motion.div
                      className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-[#D4AF37] to-transparent"
                      initial={{ y: "-100%" }}
                      animate={{ y: "100%" }}
                      transition={{
                        repeat: Infinity,
                        duration: 1.5,
                        ease: "easeInOut",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function InquiryModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-2xl flex items-start justify-center p-4 md:p-12 overflow-y-auto custom-scrollbar pt-20 md:pt-32"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="max-w-2xl w-full bg-[#0A0A0A] border border-white/10 p-6 md:p-16 relative overflow-hidden mb-20"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/[0.05] blur-[60px]" />

            <button
              onClick={onClose}
              className="absolute top-6 right-6 md:top-8 md:right-8 opacity-40 hover:opacity-100 transition-all z-20 p-4 -mt-2 -mr-2"
            >
              <X size={24} />
            </button>

            <div className="space-y-10 relative z-10 text-center">
              <div className="space-y-6 md:space-y-4">
                <h4 className="text-xs md:text-[10px] uppercase tracking-[0.5em] text-[#D4AF37]">
                  Private Inquiry
                </h4>
                <h2 className="text-2xl md:text-4xl lg:text-5xl font-serif italic">
                  Bespoke Arrangement
                </h2>
              </div>

              <div className="space-y-8">
                <div className="text-xs md:text-sm font-light italic opacity-60 leading-relaxed max-w-sm mx-auto">
                  To maintain our standards of absolute exclusivity, a dedicated
                  Maison Diamond Specialist handles all inquiries personally.
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 text-left py-8 border-t border-b border-white/5">
                  <div className="space-y-1">
                    <span className="text-xs md:text-[10px] uppercase tracking-[0.2em] opacity-30 block">
                      Kochi Boutique
                    </span>
                    <span className="text-xs md:text-sm tracking-widest">
                      +91 98470 86990
                    </span>
                  </div>
                  <div className="space-y-1">
                    <span className="text-xs md:text-[10px] uppercase tracking-[0.2em] opacity-30 block">
                      Calicut Boutique
                    </span>
                    <span className="text-xs md:text-sm tracking-widest break-all">
                      +91 98470 86002
                    </span>
                  </div>
                </div>

                <form
                  className="space-y-8 pt-4"
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    const name = formData.get("name");
                    const email = formData.get("email");
                    const phone = formData.get("phone");
                    const message = formData.get("message");

                    const subject = encodeURIComponent(
                      "Bespoke Arrangement Inquiry",
                    );
                    const body = encodeURIComponent(
                      `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\n\nMessage:\n${message}`,
                    );
                    window.location.href = `mailto:info@kirthidiamonds.com?subject=${subject}&body=${body}`;
                    onClose();
                  }}
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <input
                      name="name"
                      aria-label="Given Name"
                      type="text"
                      placeholder="GIVEN NAME"
                      className="bg-transparent border-b border-white/10 py-3 text-xs md:text-[10px] tracking-widest uppercase focus:border-[#D4AF37] outline-none transition-all placeholder:text-white/10"
                      required
                    />
                    <input
                      name="email"
                      aria-label="Email Address"
                      type="email"
                      placeholder="EMAIL ADDRESS"
                      className="bg-transparent border-b border-white/10 py-3 text-xs md:text-[10px] tracking-widest uppercase focus:border-[#D4AF37] outline-none transition-all placeholder:text-white/10"
                      required
                    />
                  </div>
                  <input
                    name="phone"
                    aria-label="Phone Number"
                    type="tel"
                    placeholder="PHONE NUMBER"
                    className="w-full bg-transparent border-b border-white/10 py-3 text-xs md:text-[10px] tracking-widest uppercase focus:border-[#D4AF37] outline-none transition-all placeholder:text-white/10"
                    required
                  />
                  <textarea
                    name="message"
                    aria-label="Personal Message"
                    placeholder="YOUR PERSONAL MESSAGE"
                    rows={3}
                    className="w-full bg-transparent border-b border-white/10 py-3 text-xs md:text-[10px] tracking-widest uppercase focus:border-[#D4AF37] outline-none transition-all placeholder:text-white/10 resize-none"
                    required
                  ></textarea>

                  <button
                    type="submit"
                    className="w-full py-5 bg-[#D4AF37] text-black text-sm md:text-[11px] uppercase tracking-[0.4em] font-medium hover:bg-white transition-all shadow-[0_10px_30px_rgba(212,175,55,0.15)]"
                  >
                    Dispatch Request
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function InfoModal({
  type,
  onClose,
}: {
  type: "archive" | "care" | null;
  onClose: () => void;
}) {
  if (!type) return null;

  const contentMap = {
    archive: {
      title: "Archive",
      subtitle: "The Kirthi Anthology",
      text: "Documenting the provenance, sketches, and exhibition history of our most seminal pieces from 2006 to the present day. Our digital and physical archives serve to authenticate and preserve the lineage of every creation.",
    },
    care: {
      title: "Care",
      subtitle: "Preserving Brilliance",
      text: "High jewellery requires meticulous attention. We recommend annual inspections by our master jewellers. When not worn, pieces should be stored individually in their original presentation boxes to prevent friction. Avoid exposure to harsh chemicals, extreme temperatures, and abrasive surfaces.",
    },
  };

  const data = contentMap[type];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-2xl flex items-center justify-center p-4 md:p-12 overflow-y-auto custom-scrollbar"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          className="max-w-2xl w-full bg-[#0A0A0A] border border-white/10 p-6 md:p-16 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/[0.05] blur-[60px]" />

          <button
            onClick={onClose}
            className="absolute top-6 right-6 md:top-8 md:right-8 opacity-40 hover:opacity-100 transition-all z-20 p-4 -mt-2 -mr-2"
          >
            <X size={24} />
          </button>

          <div className="space-y-10 relative z-10 text-center">
            <div className="space-y-6 md:space-y-4">
              <h4 className="text-xs md:text-[10px] uppercase tracking-[0.5em] text-[#D4AF37]">
                {data.title}
              </h4>
              <h2 className="text-2xl md:text-4xl lg:text-5xl font-serif italic">
                {data.subtitle}
              </h2>
            </div>
            <div className="space-y-8">
              <p className="text-sm md:text-base font-light italic opacity-60 leading-relaxed max-w-lg mx-auto">
                {data.text}
              </p>

              <div className="pt-8 flex justify-center">
                <div className="w-12 h-px bg-[#D4AF37]/50"></div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function App() {
  const viewMode = useAppStore(state => state.viewMode);
  const setViewMode = useAppStore(state => state.setViewMode);
  const currentIndex = useAppStore(state => state.currentIndex);
  const setCurrentIndex = useAppStore(state => state.setCurrentIndex);
  const isMenuOpen = useAppStore(state => state.isMenuOpen);
  const setIsMenuOpen = useAppStore(state => state.setIsMenuOpen);
  const isContactOpen = useAppStore(state => state.isContactOpen);
  const setIsContactOpen = useAppStore(state => state.setIsContactOpen);

  const activeInfoModal = useAppStore(state => state.activeInfoModal);
  const setActiveInfoModal = useAppStore(state => state.setActiveInfoModal);
  const direction = useAppStore(state => state.direction);
  const setDirection = useAppStore(state => state.setDirection);
  const showWhatsAppMenu = useAppStore(state => state.showWhatsAppMenu);
  const setShowWhatsAppMenu = useAppStore(state => state.setShowWhatsAppMenu);
  const showSocialMenu = useAppStore(state => state.showSocialMenu);
  const setShowSocialMenu = useAppStore(state => state.setShowSocialMenu);

  const { content, loading } = useContent();
  const [logoLoaded, setLogoLoaded] = useState(false);
  const [boutiqueId, setBoutiqueId] = useState<"kochi" | "calicut" | null>(null);

  const triggerHaptic = useCallback((pattern: number | number[] = 50) => {
    if (typeof window !== "undefined" && window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(pattern);
    }
  }, []);

  const menuSwipeHandlers = useSwipeable({
    onSwipedRight: () => { triggerHaptic(); setIsMenuOpen(false); },
    onSwipedLeft: () => { triggerHaptic(); setIsMenuOpen(false); },
    trackMouse: true,
  });

  const mainSwipeHandlers = useSwipeable({
    onSwipedLeft: () => nextSection(),
    onSwipedRight: () => prevSection(),
    preventScrollOnSwipe: true,
    trackMouse: false,
  });

  // Restore dynamic favicon
  useEffect(() => {
    if (content?.logoUrl) {
      // Remove any static favicons to ensure the dynamic one takes precedence
      document.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"], link[rel="apple-touch-icon"]').forEach(el => el.remove());

      const addLink = (rel: string) => {
        const link = document.createElement('link');
        link.rel = rel;
        link.href = content.logoUrl;
        document.head.appendChild(link);
      };

      addLink('icon');
      addLink('apple-touch-icon');
      addLink('shortcut icon');
    }
  }, [content?.logoUrl]);

  useEffect(() => {
    const handleLocationChange = () => {
      const pathname = window.location.pathname;
      if (pathname.startsWith("/admin")) {
        setViewMode("admin");
      } else if (pathname.startsWith("/pages/")) {
        setViewMode("page");
      } else if (pathname === "/terms") {
        setViewMode("terms");
      } else if (pathname === "/kochi" || pathname === "/kochi/") {
        setViewMode("boutique");
        setBoutiqueId("kochi");
      } else if (pathname === "/calicut" || pathname === "/calicut/") {
        setViewMode("boutique");
        setBoutiqueId("calicut");
      } else if (pathname === "/find-a-store" || pathname === "/find-a-store/") {
        setViewMode("locator");
      } else {
        setViewMode("app");
        let pathPart = pathname.slice(1).split("?")[0];
        if (pathPart.endsWith('/')) {
            pathPart = pathPart.slice(0, -1);
        }
        const sectionId = (pathPart && pathPart !== "") ? pathPart : null;
        
        if (sectionId) {
          const sections = content?.sections || SECTIONS;
          const idx = sections.findIndex(s => s.id === sectionId || (sectionId === "shop" && s.isShop) || (sectionId === "boutique" && s.isShop));
          if (idx !== -1) {
             setCurrentIndex(idx);
          } else {
             const allPosts = content?.blogPosts || [];
             const isJournalPost = allPosts.find((p: any) => p.id === sectionId || (p.title && p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') === sectionId));
             
             if (isJournalPost) {
                window.location.replace(`/journal/${isJournalPost.id || sectionId}`);
                return;
             }
             
             // If section is not found, fallback to home but let App render
             setCurrentIndex(0);
          }
        } else {
          setCurrentIndex(0);
        }
      }
    };

    handleLocationChange();
    window.addEventListener("popstate", handleLocationChange);
    return () => {
      window.removeEventListener("popstate", handleLocationChange);
    };
  }, [setViewMode, content?.sections, content?.blogPosts, setCurrentIndex, setBoutiqueId]);

    useEffect(() => {
    const handleOpenConsultation = () => setIsContactOpen(true);
    window.addEventListener("open-consultation", handleOpenConsultation);
    return () => window.removeEventListener("open-consultation", handleOpenConsultation);
  }, [setIsContactOpen]);

  // Update URL on section change
  useEffect(() => {
    if (viewMode !== 'app') return;
    if (window.location.pathname.startsWith('/admin')) return;
    const currentSection = content?.sections?.[currentIndex] || SECTIONS[currentIndex];
    if (currentSection) {
       const newPath = currentSection.id === 'home' ? '/' : `/${currentSection.id}`;
       const currentPath = window.location.pathname;
       if (currentPath !== newPath && currentPath !== newPath + '/') {
          window.history.pushState(null, '', newPath);
       }
    }
  }, [currentIndex, viewMode, content?.sections]);

  useEffect(() => {
    const recordVisit = async () => {
      if (!sessionStorage.getItem("hasVisited")) {
        sessionStorage.setItem("hasVisited", "true");
        try {
          const visitorsRef = doc(db, "analytics", "visitors");
          const docSnap = await getDoc(visitorsRef);
          if (docSnap.exists()) {
            await updateDoc(visitorsRef, {
              totalVisitors: increment(1),
              lastUpdate: new Date().toISOString(),
            });
          } else {
            await setDoc(visitorsRef, {
              totalVisitors: 1,
              lastUpdate: new Date().toISOString(),
            });
          }
        } catch (error: any) {
          if (error?.code === 'resource-exhausted' || error?.message?.includes?.('Quota') || error?.message?.includes?.('quota')) {
            console.warn("Firestore quota exceeded while recording visit.");
          } else {
            console.warn("Failed to record visit:", error);
          }
        }
      }
    };
    if (viewMode === "app") {
      recordVisit();
    }
  }, [viewMode]);

  // Update SEO dynamically (Moved down to use currentSection)

  const nextSection = useCallback(() => {
    triggerHaptic();
    setDirection(1);
    setCurrentIndex((currentIndex + 1) % SECTIONS.length);
  }, [currentIndex, setCurrentIndex, setDirection, triggerHaptic]);

  const prevSection = useCallback(() => {
    triggerHaptic();
    setDirection(-1);
    setCurrentIndex((currentIndex - 1 + SECTIONS.length) % SECTIONS.length);
  }, [currentIndex, setCurrentIndex, setDirection, triggerHaptic]);

  const goToSection = useCallback((index: number) => {
    triggerHaptic(30);
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
    setIsMenuOpen(false);
  }, [currentIndex, setCurrentIndex, setDirection, setIsMenuOpen, triggerHaptic]);

  const handleInquiry = useCallback(() => {
    setIsContactOpen(true);
  }, [setIsContactOpen]);

  const handleGoHome = useCallback(() => {
    goToSection(0);
  }, [goToSection]);

  const sectionsList = content?.sections || SECTIONS;
  const currentSectionsLength = sectionsList.length;
  const parsedIndex = typeof currentIndex === 'number' && !isNaN(currentIndex) ? currentIndex : 0;
  const safeIndex = parsedIndex >= 0 && parsedIndex < currentSectionsLength ? parsedIndex : 0;

  const currentSection = sectionsList[safeIndex];
  const nextSec = sectionsList[(safeIndex + 1) % currentSectionsLength];
  const prevSec = sectionsList[(safeIndex - 1 + currentSectionsLength) % currentSectionsLength];

  // Update SEO and Meta Tags dynamically
  useEffect(() => {
    try {
      // Remove server-side fallback SEO links to prevent duplicate H1 tags if JS is running
      const seoLinks = document.getElementById('seo-links');
      if (seoLinks) seoLinks.remove();
      
      // Update Preload for Mobile Hero
      let preloadLink = document.getElementById('hero-preload') as HTMLLinkElement;
      if (content.heroVideoUrl && (content.heroVideoUrl.match(/\.(jpeg|jpg|gif|png|webp|avif)$/i) || content.heroVideoUrl.includes('image'))) {
        if (!preloadLink) {
          preloadLink = document.createElement('link');
          preloadLink.id = 'hero-preload';
          preloadLink.rel = 'preload';
          preloadLink.as = 'image';
          document.head.appendChild(preloadLink);
        }
        preloadLink.href = `${content.heroVideoUrl}${content.heroVideoUrl.includes('?') ? '&' : '?'}width=800&height=1200&fit=crop&fm=webp`;
      } else if (preloadLink) {
         preloadLink.remove();
      }

      // Update Standard Meta Tags
      const baseUrl = 'https://kirthidiamonds.com';
      let canonicalPath = window.location.pathname;
      if (canonicalPath !== '/' && canonicalPath.endsWith('/')) {
        canonicalPath = canonicalPath.slice(0, -1);
      }
      let canonicalUrl = baseUrl + (canonicalPath === '/' ? '/' : canonicalPath);

      const defaultTitle = "Kirthi Diamond Jewellery | Luxury Diamond Jewellery";
      let targetTitle = defaultTitle;
      let rawDescContent = "A bespoke diamond house est. 2006, rooted in a family diamond trade since 1975. Discover GIA & IGI certified diamonds in Kochi and Calicut.";

      if (viewMode === "page") {
        if (canonicalPath === '/contact' || canonicalPath === '/pages/contact') {
          targetTitle = "Contact | Kirthi Diamonds";
          rawDescContent = "Get in touch to schedule a one-on-one bespoke consultation at our Kochi or Calicut showrooms.";
        } else if (canonicalPath === '/pages/policies') {
          targetTitle = "Policies & Ethics | Kirthi Diamonds";
          rawDescContent = "Comprehensive policies regarding returns, lifetime exchange, ethical sourcing, and client confidentiality at Kirthi Diamonds.";
        } else if (canonicalPath === '/pages/exchange-policy') {
          targetTitle = "Lifetime Exchange Policy | Kirthi Diamonds";
          rawDescContent = "Kirthi Diamonds lifetime buyback and exchange policy explained in full — how the valuation works, what's covered, how to use it.";
        } else if (canonicalPath === '/pages/diamond-jewellery') {
          targetTitle = "Diamond Jewellery | Kirthi Diamonds";
          rawDescContent = "Boutique luxury diamond jewellers in Kochi and Calicut with GIA and IGI certified diamonds, BIS hallmarked gold, lifetime buyback.";
        }
      } else if (canonicalPath === '/faq') {
        targetTitle = "Frequently Asked Questions | Kirthi Diamonds";
        rawDescContent = "Find answers to frequently asked questions regarding GIA/IGI certification, bespoke diamond commissions, and our lifetime exchange policies.";
      } else if (viewMode === "boutique") {
        if (boutiqueId === "kochi") {
          targetTitle = "Showroom & Boutique in Kochi, Kerala | Kirthi Diamonds";
          rawDescContent = "Visit our Kochi luxury diamond showroom at Palarivattom. Explore GIA and IGI certified bridal sets, bespoke diamond jewellery commissions, and lifetime exchange policies.";
        } else {
          targetTitle = "Showroom & Boutique in Calicut, Kozhikode | Kirthi Diamonds";
          rawDescContent = "Visit our Calicut luxury diamond boutique in Puthiyara, Kozhikode. Experience custom bridal diamond collections, expert consultations, and ethical loose solitaires.";
        }
      } else if (currentSection?.id === 'shop') {
        targetTitle = "The Boutique | Kirthi Diamonds";
        rawDescContent = currentSection?.seoDescription || currentSection?.description || rawDescContent;
      } else if (currentSection?.id === 'maison') {
        targetTitle = "The Maison | Kirthi Diamonds";
        rawDescContent = currentSection?.seoDescription || currentSection?.description || rawDescContent;
      } else if (currentSection?.id === 'journal') {
        targetTitle = "The Journal | Kirthi Diamonds";
        rawDescContent = currentSection?.seoDescription || currentSection?.description || rawDescContent;
      } else if (currentSection?.seoTitle) {
        targetTitle = currentSection.seoTitle;
        rawDescContent = currentSection?.seoDescription || currentSection?.description || rawDescContent;
      } else if (currentSection?.id === 'home' || !currentSection) {
        targetTitle = defaultTitle;
        rawDescContent = currentSection?.seoDescription || currentSection?.description || rawDescContent;
      } else if (currentSection?.title) {
        targetTitle = `${currentSection.title} | Kirthi Diamonds`;
        rawDescContent = currentSection?.seoDescription || currentSection?.description || rawDescContent;
      }
      
      let descContent = rawDescContent.replace(/\*\*/g, '').replace(/<[^>]+>/g, '').trim();

      // Ensure description is trimmed to the optimal SEO length (max 155 chars) except for explicit ones like journal
      if (!currentSection?.seoDescription) {
        if (currentSection?.id === 'journal') {
          descContent = "This journal explores the artistry, craftsmanship, and science behind high jewellery. Understand how exceptional pieces are designed, made, and valued.";
        } else if (descContent.length > 155) {
           let trimmed = descContent.substring(0, 153);
           trimmed = trimmed.substring(0, Math.min(trimmed.length, trimmed.lastIndexOf(" "))) + "...";
           descContent = trimmed;
        }
      }

      let isArticle = false;
      let articleTime: string | undefined = undefined;
      let articleAuthor: string | undefined = undefined;

      // Ensure all canonical URLs for journal articles correctly point to the full article canonicalPath rather than the base /journal/ directory.
      if (canonicalPath.startsWith('/journal/') && canonicalPath.length > 9) {
        isArticle = true;
        canonicalUrl = baseUrl + canonicalPath;
        
        // Remove existing dynamic schema if present
        const existingSchema = document.getElementById('dynamic-article-schema');
        if (existingSchema) {
          existingSchema.remove();
        }
        
        const slug = canonicalPath.slice(9);
        const dynamicSchema = articleSchemas[slug];
        
        // Let's check for content posts
        const allPosts = content?.blogPosts || [];
        const post = allPosts.find((p: any) => {
          const s = p.title ? p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') : p.id;
          return s === slug || p.id === slug;
        });

        if (dynamicSchema) {
          // Update URL in schema dynamically just in case it differs
          dynamicSchema.mainEntityOfPage = {
             "@type": "WebPage",
             "@id": canonicalUrl
          };
          const schemaScript = document.createElement('script');
          schemaScript.type = 'application/ld+json';
          schemaScript.id = 'dynamic-article-schema';
          schemaScript.text = JSON.stringify(dynamicSchema);
          document.head.appendChild(schemaScript);
        }

        if (post || dynamicSchema) {
          articleTime = post?.date || dynamicSchema?.datePublished;
          articleAuthor = 'Kirthi Diamonds';
          targetTitle = `${post?.title || dynamicSchema?.headline} | Kirthi Diamonds`;
          rawDescContent = post?.metaDescription || post?.excerpt || dynamicSchema?.description || descContent;
        }
      } else {
        const existingSchema = document.getElementById('dynamic-article-schema');
        if (existingSchema) {
          existingSchema.remove();
        }
      }
      

      // Update metadata using unified utility
      
      descContent = rawDescContent.replace(/\*\*/g, '').replace(/<[^>]+>/g, '').trim();
      updateSiteSEO({
        title: targetTitle,
        description: descContent,
        canonicalUrl,
        type: isArticle ? 'article' : 'website',
        publishedTime: articleTime,
        author: articleAuthor,
        image: (viewMode === 'page' && window.location.pathname.startsWith('/journal/') && window.location.pathname !== '/journal') 
            ? ((content?.blogPosts?.find(p => p.id === window.location.pathname.replace('/journal/', ''))?.image || content?.blogPosts?.find(p => p.id === window.location.pathname.replace('/journal/', ''))?.featuredImage) || "https://kirthidiamonds.com/og-cover.jpg")
            : (window.location.pathname === '/journal' ? "https://kirthidiamonds.com/journal-cover.jpg" : "https://kirthidiamonds.com/og-cover.jpg"),
        pathname: window.location.pathname,
        blogPosts: content?.blogPosts || [],
        sections: content?.sections || SECTIONS,
        viewMode: viewMode,
        currentSection: currentSection
      });

      // Log SEO Diagnostics to console
      logSEODiagnostics("Dynamic Update");
      
    } catch (e) {
      console.error("Failed to update SEO schema and meta tags", e);
    }
  }, [
    viewMode,
    content.logoUrl,
    content.landingTitle,
    content.landingSubtitle,
    currentSection,
    currentSection?.title,
    currentSection?.description,
    currentSection?.seoTitle,
    currentSection?.seoDescription,
    content.heroVideoUrl,
    content.blogPosts,
    content.sections,
    boutiqueId,
  ]);

  // Intersection Observer for preloading next section's image when approaching end of current section
  useEffect(() => {
    if (!nextSec?.image) return;

    let observedElement: Element | null = null;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = new window.Image();
          img.src = nextSec.image as string;
        }
      });
    }, { rootMargin: "200px" });

    // Use MutationObserver to find the end of the view as subcomponents render
    const observeEnd = () => {
      const footer = document.querySelector('footer, .bottom-sentinel, [data-section-end]');
      if (footer && footer !== observedElement) {
        if (observedElement) observer.unobserve(observedElement);
        observer.observe(footer);
        observedElement = footer;
      }
    };

    observeEnd();
    const mutation = new MutationObserver(observeEnd);
    mutation.observe(document.body, { childList: true, subtree: true });

    return () => {
      mutation.disconnect();
      observer.disconnect();
    };
  }, [nextSec]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") nextSection();
      if (e.key === "ArrowLeft") prevSection();
      if (e.key === "Escape") setIsMenuOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSection, prevSection, setIsMenuOpen]);

  const containerVariants: any = {
    initial: (direction: number) => ({
      y: direction > 0 ? "100%" : "-100%",
      opacity: 0,
      filter: "blur(4px)",
    }),
    animate: {
      y: "0%",
      opacity: 1,
      filter: "blur(0px)",
      transition: {
        duration: 1,
        ease: [0.76, 0, 0.24, 1],
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
    exit: (direction: number) => ({
      y: direction < 0 ? "100%" : "-100%",
      opacity: 0,
      filter: "blur(4px)",
      transition: {
        duration: 0.8,
        ease: [0.76, 0, 0.24, 1],
      },
    }),
  };

  const itemVariants: any = {
    initial: { opacity: 0, y: 30 },
    animate: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
    exit: { opacity: 0, y: -20, transition: { duration: 0.4 } },
  };

  if (viewMode === "admin") {
    return (
      <div className="relative w-full h-[100dvh] bg-[#050505] text-[#F5F5F0] overflow-hidden">
        <header className="absolute top-0 w-full flex justify-between items-center px-8 md:px-12 py-8 z-[70] bg-[#0A0A0A] border-b border-white/5">
          <a
            href="/"
            className="flex items-center space-x-4 md:space-x-6 cursor-pointer"
            onClick={(e) => {
              if (window.location.pathname.startsWith("/admin")) {
                // native navigation happens implicitly or explicit href assignment
              } else {
                e.preventDefault();
                setViewMode("app");
              }
            }}
          >
            <span className="text-xl">←</span>
            <span className="text-xs md:text-[10px] uppercase tracking-[0.4em]">
              Back to Experience
            </span>
          </a>
        </header>
        <ErrorBoundary onRetry={() => window.location.reload()}>
          <Suspense fallback={<LoadingFallback />}>
            <AdminView />
          </Suspense>
        </ErrorBoundary>
      </div>
    );
  }

  if (viewMode === "terms") {
    return (
      <ErrorBoundary onRetry={() => window.location.reload()}>
        <Suspense fallback={<LoadingFallback />}>
          <div className="relative w-full h-[100dvh] bg-[#050505] text-[#F5F5F0] overflow-hidden">
            <header className="fixed top-0 w-full flex justify-between items-center px-4 sm:px-6 md:px-12 py-4 sm:py-6 md:py-8 z-[70] bg-[#050505]/90 backdrop-blur-md border-b border-white/5">
              <a
                href="/"
                className="flex items-center space-x-4 md:space-x-6 cursor-pointer group"
                onClick={(e) => {
                  e.preventDefault();
                  window.history.pushState(null, "", "/");
                  setViewMode("app");
                }}
              >
                <span className="text-xl group-hover:-translate-x-2 transition-transform duration-300">
                  <ChevronLeft size={20} className="font-light" />
                </span>
                <span className="text-xs md:text-[10px] uppercase tracking-[0.4em]">
                  Back to Experience
                </span>
              </a>
            </header>
            <TermsView onInquiry={() => setIsContactOpen(true)} />
          </div>
          <ConsultationModal
            isOpen={isContactOpen}
            onClose={() => setIsContactOpen(false)}
          />
        </Suspense>
      </ErrorBoundary>
    );
  }

  if (viewMode === "page") {
    return (
      <ErrorBoundary onRetry={() => window.location.reload()}>
        <Suspense fallback={<LoadingFallback />}>
          <PageView />
          <ConsultationModal
            isOpen={isContactOpen}
            onClose={() => setIsContactOpen(false)}
          />
        </Suspense>
      </ErrorBoundary>
    );
  }

  if (viewMode === "boutique" && boutiqueId) {
    return (
      <ErrorBoundary onRetry={() => window.location.reload()}>
        <Suspense fallback={<LoadingFallback />}>
          <div className="relative w-full h-[100dvh] bg-[#050505] text-[#F5F5F0] overflow-hidden">
            <header className="fixed top-0 w-full flex justify-between items-center px-4 sm:px-6 md:px-12 py-4 sm:py-6 md:py-8 z-[70] bg-[#050505]/90 backdrop-blur-md border-b border-white/5">
              <a
                href="/"
                className="flex items-center space-x-4 md:space-x-6 cursor-pointer group"
                onClick={(e) => {
                  e.preventDefault();
                  window.history.pushState(null, "", "/");
                  setViewMode("app");
                }}
              >
                <span className="text-xl group-hover:-translate-x-2 transition-transform duration-300">
                  <ChevronLeft size={20} className="font-light" />
                </span>
                <span className="text-xs md:text-[10px] uppercase tracking-[0.4em]">
                  Back to Experience
                </span>
              </a>
            </header>
            <MemoizedBoutiqueView boutiqueId={boutiqueId} onInquiry={() => setIsContactOpen(true)} />
          </div>
          <ConsultationModal
            isOpen={isContactOpen}
            onClose={() => setIsContactOpen(false)}
          />
        </Suspense>
      </ErrorBoundary>
    );
  }

  if (viewMode === "locator") {
    return (
      <ErrorBoundary onRetry={() => window.location.reload()}>
        <Suspense fallback={<LoadingFallback />}>
          <div className="relative w-full h-[100dvh] bg-[#050505] text-[#F5F5F0] overflow-hidden">
            <header className="fixed top-0 w-full flex justify-between items-center px-4 sm:px-6 md:px-12 py-4 sm:py-6 md:py-8 z-[70] bg-[#050505]/90 backdrop-blur-md border-b border-white/5">
              <a
                href="/"
                className="flex items-center space-x-4 md:space-x-6 cursor-pointer group"
                onClick={(e) => {
                  e.preventDefault();
                  window.history.pushState(null, "", "/");
                  setViewMode("app");
                }}
              >
                <span className="text-xl group-hover:-translate-x-2 transition-transform duration-300">
                  <ChevronLeft size={20} className="font-light" />
                </span>
                <span className="text-xs md:text-[10px] uppercase tracking-[0.4em]">
                  Back to Experience
                </span>
              </a>
            </header>
            <StoreLocatorView onInquiry={() => setIsContactOpen(true)} />
          </div>
          <ConsultationModal
            isOpen={isContactOpen}
            onClose={() => setIsContactOpen(false)}
          />
        </Suspense>
      </ErrorBoundary>
    );
  }

  return (
    <div className="relative w-full min-h-[100dvh] bg-[#050505] text-[#F5F5F0] font-sans selection:bg-[#D4AF37] selection:text-black overflow-x-hidden">
      {/* Background Ambience Layer (Permanent) */}
      <div className="fixed inset-0 pointer-events-none">
        <motion.div
          animate={{ x: [0, 50, -50, 0], y: [0, 30, -30, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-1/4 -right-1/4 w-[80vw] h-[80vw] bg-[#D4AF37]/[0.02] rounded-full blur-[180px]"
        />
        <motion.div
          animate={{ x: [0, -40, 40, 0], y: [0, -20, 20, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-1/4 -left-1/4 w-[70vw] h-[70vw] bg-white/[0.015] rounded-full blur-[150px]"
        />
      </div>

      {/* Header */}
      {/* Hidden Site Index for SEO/Crawlers */}
      <nav className="sr-only" aria-label="Site Navigation">
        {SECTIONS.map((section) => (
          <a key={`seo-${section.id}`} href={section.id === 'home' ? '/' : section.id === 'contact' ? '/pages/contact' : `/${section.id}`}>
            {section.title}
          </a>
        ))}
      </nav>
      <header className="fixed top-[env(safe-area-inset-top,0px)] w-full flex justify-between items-center px-4 sm:px-6 md:px-12 py-4 sm:py-6 md:py-10 z-[70] pointer-events-none bg-gradient-to-b from-black/80 via-black/40 to-transparent backdrop-blur-[2px]">
        {/* Left: Hamburger (Mobile) / "Explore" (Desktop) */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="flex items-center justify-start cursor-pointer hover:opacity-80 transition-opacity pointer-events-auto w-1/3"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => { triggerHaptic(); setIsMenuOpen(true); }}
            className="flex flex-col justify-center items-center space-y-2 group cursor-pointer pointer-events-auto min-h-[44px] min-w-[44px] p-2 -ml-2"
          >
            <div className="relative flex flex-col justify-between w-6 h-[10px] md:h-[12px]">
              <span className="w-full h-[1.5px] bg-[#D4AF37] md:bg-[#C5A059] group-hover:bg-[#D4AF37] transition-all drop-shadow-[0_0_8px_rgba(0,0,0,0.8)]"></span>
              <span className="w-2/3 h-[1.5px] bg-[#D4AF37] md:bg-[#C5A059] group-hover:bg-[#D4AF37] transition-all drop-shadow-[0_0_8px_rgba(0,0,0,0.8)] mt-auto"></span>
            </div>
            <span className="hidden md:block text-sm md:text-[11px] uppercase tracking-[0.2em] text-[#C5A059] opacity-80 group-hover:text-[#D4AF37] group-hover:opacity-100 transition-all drop-shadow-[0_0_8px_rgba(0,0,0,0.8)]">
              Menu
            </span>
          </motion.div>
        </motion.div>

        {/* Center: Logo */}
        <motion.a
          href="/"
          aria-label="Kirthi Diamonds"
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => { e.preventDefault(); goToSection(0); }}
          className="flex flex-col items-center cursor-pointer pointer-events-auto justify-center w-1/3"
        >
          {content?.logoUrl ? (
            <div className="relative flex items-center justify-center">
              {!logoLoaded && (
                <div className="absolute inset-x-[-20%] inset-y-[-10%] bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse blur-sm" />
              )}
              <img
                fetchPriority="high"
                src={content.logoUrl || undefined}
                alt="Kirthi Diamonds"
                width="180"
                height="48"
                onLoad={() => setLogoLoaded(true)}
                className={`h-8 sm:h-10 md:h-12 w-auto filter brightness-125 drop-shadow-lg object-contain transition-opacity duration-300 ${logoLoaded ? 'opacity-100' : 'opacity-0'}`}
              />
            </div>
          ) : (
            <div className="h-8 sm:h-10 md:h-12 w-32 md:w-48 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse blur-sm" />
          )}
          <div className="hidden md:block">
            <span className="text-sm font-light uppercase tracking-[0.4em] text-center whitespace-nowrap">
              Kirthi Diamonds
            </span>
          </div>
        </motion.a>

        {/* Right: Cart/Explore */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="w-1/3 flex justify-end items-center pointer-events-auto space-x-2 md:space-x-6"
        >
          <motion.a
            href="/contact"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.preventDefault();
              window.history.pushState(null, "", "/contact");
              setViewMode("page");
            }}
            className="hidden lg:flex items-center justify-center border border-[#D4AF37]/50 hover:border-[#D4AF37] px-6 py-2 transition-all group min-h-[44px]"
          >
            <span className="text-xs uppercase tracking-[0.2em] text-[#D4AF37] opacity-80 group-hover:opacity-100 transition-all">
              Visit Us
            </span>
          </motion.a>
          
          <motion.a
            href="/shop"
            aria-label="Shop Boutique"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.preventDefault();
              goToSection(
                content?.sections?.findIndex((s) => s.isShop) ||
                  SECTIONS.findIndex((s) => s.isShop),
              );
            }}
            className="flex items-center justify-center space-x-3 md:space-x-4 md:space-x-6 group min-h-[44px] min-w-[44px] p-2 -mr-2 cursor-pointer"
          >
            <span className="hidden md:block text-sm md:text-[11px] uppercase tracking-[0.2em] opacity-60 group-hover:opacity-100 transition-all drop-shadow-[0_0_8px_rgba(0,0,0,0.8)]">
              Boutique
            </span>
            <div className="relative">
              <ShoppingBag
                size={20}
                className="text-white/60 group-hover:text-white transition-all drop-shadow-[0_0_8px_rgba(0,0,0,0.8)]"
              />
            </div>
          </motion.a>
        </motion.div>
      </header>

      {/* Dynamic Breadcrumbs */}
      <BreadcrumbNavigation currentSection={currentSection} onHomeClick={() => goToSection(0)} />

      {/* Enhanced Side Navigation */}
      <a
        href={prevSec.id === 'home' ? '/' : `/${prevSec.id}`}
        onClick={(e) => { e.preventDefault(); prevSection(); }}
        className="hidden md:flex absolute left-0 top-0 h-full w-24 items-center justify-center z-50 cursor-pointer group hover:bg-black/20 transition-colors duration-700"
      >
        <motion.div
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"
        />
        <div className="absolute left-0 top-0 h-full w-[1px] bg-gradient-to-b from-transparent via-[#D4AF37]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

        {/* Desktop Vertical Text */}
        <div className="rotate-[-90deg] whitespace-nowrap relative transform transition-all duration-500 group-hover:scale-105 group-hover:translate-x-2">
          <span className="text-sm md:text-[11px] uppercase tracking-[0.5em] text-white/30 group-hover:text-white transition-all duration-500 flex items-center gap-6">
            <span className="transform -rotate-90 group-hover:-translate-y-2 transition-transform duration-500 text-[#D4AF37] opacity-50 group-hover:opacity-100">
              ←
            </span>
            <span className="relative">
              {prevSec.title}
              <span className="absolute -bottom-3 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/80 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-center" />
            </span>
          </span>
        </div>
      </a>

      <a
        href={nextSec.id === 'home' ? '/' : `/${nextSec.id}`}
        onClick={(e) => { e.preventDefault(); nextSection(); }}
        className="hidden md:flex absolute right-0 top-0 h-full w-24 items-center justify-center z-50 cursor-pointer group hover:bg-black/20 transition-colors duration-700"
      >
        <motion.div
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          className="absolute inset-0 bg-gradient-to-l from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"
        />
        <div className="absolute right-0 top-0 h-full w-[1px] bg-gradient-to-b from-transparent via-[#D4AF37]/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

        {/* Desktop Vertical Text */}
        <div className="rotate-[90deg] whitespace-nowrap relative transform transition-all duration-500 group-hover:scale-105 group-hover:-translate-x-2">
          <span className="text-sm md:text-[11px] uppercase tracking-[0.5em] text-white/30 group-hover:text-white transition-all duration-500 flex items-center gap-6">
            <span className="relative">
              {nextSec.title}
              <span className="absolute -bottom-3 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/80 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-center" />
            </span>
            <span className="transform rotate-90 group-hover:-translate-y-2 transition-transform duration-500 text-[#D4AF37] opacity-50 group-hover:opacity-100">
              →
            </span>
          </span>
        </div>
      </a>

      {/* Progressive Content Area */}
      <main {...mainSwipeHandlers} className="min-h-[100dvh] w-full relative touch-pan-y">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.section
            key={currentIndex}
            custom={direction}
            variants={containerVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="absolute inset-0 z-10"
          >
            {/* Background Image Layer with Selective Focus */}
            <motion.div
              custom={direction}
              variants={{
                initial: (direction: number) => ({
                  scale: 1.2,
                  y: direction > 0 ? "-20%" : "20%",
                  filter: "blur(20px)",
                  opacity: 0,
                }),
                animate: {
                  scale: 1,
                  y: "0%",
                  filter: "blur(5px)",
                  opacity: 0.15,
                  transition: {
                    duration: 1.2,
                    ease: [0.76, 0, 0.24, 1],
                  },
                },
                exit: (direction: number) => ({
                  scale: 1.1,
                  y: direction > 0 ? "20%" : "-20%",
                  filter: "blur(10px)",
                  opacity: 0,
                  transition: {
                    duration: 1,
                    ease: [0.76, 0, 0.24, 1],
                  },
                }),
              } as any}
              initial="initial"
              animate="animate"
              exit="exit"
              className="absolute inset-0 -z-20 overflow-hidden"
            >
              <div className="sticky top-0 w-full h-[100dvh] overflow-hidden">
                <FastImage
                  src={currentSection.image || undefined}
                  alt=""
                  className="w-full h-full object-cover object-top md:object-center grayscale brightness-25"
                  loading="eager"
                  fetchPriority="high"
                  decoding="sync"
                  sizes="100vw"
                />
                <div className="absolute inset-0 bg-radial-gradient from-transparent to-[#050505] opacity-80" />
                <div className="absolute inset-0 bg-black/30" />
              </div>
            </motion.div>

             <ErrorBoundary onRetry={() => window.location.reload()}>
              <Suspense fallback={<LoadingFallback />}>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }} className="w-full h-[100dvh] md:h-screen relative z-10">
                  {currentSection.id === "home" ? (
                    <MemoizedLandingView onExplore={nextSection} nextSectionId={nextSec?.id} />
                  ) : currentSection.id === "journal" ? (
                    <MemoizedJournalView onInquiry={handleInquiry} onGoHome={handleGoHome} />
                  ) : currentSection.id === "heritage" ? (
                    <MemoizedHeritageArchive onInquiry={handleInquiry} onGoHome={handleGoHome} />
                  ) : currentSection.id === "terms" ? (
                    <MemoizedTermsView onInquiry={handleInquiry} />
                  ) : currentSection.id === "methodology" ? (
                    <MemoizedSavoirFaire onInquiry={handleInquiry} onGoHome={handleGoHome} />
                  ) : currentSection.id === "maison" ? (
                    <MemoizedMaisonView onInquiry={handleInquiry} onGoHome={handleGoHome} />
                  ) : currentSection.isShop ? (
                    <MemoizedShopExperience onInquiry={handleInquiry} onGoHome={handleGoHome} />
                  ) : currentSection.id === "contact" ? (
                    <MemoizedContactView  />
                  ) : currentSection.id === "brides" ? (
                    <MemoizedBridesShowcase onInquiry={handleInquiry} onGoHome={handleGoHome} />
                  ) : (
                    <div className="w-full max-w-7xl px-14 md:px-32 flex flex-col items-center">
                      <motion.div
                      variants={itemVariants}
                      className="relative mb-12 text-center"
                    >
                      <motion.div
                        initial={{ scaleY: 0 }}
                        animate={{ scaleY: 1 }}
                        className="w-px h-[80px] bg-gradient-to-b from-transparent to-[#D4AF37] mx-auto mb-16 shadow-[0_0_20px_rgba(212,175,55,0.6)] origin-top"
                      />

                      <motion.h2
                        variants={itemVariants}
                        className="text-sm md:text-[12px] uppercase tracking-[0.6em] text-[#D4AF37] mb-8 font-light"
                      >
                        Exclusivity — {currentSection.subtitle}
                      </motion.h2>

                      <motion.h2
                        variants={itemVariants}
                        className="text-3xl md:text-6xl lg:text-[80px] font-serif italic mb-10 leading-[0.9] tracking-tight"
                      >
                        {
                          (currentSection.id === "brides"
                            ? "Our Patrons"
                            : currentSection.title
                          ).split(" ")[0]
                        }{" "}
                        <br className="md:hidden" />
                        <span className="not-italic font-light opacity-90 block md:inline md:ml-6">
                          {(currentSection.id === "brides"
                            ? "Our Patrons"
                            : currentSection.title
                          )
                            .split(" ")
                            .slice(1)
                            .join(" ")}
                        </span>
                      </motion.h2>

                      <motion.p
                        variants={itemVariants}
                        className="max-w-xl mx-auto text-sm md:text-lg leading-relaxed font-light tracking-wide italic opacity-50"
                      >
                        {currentSection.description}
                      </motion.p>
                    </motion.div>

                    <motion.div
                      variants={itemVariants}
                      className="mt-4 flex flex-col md:flex-row items-center gap-12"
                    >
                      <motion.button
                        whileHover={{
                          scale: 1.05,
                          backgroundColor: "#D4AF37",
                          color: "#000",
                        }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setIsContactOpen(true)}
                        className="px-10 py-4 border border-[#D4AF37]/50 text-[#D4AF37] text-sm md:text-[11px] uppercase tracking-[0.4em] transition-all group overflow-hidden relative"
                      >
                        <span className="relative z-10">Private Inquiry</span>
                        <motion.div className="absolute inset-0 bg-[#D4AF37] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out -z-0" />
                      </motion.button>

                      <div className="flex items-center space-x-6">
                        <div className="w-10 h-px bg-white/20"></div>
                        <a
                          href={nextSec ? (nextSec.id === 'home' ? '/' : `/${nextSec.id}`) : undefined}
                          onClick={(e) => { e.preventDefault(); nextSection(); }}
                          className="text-xs md:text-[10px] uppercase tracking-[0.4em] opacity-30 font-light italic hover:opacity-80 transition-opacity cursor-pointer focus:outline-none p-4 -ml-4 inline-block"
                        >
                          Explore Anthology
                        </a>
                      </div>
                    </motion.div>
                  </div>
                )}
                </motion.div>
              </Suspense>
            </ErrorBoundary>
          </motion.section>
        </AnimatePresence>
      </main>

      {/* Decorative Corners */}
      <div className="absolute top-10 left-10 w-8 h-8 border-t border-l border-white/5 pointer-events-none" />
      <div className="absolute top-10 right-10 w-8 h-8 border-t border-r border-white/5 pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-8 h-8 border-b border-l border-white/5 pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-8 h-8 border-b border-r border-white/5 pointer-events-none" />

      {/* Full Screen Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(30px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.6 }}
            className="fixed inset-0 bg-[#050505]/95 z-[100] overflow-y-auto custom-scrollbar"
            {...menuSwipeHandlers}
          >
            <div className="min-h-full w-full flex flex-col justify-start md:justify-center items-center px-8 md:px-12 pt-24 pb-8 md:pt-12 md:pb-6 relative">
              <motion.button
                whileHover={{ rotate: 90 }}
                onClick={() => setIsMenuOpen(false)}
                className="fixed md:absolute top-4 right-4 md:top-12 md:right-12 text-[#D4AF37] md:text-[#F5F5F0] hover:text-[#D4AF37] transition-all p-2 md:p-4 z-[110]"
              >
                <X size={32} strokeWidth={1} />
              </motion.button>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 w-full max-w-6xl">
                <div className="flex flex-col space-y-6 md:space-y-8">
                  <span className="text-xs md:text-[10px] uppercase tracking-[0.6em] text-[#D4AF37]/60 mb-6">
                    Manifesto
                  </span>
                  {SECTIONS.map((section, idx) => (
                    <motion.a
                      href={section.id === 'home' ? '/' : section.id === 'contact' ? '/pages/contact' : `/${section.id}`}
                      key={section.id}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + idx * 0.08 }}
                      onClick={(e) => {
                        e.preventDefault();
                        goToSection(idx);
                      }}
                      className="group flex items-center text-left py-3 md:py-1 -my-3 md:-my-1 cursor-pointer"
                    >
                      <span className="text-xs md:text-[10px] font-sans mr-8 opacity-20 group-hover:opacity-100 group-hover:text-[#D4AF37] transition-all">
                        0{idx + 1}
                      </span>
                      <span
                        className={`text-3xl md:text-6xl font-serif italic transition-all relative ${
                          currentIndex === idx
                            ? "text-[#D4AF37]"
                            : "text-white/40 group-hover:text-white"
                        }`}
                      >
                        {section.id === "brides"
                          ? "Our Patrons"
                          : section.title}
                        <motion.div
                          initial={{ width: 0 }}
                          whileHover={{ width: "110%" }}
                          className="absolute -bottom-2 left-0 h-px bg-[#D4AF37]/40 pointer-events-none"
                        />
                      </span>
                    </motion.a>
                  ))}
                  <motion.a
                    href="/find-a-store"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 + SECTIONS.length * 0.08 }}
                    onClick={(e) => {
                      e.preventDefault();
                      window.history.pushState(null, "", "/find-a-store");
                      setViewMode("locator");
                      setIsMenuOpen(false);
                    }}
                    className="group flex items-center text-left py-3 md:py-1 -my-3 md:-my-1 cursor-pointer"
                  >
                    <span className="text-xs md:text-[10px] font-sans mr-8 opacity-20 group-hover:opacity-100 group-hover:text-[#D4AF37] transition-all">
                      0{SECTIONS.length + 1}
                    </span>
                    <span
                      className={`text-3xl md:text-6xl font-serif italic transition-all relative ${
                        window.location.pathname === "/find-a-store"
                          ? "text-[#D4AF37]"
                          : "text-white/40 group-hover:text-white"
                      }`}
                    >
                      Find a Store
                      <motion.div
                        initial={{ width: 0 }}
                        whileHover={{ width: "110%" }}
                        className="absolute -bottom-2 left-0 h-px bg-[#D4AF37]/40 pointer-events-none"
                      />
                    </span>
                  </motion.a>
                </div>

                <div className="flex flex-col justify-between pt-8 pb-4 md:pt-12 md:pb-6 border-t md:border-t-0 md:border-l border-white/5 md:pl-16">
                  <div className="space-y-8">
                    <div className="space-y-3">
                      <h4 className="text-xs md:text-[10px] uppercase tracking-[0.4em] opacity-40">
                        Kochi Boutique
                      </h4>
                      <a
                        href="/kochi"
                        onClick={(e) => {
                          e.preventDefault();
                          window.history.pushState(null, "", "/kochi");
                          setViewMode("boutique");
                          setBoutiqueId("kochi");
                        }}
                        className="block text-sm font-light leading-relaxed text-white/80 hover:text-[#D4AF37] transition-colors"
                      >
                        34/572, By Pass Rd, Palarivattom
                        <br />
                        Ernakulam, Kerala 682024
                      </a>
                      <a
                        href="/kochi"
                        onClick={(e) => {
                          e.preventDefault();
                          window.history.pushState(null, "", "/kochi");
                          setViewMode("boutique");
                          setBoutiqueId("kochi");
                        }}
                        className="inline-flex items-center space-x-2 text-xs md:text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] hover:text-white transition-colors mt-1 p-3 -ml-3"
                      >
                        <MapPin size={10} />
                        <span>View Boutique Details & Map</span>
                      </a>
                    </div>
                    <div className="space-y-3">
                      <h4 className="text-xs md:text-[10px] uppercase tracking-[0.4em] opacity-40">
                        Calicut Boutique
                      </h4>
                      <a
                        href="/calicut"
                        onClick={(e) => {
                          e.preventDefault();
                          window.history.pushState(null, "", "/calicut");
                          setViewMode("boutique");
                          setBoutiqueId("calicut");
                        }}
                        className="block text-sm font-light leading-relaxed text-white/80 hover:text-[#D4AF37] transition-colors"
                      >
                        61/11508A, opp. Federal Bank
                        <br />
                        Puthiyara, Kozhikode, Kerala 673004
                      </a>
                      <a
                        href="/calicut"
                        onClick={(e) => {
                          e.preventDefault();
                          window.history.pushState(null, "", "/calicut");
                          setViewMode("boutique");
                          setBoutiqueId("calicut");
                        }}
                        className="inline-flex items-center space-x-2 text-xs md:text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] hover:text-white transition-colors mt-1 p-3 -ml-3"
                      >
                        <MapPin size={10} />
                        <span>View Boutique Details & Map</span>
                      </a>
                    </div>
                    <div className="space-y-3 pt-4 border-t border-white/5">
                      <h4 className="text-xs md:text-[10px] uppercase tracking-[0.4em] opacity-40">
                        one-on-one bespoke consultation
                      </h4>
                      <div className="text-sm font-light leading-relaxed flex flex-col space-y-2">
                        <div className="flex gap-4">
                          <span className="text-white/50 text-xs">Kochi:</span>
                          <a
                            href="tel:+919847086990"
                            className="hover:text-[#D4AF37] transition-colors p-2 -m-2 block"
                          >
                            +91 98470 86990
                          </a>
                        </div>
                        <div className="flex gap-4">
                          <span className="text-white/50 text-xs">
                            Calicut:
                          </span>
                          <a
                            href="tel:+919847086002"
                            className="hover:text-[#D4AF37] transition-colors p-2 -m-2 block"
                          >
                            +91 98470 86002
                          </a>
                        </div>
                        <a
                          href="mailto:info@kirthidiamonds.com"
                          className="hover:text-[#D4AF37] transition-colors mt-2 block p-2 -ml-2"
                        >
                          info@kirthidiamonds.com
                        </a>
                      </div>
                    </div>
                    
                    <div className="pt-8">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          setIsContactOpen(true);
                          setIsMenuOpen(false);
                        }}
                        className="w-full flex items-center justify-center border border-[#D4AF37]/50 hover:border-[#D4AF37] px-6 py-4 transition-all group"
                      >
                        <span className="text-xs uppercase tracking-[0.2em] text-[#D4AF37] opacity-80 group-hover:opacity-100 transition-all">
                          Book Consultation
                        </span>
                      </button>
                    </div>
                  </div>

                  <div className="pt-8">
                    {content?.logoUrl && (
                      <img
                        loading="lazy"
                        src={content.logoUrl || undefined}
                        width="150"
                        height="80"
                        className="h-16 md:h-20 w-auto grayscale opacity-40 mb-6 md:mb-8 object-contain"
                        alt="Kirthi Diamonds Seal"
                      />
                    )}
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-4 opacity-40">
                      <a
                        href="/terms"
                        onClick={(e) => {
                          e.preventDefault();
                          window.history.pushState(null, "", "/terms");
                          setViewMode("terms");
                          setIsMenuOpen(false);
                        }}
                        className="text-xs md:text-[10px] uppercase tracking-[0.3em] hover:text-[#D4AF37] hover:opacity-100 transition-all cursor-pointer py-2 md:-m-2 inline-flex items-center"
                      >
                        Terms & Conditions
                      </a>
                      <a
                        href="/pages/policies"
                        onClick={(e) => {
                          e.preventDefault();
                          window.history.pushState(null, "", "/pages/policies");
                          setViewMode("page");
                        }}
                        className="text-xs md:text-[10px] uppercase tracking-[0.3em] hover:text-[#D4AF37] hover:opacity-100 transition-all cursor-pointer inline-flex items-center py-2 md:-m-2"
                      >
                        Policies & Ethics
                      </a>
                      <span
                        onClick={() => setActiveInfoModal("care")}
                        className="text-xs md:text-[10px] uppercase tracking-[0.3em] hover:text-[#D4AF37] hover:opacity-100 transition-all cursor-pointer py-2 md:-m-2 inline-flex items-center"
                      >
                        Care
                      </span>
                      <a
                        href="/pages/diamond-jewellery"
                        onClick={(e) => {
                          e.preventDefault();
                          window.history.pushState(null, "", "/pages/diamond-jewellery");
                          setViewMode("page");
                        }}
                        className="text-xs md:text-[10px] uppercase tracking-[0.3em] hover:text-[#D4AF37] hover:opacity-100 transition-all cursor-pointer inline-flex items-center py-2 md:-m-2"
                      >
                        Diamond Jewellery
                      </a>
                      <a
                        href="/pages/certified-diamonds"
                        onClick={(e) => {
                          e.preventDefault();
                          window.history.pushState(null, "", "/pages/certified-diamonds");
                          setViewMode("page");
                        }}
                        className="text-xs md:text-[10px] uppercase tracking-[0.3em] hover:text-[#D4AF37] hover:opacity-100 transition-all cursor-pointer inline-flex items-center py-2 md:-m-2"
                      >
                        Certified Diamonds
                      </a>
                      <a
                        href="/pages/exchange-policy"
                        onClick={(e) => {
                          e.preventDefault();
                          window.history.pushState(null, "", "/pages/exchange-policy");
                          setViewMode("page");
                          setIsMenuOpen(false);
                        }}
                        className="text-xs md:text-[10px] uppercase tracking-[0.3em] hover:text-[#D4AF37] hover:opacity-100 transition-all cursor-pointer inline-flex items-center py-2 md:-m-2"
                      >
                        Exchange Policy
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ConsultationModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />
      <InfoModal
        type={activeInfoModal}
        onClose={() => setActiveInfoModal(null)}
      />

      {/* Innovative Social Network Links */}
      <div className="fixed bottom-6 left-6 md:bottom-10 md:left-10 z-[80] pointer-events-auto">
        <div 
          className="group relative flex flex-col items-center"
          onMouseLeave={() => setShowSocialMenu(false)}
        >
          <div className={`absolute bottom-full pb-4 flex flex-col items-center gap-4 transition-all duration-700 opacity-0 translate-y-8 ${showSocialMenu ? 'opacity-100 translate-y-0 pointer-events-auto' : 'pointer-events-none md:group-hover:opacity-100 md:group-hover:translate-y-0 md:group-hover:pointer-events-auto'}`}>
            <a href="https://instagram.com/kirthidiamonds" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="p-3 bg-black/40 border border-white/5 backdrop-blur-md rounded-full text-white/50 hover:text-[#D4AF37] hover:border-[#D4AF37]/50 transition-all hover:scale-110 shadow-lg group/icon">
              <Instagram size={18} strokeWidth={1.5} className="group-hover/icon:opacity-100 opacity-80" />
            </a>
            <a href="https://facebook.com/kirthidiamonds" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="p-3 bg-black/40 border border-white/5 backdrop-blur-md rounded-full text-white/50 hover:text-[#D4AF37] hover:border-[#D4AF37]/50 transition-all hover:scale-110 shadow-lg group/icon">
              <Facebook size={18} strokeWidth={1.5} className="group-hover/icon:opacity-100 opacity-80" />
            </a>
            <a href="https://twitter.com/kirthidiamonds" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="p-3 bg-black/40 border border-white/5 backdrop-blur-md rounded-full text-white/50 hover:text-[#D4AF37] hover:border-[#D4AF37]/50 transition-all hover:scale-110 shadow-lg group/icon">
              <Twitter size={18} strokeWidth={1.5} className="group-hover/icon:opacity-100 opacity-80" />
            </a>
            <div className="w-px h-10 bg-gradient-to-b from-[#D4AF37]/40 to-transparent my-1" />
          </div>
          <div 
            className="w-14 h-14 rounded-full border border-white/10 flex items-center justify-center cursor-pointer group-hover:border-[#D4AF37]/50 transition-all duration-500 bg-black/60 backdrop-blur-md hover:bg-[#D4AF37]/5"
            onClick={() => setShowSocialMenu(!showSocialMenu)}
          >
            <span className="text-xs md:text-[10px] uppercase tracking-[0.2em] text-[#D4AF37]/70 group-hover:text-[#D4AF37]">
              Social
            </span>
          </div>
        </div>
      </div>

      {/* Floating WhatsApp Button */}
      <div
        className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-[80] flex flex-col items-end pointer-events-none"
        style={{ marginBottom: "env(safe-area-inset-bottom)" }}
      >
        <AnimatePresence>
          {showWhatsAppMenu && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="bg-[#1A1A1A] border border-white/10 rounded-2xl p-4 mb-4 shadow-2xl flex flex-col gap-4 md:gap-3 pointer-events-auto min-w-[200px]"
            >
              <div className="text-xs md:text-[10px] uppercase tracking-[0.2em] text-[#D4AF37] opacity-80 mb-1 px-1">
                Connect with Store
              </div>
              <a
                href="https://wa.me/919847086990"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setShowWhatsAppMenu(false)}
                className="flex items-center gap-4 md:gap-3 p-3 rounded-xl hover:bg-white/5 active:bg-white/10 transition-colors group"
              >
                <div className="w-8 h-8 rounded-full bg-[#25D366] flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                  <MessageCircle size={16} />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-white/90">
                    Kochi Boutique
                  </span>
                  <span className="text-xs md:text-[10px] text-white/50">
                    +91 98470 86990
                  </span>
                </div>
              </a>
              <a
                href="https://wa.me/919847086002"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setShowWhatsAppMenu(false)}
                className="flex items-center gap-4 md:gap-3 p-3 rounded-xl hover:bg-white/5 active:bg-white/10 transition-colors group"
              >
                <div className="w-8 h-8 rounded-full bg-[#25D366] flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                  <MessageCircle size={16} />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-white/90">
                    Calicut Boutique
                  </span>
                  <span className="text-xs md:text-[10px] text-white/50">
                    +91 98470 86002
                  </span>
                </div>
              </a>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setShowWhatsAppMenu(!showWhatsAppMenu)}
          className="w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-[0_10px_30px_rgba(37,211,102,0.3)] hover:scale-110 hover:shadow-[0_15px_40px_rgba(37,211,102,0.4)] transition-all duration-300 pointer-events-auto"
          aria-label={
            showWhatsAppMenu
              ? "Close WhatsApp Menu"
              : "Chat with us on WhatsApp"
          }
        >
          {showWhatsAppMenu ? <X size={28} /> : <MessageCircle size={28} />}
        </button>
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "ContactPage",
        "@id": "https://kirthidiamonds.com/contact#page",
        "name": "Contact Kirthi Diamonds",
        "description": "Kirthi Diamonds creates bespoke, direct-sourced diamond masterpieces for discerning brides and collectors, avoiding retail markups through our bespoke consultation experience. Get in touch to schedule a bespoke consultation at our Kochi showroom at 34/572, By Pass Road, Palarivattom (Mon-Sat 10:00-19:30) or Calicut showroom at 61/11508A, Opposite Federal Bank, Puthiyara (Mon-Sat 10:00-19:30). Call +91 98470 86990.",
        "url": "https://kirthidiamonds.com/contact",
        "mainEntity": [
          { "@id": "https://kirthidiamonds.com/#kochi" },
          { "@id": "https://kirthidiamonds.com/#calicut" }
        ]
      }) }} />
    </div>
  );
}
