import { hardcodedPosts } from '../utils/fallbackPosts';
import { marked } from 'marked';
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useContent } from '../contexts/ContentContext';
import { BlogPost } from '../constants';
import { FastImage } from './FastImage';
import { ChevronLeft } from 'lucide-react';
import { doc, getDoc, getDocs, collection } from 'firebase/firestore';
import { db } from '../lib/firebase';
import BreadcrumbNavigation from './BreadcrumbNavigation';
import { articleSchemas } from '../seoSchemas';
import { weaveLinks } from '../lib/linkWeaver';
import { getMetaDescription } from '../utils/meta';
import { injectFAQSchema } from '../utils/seo';
import { SharedFooter } from './SharedFooter';
const ARTICLE_FAQS: Record<string, Array<{ question: string; answer: string }>> = {
  "antique-diamond-jewellery-designs-for-traditional-kerala-weddings": [
    {
      question: "Are real antique Kerala diamond pieces available for purchase?",
      answer: "Genuine 75-year-old antique pieces are very rarely available retail — most stay in families. What is available is antique-style reproduction using contemporary certified diamonds, and heritage-design work inspired by traditional motifs. At Kirthi Diamonds we specialise in both."
    },
    {
      question: "What is the difference between Hindu, Christian, and Muslim Kerala bridal jewellery?",
      answer: "Hindu Kerala bridal jewellery layers traditional named pieces (Mullamottu Mala, Palakka Mala, Lakshmi Haram, Nagapadam) in yellow gold with diamond accents. Christian Kerala brides typically choose white-gold or yellow-gold settings with diamond and pearl detailing in cascading designs. Muslim Kerala brides traditionally wear matched diamond sets featuring chokers, matha pattis, kada bangles, and jhumkas with intricate patterning."
    },
    {
      question: "Can my family heirloom be reset into a modern piece while preserving the antique feel?",
      answer: "Yes — this is one of the most common bespoke commissions we receive. The original gold and stones are preserved; the design is reinterpreted to suit modern daily wear while keeping the heritage motif. We document the original piece before disassembly and provide the reset piece with full certification of the diamonds."
    },
    {
      question: "What is the typical budget for a complete Kerala bridal diamond set?",
      answer: "A traditional Kerala bridal set typically ranges from ₹4 lakh to ₹40 lakh and above, depending on diamond weight, gold weight, and number of pieces. A full Kirthi Diamonds bridal package — necklace set, earrings, bangles, and central solitaire — commonly sits in the ₹8–25 lakh range for high-quality certified work."
    },
    {
      question: "Where can I view antique-style Kerala wedding diamond jewellery in person?",
      answer: "At Kirthi Diamonds Kochi (34/572 By Pass Road, Palarivattom, Mon–Sat 10am–7:30pm) and Calicut (61/11508A, opposite Federal Bank, Puthiyara, Mon–Sat 10:00am–7:30pm). Heritage consultations for bridal commissions are by appointment."
    }
  ],
  "id-khdjfej42": [
    {
      question: "Are real antique Kerala diamond pieces available for purchase?",
      answer: "Genuine 75-year-old antique pieces are very rarely available retail — most stay in families. What is available is antique-style reproduction using contemporary certified diamonds, and heritage-design work inspired by traditional motifs. At Kirthi Diamonds we specialise in both."
    },
    {
      question: "What is the difference between Hindu, Christian, and Muslim Kerala bridal jewellery?",
      answer: "Hindu Kerala bridal jewellery layers traditional named pieces (Mullamottu Mala, Palakka Mala, Lakshmi Haram, Nagapadam) in yellow gold with diamond accents. Christian Kerala brides typically choose white-gold or yellow-gold settings with diamond and pearl detailing in cascading designs. Muslim Kerala brides traditionally wear matched diamond sets featuring chokers, matha pattis, kada bangles, and jhumkas with intricate patterning."
    },
    {
      question: "Can my family heirloom be reset into a modern piece while preserving the antique feel?",
      answer: "Yes — this is one of the most common bespoke commissions we receive. The original gold and stones are preserved; the design is reinterpreted to suit modern daily wear while keeping the heritage motif. We document the original piece before disassembly and provide the reset piece with full certification of the diamonds."
    },
    {
      question: "What is the typical budget for a complete Kerala bridal diamond set?",
      answer: "A traditional Kerala bridal set typically ranges from ₹4 lakh to ₹40 lakh and above, depending on diamond weight, gold weight, and number of pieces. A full Kirthi Diamonds bridal package — necklace set, earrings, bangles, and central solitaire — commonly sits in the ₹8–25 lakh range for high-quality certified work."
    },
    {
      question: "Where can I view antique-style Kerala wedding diamond jewellery in person?",
      answer: "At Kirthi Diamonds Kochi (34/572 By Pass Road, Palarivattom, Mon–Sat 10am–7:30pm) and Calicut (61/11508A, opposite Federal Bank, Puthiyara, Mon–Sat 10:00am–7:30pm). Heritage consultations for bridal commissions are by appointment."
    }
  ]
};

export default function BlogPostView() {
  const { postId } = useParams<{ postId: string }>();
  const { content } = useContent();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      // First try from context
      const allPosts = [...(content.blogPosts || []), ...(content.journalTrends || [])];
      
      let foundPost = allPosts.find((p: any) => {
        const slug = p.title ? p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') : p.id;
        return slug === postId || p.id === postId;
      });

      // If not in context and db is available, try fetching from Firebase
      if (!foundPost && db && postId) {
        try {
          // We don't have a slug index so we either have to use a known Firebase field,
          // or we fetch all posts. Given this is low volume, we can grab all posts or use a query if title is exact.
          const postsSnapshot = await getDocs(collection(db, 'site_content_blogPosts'));
          postsSnapshot.forEach(doc => {
            const data = doc.data() as BlogPost;
            const pSlug = data.title ? data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') : doc.id;
            if (pSlug === postId || doc.id === postId) {
               foundPost = { id: doc.id, ...data };
            }
          });

          if (!foundPost) {
            const trendsSnapshot = await getDocs(collection(db, 'site_content_journalTrends'));
            trendsSnapshot.forEach(doc => {
              const data = doc.data() as BlogPost;
              const pSlug = data.title ? data.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') : doc.id;
              if (pSlug === postId || doc.id === postId) {
                 foundPost = { id: doc.id, ...data };
              }
            });
          }
          if (!foundPost) {
            const fallback = hardcodedPosts.find(p => p.id === postId);
            if (fallback) foundPost = fallback;
          }
        } catch (e) {
          console.error("Error fetching post", e);
        }
      }

      setPost(foundPost || null);
      setLoading(false);
    };

    fetchPost();
  }, [postId, content.blogPosts, content.journalTrends]);

  useEffect(() => {
    if (post) {
      
      
      const slug = post.title ? post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') : post.id;
      const descContent = getMetaDescription(post, slug);
      
      const metaDescription = document.querySelector('meta[name="description"]');
      if (metaDescription) metaDescription.setAttribute("content", descContent);
      const ogDescription = document.querySelector('meta[property="og:description"]');
      if (ogDescription) ogDescription.setAttribute("content", descContent);
      const twitterDescription = document.querySelector('meta[name="twitter:description"]');
      if (twitterDescription) twitterDescription.setAttribute("content", descContent);

      let linkCanonical = document.querySelector('link[rel="canonical"]');
      if (!linkCanonical) {
        linkCanonical = document.createElement('link');
        linkCanonical.setAttribute('rel', 'canonical');
        document.head.appendChild(linkCanonical);
      }
      
      linkCanonical.setAttribute('href', `https://kirthidiamonds.com/journal/${slug}`);

      // Dynamic Schema Setup - Dynamically constructed from post content/fields
      const structuredDataObj = {
        "@context": "https://schema.org",
        "@type": "Article",
        "mainEntityOfPage": `https://kirthidiamonds.com/journal/${slug}`,
        "headline": post.title,
        "description": descContent,
        "image": post.featuredImage ? [post.featuredImage] : ["https://kirthidiamonds.com/og-cover.jpg"],
        "datePublished": post.date,
        "dateModified": post.date,
        "author": {
            "@type": "Organization",
            "name": "Kirthi Diamonds"
        },
        "publisher": {
            "@id": "https://kirthidiamonds.com/#org"
        }
      };

      const breadcrumbDataObj = {
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
            "name": "Journal",
            "item": "https://kirthidiamonds.com/journal"
          },
          {
            "@type": "ListItem",
            "position": 3,
            "name": post.title,
            "item": `https://kirthidiamonds.com/journal/${slug}`
          }
        ]
      };

      // 1. Inject Article script in Head
      let articleScript = document.getElementById("dynamic-article-schema") as HTMLScriptElement;
      if (!articleScript) {
        articleScript = document.createElement("script");
        articleScript.id = "dynamic-article-schema";
        articleScript.type = "application/ld+json";
        document.head.appendChild(articleScript);
      }
      articleScript.textContent = JSON.stringify(structuredDataObj, null, 2);

      // 2. Inject Breadcrumb script in Head
      let breadcrumbScript = document.getElementById("dynamic-breadcrumb-schema") as HTMLScriptElement;
      if (!breadcrumbScript) {
        breadcrumbScript = document.createElement("script");
        breadcrumbScript.id = "dynamic-breadcrumb-schema";
        breadcrumbScript.type = "application/ld+json";
        document.head.appendChild(breadcrumbScript);
      }
      breadcrumbScript.textContent = JSON.stringify(breadcrumbDataObj, null, 2);

      // 3. Scan and Inject FAQPage schema automatically
      const timer = setTimeout(() => {
        // injectFAQSchema(".blog-content", "dynamic-scanned-faq-schema");
      }, 100);

      return () => {
        clearTimeout(timer);
        const existingArticle = document.getElementById("dynamic-article-schema");
        if (existingArticle) existingArticle.remove();
        const existingBreadcrumb = document.getElementById("dynamic-breadcrumb-schema");
        if (existingBreadcrumb) existingBreadcrumb.remove();
        const existingScannedFaq = document.getElementById("dynamic-scanned-faq-schema");
        if (existingScannedFaq) existingScannedFaq.remove();
      };
    }
  }, [post]);

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-[#050505] text-[#F5F5F0] flex items-center justify-center">
        <div className="text-xs uppercase tracking-widest animate-pulse opacity-50">Loading Context...</div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="w-full h-screen bg-[#050505] text-[#F5F5F0] flex flex-col items-center justify-center font-serif italic space-y-8">
        <h2 className="text-3xl md:text-5xl">Post Not Found</h2>
        <Link 
          to="/" 
          className="text-sm md:text-[12px] not-italic uppercase tracking-[0.2em] px-8 py-3 border border-white/20 hover:border-[#D4AF37] hover:text-[#D4AF37] transition-all"
        >
          Return to Maison Kirthi
        </Link>
      </div>
    );
  }

  const postSlug = (post.title ? post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') : post.id) || '';

  const dynamicSchema = articleSchemas[postSlug];

  const structuredData = dynamicSchema ? dynamicSchema : {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": post.title,
    "image": post.featuredImage ? [post.featuredImage] : ["https://kirthidiamonds.com/og-cover.jpg"],
    "datePublished": post.date, // Assuming date is parsable or generic representation
    "author": [{
        "@type": "Person",
        "name": "Team Kirthi Diamonds",
        "url": "https://kirthidiamonds.com"
    }],
    "publisher": {
        "@type": "Organization",
        "name": "Kirthi Diamonds",
        "logo": {
            "@type": "ImageObject",
            "url": "/logo.png"
        }
    }
  };

  const breadcrumbData = {
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
        "name": "Journal",
        "item": "https://kirthidiamonds.com/journal"
      },
      {
        "@type": "ListItem",
        "position": 3,
        "name": post.title,
        "item": `https://kirthidiamonds.com/journal/${postSlug}`
      }
    ]
  };

  return (
    <div className="relative w-full h-[100dvh] overflow-y-auto custom-scrollbar overflow-x-hidden bg-[#050505] text-[#F5F5F0] font-sans selection:bg-[#D4AF37] selection:text-black">
      
      {/* Schema Markup (Fallback in Body) */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbData) }} />

      {/* Header */}
      <header className="fixed top-0 w-full flex justify-between items-center px-8 md:px-12 py-8 z-[70] bg-[#050505]/90 backdrop-blur-md border-b border-white/5">
        <Link
          to="/"
          className="flex items-center space-x-4 md:space-x-6 cursor-pointer group"
        >
          <span className="text-xl group-hover:-translate-x-1 transition-transform">←</span>
          <span className="text-xs md:text-[10px] uppercase tracking-[0.4em] opacity-70 group-hover:opacity-100 transition-opacity">
            Return to Homepage
          </span>
        </Link>
        <div>
          <img src={content.logoUrl || "/logo.png"} alt="Kirthi Diamonds" className="h-6 opacity-80" />
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto pt-32 px-4 sm:px-6 md:px-28 pb-32">
        <BreadcrumbNavigation className="relative justify-start pb-8 px-0" />
        <article className="prose prose-invert max-w-none">
          <header className="mb-16">
            <span className="text-xs md:text-[10px] uppercase tracking-[0.5em] text-[#D4AF37] mb-6 block font-light">
              Insights / Science & Methodology
            </span>
            <h2 className="text-4xl md:text-7xl font-serif italic mb-8 leading-tight text-white">
              {post.title}
            </h2>
            <div className="flex items-center space-x-6 text-[#D4AF37] text-xs uppercase tracking-widest font-medium mb-12">
              <span className="flex items-center space-x-2">
                <span className="w-1 h-1 bg-[#D4AF37] rounded-full inline-block"></span>
                <span itemProp="author">By Shekar Menon</span>
              </span>
              <span className="opacity-60 hidden md:inline">|</span>
              <span className="opacity-60 flex items-center space-x-1">
                <span>Published:</span>
                <time itemProp="datePublished">{post.date}</time>
              </span>
              <span className="opacity-60 hidden md:inline">|</span>
              <span className="opacity-60">Updated: May 29, 2026</span>
            </div>
            {(() => {
              const imageSrc = post.featuredImage && post.featuredImage.trim() !== "" 
                ? post.featuredImage 
                : "https://kirthidiamonds.com/og-cover.jpg";
              
              if (imageSrc === "https://kirthidiamonds.com/og-cover.jpg") {
                return null;
              }
              return (
                <div className="aspect-[16/9] w-full overflow-hidden mb-12 rounded-sm shadow-2xl bg-[#030303] flex items-center justify-center">
                  <FastImage
                    src={imageSrc}
                    alt={post.title}
                    className="w-full h-full transition-all duration-1000 object-cover grayscale brightness-90 hover:grayscale-0 hover:brightness-100"
                  />
                </div>
              );
            })()}
            <p className="text-xl md:text-2xl font-light italic leading-relaxed opacity-80 mb-12">
              {post.excerpt}
            </p>
            <div className="w-12 h-px bg-[#D4AF37] mb-12 opacity-50"></div>
          </header>

          <div className="space-y-12 text-lg font-light leading-loose opacity-80">
            <div className="blog-content prose prose-invert prose-p:text-white/80 prose-headings:font-serif prose-headings:font-light prose-h1:text-4xl prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6 prose-a:text-[#D4AF37] hover:prose-a:text-white transition-colors max-w-none prose-td:border prose-td:border-white/20 prose-th:border prose-th:border-white/20 prose-th:bg-white/5 prose-table:border-collapse prose-img:max-w-full prose-img:h-auto prose-img:rounded-sm">
               <div dangerouslySetInnerHTML={{ __html: marked.parse(weaveLinks(post.content || '', post.id || '')) as string }} />
            </div>
          </div>
        </article>

        {/* Consultation CTA */}
        <div className="mt-24 pt-16 border-t border-white/10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-16 px-8 md:px-12 bg-[#111] p-12 rounded-sm border border-white/5">
             <div className="text-center md:text-left">
               <h3 className="text-2xl font-serif italic mb-4 text-white">Inspired by this piece?</h3>
               <p className="text-sm opacity-60 font-light max-w-md line-clamp-3">
                 Discuss a unique acquisition or explore our bespoke design capabilities with our bespoke consultation team.
               </p>
             </div>
             <button
               onClick={(e) => {
                 e.preventDefault();
                 window.dispatchEvent(new CustomEvent('open-consultation'));
               }}
               className="px-8 py-5 border border-[#D4AF37]/50 hover:border-[#D4AF37] text-[#D4AF37] text-sm md:text-xs uppercase tracking-[0.3em] hover:bg-[#D4AF37] hover:text-black transition-all group flex items-center gap-3 shrink-0"
             >
               Book a Bespoke Consultation <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover:translate-x-1 transition-transform"><path d="M5 12h14"></path><path d="m12 5 7 7-7 7"></path></svg>
             </button>
          </div>
        </div>

        {/* Share Section to encourage Backlinks */}
        <div className="mt-16 pt-16 border-t border-white/10">
          <h3 className="text-xl font-serif italic text-white mb-6 text-center">Share This Article</h3>
          <div className="flex justify-center space-x-6">
            <a 
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : `https://kirthidiamonds.com/journal/${postSlug}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs uppercase tracking-[0.2em] text-[#D4AF37] opacity-70 hover:opacity-100 transition-opacity flex items-center space-x-2"
            >
              <span>X (Twitter)</span>
            </a>
            <a 
              href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : `https://kirthidiamonds.com/journal/${postSlug}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs uppercase tracking-[0.2em] text-[#D4AF37] opacity-70 hover:opacity-100 transition-opacity flex items-center space-x-2"
            >
              <span>LinkedIn</span>
            </a>
            <a 
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : `https://kirthidiamonds.com/journal/${postSlug}`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs uppercase tracking-[0.2em] text-[#D4AF37] opacity-70 hover:opacity-100 transition-opacity flex items-center space-x-2"
            >
              <span>Facebook</span>
            </a>
            <button
              onClick={() => {
                navigator.clipboard.writeText(typeof window !== 'undefined' ? window.location.href : `https://kirthidiamonds.com/journal/${postSlug}`);
                alert('Link copied to clipboard');
              }}
              className="text-xs uppercase tracking-[0.2em] text-[#D4AF37] opacity-70 hover:opacity-100 transition-opacity flex items-center space-x-2 cursor-pointer"
            >
              <span>Copy Link</span>
            </button>
          </div>
        </div>

        <div className="mt-24 pt-16 border-t border-white/10 flex justify-center">
            <Link 
              to="/" 
              className="px-10 py-4 border border-[#D4AF37]/50 text-[#D4AF37] text-sm md:text-[11px] uppercase tracking-[0.4em] transition-all group overflow-hidden relative inline-block"
            >
              <span className="relative z-10 group-hover:text-black transition-colors duration-500">Back to Kirthi Diamonds Experience</span>
              <div className="absolute inset-0 bg-[#D4AF37] translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-0" />
            </Link>
        </div>
      </main>

      <SharedFooter />

      {/* Global styling for injected HTML (h2, p, etc) */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .blog-content h2 { font-family: ui-serif, Georgia, Cambria, "Times New Roman", Times, serif; font-style: italic; font-size: 1.875rem; margin-top: 4rem; margin-bottom: 2rem; color: #fff; }
          .blog-content p { margin-bottom: 2rem; }
        `
      }} />
    </div>
  );
}
