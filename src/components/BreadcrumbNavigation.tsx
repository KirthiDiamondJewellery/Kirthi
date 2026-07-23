import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useContent } from '../contexts/ContentContext';
import { SECTIONS } from '../constants';

interface BreadcrumbNavigationProps {
  currentSection?: any;
  onHomeClick?: () => void;
  className?: string;
}

export default function BreadcrumbNavigation({ currentSection, onHomeClick, className = '' }: BreadcrumbNavigationProps) {
  const location = useLocation();
  const { content } = useContent();

  const currentPath = window.location.pathname;
  const pathnames = currentPath.split('/').filter(x => x);
  const sectionsList = content?.sections || SECTIONS;

  let breadcrumbs = [];
  breadcrumbs.push({ name: 'Home', path: '/' });

  if (currentSection && currentSection.id !== 'home') {
    breadcrumbs.push({ name: currentSection.title, path: `/${currentSection.id}` });
  } else if (!currentSection && pathnames.length > 0) {
    let builtPath = '';
    for (let i = 0; i < pathnames.length; i++) {
        const pathPart = pathnames[i];
        builtPath += `/${pathPart}`;

        let name = pathPart.charAt(0).toUpperCase() + pathPart.slice(1).replace(/-/g, ' ');

        // Try to find the section name if it's a section
        if (i === 0) {
            const matchedSection = sectionsList.find(s => s.id === pathPart);
            if (matchedSection) name = matchedSection.title;
        } else if (i === 1 && pathnames[0] === 'journal') {
            const allPosts = content?.blogPosts || [];
            const post = allPosts.find((p: any) => {
              const slug = p.title ? p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') : p.id;
              return slug === pathPart || p.id === pathPart;
            });
            if (post) {
                // Determine a category (use 'Articles' if not present)
                const category = post.category || 'Articles';
                breadcrumbs.push({ name: category, path: `/journal?category=${encodeURIComponent(category.toLowerCase())}` }); // we link category to /journal
                name = post.title;
            }
        }

        // special case for pages
        if (i === 1 && pathnames[0] === 'pages') {
           name = pathPart.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
        }

        breadcrumbs.push({ name, path: builtPath });
    }
  }

  // Ensure unique breadcrumbs just in case
  const seen = new Set();
  breadcrumbs = breadcrumbs.filter(b => {
      if (seen.has(b.path)) return false;
      seen.add(b.path);
      return true;
  });

  const jsonLdBreadcrumbList = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map((crumb, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "name": crumb.name,
      "item": crumb.path.startsWith('http') ? crumb.path : `https://kirthidiamonds.com${crumb.path === '/' ? '/' : crumb.path}`
    }))
  };

  return (
    <nav 
      aria-label="Breadcrumb" 
      className={`absolute w-full px-6 md:px-12 z-[65] pointer-events-auto flex justify-center ${className || 'pt-4 md:pt-0 top-[70px] md:top-[120px]'}`}
    >
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumbList) }} />
      <ol className="group flex items-center space-x-3 text-[9px] md:text-[10px] uppercase tracking-[0.3em] font-light text-white/40 bg-black/20 backdrop-blur-md px-6 py-2 md:py-3 rounded-full border border-white/5 transition-all duration-700 hover:border-white/10 hover:bg-black/40 hover:shadow-[0_0_20px_rgba(212,175,55,0.05)]" itemScope itemType="https://schema.org/BreadcrumbList">
        {breadcrumbs.map((crumb, idx) => {
          const isLast = idx === breadcrumbs.length - 1;
          
          return (
            <React.Fragment key={crumb.path}>
              {idx > 0 && <span className="text-white/20 select-none group-hover:opacity-40 transition-opacity duration-500">/</span>}
              <li itemProp="itemListElement" itemScope itemType="https://schema.org/ListItem" className="flex items-center whitespace-nowrap">
                {isLast ? (
                  <span itemProp="name" className="text-[#D4AF37] opacity-90 group-hover:opacity-100 group-hover:drop-shadow-[0_0_10px_rgba(212,175,55,0.4)] transition-all duration-500 truncate max-w-[150px] md:max-w-[400px]" title={crumb.name}>{crumb.name}</span>
                ) : (
                  <Link 
                    to={crumb.path} 
                    onClick={(e) => {
                      if (idx === 0 && onHomeClick) {
                        e.preventDefault();
                        onHomeClick();
                      } else if (crumb.path === '/journal' || crumb.path.startsWith('/journal?')) {
                        // Let react-router navigate, then scroll up gracefully
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                    }} 
                    className="group/link group-hover:opacity-50 hover:!opacity-100 hover:text-[#D4AF37] transition-all duration-500 cursor-pointer p-2 -my-2 flex items-center min-h-[44px] relative"
                  >
                    <span itemProp="name" className="relative z-10 transition-all duration-500 group-hover/link:drop-shadow-[0_0_8px_rgba(212,175,55,0.6)]">{crumb.name}</span>
                    <span className="absolute bottom-2 left-2 right-2 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent scale-x-0 transition-transform duration-500 ease-out origin-center group-hover/link:scale-x-100" />
                    <meta itemProp="item" content={`https://kirthidiamonds.com${crumb.path}`} />
                  </Link>
                )}
                <meta itemProp="position" content={(idx + 1).toString()} />
              </li>
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
