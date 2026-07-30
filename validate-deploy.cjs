const https = require('https');
const http = require('http');

const baseUrl = process.env.BASE_URL || 'https://kirthidiamonds.com';
const urls = [baseUrl + "/", baseUrl + "/shop", baseUrl + "/journal", baseUrl + "/brides", baseUrl + "/heritage", baseUrl + "/methodology", baseUrl + "/maison"];
const bannedTerms = [/private viewing/i, /private-viewing/i, /concierge/i, /private concierge/i, /private appointment/i, /priority access/i, /hurry/i, /limited time/i, /don't miss/i, /offer ends/i];

function fetchHtml(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('http://') ? http : https;
    client.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ url, html: data, status: res.statusCode }));
    }).on('error', reject);
  });
}

function extractTag(html, regex) {
  const match = html.match(regex);
  return match ? match[1] : null;
}

function extractAllTags(html, regex) {
  const matches = [...html.matchAll(regex)];
  return matches.map(m => m[1]);
}

async function run() {
  try {
    let homepageH1 = null;
    let homepageTitle = null;
    let articleLinks = [];

    // Fetch all core pages
    const results = await Promise.all(urls.map(fetchHtml));
    
    for (const res of results) {
      const { url, html, status } = res;
      if (status !== 200) throw new Error(`URL ${url} returned ${status}`);
      
      const h1 = extractTag(html, /<h1[^>]*>(.*?)<\/h1>/is);
      const title = extractTag(html, /<title[^>]*>(.*?)<\/title>/is);
      
      if (!h1) throw new Error(`RENDER GUARD: ${url} lacks an <h1>`);
      const bodyMatch = html.match(/<body[^>]*>(.*?)<\/body>/is);
      if (!bodyMatch || bodyMatch[1].replace(/<[^>]+>/g, '').trim().length < 100) {
        throw new Error(`RENDER GUARD: ${url} body text under minimum threshold`);
      }
      
      if (url === baseUrl + '/') {
        homepageH1 = h1;
        homepageTitle = title;
      } else {
        if (h1 === homepageH1 || title === homepageTitle) {
          throw new Error(`HOMEPAGE-CLONE GUARD: ${url} has homepage H1 or Title`);
        }
      }
      
      for (const term of bannedTerms) {
        if (term.test(html)) throw new Error(`BANNED VOCABULARY: ${term} found on ${url}`);
      }
      
      if (/<meta[^>]*name=["']keywords["'][^>]*>/i.test(html)) {
        throw new Error(`META KEYWORDS: Found on ${url}`);
      }
      
      const ogTitle = extractTag(html, /<meta[^>]*property=["']og:title["'][^>]*content=["'](.*?)["']/is);
      const ogUrl = extractTag(html, /<meta[^>]*property=["']og:url["'][^>]*content=["'](.*?)["']/is);
      
      if (ogTitle && ogTitle !== title) throw new Error(`META CONSISTENCY: og:title (${ogTitle}) !== title (${title}) on ${url}`);
      if (ogUrl && ogUrl !== url) throw new Error(`META CONSISTENCY: og:url (${ogUrl}) !== url (${url}) on ${url}`);
      
      if ((html.includes('http://') && !html.includes('http://localhost')) || html.includes('www.kirthidiamonds.com')) {
        throw new Error(`CANONICAL HOST: Found http:// or www on ${url}`);
      }
      
      const ogImage = extractTag(html, /<meta[^>]*property=["']og:image["'][^>]*content=["'](.*?)["']/is);
      if (!ogImage || ogImage === 'undefined' || ogImage === 'null' || ogImage.startsWith('data:image')) {
        throw new Error(`IMAGE INTEGRITY: Invalid og:image on ${url}`);
      }
      
      const ogW = extractTag(html, /<meta[^>]*property=["']og:image:width["'][^>]*content=["'](.*?)["']/is);
      if (ogW && !/^\d+$/.test(ogW)) throw new Error(`IMAGE INTEGRITY: Invalid og:image:width on ${url}`);
      
      const ogH = extractTag(html, /<meta[^>]*property=["']og:image:height["'][^>]*content=["'](.*?)["']/is);
      if (ogH && !/^\d+$/.test(ogH)) throw new Error(`IMAGE INTEGRITY: Invalid og:image:height on ${url}`);
      
      if (url === baseUrl + '/') {
        if (!html.includes('"@type": "Organization"')) throw new Error(`SCHEMA PRESENCE: Homepage lacks Organization JSON-LD`);
      }
      
      if (url === baseUrl + '/journal') {
        const links = extractAllTags(html, new RegExp(`href=["'](${baseUrl}/journal/[^"']+)["']`, "gi"));
        // filter out duplicates
        articleLinks = [...new Set(links)];
        if (articleLinks.length === 0) throw new Error(`HUB-LINK GUARD: /journal contains no article links`);
      }
    }
    
    // Check articles
    console.log(`Checking ${articleLinks.length} articles...`);
    const articleResults = await Promise.all(articleLinks.map(fetchHtml));
    for (const res of articleResults) {
      const { url, html, status } = res;
      if (status !== 200) throw new Error(`URL ${url} returned ${status}`);
      const h1 = extractTag(html, /<h1[^>]*>(.*?)<\/h1>/is);
      if (!h1 || h1 === homepageH1) throw new Error(`HUB-LINK GUARD: Article ${url} renders homepage H1`);
      if (!html.includes('"@type": "Article"')) throw new Error(`SCHEMA PRESENCE: Article ${url} lacks Article JSON-LD`);
    }

    console.log("Validation passed successfully!");
  } catch (e) {
    console.error("Validation failed:", e.message);
    process.exit(1);
  }
}
run();
