import React, { useState } from "react";
import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { BlogPost } from "../constants";
import { ArrowRight } from "lucide-react";
import { useContent } from "../contexts/ContentContext";
import { FastImage } from "./FastImage";
import { SharedFooter } from "./SharedFooter";

export default function JournalView({ onInquiry, onGoHome }: { onInquiry?: () => void, onGoHome?: () => void }) {
  const { content } = useContent();
  const [activeTab, setActiveTab] = useState<"publication" | "trends">("publication");
  
  const publicationPosts = content.blogPosts || [];
  const trendPosts = content.journalTrends || [];
  const displayPosts = [...publicationPosts, ...trendPosts];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="w-full h-full flex flex-col items-center justify-start px-8 md:px-28 overflow-y-auto custom-scrollbar pt-[140px] md:pt-[200px] pb-32">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([
        {
          "@context": "https://schema.org",
          "@type": "Blog",
          "@id": "https://kirthidiamonds.com/journal#blog",
          "name": "The Kirthi Journal",
          "description": "Articles on diamond mastery, jewellery design philosophy, and the art of fine jewellery from the artisans at Kirthi Diamonds, Kochi and Calicut.",
          "url": "https://kirthidiamonds.com/journal",
          "publisher": {
            "@id": "https://kirthidiamonds.com/#organization"
          },
          "inLanguage": "en-IN",
          "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://kirthidiamonds.com/"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "The Journal",
                "item": "https://kirthidiamonds.com/journal"
              }
            ]
          },
          "blogPost": [...publicationPosts, ...trendPosts].map((post: BlogPost) => {
            const slug = post.id || (post.title ? post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') : '');
            return {
              "@type": "BlogPosting",
              "headline": post.title,
              "url": `https://kirthidiamonds.com/journal/${slug}`,
              "description": post.excerpt,
              "datePublished": post.date || new Date().toISOString(),
              "image": post.image
            };
          })
        },
        {
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": "Exploring the Art and Science of High Jewellery: Insights from Kirthi Diamonds",
          "description": "This journal explores the artistry, craftsmanship, and science behind high jewellery. It helps collectors and enthusiasts understand how exceptional pieces are designed, made, and valued.",
          "datePublished": "2026-05-01T08:00:00+00:00",
          "dateModified": "2026-05-29T10:00:00+00:00",
          "author": {
            "@type": "Person",
            "name": "Shekar Menon",
            "jobTitle": "High Jewellery Expert",
            "worksFor": {
              "@type": "Organization",
              "name": "Kirthi Diamonds"
            }
          },
          "publisher": {
            "@type": "Organization",
            "name": "Kirthi Diamonds"
          }
        }
      ]) }} />
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-6xl"
      >
        <motion.div variants={itemVariants} className="mb-16">

          <h2 className="text-3xl md:text-5xl lg:text-7xl font-serif italic text-white flex flex-col md:inline-flex md:flex-row md:items-baseline md:space-x-6">
            <span className="opacity-80">Exploring the Art and Science of High Jewellery:</span>
            <span className="text-[#D4AF37] opacity-100 mt-2 md:mt-0">
              Insights from Kirthi Diamonds
            </span>
          </h2>

          <div className="mt-12 text-sm md:text-lg opacity-80 font-light max-w-3xl leading-relaxed lg:leading-[2] text-[#F5F5F0]">
            <p className="mb-8">
              This journal explores the artistry, craftsmanship, and science behind high jewellery. It helps collectors and enthusiasts understand how exceptional pieces are designed, made, and valued. Expect practical insights, heritage stories, and expert perspectives from Kirthi Diamonds.
            </p>
            
            <div className="flex items-center space-x-5 mb-10 p-5 md:p-6 bg-[#111] border border-white/10 rounded-sm w-full md:w-max pr-12 md:pr-24">
              <div className="w-12 h-12 rounded-full bg-[#050505] border border-[#D4AF37]/50 flex items-center justify-center flex-shrink-0">
                <span className="text-[#D4AF37] font-serif text-lg italic mt-1">SM</span>
              </div>
              <div>
                <p className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-[#D4AF37]/80 mb-1">Authored & Curated By</p>
                <p className="text-sm md:text-lg font-serif italic text-white">Shekar Menon</p>
              </div>
            </div>

            <p className="text-xs md:text-sm text-[#D4AF37] font-medium tracking-wide mb-12">
              Quick take: insights on craftsmanship, heritage, and fine jewellery expertise.
            </p>
          </div>

          <div className="mb-12 flex items-center space-x-8 border-b border-white/10 w-full text-left">
            <span className="pb-4 uppercase tracking-widest text-xs relative text-[#D4AF37]">
              The Publication
              <span className="absolute bottom-[-1px] left-0 w-full h-[1px] bg-[#D4AF37]" />
            </span>
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16 md:gap-12">
            {displayPosts
              .filter((post: BlogPost) => post.title && post.id && post.title.trim() !== '') // Render only functional, linked entries
              .sort((a: BlogPost, b: BlogPost) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime())
              .map((post: BlogPost) => {
                const slug = (post.title ? post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') : post.id) || '';
                return (
                <Link
                  to={`/journal/${slug}`}
                  key={post.id}
                  className="group cursor-pointer block"
                >
                  <motion.article variants={itemVariants}>
                    <div className="relative aspect-[4/5] md:aspect-[16/10] overflow-hidden mb-8 shadow-2xl">
                      {(() => {
                        let gridImgSrc = (post.image && post.image !== "undefined" && post.image.trim() !== "")
                          ? post.image
                          : (post.images && post.images.length > 0 && post.images[0] && post.images[0] !== "undefined" && post.images[0].trim() !== "")
                          ? post.images[0]
                          : "/logo.png";
                          
                        if (gridImgSrc.includes('unsplash.com') || gridImgSrc.includes('images.unsplash')) {
                          gridImgSrc = "/logo.png";
                        }
                        
                        const isLogo = gridImgSrc === "/logo.png";
                        return (
                          <div className="w-full h-full bg-[#030303] flex items-center justify-center">
                            <FastImage
                              src={gridImgSrc}
                              alt={post.title}
                              className={`w-full h-full transition-all duration-1000 ${
                                isLogo 
                                  ? "object-contain p-12 max-h-[70%] opacity-60 group-hover:opacity-90 group-hover:scale-105" 
                                  : "object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110"
                              }`}
                            />
                          </div>
                        );
                      })()}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent opacity-80" />
                    </div>
                    <div className="px-4 md:px-0">
                      <div className="flex items-center space-x-4 text-[10px] md:text-xs uppercase tracking-[0.2em] opacity-40 mb-4 text-[#D4AF37]">
                        <span>{post.date}</span>
                        <div className="w-8 h-px bg-[#D4AF37] opacity-50" />
                        <span>{post.readTime || '5 min read'}</span>
                      </div>
                      <h3 className="text-xl md:text-2xl font-serif italic mb-4 opacity-90 group-hover:text-[#D4AF37] transition-colors leading-relaxed">
                        {post.title}
                      </h3>
                      <div className="flex items-center space-x-4 text-xs md:text-[10px] uppercase tracking-[0.3em] opacity-0 group-hover:opacity-100 transition-all text-[#D4AF37] transform -translate-x-4 group-hover:translate-x-0">
                        <span>Read Article</span>
                        <div className="w-4 h-4 rounded-full border border-[#D4AF37] flex items-center justify-center">
                          <ArrowRight size={14} />
                        </div>
                      </div>
                    </div>
                  </motion.article>
                </Link>
                );
              })}
            </div>
          </motion.div>
      </motion.div>
      <SharedFooter />
    </div>
  );
}
