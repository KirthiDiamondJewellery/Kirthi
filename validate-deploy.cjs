const http = require('http');
const https = require('https');
const { URL } = require('url');

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const EXPECTED_HOST = process.env.EXPECTED_HOST || new URL(BASE_URL).host;
const STRICT = process.env.STRICT === '1';

const failures = [];

function reportFailure(msg) {
  failures.push(msg);
  if (STRICT) {
    console.error(`[FAIL] ${msg}`);
  } else {
    console.warn(`[WARN] ${msg}`);
  }
}

async function fetchUrl(url, maxRedirects = 3) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const client = parsedUrl.protocol === 'https:' ? https : http;
    const req = client.get(url, {
        headers: { 'User-Agent': 'KirthiBot/1.0' }
    }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        if (maxRedirects > 0) {
          let redirectUrl = res.headers.location;
          if (redirectUrl.startsWith('/')) {
              redirectUrl = BASE_URL + redirectUrl;
          }
          fetchUrl(redirectUrl, maxRedirects - 1).then(resolve).catch(reject);
        } else {
          resolve({ status: res.statusCode, data: '', finalUrl: url, headers: res.headers, redirectChain: true });
        }
        return;
      }
      
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data, finalUrl: url, headers: res.headers, redirectChain: false }));
    });
    
    req.on('error', reject);
    req.setTimeout(10000, () => {
        req.destroy(new Error('Timeout'));
    });
  });
}

const bannedVocab = ["private viewing", "private-viewing", "concierge", "private concierge", "private appointment", "priority access", "hurry", "limited time", "don't miss", "offer ends"];

async function validate() {
  console.log(`Starting validation for ${BASE_URL}, EXPECTED_HOST: ${EXPECTED_HOST}`);
  
  let pathsToTest = [
    '/', '/shop', '/journal', '/brides', '/heritage', '/methodology', '/maison',
    '/pages/contact', '/pages/exchange-policy', '/pages/policies', '/pages/diamond-jewellery'
  ];

  console.log(`Fetching /journal to extract articles...`);
  const journalRes = await fetchUrl(BASE_URL + '/journal');
  if (journalRes.status === 200) {
    const articleRegex = /href="(?:https:\/\/[^\/]+)?(\/journal\/[^"]+)"/g;
    let match;
    while ((match = articleRegex.exec(journalRes.data)) !== null) {
      if (!pathsToTest.includes(match[1])) {
        pathsToTest.push(match[1]);
      }
    }
  } else {
    reportFailure(`Failed to fetch /journal. Status: ${journalRes.status}`);
  }

  let homeData = '';
  const allHrefs = new Set();

  for (const p of pathsToTest) {
    try {
      const url = BASE_URL + p;
      console.log(`Checking ${p}...`);
      const { status, data } = await fetchUrl(url);
      
      if (status !== 200) {
        reportFailure(`Path ${p} returned ${status}`);
        continue;
      }
      
      if (p === '/') {
        homeData = data;
      }

      if (p !== '/' && data === homeData && homeData.length > 0) {
        reportFailure(`Soft-404: ${p} is identical to the homepage`);
      }

      if (!data || data.length < 500) {
        reportFailure(`Empty or very small body detected on ${p}`);
      }
      
      if (data.length < 2000) {
        reportFailure(`Minimum body length check failed on ${p} (length: ${data.length})`);
      }

      for (const term of bannedVocab) {
        const regex = new RegExp(`\\b${term}\\b`, 'gi');
        if (regex.test(data)) {
          reportFailure(`Banned vocabulary "${term}" found on ${p}`);
        }
      }

      const canonicalMatch = data.match(/<link[^>]*rel="canonical"[^>]*href="([^"]+)"/);
      if (canonicalMatch) {
        const canonicalUrl = canonicalMatch[1];
        if (!canonicalUrl.includes(EXPECTED_HOST)) {
          reportFailure(`Canonical URL on ${p} does not match EXPECTED_HOST. Found: ${canonicalUrl}`);
        }
      } else {
        reportFailure(`No canonical link found on ${p}`);
      }

      const titleMatch = data.match(/<title[^>]*>([^<]+)<\/title>/);
      const ogTitleMatch = data.match(/<meta[^>]*property="og:title"[^>]*content="([^"]+)"/);
      if (titleMatch && ogTitleMatch && titleMatch[1] !== ogTitleMatch[1]) {
        reportFailure(`og:title doesn't match <title> on ${p}: "${ogTitleMatch[1]}" vs "${titleMatch[1]}"`);
      }

      const ogUrlMatch = data.match(/<meta[^>]*property="og:url"[^>]*content="([^"]+)"/);
      if (ogUrlMatch) {
        let expectedUrl = `https://${EXPECTED_HOST}${p}`;
        if (expectedUrl.endsWith('/') && expectedUrl !== `https://${EXPECTED_HOST}/`) {
            expectedUrl = expectedUrl.slice(0, -1);
        }
        if (ogUrlMatch[1] !== expectedUrl && ogUrlMatch[1] !== `https://${EXPECTED_HOST}${p}`) {
           reportFailure(`og:url mismatch on ${p}. Expected something like ${expectedUrl}, found ${ogUrlMatch[1]}`);
        }
      } else {
         reportFailure(`No og:url found on ${p}`);
      }

      const ogImageMatch = data.match(/<meta[^>]*property="og:image"[^>]*content="([^"]+)"/);
      if (!ogImageMatch) {
        reportFailure(`No og:image found on ${p}`);
      }
      
      const ogImageWidth = data.match(/<meta[^>]*property="og:image:width"[^>]*content="([^"]+)"/);
      const ogImageHeight = data.match(/<meta[^>]*property="og:image:height"[^>]*content="([^"]+)"/);
      
      if (ogImageWidth && !Number.isInteger(Number(ogImageWidth[1]))) {
         reportFailure(`og:image:width is not an integer on ${p}: ${ogImageWidth[1]}`);
      }
      if (ogImageHeight && !Number.isInteger(Number(ogImageHeight[1]))) {
         reportFailure(`og:image:height is not an integer on ${p}: ${ogImageHeight[1]}`);
      }

      const metaKeywords = data.match(/<meta[^>]*name="keywords"[^>]*content="([^"]+)"/);
      if (!metaKeywords || !metaKeywords[1].trim()) {
         // Missing keywords is fine, but we'll flag it below if present.
      }
      if (metaKeywords && metaKeywords[1].trim() !== '') {
          reportFailure(`Meta keywords tag is present on ${p} (usually deprecated for SEO)`);
      }

      const h1Match = data.match(/<h1[^>]*>(.*?)<\/h1>/i);
      if (!h1Match) {
        reportFailure(`No H1 found on ${p}`);
      }
      
      if (p.startsWith('/journal/') && p.length > 9) {
          const homeH1 = homeData.match(/<h1[^>]*>(.*?)<\/h1>/i);
          if (h1Match && homeH1 && h1Match[1] === homeH1[1]) {
             reportFailure(`Article ${p} renders the homepage H1 instead of its own.`);
          }
          if (!data.includes('"@type":"Article"') && !data.includes('"@type": "Article"') && !data.includes('"@type":"BlogPosting"') && !data.includes('"@type": "BlogPosting"')) {
             reportFailure(`Article JSON-LD schema missing on ${p}`);
          }
      }

      if (/Kochi.{0,80}19:30/i.test(data) || /19:30.{0,80}Kochi/i.test(data)) {
        reportFailure(`Kochi hours stated as 19:30 on ${p}`);
      }
      if (!data.includes('+91 98470 86990') || (!data.includes('+91 98470 86002') && !data.includes('+919847086002'))) {
        reportFailure(`Footer missing one of the required phone numbers (+91 98470 86990, +91 98470 86002) on ${p}`);
      }

      if (p === '/' || p === '/pages/contact') {
        if (!data.includes('"@type":"LocalBusiness"') && !data.includes('"@type": "LocalBusiness"') && !data.includes('"@type": "JewelryStore"')) {
          reportFailure(`LocalBusiness schema missing on ${p}`);
        }
      }

      if (data.includes('Frequently Asked Questions') || data.includes('FAQs')) {
        if (!data.includes('"@type":"FAQPage"') && !data.includes('"@type": "FAQPage"')) {
          reportFailure(`FAQPage schema missing on ${p} despite containing FAQs`);
        }
      }

      const hrefRegex = /href="(\/[^"]+)"/g;
      let m;
      while ((m = hrefRegex.exec(data)) !== null) {
         allHrefs.add(m[1]);
      }

    } catch (e) {
      reportFailure(`Exception when fetching ${p}: ${e.message}`);
    }
  }

  console.log(`Checking ${allHrefs.size} internal links...`);
  for (const href of allHrefs) {
    if (href.startsWith('/@') || href.startsWith('/assets') || href.startsWith('/src/') || href.startsWith('/images/')) continue; 
    try {
      const url = BASE_URL + href;
      const res = await fetchUrl(url);
      if (res.status !== 200) {
        reportFailure(`Internal link to ${href} returned ${res.status}`);
      }
      if (res.redirectChain) {
        reportFailure(`Internal link to ${href} resulted in a redirect chain`);
      }
    } catch(e) {
      reportFailure(`Internal link to ${href} failed: ${e.message}`);
    }
  }

  if (failures.length > 0) {
    console.log(`\n--- Validation Report: ${failures.length} issues found ---`);
    failures.forEach(f => console.log(`- ${f}`));
    if (STRICT) {
      process.exit(1);
    } else {
      console.log('Exiting with 0 (Warn-only mode)');
      process.exit(0);
    }
  } else {
    console.log('Validation passed successfully.');
    process.exit(0);
  }
}

validate().catch(e => {
  console.error("Unexpected error in validation:", e);
  process.exit(1);
});
