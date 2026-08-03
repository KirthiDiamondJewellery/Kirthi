const https = require('https');
const http = require('http');

const baseUrl = (process.env.BASE_URL || 'https://kirthidiamonds.com').replace(/\/$/, '');
const expectedHost = (process.env.EXPECTED_HOST || baseUrl).replace(/\/$/, '');
const strict = process.env.STRICT === '1';
const failures = [];
function fail(msg) { if (strict) throw new Error(msg); failures.push(msg); }

const paths = ['/', '/shop', '/journal', '/brides', '/heritage', '/methodology', '/maison'];
const bannedTerms = [/private viewing/i, /private-viewing/i, /concierge/i,
  /private appointment/i, /priority access/i, /hurry/i, /limited time/i, /offer ends/i];

function fetchHtml(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('http://') ? http : https;
    client.get(url, (res) => {
      let data = '';
      res.on('data', c => data += c);
      res.on('end', () => resolve({ url, html: data, status: res.statusCode }));
    }).on('error', reject);
  });
}
const tag = (html, re) => { const m = html.match(re); return m ? m[1].trim() : null; };
const allTags = (html, re) => [...html.matchAll(re)].map(m => m[1]);

async function run() {
  try {
    let homeH1 = null, homeTitle = null, articlePaths = [];
    const results = await Promise.all(paths.map(p => fetchHtml(baseUrl + p)));

    for (const { url, html, status } of results) {
      const path = url.replace(baseUrl, '') || '/';
      if (status !== 200) { fail(`STATUS: ${path} returned ${status}`); continue; }

      const h1 = tag(html, /<h1[^>]*>(.*?)<\/h1>/is);
      const title = tag(html, /<title[^>]*>(.*?)<\/title>/is);

      if (!h1) fail(`RENDER: ${path} lacks an <h1>`);
      const body = html.match(/<body[^>]*>(.*?)<\/body>/is);
      const text = body ? body[1].replace(/<script[\s\S]*?<\/script>/gi, '').replace(/<[^>]+>/g, '').trim() : '';
      if (text.length < 300) fail(`RENDER: ${path} body text only ${text.length} chars`);

      if (path === '/') { homeH1 = h1; homeTitle = title; }
      else if (h1 && h1 === homeH1) fail(`CLONE: ${path} renders homepage H1`);
      else if (title && title === homeTitle) fail(`CLONE: ${path} has homepage title`);

      for (const t of bannedTerms) if (t.test(text)) fail(`BANNED: ${t} on ${path}`);
      if (/<meta[^>]*name=["']keywords["']/i.test(html)) fail(`META-KEYWORDS: on ${path}`);

      const canonical = tag(html, /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)/i);
      if (canonical && (/^http:\/\//.test(canonical) || canonical.includes('//www.')))
        fail(`CANONICAL HOST: ${canonical} on ${path}`);

      const ogTitle = tag(html, /<meta[^>]*property=["']og:title["'][^>]*content=["'](.*?)["']/is);
      if (ogTitle && title && ogTitle !== title) fail(`META: og:title != title on ${path}`);
      const ogUrl = tag(html, /<meta[^>]*property=["']og:url["'][^>]*content=["'](.*?)["']/is);
      const wantUrl = expectedHost + (path === '/' ? '/' : path);
      if (ogUrl && ogUrl.replace(/\/$/, '') !== wantUrl.replace(/\/$/, ''))
        fail(`META: og:url ${ogUrl} != ${wantUrl}`);

      const ogImg = tag(html, /<meta[^>]*property=["']og:image["'][^>]*content=["'](.*?)["']/is);
      if (!ogImg || /^(undefined|null)$/.test(ogImg) || ogImg.startsWith('data:image'))
        fail(`IMAGE: invalid og:image on ${path}`);
      for (const dim of ['width', 'height']) {
        const v = tag(html, new RegExp(`<meta[^>]*property=["']og:image:${dim}["'][^>]*content=["'](.*?)["']`, 'is'));
        if (v && !/^\d+$/.test(v)) fail(`IMAGE: og:image:${dim} not an integer on ${path}`);
      }

      if (path === '/' && !/"@type"\s*:\s*"(Organization|JewelryStore)"/.test(html))
        fail(`SCHEMA: homepage lacks Organization/JewelryStore JSON-LD`);

      if (path === '/journal') {
        articlePaths = [...new Set(allTags(html, /href=["'][^"']*(\/journal\/[^"'#]+)["']/gi))];
        if (!articlePaths.length) fail(`HUB: /journal contains no article links`);
      }
    }

    console.log(`Checking ${articlePaths.length} article(s)...`);
    const arts = await Promise.all(articlePaths.map(p => fetchHtml(baseUrl + p)));
    for (const { url, html, status } of arts) {
      const path = url.replace(baseUrl, '');
      if (status !== 200) { fail(`ARTICLE: ${path} returned ${status}`); continue; }
      const h1 = tag(html, /<h1[^>]*>(.*?)<\/h1>/is);
      if (!h1 || h1 === homeH1) fail(`ARTICLE: ${path} renders homepage H1`);
      if (!/"@type"\s*:\s*"Article"/.test(html)) fail(`SCHEMA: ${path} lacks Article JSON-LD`);
    }

    if (failures.length) {
      console.error(`\n=== ${failures.length} issue(s) found (warn-only mode) ===`);
      failures.forEach(f => console.error('  - ' + f));
      console.error('=== set STRICT=1 to block deploys on these ===\n');
    } else {
      console.log('Validation passed — no issues found.');
    }
  } catch (e) {
    console.error('Validation failed:', e.message);
    process.exit(1);
  }
}
run();
