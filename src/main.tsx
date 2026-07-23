import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { BrowserRouter, Routes, Route, Link, Navigate, useLocation, useParams } from 'react-router-dom';
import App from './App.tsx';
import { ContentProvider } from './contexts/ContentContext';
import { ErrorBoundary } from './ErrorBoundary.tsx';
import BlogPostView from './components/BlogPostView';
import JournalView from './components/JournalView';
import PageView from './components/PageView';
import BoutiqueLocalView from './components/BoutiqueLocalView';
import ContactView from './components/ContactView';

import './index.css';

import FAQView from './components/FAQView';
import { reportWebVitalsToFirestore } from './lib/vitals';

// Initialize performance monitoring
reportWebVitalsToFirestore();

function LegacyRouteHandler() {
  const location = useLocation();
  const pathParts = location.pathname.split('/').filter(Boolean);
  const possibleSlug = pathParts[pathParts.length - 1]; // get the last segment

  if (possibleSlug) {
    // Let App or BlogPostView handle the path matching logic via ContentContext
  }

  // Handle explicit old slugs mapping if any specific ones emerge
  const REDIRECTION_MAP: Record<string, string> = {
    // e.g., 'old-url-slug': 'new-url-slug'
  };

  if (possibleSlug && REDIRECTION_MAP[possibleSlug]) { 
     return <Navigate to={`/journal/${REDIRECTION_MAP[possibleSlug]}`} replace />;
  }

  return (
    <div style={{ padding: '50px', textAlign: 'center', fontFamily: 'sans-serif', background: '#050505', color: '#F5F5F0', minHeight: '100vh' }}>
      <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>404 - Page Not Found</h2>
      <p style={{ opacity: 0.7, marginBottom: '2rem' }}>The page you are looking for does not exist.</p>
      <Link to="/" style={{ color: '#D4AF37', textDecoration: 'none', border: '1px solid rgba(212,175,55,0.5)', padding: '10px 20px', textTransform: 'uppercase', letterSpacing: '0.2em', fontSize: '12px' }}>Return Home</Link>
    </div>
  );
}

function BlogRedirect() {
  const { postId } = useParams<{ postId: string }>();
  return <Navigate to={`/journal/${postId}`} replace />;
}

// Prevent saving images via context menu
document.addEventListener('contextmenu', (e) => {
  if (e.target && (e.target as HTMLElement).tagName === 'IMG') {
    e.preventDefault();
  }
});

document.getElementById("seo-links")?.remove();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <ContentProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/faq" element={<FAQView />} />
            
            <Route path="/contact" element={<ContactView />} />
            <Route path="/kochi" element={<BoutiqueLocalView location="kochi" />} />
            <Route path="/calicut" element={<BoutiqueLocalView location="calicut" />} />

            <Route path="/pages/:slug" element={<PageView />} />
            <Route path="/:sectionId" element={<App />} />
            <Route path="/blog/:postId" element={<BlogRedirect />} />
            <Route path="/journal" element={<JournalView />} />
            <Route path="/journal/:postId" element={<BlogPostView />} />
            <Route path="*" element={<LegacyRouteHandler />} />
          </Routes>
        </BrowserRouter>
      </ContentProvider>
    </ErrorBoundary>
  </StrictMode>,
);
