/**
 * Console-based diagnostic utility to verify SEO meta-tag injection.
 * Logs the current canonical URL, page title, and meta description matches.
 */
export function logSEODiagnostics(context: string = "") {
  try {
    const title = document.title;
    
    const canonicalEl = document.querySelector('link[rel="canonical"]');
    const canonicalUrl = canonicalEl ? canonicalEl.getAttribute("href") : "NOT FOUND";
    
    const descriptionEl = document.querySelector('meta[name="description"]');
    const description = descriptionEl ? descriptionEl.getAttribute("content") : "NOT FOUND";
    
    const ogTitleEl = document.querySelector('meta[property="og:title"]');
    const ogTitle = ogTitleEl ? ogTitleEl.getAttribute("content") : "NOT FOUND";
    
    const ogDescriptionEl = document.querySelector('meta[property="og:description"]');
    const ogDescription = ogDescriptionEl ? ogDescriptionEl.getAttribute("content") : "NOT FOUND";
    
    const ogUrlEl = document.querySelector('meta[property="og:url"]');
    const ogUrl = ogUrlEl ? ogUrlEl.getAttribute("content") : "NOT FOUND";

    console.group(`[SEO Diagnostics] ${context ? `${context} - ` : ""}${window.location.pathname}`);
    console.log(`%cPage Title:       %c"${title}"`, "font-weight: bold; color: #D4AF37;", "color: inherit;");
    console.log(`%cCanonical URL:     %c"${canonicalUrl}"`, "font-weight: bold; color: #D4AF37;", "color: inherit;");
    console.log(`%cMeta Description:  %c"${description}"`, "font-weight: bold; color: #D4AF37;", "color: inherit;");
    console.log(`%cOG Title:          %c"${ogTitle}"`, "font-weight: bold; color: #888;", "color: #888;");
    console.log(`%cOG Description:    %c"${ogDescription}"`, "font-weight: bold; color: #888;", "color: #888;");
    console.log(`%cOG URL:            %c"${ogUrl}"`, "font-weight: bold; color: #888;", "color: #888;");
    
    // Check for schema.org script tags too
    const schemaTags = document.querySelectorAll('script[type="application/ld+json"]');
    console.log(`%cJSON-LD Schemas:   %cFound ${schemaTags.length} script(s)`, "font-weight: bold; color: #D4AF37;", "color: inherit;");
    schemaTags.forEach((tag, idx) => {
      try {
        const json = JSON.parse(tag.textContent || "{}");
        const type = json["@type"] || json[0]?.["@type"] || "Unknown";
        const id = tag.id || `unnamed-${idx}`;
        console.log(`  - Script #${idx} [id: ${id}]: type = ${type}`);
      } catch (e) {
        console.log(`  - Script #${idx}: Invalid JSON`);
      }
    });
    console.groupEnd();
  } catch (error) {
    console.error("[SEO Diagnostics] Error collecting diagnostics:", error);
  }
}

// Automatically expose it to the global window object for manual debugging
if (typeof window !== "undefined") {
  (window as any).__KIRTHI_SEO_DIAGNOSTICS__ = logSEODiagnostics;
}
