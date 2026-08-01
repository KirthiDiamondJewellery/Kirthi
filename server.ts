import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc, collection, getDocs } from "firebase/firestore";

const app = express();
const PORT = 3000;
app.use(express.json());

// Initialize Firebase Client SDK for Server-Side fetching
const configPath = path.join(process.cwd(), 'firebase-applet-config.json');
let db = null;
if (fs.existsSync(configPath)) {
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  const fbApp = initializeApp(config);
  db = getFirestore(fbApp);
  console.log("Firebase initialized for SSR");
}

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.post("/api/consultation", (req, res) => {
  console.log("Consultation received:", req.body);
  res.json({ success: true });
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true }, root: process.cwd(),
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath, { index: false })); // don't serve index.html automatically
    
    app.get('*', async (req, res) => {
      let indexHtml = fs.readFileSync(path.join(distPath, 'index.html'), 'utf8');
      
      try {
        if (db) {
          if (req.path === '/methodology' || req.path === '/brides') {
            const pageId = req.path === '/methodology' ? 'methodology' : 'bespoke';
            const videoRef = doc(db, 'site_content_pageVideos', pageId);
            const videoSnap = await getDoc(videoRef);
            if (videoSnap.exists()) {
              const data = videoSnap.data();
              const videoIdStr = data.youtubeUrl ? (data.youtubeUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/i)?.[1] || "") : "";
              
              if (videoIdStr) {
                const schema = {
                  "@context": "https://schema.org",
                  "@type": "VideoObject",
                  "name": data.title || "Kirthi Diamonds Video",
                  "description": data.description || "Video from Kirthi Diamonds.",
                  "thumbnailUrl": `https://img.youtube.com/vi/${videoIdStr}/maxresdefault.jpg`,
                  "uploadDate": data.uploadDate || "2024-01-01T08:00:00+08:00",
                  "duration": data.duration || "PT5M",
                  "embedUrl": `https://www.youtube-nocookie.com/embed/${videoIdStr}`
                };
                const scriptTag = `<script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n</script>`;
                indexHtml = indexHtml.replace('</head>', `${scriptTag}\n</head>`);
                
                const noScriptText = `<noscript><div><h2>${data.title}</h2><p>${data.description}</p></div></noscript>`;
                indexHtml = indexHtml.replace('<body>', `<body>\n${noScriptText}`);
              }
            }
          }
          // We can also server-render other pages like /journal/:id
        }
      
      
      } catch (err) {
        console.error("Error fetching SSR data:", err);
      }
      
      // Fix Canonical URL
      let canonicalPath = req.path;
      if (canonicalPath !== '/' && canonicalPath.endsWith('/')) {
        canonicalPath = canonicalPath.slice(0, -1);
      }
      const canonicalUrl = 'https://kirthidiamonds.com' + (canonicalPath === '/' ? '' : canonicalPath);
      indexHtml = indexHtml.replace(
        /<link\s+rel="canonical"\s+href="https:\/\/kirthidiamonds\.com\/?"\s*\/?>/,
        `<link rel="canonical" href="${canonicalUrl}" />`
      );
      
      // Inject specific content for /methodology and /pages/exchange-policy to replace the generic seo-links
      if (req.path === '/methodology') {
        const methodologyHtml = `
        <div id="seo-links" style="position:absolute; width:1px; height:1px; padding:0; margin:-1px; overflow:hidden; clip:rect(0,0,0,0); border:0;">
          <main>
            <h1>The Kirthi Methodology</h1>
            <p>Our process is defined by an uncompromising commitment to artisanal, low-volume production. Unlike mass-manufactured commercial jewellery that relies on rapid, high-volume automated casting and generic setting templates, we restrict our studio to a handful of bespoke creations per month.</p>
            <h2>Rough Selection</h2>
            <p>The process begins with the rigorous selection of rough stones, prioritizing inherent clarity and potential light return. We rely on independent grading from world-renowned institutes, including the GIA and IGI, ensuring that every significant diamond meets our exacting standards before it even reaches the bench.</p>
            <h2>Cutting & Polishing</h2>
            <p>Our master artisans then undertake the delicate process of cutting and polishing, calculating angles and facets to maximize the stone's natural fire and scintillation.</p>
            <h2>Bespoke Setting</h2>
            <p>Once the diamond achieves its optimal brilliance, the setting is individually engineered. Rather than using pre-cast, standardized mounts, our bench jewellers hand-pull platinum wires and forge BIS-hallmarked 18kt and 22kt gold to perfectly accommodate the unique physical characteristics of the chosen stone.</p>
            <h2>Precision Craftsmanship</h2>
            <p>This bespoke tailoring prevents microscopic misalignments, ensuring that the diamond sits perfectly secure while capturing and refracting light from every angle.</p>
            <h2>Final Inspection</h2>
            <p>The final stage is a rigorous quality control inspection, after which the piece is registered in our permanent archive. We specifically champion the use of precision burs, alongside traditional jadai and intricate nakashi work as our specific setting techniques, honoring ancient craftsmanship with modern precision.</p>
          </main>
        </div>
        `;
        indexHtml = indexHtml.replace(/<!-- SEO_LINKS_START -->[\s\S]*?<!-- SEO_LINKS_END -->/, methodologyHtml);
      } else if (req.path === '/pages/exchange-policy') {
        const exchangeHtml = `
        <div id="seo-links" style="position:absolute; width:1px; height:1px; padding:0; margin:-1px; overflow:hidden; clip:rect(0,0,0,0); border:0;">
          <main>
            <h1>Buyback & Exchange Policy</h1>
            <p>At Kirthi Diamonds, every acquisition is considered a lifelong asset. We provide a fully transparent, guaranteed buyback and exchange programme for all certified diamond jewellery purchased at our Kochi or Calicut boutiques.</p>
            <h2>Diamond Exchange Values</h2>
            <table>
              <tr><th>Timeframe</th><th>Exchange Value (against new jewellery)</th><th>Cash Buyback Value</th></tr>
              <tr><td>Within 12 Months</td><td>100% of prevailing diamond value</td><td>90% of prevailing diamond value</td></tr>
              <tr><td>After 12 Months</td><td>100% of prevailing diamond value</td><td>85% of prevailing diamond value</td></tr>
            </table>
            <h2>Gold Exchange Values</h2>
            <table>
              <tr><th>Purity</th><th>Exchange Value</th><th>Cash Buyback Value</th></tr>
              <tr><td>22kt Gold</td><td>100% of prevailing market rate</td><td>95% of prevailing market rate</td></tr>
              <tr><td>18kt Gold</td><td>100% of prevailing market rate</td><td>95% of prevailing market rate</td></tr>
            </table>
            <h2>Terms and Conditions</h2>
            <p>Evaluations are based on the current market value of the diamond on the day of exchange. The original GIA or IGI certification and Kirthi Diamonds invoice must be presented. Jewellery must pass our quality inspection to ensure it has not been altered by third-party jewellers.</p>
          </main>
        </div>
        `;
        indexHtml = indexHtml.replace(/<!-- SEO_LINKS_START -->[\s\S]*?<!-- SEO_LINKS_END -->/, exchangeHtml);
      }

      res.send(indexHtml);
    });

  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
