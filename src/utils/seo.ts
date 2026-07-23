interface SEOProps {
  title: string;
  description: string;
  canonicalUrl: string;
  type: string;
  publishedTime?: string;
  author?: string;
  image?: string;
  pathname: string;
  blogPosts: any[];
  sections: any[];
  viewMode: string;
  currentSection: any;
}

export function updateSiteSEO(props: SEOProps) {
  if (typeof document === 'undefined') return;

  // 1. Meta Tags
  document.title = props.title;
  const metaDesc = document.querySelector('meta[name="description"]');
  if (metaDesc) metaDesc.setAttribute('content', props.description);

  let canonical = document.querySelector('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.setAttribute('rel', 'canonical');
    document.head.appendChild(canonical);
  }
  canonical.setAttribute('href', props.canonicalUrl);

  const ogTitle = document.querySelector('meta[property="og:title"]');
  if (ogTitle) ogTitle.setAttribute('content', props.title);

  const ogDesc = document.querySelector('meta[property="og:description"]');
  if (ogDesc) ogDesc.setAttribute('content', props.description);
  
  const ogType = document.querySelector('meta[property="og:type"]');
  if (ogType) ogType.setAttribute('content', props.type);

  const ogUrl = document.querySelector('meta[property="og:url"]');
  if (ogUrl) ogUrl.setAttribute('content', props.canonicalUrl);

  if (props.image) {
    const ogImage = document.querySelector('meta[property="og:image"]');
    if (ogImage) ogImage.setAttribute('content', props.image);
    const twImage = document.querySelector('meta[name="twitter:image"]');
    if (twImage) twImage.setAttribute('content', props.image);
  }

  // 2. Organization Schema (Global)
  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Kirthi Diamonds",
    "url": "https://kirthidiamonds.com",
    "logo": "/logo.png",
    "sameAs": [
      "https://instagram.com/kirthidiamonds",
      "https://facebook.com/kirthidiamonds"
    ]
  };
  injectSchema(orgSchema, 'org-schema');

  // 3. LocalBusiness Schema
  const localBizSchema = {
    "@context": "https://schema.org",
    "@type": "JewelryStore",
    "name": "Kirthi Diamonds",
    "image": "https://kirthidiamonds.com/og-cover.jpg",
    "@id": "https://kirthidiamonds.com",
    "url": "https://kirthidiamonds.com",
    "telephone": "+919847086990",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "34/572, By Pass Road, Palarivattom",
      "addressLocality": "Kochi",
      "addressRegion": "KL",
      "postalCode": "682024",
      "addressCountry": "IN"
    }
  };
  injectSchema(localBizSchema, 'localbiz-schema');

  // 4. Breadcrumb Schema
  let breadcrumbItems: any[];
  if (props.pathname === '/') {
    breadcrumbItems = [{ name: 'Home', url: 'https://kirthidiamonds.com/' }];
  } else {
    const parts = props.pathname.split('/').filter(Boolean);
    let currentUrl = 'https://kirthidiamonds.com';
    breadcrumbItems = parts.map((part, index) => {
      currentUrl += '/' + part;
      return {
        name: part.charAt(0).toUpperCase() + part.slice(1).replace(/-/g, ' '),
        url: currentUrl
      };
    });
    breadcrumbItems.unshift({ name: 'Home', url: 'https://kirthidiamonds.com/' });
  }
  
  injectBreadcrumbSchema(breadcrumbItems, 'breadcrumb-schema');

  // 5. Article Schema
  if (props.type === 'article' && props.pathname.startsWith('/journal/')) {
    const slug = props.pathname.replace('/journal/', '');
    const post = props.blogPosts.find(p => {
      const pSlug = p.title ? p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') : p.id;
      return pSlug === slug || p.id === slug;
    });

    if (post) {
      const articleSchema = {
        "@context": "https://schema.org",
        "@type": "Article",
        "headline": post.title,
        "image": post.image || "https://kirthidiamonds.com/og-cover.jpg",
        "datePublished": post.date || props.publishedTime || new Date().toISOString(),
        "dateModified": post.date || props.publishedTime || new Date().toISOString(),
        "author": {
          "@type": "Organization",
          "name": "Kirthi Diamonds"
        }
      };
      injectSchema(articleSchema, 'article-schema');
      
      // Also inject FAQ schema for this article if we have questions
      const faqSchema = generateFAQSchema(post.content || '');
      if (faqSchema) {
         injectSchema(faqSchema, 'dynamic-faq-schema');
      } else {
         removeSchema('dynamic-faq-schema');
      }
    } else {
      removeSchema('article-schema');
      removeSchema('dynamic-faq-schema');
    }
  } else {
    removeSchema('article-schema');
    removeSchema('dynamic-faq-schema');
  }
}

function removeSchema(id: string) {
  const el = document.getElementById(id);
  if (el) el.remove();
}

function injectSchema(schema: any, id: string) {
  let script = document.getElementById(id) as HTMLScriptElement;
  if (!script) {
    script = document.createElement('script');
    script.id = id;
    script.type = 'application/ld+json';
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(schema);
}

function injectBreadcrumbSchema(items: Array<{name: string, url: string}>, id: string = "breadcrumb-schema") {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };
  injectSchema(schema, id);
}

export function generateFAQSchema(htmlContent: string) {
  const faqBlocks: Array<{ question: string; answer: string }> = [];
  const regex = /<h[23][^>]*>(.*?\?)<\/h[23]>\s*<p[^>]*>([\s\S]*?)<\/p>/gi;
  
  let match;
  while ((match = regex.exec(htmlContent)) !== null) {
    const question = match[1].replace(/<[^>]+>/g, '').trim(); 
    const answer = match[2].trim();
    faqBlocks.push({ question, answer });
  }

  if (faqBlocks.length === 0) {
    return null;
  }

  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqBlocks.map(block => ({
      "@type": "Question",
      "name": block.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": block.answer
      }
    }))
  };
}

export function injectFAQSchema(faqs: Array<{question: string, answer: string}>, id: string = "faq-schema") {
  if (!faqs || faqs.length === 0) return;
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
  injectSchema(schema, id);
}
