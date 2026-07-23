import { marked } from 'marked';
import React, { useEffect, useState, useMemo } from 'react';
import BreadcrumbNavigation from './BreadcrumbNavigation';
import { SharedFooter } from './SharedFooter';
import { useContent } from '../contexts/ContentContext';
import { ChevronDown, ThumbsUp, ThumbsDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { injectFAQSchema } from '../utils/seo';

export default function FAQView() {
  const { content } = useContent();
  const faqs = useMemo(() => content?.faqs || [], [content?.faqs]);
  
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [feedbackState, setFeedbackState] = useState<Record<number, 'yes' | 'no'>>({});

  const categories = useMemo(() => {
    const cats = new Set<string>();
    faqs.forEach((faq: any) => {
      if (faq.category) cats.add(faq.category);
    });
    return ['All', ...Array.from(cats)];
  }, [faqs]);

  const filteredFaqs = useMemo(() => {
    if (activeCategory === 'All') return faqs;
    return faqs.filter((faq: any) => faq.category === activeCategory);
  }, [faqs, activeCategory]);

  useEffect(() => {
    
    
    // Description
    
    const descContent = "Find answers to frequently asked questions about diamond jewellery in Kochi, GIA and IGI certification, boutique locations, and buyback policies.";
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) metaDescription.setAttribute("content", descContent);
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) ogDescription.setAttribute("content", descContent);
    const twitterDescription = document.querySelector('meta[name="twitter:description"]');
    if (twitterDescription) twitterDescription.setAttribute("content", descContent);
    
    // Canonical link
    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute('href', 'https://kirthidiamonds.com/faq');
  }, []);

  useEffect(() => {
    if (filteredFaqs && filteredFaqs.length > 0) {
      // Use injectFAQSchema with bypassPathCheck = true because this is the /faq route
      injectFAQSchema(filteredFaqs, "faq-page-schema");
    }
  }, [filteredFaqs]);

  const handleFeedback = async (idx: number, type: 'yes' | 'no') => {
    setFeedbackState(prev => ({ ...prev, [idx]: type }));
    
    try {
      await addDoc(collection(db, "faq_feedback"), {
        question: faqs[idx]?.question,
        category: faqs[idx]?.category || "Uncategorized",
        helpful: type === 'yes',
        timestamp: serverTimestamp(),
        path: window.location.pathname
      });
      console.log(`Feedback saved for FAQ "${faqs[idx]?.question}": ${type}`);
    } catch (error) {
      console.error("Error saving FAQ feedback:", error);
    }
  };

  return (
    <div className="w-full h-[100dvh] overflow-y-auto custom-scrollbar overflow-x-hidden bg-[#050505] text-[#E5E4E2] flex flex-col items-center px-4 sm:px-6 md:px-24 pb-8 md:pb-24 pt-[140px] md:pt-[200px]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        "itemListElement": [
          {
            "@type": "ListItem",
            "position": 1,
            "name": "Home",
            "item": "https://kirthidiamonds.com"
          },
          {
            "@type": "ListItem",
            "position": 2,
            "name": "FAQ",
            "item": "https://kirthidiamonds.com/faq"
          }
        ]
      }) }} />
      

      <div className="max-w-4xl text-left w-full space-y-12">
        <BreadcrumbNavigation className="relative justify-start px-0 pt-0 pb-0" />
        
        <h2 className="text-3xl md:text-5xl font-serif italic text-white/90">Frequently Asked Questions</h2>
        
        <div className="flex flex-wrap gap-3 mb-8">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setOpenIndex(null); // Close accordion when switching tabs
              }}
              className={`px-5 py-2 text-sm rounded-full transition-all duration-300 border ${
                activeCategory === cat 
                  ? 'border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]' 
                  : 'border-white/10 text-gray-400 hover:border-white/30 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredFaqs.map((faq: any) => {
              // We need the original index to keep feedback state consistent across filters
              const originalIndex = faqs.findIndex((f: any) => f.question === faq.question);
              const isOpen = openIndex === originalIndex;
              const feedback = feedbackState[originalIndex];

              return (
                <motion.div 
                  key={faq.question}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                  className="border border-white/10 bg-white/5 rounded-lg overflow-hidden transition-colors hover:bg-white/10"
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : originalIndex)}
                    className="w-full flex items-center justify-between p-6 text-left"
                  >
                    <h2 className="text-lg md:text-xl font-medium text-white/90 pr-8 leading-snug">{faq.question}</h2>
                    <ChevronDown 
                      className={`w-5 h-5 text-[#D4AF37] flex-shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
                    />
                  </button>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                      >
                        <div className="px-6 pb-6 pt-2 border-t border-white/5">
                          <div className="text-gray-300 font-light leading-relaxed prose prose-invert prose-p:mb-0 max-w-none">
                            <div dangerouslySetInnerHTML={{ __html: marked.parse(faq.answer || '') as string }} />
                          </div>
                          
                          <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                            <span className="text-sm text-gray-400">Was this helpful?</span>
                            <div className="flex items-center gap-3">
                              {!feedback ? (
                                <>
                                  <button 
                                    onClick={() => handleFeedback(originalIndex, 'yes')}
                                    className="p-2 rounded hover:bg-white/10 text-gray-400 hover:text-green-400 transition-colors"
                                    aria-label="Yes, this was helpful"
                                  >
                                    <ThumbsUp className="w-4 h-4" />
                                  </button>
                                  <button 
                                    onClick={() => handleFeedback(originalIndex, 'no')}
                                    className="p-2 rounded hover:bg-white/10 text-gray-400 hover:text-red-400 transition-colors"
                                    aria-label="No, this was not helpful"
                                  >
                                    <ThumbsDown className="w-4 h-4" />
                                  </button>
                                </>
                              ) : (
                                <motion.div 
                                  initial={{ opacity: 0, x: 10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  className="flex items-center gap-2 text-sm text-[#D4AF37]"
                                >
                                  <Check className="w-4 h-4" />
                                  <span>Thanks for your feedback</span>
                                </motion.div>
                              )}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        <a href="/" className="inline-block mt-12 text-[#D4AF37] uppercase tracking-widest text-xs font-medium hover:text-white transition-colors">Return Home</a>
      </div>
      <SharedFooter />
    </div>
  );
}
