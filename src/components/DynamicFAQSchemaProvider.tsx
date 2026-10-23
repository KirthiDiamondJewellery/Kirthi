import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useContent } from '../contexts/ContentContext';

interface FAQItem {
  question: string;
  answer: string;
  schemaAnswer?: string;
  category?: string;
}

/**
 * Strips markdown and HTML tags to produce clean, valid plain text for Schema.org JSON-LD.
 */
function cleanSchemaText(rawText: string): string {
  if (!rawText) return '';
  return rawText
    // Remove markdown links [title](url) -> title
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    // Remove markdown bold/italics
    .replace(/[*_~`]/g, '')
    // Remove HTML tags
    .replace(/<[^>]*>/g, ' ')
    // Replace markdown headers (e.g. ### Header)
    .replace(/^#+\s+/gm, '')
    // Collapse multiple whitespace
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Dynamic FAQ Schema Structured Data Provider Component
 * 
 * Reads from ContentContext and current route, dynamically injecting and updating
 * Schema.org FAQPage structured data in the document head for optimal search engine parsing.
 */
export const DynamicFAQSchemaProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { content } = useContent();
  const location = useLocation();

  useEffect(() => {
    if (typeof document === 'undefined') return;

    const pathname = location.pathname.toLowerCase();
    const faqs: FAQItem[] = Array.isArray(content?.faqs) ? content.faqs : [];
    const homeFAQs: FAQItem[] = Array.isArray(content?.homeFAQs) ? content.homeFAQs : [];

    let targetFAQs: FAQItem[] = [];

    if (pathname === '/faq') {
      // Complete FAQ repository on dedicated FAQ route
      targetFAQs = faqs;
    } else if (pathname === '/' || pathname === '') {
      // Homepage: use curated home FAQs combined with core trust & policy FAQs
      targetFAQs = homeFAQs.length > 0 
        ? homeFAQs 
        : faqs.filter(f => f.category === 'Certification & Quality' || f.category === 'Purchasing & Policies').slice(0, 8);
    } else if (pathname.includes('/shop')) {
      // Boutique / Products route: shopping, sizing, hallmarking, and exchange FAQs
      targetFAQs = faqs.filter(f => 
        f.category?.includes('Purchasing') || 
        f.category?.includes('Quality') || 
        f.question.toLowerCase().includes('gold') || 
        f.question.toLowerCase().includes('exchange') ||
        f.question.toLowerCase().includes('certificate')
      );
    } else if (pathname.includes('/brides')) {
      // Bridal Showcase: bridal commissions, jewellery sets, and custom heirloom FAQs
      targetFAQs = faqs.filter(f => 
        f.question.toLowerCase().includes('bridal') || 
        f.question.toLowerCase().includes('wedding') || 
        f.question.toLowerCase().includes('custom') ||
        f.category?.includes('Purchasing')
      );
    } else if (pathname.includes('/bespoke')) {
      // Bespoke Atelier: custom commission process, pricing, turnaround, and direct sourcing
      targetFAQs = faqs.filter(f => 
        f.question.toLowerCase().includes('custom') || 
        f.question.toLowerCase().includes('design') || 
        f.question.toLowerCase().includes('consultation') ||
        f.question.toLowerCase().includes('commission')
      );
    } else if (pathname.includes('/kochi') || pathname.includes('/calicut') || pathname.includes('/contact') || pathname.includes('/find-a-store')) {
      // Showroom & Location routes: boutique consultation, appointments, and showroom addresses
      targetFAQs = faqs.filter(f => 
        f.question.toLowerCase().includes('kochi') || 
        f.question.toLowerCase().includes('calicut') || 
        f.question.toLowerCase().includes('appointment') ||
        f.question.toLowerCase().includes('showroom') ||
        f.question.toLowerCase().includes('where')
      );
    } else if (pathname.startsWith('/journal/') || pathname.startsWith('/blog/')) {
      // Journal article: check if the article itself has specific Q&A in its content
      const slugOrId = pathname.split('/')[2];
      const matchingPost = content?.blogPosts?.find(
        (p: any) => p.id === slugOrId || (p.title && p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') === slugOrId)
      );

      if (matchingPost?.content) {
        // Scan HTML for Q&A structures: <h3>Question?</h3> <p>Answer</p>
        const regex = /<h[234][^>]*>(.*?\?)<\/h[234]>\s*<p[^>]*>([\s\S]*?)<\/p>/gi;
        const scanned: FAQItem[] = [];
        let match;
        while ((match = regex.exec(matchingPost.content)) !== null) {
          scanned.push({
            question: match[1],
            answer: match[2]
          });
        }
        if (scanned.length > 0) {
          targetFAQs = scanned;
        }
      }

      // If article doesn't have scanned FAQs, fallback to foundational certification FAQs
      if (targetFAQs.length === 0) {
        targetFAQs = faqs.filter(f => f.category === 'Certification & Quality').slice(0, 5);
      }
    } else {
      // General fallback for other brand pages
      targetFAQs = homeFAQs.length > 0 ? homeFAQs : faqs.slice(0, 6);
    }

    // Filter out items without question or answer
    const validQuestions = targetFAQs
      .filter(item => item && item.question && (item.schemaAnswer || item.answer))
      .map(item => ({
        "@type": "Question",
        "name": cleanSchemaText(item.question),
        "acceptedAnswer": {
          "@type": "Answer",
          "text": cleanSchemaText(item.schemaAnswer || item.answer)
        }
      }));

    const SCRIPT_ID = 'dynamic-faq-schema';
    let scriptElement = document.getElementById(SCRIPT_ID) as HTMLScriptElement | null;

    if (validQuestions.length === 0) {
      if (scriptElement) {
        scriptElement.remove();
      }
      return;
    }

    const faqSchemaPayload = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": validQuestions
    };

    if (!scriptElement) {
      scriptElement = document.createElement('script');
      scriptElement.id = SCRIPT_ID;
      scriptElement.type = 'application/ld+json';
      document.head.appendChild(scriptElement);
    }

    scriptElement.textContent = JSON.stringify(faqSchemaPayload, null, 2);

    return () => {
      // Cleanup on unmount
      const existing = document.getElementById(SCRIPT_ID);
      if (existing) {
        existing.remove();
      }
    };
  }, [location.pathname, content?.faqs, content?.homeFAQs, content?.blogPosts]);

  return <>{children}</>;
};

export default DynamicFAQSchemaProvider;
