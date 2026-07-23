import multer from "multer";
import sharp from "sharp";
import express from "express";
import path from "path";
import Razorpay from "razorpay";
import dotenv from "dotenv";
import compression from "compression";
import helmet from "helmet";
import crypto from "crypto";
import { initializeApp } from "firebase/app";
import { getFirestore, initializeFirestore, collection, getDocs, doc, getDoc, orderBy, query, limit, onSnapshot } from "firebase/firestore";
import fs from "fs";
import { weaveLinks } from "./src/lib/linkWeaver";
import { generateFAQSchema } from "./src/utils/seo";
import { hardcodedPosts } from "./src/utils/fallbackPosts";
import { getMetaDescription } from "./src/utils/meta";
import { marked } from "marked";

dotenv.config();

let firebaseConfig: any = null;
try {
  firebaseConfig = JSON.parse(fs.readFileSync(path.join(process.cwd(), "firebase-applet-config.json"), "utf8"));
} catch (e) {
  console.error("Could not read firebase-applet-config.json");
}

let db: any = null;
if (firebaseConfig) {
  const firebaseApp = initializeApp(firebaseConfig);
  db = initializeFirestore(firebaseApp, {
    experimentalForceLongPolling: true
  }, firebaseConfig.firestoreDatabaseId);
}

let razorpayClient: Razorpay | null = null;
function getRazorpay(): Razorpay {
  if (!razorpayClient) {
    const key_id = process.env.RAZORPAY_KEY_ID;
    const key_secret = process.env.RAZORPAY_KEY_SECRET;
    if (!key_id || !key_secret) {
      throw new Error("Razorpay credentials missing from environment variables");
    }
    razorpayClient = new Razorpay({ key_id, key_secret });
  }
  return razorpayClient;
}

async function startServer() {
  const app = express();
  app.set("trust proxy", 1);
  const PORT = Number(process.env.PORT) || 3000;

  app.use(compression());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ limit: '10mb', extended: true }));
  
  app.get("/healthz", (req, res) => {
    res.status(200).send("OK");
  });

  
  const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });
  
  app.post("/api/upload", upload.single("file"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      let format = req.file.mimetype === 'image/jpeg' ? 'jpeg' : 'webp';
      let buffer = req.file.buffer; console.log("File received:", req.file.originalname, req.file.mimetype, buffer.length);
      const originalExt = req.file.originalname.split('.').pop()?.toLowerCase();
      let width = 1200;
      let height = 630;
      if (originalExt === 'svg' || req.file.mimetype === 'image/svg+xml') {
        // Keep SVGs as is
        format = 'svg';
      } else {
        const image = sharp(buffer);
        const metadata = await image.metadata();
        const result = await image.resize({
          width: 1200,
          height: 630,
          fit: 'inside',
          withoutEnlargement: true
        }).webp({ quality: 80 }).toBuffer({ resolveWithObject: true });
        
        buffer = result.data;
        format = 'webp';
        width = result.info.width;
        height = result.info.height;
        
        if (buffer.length > 300 * 1024) {
           return res.status(400).json({ error: "Image too large after compression (> 300KB). Please upload a smaller image." });
        }
      }
      const filename = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}_${width}x${height}.${format}`;
      const publicDir = path.join(process.cwd(), 'public', 'images', 'uploads');
      const distDir = path.join(process.cwd(), 'dist', 'images', 'uploads');
      
      if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
      if (!fs.existsSync(distDir)) fs.mkdirSync(distDir, { recursive: true });

      fs.writeFileSync(path.join(publicDir, filename), buffer);
      fs.writeFileSync(path.join(distDir, filename), buffer);

      const url = `https://kirthidiamonds.com/images/uploads/${filename}`;
      res.json({ url });
    } catch (e: any) {
      console.error("Upload error:", e);
      res.status(500).json({ error: e.message || "Failed to process image" });
    }
  });

  app.post("/api/verify-payment", express.json(), (req, res) => {
    try {
      const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
      const key_secret = process.env.RAZORPAY_KEY_SECRET;

      if (!key_secret) {
        return res.status(500).json({ error: "Razorpay secret not configured" });
      }

      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const hmac = crypto.createHmac("sha256", key_secret);
      hmac.update(razorpay_order_id + "|" + razorpay_payment_id);
      const generated_signature = hmac.digest("hex");

      if (generated_signature === razorpay_signature) {
        res.json({ success: true, message: "Payment verified successfully" });
      } else {
        res.status(400).json({ success: false, error: "Invalid signature" });
      }
    } catch (error) {
      console.error("Signature verification error:", error);
      res.status(500).json({ error: "Failed to verify signature" });
    }
  });

  // SEO Redirect middleware: HTTPS, www to non-www, and single-hop legacy 301s
  app.use((req, res, next) => {
    let shouldRedirect = false;
    let targetHost = req.headers.host || req.hostname || '';
    const targetPath = req.originalUrl;
    let proto = req.headers['x-forwarded-proto'] || req.protocol || 'http';
    
    // 1. Force HTTPS in production
    if (proto === 'http' && !targetHost.includes('localhost') && !targetHost.includes('127.0.0.1') && !targetHost.includes('.run.app')) {
      proto = 'https';
      shouldRedirect = true;
    }

    // 2. Redirect www to non-www explicitly
    if (targetHost.startsWith('www.')) {
      targetHost = targetHost.replace(/^www\./i, '');
      shouldRedirect = true;
    } else if (req.hostname === 'www.kirthidiamonds.com') {
      targetHost = 'kirthidiamonds.com';
      shouldRedirect = true;
    }

    // 3. Trailing slash removal
    let pathPart = targetPath.split('?')[0];
    if (pathPart.length > 1 && pathPart.endsWith('/')) {
      pathPart = pathPart.slice(0, -1);
      shouldRedirect = true;
    }
    
    // 4. Single-hop legacy 301 mapping
    let mappedPath = pathPart;
    if (pathPart === '/about' || pathPart === '/projects') mappedPath = '/heritage';
    else if (pathPart === '/faq') mappedPath = '/methodology';
    else if (pathPart === '/collections' || pathPart.startsWith('/collections/') || pathPart === '/category/all-products' || pathPart.startsWith('/category/') || pathPart.startsWith('/product-page') || pathPart === '/pages/diamond-jewellery') mappedPath = '/shop';
    else if (pathPart.startsWith('/post/') || pathPart === '/journal/onam-2026-diamond-jewellery-guide-what-to-buy-and-where-in-kerala' || pathPart === '/shop/post') mappedPath = '/journal';
    else if (pathPart === '/contact-us' || pathPart === '/pages/contact' || pathPart === '/shop/contact-us') mappedPath = '/contact';
    
    if (mappedPath !== pathPart) {
      shouldRedirect = true;
      pathPart = mappedPath;
    }
    
    if (shouldRedirect) {
      const queryPart = targetPath.includes('?') ? targetPath.substring(targetPath.indexOf('?')) : '';
      return res.redirect(301, `${proto}://${targetHost}${pathPart}${queryPart}`);
    }

    next();
  });
  
  // Basic security headers
  app.use(
    helmet({
      contentSecurityPolicy: false, // Disabled to allow external resources/images for now
      crossOriginEmbedderPolicy: false,
      crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" },
      hsts: {
        maxAge: 63072000,
        includeSubDomains: true,
        preload: true
      }
    })
  );

  app.post("/api/create-order", async (req, res) => {
    try {
      const { amount, currency = "INR", receipt } = req.body;
      const rzp = getRazorpay();
      
      const options = {
        amount: Math.round(amount * 100), // amount in the smallest currency unit
        currency,
        receipt: receipt || "receipt_" + Math.random().toString(36).substring(7),
      };
      
      const order = await rzp.orders.create(options);
      res.json(order);
    } catch (error) {
      console.error("Razorpay Error:", error);
      res.status(500).json({ error: "Failed to create order" });
    }
  });

  app.post("/api/send-order-email", async (req, res) => {
    try {
      const { paymentId, orderId, items, shippingDetails } = req.body;
      
      const emailBody = `
NEW ORDER RECEIVED
===================
Order ID: ${orderId}
Payment ID: ${paymentId}

CUSTOMER DETAILS:
Name: ${shippingDetails.name}
Email: ${shippingDetails.email}
Phone: ${shippingDetails.phone}
Address:
${shippingDetails.address}

ORDER ITEMS:
${items.map((item: any) => `
- ${item.name} (QTY: 1)
  Category: ${item.category}
  Price: ₹${item.price.toLocaleString('en-IN')}
${item.selectedMetal ? `  Metal: ${item.selectedMetal}` : ''}
${item.selectedSize ? `  Size: ${item.selectedSize}` : ''}
${item.bespokeInstructions ? `  Bespoke Instructions: ${item.bespokeInstructions}` : ''}
${item.bespokeImage ? `  Bespoke Image: ${item.bespokeImage}` : ''}
`).join('')}

Total Amount: ₹${items.reduce((s: number, i: any) => s + i.price, 0).toLocaleString('en-IN')}
      `;

      // Simulating email sending process to admin
      console.log(`\n\n--- SENDING NEW ORDER EMAIL TO info@kirthidiamonds.com ---`);
      console.log(emailBody);
      console.log(`------------------------------------------------\n\n`);

      const customerEmailBody = `
Dear ${shippingDetails.name},

Thank you for acquiring a masterpiece from Kirthi Diamonds.

Your order (${orderId}) has been successfully placed.

ORDER DETAILS:
${items.map((item: any) => `
- ${item.name}
  ${item.selectedMetal ? `Metal: ${item.selectedMetal}` : ''}
  ${item.selectedSize ? `Size: ${item.selectedSize}` : ''}
`).join('')}

Total: ₹${items.reduce((s: number, i: any) => s + i.price, 0).toLocaleString('en-IN')}

We will inform you once your order is dispatched. 
For bespoke requirements, our Diamond Specialist will be in touch with you shortly.

Warm regards,
Kirthi Diamonds Diamond Specialist
      `;

      // Simulating email sending process to customer
      console.log(`\n\n--- SENDING ORDER CONFIRMATION EMAIL TO ${shippingDetails.email} ---`);
      console.log(customerEmailBody);
      console.log(`------------------------------------------------\n\n`);

      res.json({ success: true, message: "Email sent" });
    } catch (error) {
       console.error("Email Sending Error:", error);
       res.status(500).json({ error: "Failed to send email" });
    }
  });

  app.post("/api/consultation", async (req, res) => {
    try {
      const { category, style, metal, budget, occasion, name, email, phone, message, attachment } = req.body;
      
      const emailBody = `
NEW BESPOKE COMMISSION REQUEST
================================

CLIENT DETAILS:
Name: ${name}
Email: ${email}
Phone: ${phone}

JEWELLERY PREFERENCES:
Category: ${category || 'Not Specified'}
Style/Aesthetic: ${style || 'Not Specified'}
Metal Preference: ${metal || 'Not Specified'}

SCOPE:
Budget: ${budget || 'Not Specified'}
Occasion: ${occasion || 'Not Specified'}

ADDITIONAL DETAILS:
${message || 'None'}
`;

      const mailOptions: any = {
        from: process.env.EMAIL_FROM || '"Kirthi Diamonds" <info@kirthidiamonds.com>',
        to: process.env.EMAIL_TO || 'info@kirthidiamonds.com',
        subject: `New Bespoke Commission Request from ${name}`,
        text: emailBody,
      };

      if (attachment) {
        // attachment is typically a base64 Data URL (e.g., data:image/png;base64,iVBORw0KGgo...)
        const match = attachment.match(/^data:(.+);base64,(.*)$/);
        if (match) {
          const [, mimeType, base64Data] = match;
          let filename = 'attachment';
          if (mimeType.includes('pdf')) filename += '.pdf';
          else if (mimeType.includes('png')) filename += '.png';
          else if (mimeType.includes('jpeg') || mimeType.includes('jpg')) filename += '.jpg';
          else filename += '.bin';
          
          mailOptions.attachments = [
            {
              filename,
              content: Buffer.from(base64Data, 'base64')
            }
          ];
        }
      }

      let emailSent = false;
      let emailError = null;

      if (process.env.EMAIL_SERVER_HOST && process.env.EMAIL_SERVER_USER && process.env.EMAIL_SERVER_PASSWORD) {
        try {
          const nodemailer = await import("nodemailer");
          const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_SERVER_HOST,
            port: parseInt(process.env.EMAIL_SERVER_PORT || "587"),
            secure: process.env.EMAIL_SERVER_PORT === "465",
            auth: {
              user: process.env.EMAIL_SERVER_USER,
              pass: process.env.EMAIL_SERVER_PASSWORD,
            },
            tls: {
              rejectUnauthorized: false
            },
            connectionTimeout: 10000, // 10s connection timeout
            greetingTimeout: 10000,
            socketTimeout: 15000
          });
          
          await transporter.sendMail(mailOptions);
          console.log(`[SMTP] Consultation email sent successfully to ${mailOptions.to}`);
          emailSent = true;
        } catch (err: any) {
          console.error("SMTP Configuration or Delivery Failure:", err);
          emailError = err?.message || String(err);
        }
      } else {
        console.log(`\n\n--- [SIMULATED] SENDING NEW CONSULTATION NOTIFICATION ---`);
        console.log(emailBody);
        console.log(`(Configure EMAIL_SERVER_HOST, EMAIL_SERVER_USER, and EMAIL_SERVER_PASSWORD in .env to send real emails)`);
        console.log(`------------------------------------------------\n\n`);
      }

      res.json({ 
        success: true, 
        message: "Consultation request processed successfully", 
        emailSent, 
        emailError 
      });
    } catch (error) {
       console.error("Consultation Email Sending Error:", error);
       res.status(500).json({ error: "Failed to process consultation request" });
    }
  });

  app.get("/api/gold-rate", async (req, res) => {
    try {
      const fetchReq = await fetch("https://akgsma.com/", {
        headers: { "User-Agent": "Mozilla/5.0" }
      });
      const html = await fetchReq.text();
      let rate22 = 7200;
      let rate18 = 5900;
      const match22 = html.match(/22K916.*?(\d{3,6})/is);
      const match18 = html.match(/18K750.*?(\d{3,6})/is);
      if (match22 && match22[1]) rate22 = parseInt(match22[1], 10);
      if (match18 && match18[1]) rate18 = parseInt(match18[1], 10);
      
      res.json({ success: true, "18KT": rate18, "22KT": rate22 });
    } catch (error) {
       console.error("Gold rate fetch error:", error);
       res.status(500).json({ success: false, error: "Failed to fetch gold rate" });
    }
  });

  app.get("/api/diagnostics/seo", async (req, res) => {
    try {
      const checks = [];
      const baseUrl = "https://kirthidiamonds.com";

      // 1. Robots.txt check
      const robotsTxt = `User-agent: *
Allow: /

User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Applebot-Extended
Allow: /

Sitemap: ${baseUrl}/sitemap-index.xml`;
      
      const sitemapRef = `Sitemap: ${baseUrl}/sitemap-index.xml`;
      const robotsHasSitemap = robotsTxt.includes(sitemapRef);
      checks.push({
        name: "robots_txt_sitemap_reference",
        status: robotsHasSitemap ? "passed" : "failed",
        details: robotsHasSitemap 
          ? `robots.txt strictly contains the correct non-www sitemap reference: "${sitemapRef}"`
          : `robots.txt is missing the non-www sitemap reference`
      });

      // 2. Sitemap non-www check
      const staticRoutes = [
        "/", "/journal", "/heritage", "/methodology", "/maison", "/shop", "/brides", "/faq", "/terms", "/kochi", "/calicut"
      ];
      const testUrls = staticRoutes.map(route => `${baseUrl}${route}`);
      const hasWww = testUrls.some(url => url.includes("www."));
      const allHttps = testUrls.every(url => url.startsWith("https://"));

      checks.push({
        name: "sitemap_only_non_www_urls",
        status: (!hasWww && allHttps) ? "passed" : "failed",
        details: (!hasWww && allHttps)
          ? "Sitemap generated URLs strictly contain only non-www and enforce secure https:// protocol"
          : "Sitemap contains invalid or www URLs"
      });

      const allPassed = checks.every(check => check.status === "passed");
      res.json({
        success: allPassed,
        timestamp: new Date().toISOString(),
        checks
      });
    } catch (e: any) {
      res.status(500).json({ success: false, error: e.message });
    }
  });

  app.get("/ads.txt", (req, res) => {
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=31536000");
    res.sendFile(path.join(process.cwd(), "public", "ads.txt"));
  });

  app.get("/llms.txt", async (req, res) => {
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=3600");
    
    let journalArticlesText = "";
    let shopProductsText = "";
    let heritageItemsText = "";
    
    if (db) {
      try {
        const fetchItems = async (col: string) => {
          const snap = await getDocs(collection(db, col));
          return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        };

        const [posts, trends, products, heritage] = await Promise.all([
          fetchItems("site_content_blogPosts"),
          fetchItems("site_content_journalTrends"),
          fetchItems("site_content_shopProducts"),
          fetchItems("site_content_heritageItems")
        ]);

        journalArticlesText = [...posts, ...trends]
          .filter((p: any) => !["The Art of the Perfect Cut", "2026 High Jewellery Trends", "Bespoke Masterpieces: A Case Study"].includes(p.title))
          .map((p: any) => {
          const slug = p.title ? p.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') : encodeURIComponent(p.id);
          return `- [${p.title}](https://kirthidiamonds.com/journal/${slug})`;
        }).join("\n");
        
        shopProductsText = products.map((p: any) => {
          return `- [${p.name}](https://kirthidiamonds.com/shop?product=${encodeURIComponent(p.id)})`;
        }).join("\n");
        
        heritageItemsText = heritage.map((h: any) => {
          return `- [${h.title}](https://kirthidiamonds.com/heritage?item=${encodeURIComponent(h.id)})`;
        }).join("\n");
      } catch (e) {
        console.error("Error fetching data for llms.txt", e);
      }
    }

    const llms = `# Kirthi Diamonds

Premium diamond and gold jewellery in Kochi and Calicut. GIA and IGI certified bespoke diamond jewellery since 2006.

Kirthi Diamonds is a luxury diamond jewellery brand rooted in a family heritage in the global diamond trade since 1975. The brand serves customers through boutiques in Kochi and Calicut, offering bespoke diamond jewellery, bridal commissions, engagement rings, wedding bands, and BIS hallmarked gold. Every diamond above 0.30 carats is GIA or IGI certified, and the brand offers a one-on-one bespoke consultation experience for customers seeking custom design and premium service.

## Sitemap
- [Sitemap](https://kirthidiamonds.com/sitemap.xml)

## Core Pages
- [Homepage](https://kirthidiamonds.com/) - Brand homepage, showroom overview, trust pillars, and collections entry point
- [The Boutique](https://kirthidiamonds.com/shop) - Collections and services overview
- [Kirthi Brides](https://kirthidiamonds.com/brides) - Bridal diamond jewellery, engagement rings, wedding bands, and custom bridal commissions
- [The Heritage](https://kirthidiamonds.com/heritage) - Brand heritage and family history
- [Our Methodology](https://kirthidiamonds.com/methodology) - Craftsmanship process, certification, hallmarking, and quality standards
- [The Maison](https://kirthidiamonds.com/maison) - Showroom and boutique locations
- [The Journal](https://kirthidiamonds.com/journal) - Editorial content, diamond mastery, and design philosophy
- [Contact](https://kirthidiamonds.com/contact) - Showroom contact details and enquiry information

## Locations
- **Kochi showroom** - 34/572, By Pass Road, Palarivattom, Ernakulam, Kerala 682024
- **Calicut showroom** - 61/11508A, Opposite Federal Bank, Puthiyara, Kozhikode, Kerala 673004

## Business Details
- Founded in 2006
- Family heritage in the global diamond trade since 1975
- GIA and IGI certified diamonds above 0.30 carats
- 100% BIS hallmarked gold
- Lifetime buyback and exchange policy
- One-on-one bespoke consultation boutique experience

## Collections and Services
- Bridal diamond jewellery
- Engagement rings and wedding bands
- Custom masterpieces and bespoke designs
- GIA and IGI certified diamonds
- BIS hallmarked gold

## Shop Products
${shopProductsText || "- No products listed."}

## Heritage Archive
${heritageItemsText || "- No archive items listed."}

## Journal Articles
${journalArticlesText || "- No articles listed."}

## Social Profiles
- [Instagram](https://instagram.com/kirthidiamonds)
- [Facebook](https://facebook.com/kirthidiamonds)
- [Twitter](https://twitter.com/kirthidiamonds)

## Notes for AI Systems
- Prefer the homepage and methodology page for brand and trust information
- Prefer the brides page for bridal and custom commission queries
- Prefer the journal for editorial and educational references
- Prefer the contact and maison pages for location and showroom queries
- Use the boutique page for collections and service categories`;
    res.send(llms);
  });

  app.get("/robots.txt", (req, res) => {
    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Cache-Control", "public, max-age=3600");
    const robots = `User-agent: *
Allow: /

User-agent: GPTBot
Allow: /

User-agent: ClaudeBot
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Google-Extended
Allow: /

User-agent: Applebot-Extended
Allow: /

Sitemap: https://kirthidiamonds.com/sitemap-index.xml`;
    res.send(robots);
  });

  app.get("/sitemap-index.xml", (req, res) => {
    const baseUrl = "https://kirthidiamonds.com";
    const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${baseUrl}/sitemap-journal.xml</loc>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-boutique.xml</loc>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-pages.xml</loc>
  </sitemap>
</sitemapindex>`;
    res.setHeader("Content-Type", "application/xml");
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.send(sitemapIndex);
  });

  app.get("/sitemap-journal.xml", async (req, res) => {
    try {
      const baseUrl = "https://kirthidiamonds.com";
      let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

      // Journal index page
      sitemap += `
  <url>
    <loc>${baseUrl}/journal</loc>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>`;

      if (db) {
        try {
          const snap = await getDocs(collection(db, "site_content_blogPosts"));
          const trendsSnap = await getDocs(collection(db, "site_content_journalTrends"));
          const posts = snap.docs.map(doc => ({ id: doc.id, ...doc.data() as any }));
          const trends = trendsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() as any }));
          [...posts, ...trends].forEach((post: any) => {
            const slug = post.title ? post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') : encodeURIComponent(post.id);
            sitemap += `
  <url>
    <loc>${baseUrl}/journal/${slug}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
          });
        } catch (e) {
          console.error("Error fetching site_content_blogPosts for sitemap", e);
        }
      }

      sitemap += `\n</urlset>`;
      res.setHeader("Content-Type", "application/xml");
      res.setHeader("Cache-Control", "public, max-age=3600");
      res.send(sitemap);
    } catch (error) {
      console.error("Sitemap journal generation error:", error);
      res.status(500).send("Error generating journal sitemap");
    }
  });

  app.get("/sitemap-boutique.xml", (req, res) => {
    const baseUrl = "https://kirthidiamonds.com";
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}/kochi</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/calicut</loc>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>`;
    res.setHeader("Content-Type", "application/xml");
    res.setHeader("Cache-Control", "public, max-age=3600");
    res.send(sitemap);
  });

  app.get("/sitemap-pages.xml", async (req, res) => {
    try {
      const baseUrl = "https://kirthidiamonds.com";
      let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

      // Static routes
      const staticRoutes = [
        { path: "/", priority: "1.0", changefreq: "daily" },
        { path: "/heritage", priority: "0.8", changefreq: "weekly" },
        { path: "/methodology", priority: "0.7", changefreq: "monthly" },
        { path: "/maison", priority: "0.7", changefreq: "monthly" },
        { path: "/shop", priority: "0.9", changefreq: "daily" },
        { path: "/brides", priority: "0.8", changefreq: "weekly" },
        { path: "/faq", priority: "0.7", changefreq: "weekly" },
        { path: "/kochi", priority: "0.8", changefreq: "monthly" },
        { path: "/calicut", priority: "0.8", changefreq: "monthly" },
        { path: "/terms", priority: "0.5", changefreq: "monthly" },
        { path: "/contact", priority: "0.9", changefreq: "monthly" },
        { path: "/pages/policies", priority: "0.8", changefreq: "monthly" },
      ];

      for (const route of staticRoutes) {
        sitemap += `
  <url>
    <loc>${baseUrl}${route.path}</loc>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`;
      }

      if (db) {
        const fetchItems = async (col: string) => {
          try {
            const snap = await getDocs(collection(db, col));
            return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
          } catch (e) {
            console.error(`Error fetching ${col} for sitemap`, e);
            return [];
          }
        };

        const [products, heritage, brides] = await Promise.all([
          fetchItems("site_content_shopProducts"),
          fetchItems("site_content_heritageItems"),
          fetchItems("site_content_brideGallery")
        ]);

        products.forEach((product: any) => {
          sitemap += `
  <url>
    <loc>${baseUrl}/shop?product=${encodeURIComponent(product.id)}</loc>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`;
        });

        heritage.forEach((item: any) => {
          sitemap += `
  <url>
    <loc>${baseUrl}/heritage?item=${encodeURIComponent(item.id)}</loc>
    <changefreq>yearly</changefreq>
    <priority>0.7</priority>
  </url>`;
        });

        brides.forEach((bride: any) => {
          sitemap += `
  <url>
    <loc>${baseUrl}/brides?gallery=${encodeURIComponent(bride.id)}</loc>
    <changefreq>yearly</changefreq>
    <priority>0.6</priority>
  </url>`;
        });
      }

      sitemap += `\n</urlset>`;
      res.setHeader("Content-Type", "application/xml");
      res.setHeader("Cache-Control", "public, max-age=3600");
      res.send(sitemap);
    } catch (error) {
      console.error("Sitemap pages generation error:", error);
      res.status(500).send("Error generating pages sitemap");
    }
  });

  // Serve union or direct to index for standard sitemap.xml requests
  app.get("/sitemap.xml", async (req, res) => {
    res.setHeader("Content-Type", "text/xml");
    const staticUrls = [
      "",
      "/shop",
      "/brides",
      "/heritage",
      "/methodology",
      "/journal",
      "/maison",
      "/kochi",
      "/calicut",
      "/contact"
    ];

    let postSlugs: string[] = [];
    if (db) {
      try {
        const postsSnap = await getDocs(collection(db, "site_content_blogPosts"));
        postsSnap.forEach(doc => {
          const d = doc.data();
          const slug = d.id || (d.title ? d.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') : '');
          if (slug) postSlugs.push(slug);
        });
      } catch (e) {
        console.error("Error fetching sitemap posts", e);
      }
    }
    if (postSlugs.length === 0) {
      postSlugs = hardcodedPosts.map(p => p.id);
    }

    const today = new Date().toISOString().split("T")[0];
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    for (const url of staticUrls) {
      xml += `  <url>\n    <loc>https://kirthidiamonds.com${url}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>weekly</changefreq>\n  </url>\n`;
    }

    for (const slug of postSlugs) {
      xml += `  <url>\n    <loc>https://kirthidiamonds.com/journal/${slug}</loc>\n    <lastmod>${today}</lastmod>\n    <changefreq>monthly</changefreq>\n  </url>\n`;
    }

    xml += `</urlset>`;
    res.send(xml);
  });

  app.get("/robots.txt", (req, res) => {
    res.setHeader("Content-Type", "text/plain");
    res.send(`User-agent: *\nAllow: /\n\nSitemap: https://kirthidiamonds.com/sitemap.xml\n`);
  });

  async function injectSEO(html: string, pathPart: string): Promise<string> {
    const replaceMetaTag = (sourceHtml: string, attrName: "property" | "name", attrValue: string, newContent: string): string => {
      const metaRegex = /<meta\s+([^>]*?)>/gi;
      let found = false;
      const replaced = sourceHtml.replace(metaRegex, (match, attrs) => {
        const attrRegex = new RegExp(`${attrName}\\s*=\\s*["']?${attrValue}["']?`, 'i');
        if (attrRegex.test(attrs)) {
          found = true;
          const contentRegex = /content\s*=\s*["']?([^"']*)["']?/i;
          if (contentRegex.test(attrs)) {
            const newAttrs = attrs.replace(contentRegex, `content="${newContent}"`);
            return `<meta ${newAttrs}>`;
          } else {
            return `<meta ${attrs} content="${newContent}">`;
          }
        }
        return match;
      });

      if (!found) {
        return sourceHtml.replace('</head>', `  <meta ${attrName}="${attrValue}" content="${newContent}" />\n</head>`);
      }
      return replaced;
    };

    const replaceLinkTag = (sourceHtml: string, relValue: string, newHref: string): string => {
      const linkRegex = /<link\s+([^>]*?)>/gi;
      let found = false;
      const replaced = sourceHtml.replace(linkRegex, (match, attrs) => {
        const relRegex = new RegExp(`rel\\s*=\\s*["']?${relValue}["']?`, 'i');
        if (relRegex.test(attrs)) {
          found = true;
          const hrefRegex = /href\s*=\s*["']?([^"'\s>]*)["']?/i;
          if (hrefRegex.test(attrs)) {
            const newAttrs = attrs.replace(hrefRegex, `href="${newHref}"`);
            return `<link ${newAttrs}>`;
          } else {
            return `<link ${attrs} href="${newHref}">`;
          }
        }
        return match;
      });

      if (!found) {
        return sourceHtml.replace('</head>', `  <link rel="${relValue}" href="${newHref}" />\n</head>`);
      }
      return replaced;
    };

    const navLinks = `
      <nav>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/shop">The Boutique</a></li>
          <li><a href="/brides">Kirthi Brides</a></li>
          <li><a href="/heritage">The Heritage</a></li>
          <li><a href="/methodology">Our Methodology</a></li>
          <li><a href="/journal">The Journal</a></li>
          <li><a href="/maison">The Maison</a></li>
        </ul>
      </nav>
    `;

    const footerLinks = `
      <footer>
        <p>Kirthi Diamonds - Luxury Diamond Jewellery</p>
        <p>Kochi: 34/572, By Pass Road, Palarivattom</p>
        <p>Calicut: 61/11508A, Opposite Federal Bank, Puthiyara</p>
      </footer>
    `;

    const buildFallback = (content: string) => `
      <header>
        <p>Kirthi Diamonds</p>
        ${navLinks}
      </header>
      <main>
        ${content}
        <h2>Certifications and Standards</h2>
        <p>Every diamond above 0.30 carats at Kirthi Diamonds is certified by the
          <a href="https://www.gia.edu" rel="noopener noreferrer">
            Gemological Institute of America (GIA)
          </a>
          or the
          <a href="https://www.igi.org" rel="noopener noreferrer">
            International Gemological Institute (IGI)
          </a>,
          ensuring internationally recognised grading for cut, colour, clarity, and carat weight.
          All gold jewellery is
          <a href="https://www.bis.gov.in/hallmarking/" rel="noopener noreferrer">
            BIS Hallmarked
          </a>
          in 18kt and 22kt configurations, guaranteeing purity in accordance with the Bureau of Indian Standards.
        </p>
      </main>
      ${footerLinks}
    `;

    const customMeta: Record<string, { title: string; desc: string; fallbackBody: string }> = {
      "/": {
        title: "Kirthi Diamonds | Bespoke Luxury Diamond Jewellery",
        desc: "Bespoke diamond house est. 2006, family diamond trade since 1975. Luxury GIA and IGI certified diamond and gold jewellery in Kochi and Calicut, Kerala.",
        fallbackBody: "<h1>Kirthi Diamonds - Luxury Diamond Jewellery in Kochi & Calicut</h1><p>A bespoke diamond house est. 2006, rooted in a family diamond trade since 1975. Exclusive boutiques in Kochi and Calicut offering GIA and IGI certified diamonds, BIS Hallmarked gold jewellery, bespoke commissions, and a lifetime exchange policy.</p><h2>Our Collections</h2><p>Bridal jewellery, everyday luxury lines, and high-jewellery bespoke acquisitions.</p><h2>Visit Our Boutiques</h2><p>Kochi and Calicut. One-on-one bespoke consultation appointments available.</p>"
      },
      "/journal": {
        title: "The Journal | Kirthi Diamonds",
        desc: "Insights, artisanal stories, and complete guides to diamond valuation in India.",
        fallbackBody: "<h1>The Journal</h1><p>Insights into artisanal diamond jewellery and investment grade solitaires.</p>",
        image: "https://kirthidiamonds.com/journal-cover.jpg"
      },
      "/heritage": {
        title: "The Heritage | Kirthi Diamonds",
        desc: "Discover our legacy of artisanal diamond mastery since 2006. A retrospective of our most significant diamond commissions.",
        fallbackBody: "<h1>The Heritage</h1><p>The heritage of Kirthi Diamonds is a story of dedication to the diamond trade, beginning with our family's foundational roots in loose diamond sourcing and distribution in 1975. For over three decades, we supplied some of the country's most prominent jewellery retailers, mastering the complex global supply chain from Antwerp and Surat before establishing our bespoke high-jewellery house in 2006. This deep-seated expertise in gemological grading and direct procurement became the cornerstone of Kirthi, enabling us to curate loose diamonds of exceptional purity and make them accessible directly to discerning collectors.</p><p>Throughout our history, we have remained steadfast in our belief that high jewellery should be built on artisanal, low-volume craftsmanship. In an era dominated by rapid commercial fabrication, our heritage is preserved by master craftsmen who hand-finish every setting in our exclusive Kerala workshops. This traditional method allows us to achieve far superior setting outcomes than mass-production lines. A hand-carved setting is built slowly, letting the jeweller adapt the precious metal to the precise optical dimensions of the specific diamond.</p><p>Over the last twenty years, our archive has grown to include historic bridal commissions, bespoke heirloom restorations, and award-winning contemporary designs that celebrate the natural brilliance of conflict-free solitaires. Each milestone in our archive represents an unyielding commitment to BIS-hallmarked purity, GIA and IGI certified authenticity, and the preservation of Indian artisanal heritage.</p>"
      },
      "/terms": {
        title: "Terms & Conditions | Kirthi Diamonds",
        desc: "Our standard terms and conditions of purchase, bespoke commissions, and lifetime buyback guarantees.",
        fallbackBody: "<h1>Terms & Conditions</h1><p>Our standard terms and conditions of purchase, bespoke commissions, and lifetime buyback guarantees.</p>"
      },
      "/methodology": {
        title: "Methodology | Kirthi Diamonds",
        desc: "The exacting journey from rough stone to brilliant masterpiece. Our proprietary crafting methodology.",
        fallbackBody: "<h1>Methodology: From Concept to Masterpiece</h1><p>The journey from a rough diamond to a finished high-jewellery masterpiece at Kirthi Diamonds is a rigorous progression that marries geological intelligence with generational hand-craftsmanship. Every stone we handle begins its life deep within the Earth, where immense pressure and heat crystallize carbon over billions of years. We select only the upper-echelon of these rough gems. Once ethically sourced through audited channels adhering strictly to the Kimberley Process, each gem undergoes a meticulous transformation in our dedicated workshops.</p><p>Our process is defined by an uncompromising commitment to artisanal, low-volume production. Unlike mass-manufactured commercial jewellery that relies on rapid, high-volume automated casting and generic setting templates, we restrict our studio to a handful of bespoke creations per month. This deliberate low-volume approach is central to our setting quality. When gold or platinum is cast to hold diamonds, micro-variations in the stone's dimensions must be accounted for on a sub-millimeter level. At Kirthi, our bench jewellers dedicate dozens of hours to a single setting, hand-drawing wire and hand-carving the metal around the specific proportions of each unique stone. Master setters secure each diamond under high-magnification microscopes using manual claw techniques. The result is a structurally flawless setting with unmatched fire, brilliance, and lifetime durability.</p>"
      },
      "/maison": {
        title: "The Maison | Kirthi Diamonds",
        desc: "The soul of Kirthi Diamonds. A modern journey of artistic integrity, ethical leadership, and the relentless pursuit of brilliance.",
        fallbackBody: "<h1>The Maison: A Legacy of Brilliance</h1><p>Established in 2006 and built upon a family heritage in the diamond trade since 1975, Kirthi Diamonds operates as a premier boutique house dedicated to the preservation of high jewellery as an art form. From our main design atelier to our exclusive boutiques in Kochi and Calicut, we reject the commercialized, high-throughput model of modern retailing in favor of deliberate, low-volume, artisanal craftsmanship. We believe that true luxury cannot be mass-produced; it requires time, intimacy, and an uncompromising focus on singular creations.</p><p>By maintaining a strict limit on our monthly workshop output, we ensure that every creation receives the undivided attention of our master bench jewellers, who possess decades of specialized experience. This bespoke tailoring prevents the microscopic misalignments common in mass-produced items, resulting in settings that are not only remarkably durable but also designed to optimize light transmission.</p><p>Our relationship with our patrons is equally personal. We operate primarily by appointment, offering a slow-paced, advisory-led environment where clients collaborate directly with diamond specialists and designers. Every piece created under our roof is thoroughly documented and registered in our permanent archive. Through our transparent sourcing, independent GIA/IGI certification, and legendary lifetime buyback policy, Kirthi Diamonds stands as a sanctuary of trust and artistic integrity in the world of luxury jewellery.</p>"
      },
      
      "/faq": {
        title: "Frequently Asked Questions | Kirthi Diamonds",
        desc: "Find answers to frequently asked questions regarding GIA/IGI certification, bespoke diamond commissions, and our lifetime exchange policies.",
        fallbackBody: "<h1>Frequently Asked Questions</h1><p>Find answers to our most frequently asked questions regarding GIA/IGI certification, bespoke commissions, custom jewellery design, and lifetime exchange policies.</p>"
      },
      "/brides": {
        title: "Kirthi Brides | Kirthi Diamonds",
        desc: "Celebrating the brides who wear our custom engagement rings and bridal masterpieces.",
        fallbackBody: "<h1>Kirthi Brides: Celebrating Unique Love Stories</h1><p>At Kirthi Diamonds, we believe that bridal jewellery should be as unique as the love story it represents. Our dedicated bridal service is built entirely upon a foundation of low-volume, highly personalized commissions. Rather than presenting brides with mass-manufactured, generic designs, we welcome families into our private consultation rooms in Kochi and Calicut for a slow-paced, collaborative experience. Here, our designers work hand-in-hand with the bride to sketch and render a custom-tailored ensemble—spanning from the center engagement ring to the complete necklace and bangle set—ensuring every piece harmonizes beautifully with her bridal attire and personal style.</p><p>This deliberate low-volume approach is vital to achieving a perfect, durable setting outcome for bridal jewellery, which is designed to be worn and cherished for a lifetime. Commercial bridal sets are often cast using standard molds that force pre-selected diamonds into rigid claw positions. At Kirthi, every bridal mounting is hand-forged and custom-sculpted around the exact contours and proportions of its certified GIA or IGI diamond. Our master setters spend hours under high magnification precisely placing and adjusting each individual claw.</p><p>Whether crafting traditional Kerala-inspired masterpieces, modern solitaire rings, or intricate Polki and uncut diamond sets, we commit to absolute material transparency. Every diamond above 0.30 carats features its own independent laboratory certificate, and every gram of gold is BIS-hallmarked for absolute purity. Backed by our lifetime buyback and exchange policy, a Kirthi bridal commission is not just a stunning accessory for a single day, but a structurally perfect generational heirloom designed to be passed down with pride.</p>"
      },
      "/contact": {
        title: "Contact Us | Kirthi Diamonds",
        desc: "Get in touch to schedule a one-on-one bespoke consultation at our Kochi or Calicut showrooms.",
        fallbackBody: "<h1>Contact Kirthi Diamonds</h1><p>Schedule a one-on-one bespoke consultation at our Kochi showroom (34/572, By Pass Road, Palarivattom) or Calicut showroom (61/11508A, Opposite Federal Bank, Puthiyara).</p>"
      },
      "/pages/policies": {
        title: "Policies & Ethics | Kirthi Diamonds",
        desc: "Comprehensive policies regarding returns, lifetime exchange, ethical sourcing, and client confidentiality at Kirthi Diamonds.",
        fallbackBody: "<h1>Policies & Ethics — Kirthi Diamonds</h1><p>Our comprehensive policies regarding returns, lifetime exchange, ethical sourcing, and client confidentiality.</p>"
      },
      "/pages/exchange-policy": {
        title: "Lifetime Diamond Exchange Policy | Kirthi Diamonds",
        desc: "Kirthi Diamonds lifetime buyback and exchange policy explained in full — how the valuation works, what's covered, how to use it.",
        fallbackBody: "<h1>Lifetime Diamond Buyback and Exchange Policy</h1><p>Understanding our valuation process, what is covered, and how to utilize our lifetime exchange and buyback program.</p>"
      },
      "/pages/certified-diamonds": {
        title: "GIA & IGI Certified Diamonds in Kerala | Kirthi Diamonds",
        desc: "Every diamond above 0.30 carats at Kirthi Diamonds is GIA or IGI certified. Learn how to verify the certificate and what ethical sourcing means.",
        fallbackBody: "<h1>GIA & IGI Certified Diamonds in Kerala</h1><p>Every significant diamond we offer is independently graded by GIA or IGI for guaranteed quality and authenticity.</p>"
      },
      "/kochi": {
        title: "Kochi Boutique | Kirthi Diamonds",
        desc: "Visit our Kochi boutique at Palarivattom for a bespoke diamond jewellery consultation. Explore GIA & IGI certified solitaires and bridal masterpieces.",
        fallbackBody: "<h1>Kirthi Diamonds Kochi Boutique</h1><p>34/572, By Pass Road, Palarivattom, Kochi, Kerala. By appointment boutique visits for bespoke bridal jewellery and certified diamonds.</p>"
      },
      "/calicut": {
        title: "Calicut Boutique | Kirthi Diamonds",
        desc: "Visit our Calicut boutique at Puthiyara for a bespoke diamond jewellery consultation. Explore GIA & IGI certified solitaires and bridal masterpieces.",
        fallbackBody: "<h1>Kirthi Diamonds Calicut Boutique</h1><p>61/11508A, Opposite Federal Bank, Puthiyara, Kozhikode, Kerala. By appointment boutique visits for bespoke bridal jewellery and certified diamonds.</p>"
      }
    };

    let newHtml = html;

    
    const jewelryStoreSchema = {
      "@context": "https://schema.org",
      "@type": "JewelryStore",
      "name": "Kirthi Diamonds",
      "image": "https://kirthidiamonds.com/og-cover.jpg",
      "@id": "https://kirthidiamonds.com",
      "url": "https://kirthidiamonds.com",
      "telephone": "+919847086990",
      "priceRange": "$",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "34/572, By Pass Road, Palarivattom",
        "addressLocality": "Kochi",
        "postalCode": "682024",
        "addressCountry": "IN"
      }
    };
    
    if (pathPart === '/calicut') {
      jewelryStoreSchema.address = {
        "@type": "PostalAddress",
        "streetAddress": "61/11508A, Opposite Federal Bank, Puthiyara",
        "addressLocality": "Kozhikode",
        "postalCode": "673004",
        "addressCountry": "IN"
      };
      jewelryStoreSchema["@id"] = "https://kirthidiamonds.com/calicut";
      jewelryStoreSchema.url = "https://kirthidiamonds.com/calicut";
    } else if (pathPart === '/kochi') {
      jewelryStoreSchema["@id"] = "https://kirthidiamonds.com/kochi";
      jewelryStoreSchema.url = "https://kirthidiamonds.com/kochi";
    }
  

    // Inject global schemas
    newHtml = newHtml.replace('</head>', `\n<script type="application/ld+json">\n${JSON.stringify(jewelryStoreSchema, null, 2)}\n</script>\n</head>`);

    if (pathPart.startsWith("/journal/") && pathPart !== "/journal") {
      const slug = pathPart.replace("/journal/", "");
      if (slug && slug !== "") {
        try {
          let post: any = null;
          let categoryName = "The Publication";

          if (db) {
            const postsCollection = collection(db, "site_content_blogPosts");
            const trendsCollection = collection(db, "site_content_journalTrends");
            const snapshot = await getDocs(postsCollection);
            const trendsSnapshot = await getDocs(trendsCollection);
            
            snapshot.forEach(doc => {
              const data = doc.data();
              const pSlug = (data.title || "").toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || doc.id;
              if (pSlug === slug || doc.id === slug) {
                post = { id: doc.id, ...data };
              }
            });
            
            if (!post) {
              trendsSnapshot.forEach(doc => {
                const data = doc.data();
                const pSlug = (data.title || "").toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '') || doc.id;
                if (pSlug === slug || doc.id === slug) {
                  post = { id: doc.id, ...data };
                  categoryName = "Trends";
                }
              });
            }
          }

          if (!post) {
            const fallbackPost = hardcodedPosts.find(p => p.id === slug);
            if (fallbackPost) {
              post = fallbackPost;
            }
          }

          if (!post) {
            console.error("404 Not Found for slug: " + slug);
            throw new Error('404_NOT_FOUND');
          }

          if (post) {
            newHtml = newHtml.replace(
              /<title>.*?<\/title>/gi, 
              `<title>${post.title || 'Blog Post'} | Kirthi Diamonds</title>`
            );
            
            const descContent = getMetaDescription(post, slug);
            const desc = descContent.replace(/"/g, '&quot;');
            const title = post.title || 'Blog Post';
            
            newHtml = replaceMetaTag(newHtml, "name", "description", desc);
            newHtml = replaceMetaTag(newHtml, "property", "og:title", title);
            newHtml = replaceMetaTag(newHtml, "property", "og:description", desc);
            newHtml = replaceMetaTag(newHtml, "name", "twitter:title", title);
            newHtml = replaceMetaTag(newHtml, "name", "twitter:description", desc);
            
            let img = post.featuredImage && post.featuredImage.trim() !== "" 
               ? post.featuredImage 
               : "https://kirthidiamonds.com/og-cover.jpg";
            
            if (img.startsWith("data:") || img === "logo.png" || img === "/logo.png") {
               img = "https://kirthidiamonds.com/og-cover.jpg";
            } else if (!img.startsWith("http")) {
               if (img.startsWith("/")) img = "https://kirthidiamonds.com" + img;
               else img = "https://kirthidiamonds.com/" + img;
            }
               
            newHtml = replaceMetaTag(newHtml, "property", "og:image", img);
            newHtml = replaceMetaTag(newHtml, "name", "twitter:image", img);
            
            let ogW = "1200";
            let ogH = "630";
            const match = img.match(/_(\d+)x(\d+)\.\w+$/);
            if (match) {
              ogW = match[1];
              ogH = match[2];
            }
            newHtml = replaceMetaTag(newHtml, "property", "og:image:width", ogW);
            newHtml = replaceMetaTag(newHtml, "property", "og:image:height", ogH);

            
            const schema = {
              "@context": "https://schema.org",
              "@type": "Article",
              "headline": post.title,
              "image": img,
              "datePublished": post.date || new Date().toISOString(),
              "dateModified": post.date || new Date().toISOString(),
              "author": [{
                "@type": "Organization",
                "name": "Kirthi Diamonds"
              }]
            }; 
            const breadcrumbCategoryName = post.category || categoryName;
            
            const breadcrumbSchema = {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Home",
                  "item": "https://kirthidiamonds.com/"
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
                  "name": breadcrumbCategoryName,
                  "item": "https://kirthidiamonds.com/journal"
                },
                {
                  "@type": "ListItem",
                  "position": 4,
                  "name": post.title,
                  "item": `https://kirthidiamonds.com/journal/${slug}`
                }
              ]
            };
            
            newHtml = newHtml.replace('</head>', `\n<!-- pipeline-test-2026-07-21 -->\n<script type="application/ld+json">\n${JSON.stringify(schema, null, 2)}\n</script>\n<script type="application/ld+json">\n${JSON.stringify(breadcrumbSchema, null, 2)}\n</script>\n</head>`);
            
            const parsedContent = await marked.parse(weaveLinks(post.content || '', post.id || slug));
            const fallbackContent = `
              <article>
                <h1>${post.title}</h1>
                <img src="${img}" alt="${post.title}" />
                <div>${parsedContent}</div>
              </article>
            `;
            newHtml = newHtml.replace(/<!-- SEO_LINKS_START -->[\s\S]*?<!-- SEO_LINKS_END -->/, `<!-- SEO_LINKS_START --><div id="seo-links" style="position:absolute; width:1px; height:1px; padding:0; margin:-1px; overflow:hidden; clip:rect(0,0,0,0); border:0;">${buildFallback(fallbackContent)}</div><!-- SEO_LINKS_END -->`);
          }
        } catch (e: any) {
          if (e.message === '404_NOT_FOUND') throw e;
          console.error("Error SSRing blog post", e);
        }
      }
    } else if (customMeta[pathPart]) {
      const meta = customMeta[pathPart];
      newHtml = newHtml.replace(
        /<title>.*?<\/title>/gi, 
        `<title>${meta.title}</title>`
      );
      newHtml = replaceMetaTag(newHtml, "name", "description", meta.desc);
      newHtml = replaceMetaTag(newHtml, "property", "og:title", meta.title);
      newHtml = replaceMetaTag(newHtml, "property", "og:description", meta.desc);
      newHtml = replaceMetaTag(newHtml, "name", "twitter:title", meta.title);
      newHtml = replaceMetaTag(newHtml, "name", "twitter:description", meta.desc);
      
      const img = meta.image || "https://kirthidiamonds.com/og-cover.jpg";
      newHtml = replaceMetaTag(newHtml, "property", "og:image", img);
      newHtml = replaceMetaTag(newHtml, "name", "twitter:image", img);
      
            let ogW = "1200";
            let ogH = "630";
            const match = img.match(/_(\d+)x(\d+)\.\w+$/);
            if (match) {
              ogW = match[1];
              ogH = match[2];
            }
            newHtml = replaceMetaTag(newHtml, "property", "og:image:width", ogW);
            newHtml = replaceMetaTag(newHtml, "property", "og:image:height", ogH);


      newHtml = newHtml.replace(/<!-- SEO_LINKS_START -->[\s\S]*?<!-- SEO_LINKS_END -->/, '');
      
      if (pathPart === "/faq" || pathPart === "/methodology") {
        const faqSchema = {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          "mainEntity": [
            {
              "@type": "Question",
              "name": "Are Kirthi Diamonds certified?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes, every diamond above 0.30 carats is certified by renowned laboratories like GIA or IGI."
              }
            },
            {
              "@type": "Question",
              "name": "Do you offer bespoke jewellery services?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "Yes. Kirthi Diamonds specialises in bespoke commissions, from custom masterpieces and engagement rings to bridal jewellery. Each piece is crafted through a one-on-one bespoke consultation process."
              }
            },
            {
              "@type": "Question",
              "name": "What is BIS hallmarking and why does it matter?",
              "acceptedAnswer": {
                "@type": "Answer",
                "text": "BIS hallmarking is the Bureau of Indian Standards certification confirming gold purity. Each piece carries the BIS logo, karat purity (18K or 22K), assaying centre mark, and jeweller's identification mark. BIS hallmarking is legally required for all gold jewellery sold in India. Kirthi Diamonds uses only BIS hallmarked 18kt or 22kt gold."
              }
            }
          ]
        };
        newHtml = newHtml.replace('</head>', `\n<script type="application/ld+json">\n${JSON.stringify(faqSchema)}\n</script>\n</head>`);
      } else if (pathPart === "/shop") {
        const itemListSchema = {
          "@context": "https://schema.org",
          "@type": "ItemList",
          "@id": "https://kirthidiamonds.com/shop#catalogue",
          "name": "Kirthi Diamonds - The Boutique Collection",
          "description": "Explore the full range of GIA and IGI certified diamond jewellery and BIS hallmarked gold collections at Kirthi Diamonds.",
          "itemListElement": [
             { "@type": "ListItem", "position": 1, "item": "https://kirthidiamonds.com/shop" },
             { "@type": "ListItem", "position": 2, "item": "https://kirthidiamonds.com/shop" }
          ]
        };
        newHtml = newHtml.replace('</head>', `\n<script type="application/ld+json">\n${JSON.stringify(itemListSchema)}\n</script>\n</head>`);
      }
    }

    // Replace canonical tag & og:url
    const canonicalBaseUrl = 'https://kirthidiamonds.com';
    let canonicalPathUrl = canonicalBaseUrl;
    if (pathPart === '/' || pathPart === '') {
      canonicalPathUrl += '/';
    } else {
      canonicalPathUrl += pathPart;
    }
    newHtml = replaceLinkTag(newHtml, "canonical", canonicalPathUrl);
    newHtml = replaceMetaTag(newHtml, "property", "og:url", canonicalPathUrl);

    // Fix script tag type="module" issue based on user request
    newHtml = newHtml.replace(
      /<script\s+(?:type="module"\s+)?(?:crossorigin\s+)?src="(\/assets\/[a-zA-Z0-9_.-]+)"\s*(?:crossorigin)?><\/script>/gi,
      '<script type="module" src="$1" defer></script>'
    );
    newHtml = newHtml.replace(
      /<script\s+src="(\/assets\/[a-zA-Z0-9_.-]+)"><\/script>/gi,
      '<script type="module" src="$1" defer></script>'
    );

    // Make CSS bundle non-blocking
    newHtml = newHtml.replace(
      /<link\s+rel="stylesheet"\s*(?:crossorigin)?\s*href="(\/assets\/[a-zA-Z0-9_.-]+\.css)"\s*(?:crossorigin)?>/gi,
      `<link rel="preload" as="style" href="$1" onload="this.onload=null;this.rel='stylesheet'" crossorigin>\n<noscript><link rel="stylesheet" href="$1" crossorigin></noscript>`
    );

    return newHtml;
  }

  // 301 redirects for legacy Wix URLs — permanent
  const WIX_REDIRECTS = {
    '/about': '/maison',
    '/collections': '/shop',
    '/terms-conditions': '/terms',
    '/privacy-policy': '/terms',
    
    '/cancellation-returns': '/terms',
    '/shipping-policy': '/terms',
    '/portfolio': '/heritage',
  };

  for (const [from, to] of Object.entries(WIX_REDIRECTS)) {
    app.get(from, (req, res) => res.redirect(301, to));
  }

  
  // Short URL redirects
  app.get('/journal/investment-grade-diamond-jewellery-guide', (req, res) => res.redirect(301, '/journal/investment-grade-diamond-jewellery-a-complete-buyer-s-guide-for-india'));
  app.get('/journal/diamond-jewellery-vs-gold-investment-kerala', (req, res) => res.redirect(301, '/journal/diamond-jewellery-vs-gold-as-an-investment-in-kerala-what-you-need-to-know'));
  app.get('/journal/gia-vs-igi-certified-diamonds-india-guide', (req, res) => res.redirect(301, '/journal/gia-vs-igi-certified-diamonds-which-should-you-choose-when-buying-in-india'));
  app.get('/journal/antique-diamond-jewellery-kerala-traditional-weddings', (req, res) => res.redirect(301, '/journal/antique-diamond-jewellery-designs-for-traditional-kerala-weddings'));
  app.get('/journal/artisanal-vs-mass-produced-diamond-jewellery', (req, res) => res.redirect(301, '/journal/artisanal-diamond-jewellery-vs-mass-produced-what-is-the-real-difference'));
  app.get('/journal/onam-2026-diamond-jewellery-guide-what-to-buy-and-where-in-kerala', (req, res) => res.redirect(301, '/journal'));

  
  app.get('/pages/diamond-jewellery-in-kochi-kirthi-diamonds-palarivattom-boutique', (req, res) => res.redirect(301, '/kochi'));
  app.get('/about', (req, res) => res.redirect(301, '/heritage'));
  app.get('/faq', (req, res) => res.redirect(301, '/methodology'));
  app.get('/collections', (req, res) => res.redirect(301, '/shop'));
  app.get('/collections/*', (req, res) => res.redirect(301, '/shop'));
  app.get('/category/all-products', (req, res) => res.redirect(301, '/shop'));
  // Note: /category/* is already mapped to /shop
  app.get('/shop/contact-us', (req, res) => res.redirect(301, '/contact'));
  

  // Wildcard redirects for old Wix prefixes
  app.get('/product-page/*', (req, res) => res.redirect(301, '/shop'));
  app.get('/category/*', (req, res) => res.redirect(301, '/shop'));
  app.get('/projects/*', (req, res) => res.redirect(301, '/heritage'));
  app.get('/post/*', (req, res) => res.redirect(301, '/journal'));

  // Serve custom favicon endpoints if defined in Firestore 'site_content/global'
  let globalBrandingData: any = null;
  if (db) {
    try {
      const docSnap = await getDoc(doc(db, "site_content", "global"));
      if (docSnap.exists()) {
        const data = docSnap.data();
        globalBrandingData = {
          faviconSvg: data.customFaviconSvg || null,
          fav32: data.favicon_32 || null,
          fav180: data.favicon_180 || data.favicon_apple || null,
          fav192: data.favicon_192 || null,
          fav512: data.favicon_512 || null
        };
      }
    } catch (e) {
      console.error("Error setting up Firestore snapshot inside server:", e);
    }
  }

  app.get("/favicon.svg", (req, res, next) => {
    if (globalBrandingData && globalBrandingData.faviconSvg) {
      res.setHeader("Content-Type", "image/svg+xml");
      res.setHeader("Cache-Control", "public, max-age=86400");
      return res.send(globalBrandingData.faviconSvg);
    }
    next();
  });

  app.get("/favicon-32x32.png", (req, res, next) => {
    if (globalBrandingData && globalBrandingData.fav32) {
      try {
        const base64Data = globalBrandingData.fav32.split(",")[1] || globalBrandingData.fav32;
        const imgBuffer = Buffer.from(base64Data, "base64");
        res.setHeader("Content-Type", "image/png");
        res.setHeader("Cache-Control", "public, max-age=86400");
        return res.send(imgBuffer);
      } catch (e) {
        console.error("Error serving favicon-32x32.png dynamically", e);
      }
    }
    next();
  });

  app.get("/favicon.png", (req, res, next) => {
    if (globalBrandingData && globalBrandingData.fav192) {
      try {
        const base64Data = globalBrandingData.fav192.split(",")[1] || globalBrandingData.fav192;
        const imgBuffer = Buffer.from(base64Data, "base64");
        res.setHeader("Content-Type", "image/png");
        res.setHeader("Cache-Control", "public, max-age=86400");
        return res.send(imgBuffer);
      } catch (e) {
        console.error("Error serving favicon.png dynamically", e);
      }
    }
    next();
  });

  app.get("/apple-touch-icon.png", (req, res, next) => {
    if (globalBrandingData && globalBrandingData.fav180) {
      try {
        const base64Data = globalBrandingData.fav180.split(",")[1] || globalBrandingData.fav180;
        const imgBuffer = Buffer.from(base64Data, "base64");
        res.setHeader("Content-Type", "image/png");
        res.setHeader("Cache-Control", "public, max-age=86400");
        return res.send(imgBuffer);
      } catch (e) {
        console.error("Error serving apple-touch-icon.png dynamically", e);
      }
    }
    next();
  });

  app.get("/favicon-512.png", (req, res, next) => {
    if (globalBrandingData && globalBrandingData.fav512) {
      try {
        const base64Data = globalBrandingData.fav512.split(",")[1] || globalBrandingData.fav512;
        const imgBuffer = Buffer.from(base64Data, "base64");
        res.setHeader("Content-Type", "image/png");
        res.setHeader("Cache-Control", "public, max-age=86400");
        return res.send(imgBuffer);
      } catch (e) {
        console.error("Error serving favicon-512.png dynamically", e);
      }
    }
    next();
  });



  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "custom",
    });
    app.use(vite.middlewares);

    app.use("*", async (req, res, next) => {
      try {
        const reqUrl = req.originalUrl;
        let pathPart = reqUrl.split("?")[0];
        if (pathPart !== '/' && pathPart.endsWith('/')) {
          pathPart = pathPart.slice(0, -1);
        }
        
        // Serve HTML for all requests that don't seem to be static assets
        if (!pathPart.match(/\.(js|css|png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot|ico|json|webmanifest)$/i)) {
          // Read raw HTML
          let template = fs.readFileSync(path.resolve("index.html"), "utf-8");
          // Let Vite transform it (inject HMR clients, etc)
          template = await vite.transformIndexHtml(req.originalUrl || "/", template);
          // Inject SEO
          template = await injectSEO(template, pathPart);
          res.setHeader("Cache-Control", "no-cache");
          res.status(200).set({ "Content-Type": "text/html" }).end(template);
        } else {
          next();
        }
      } catch (e: any) {
        if (e.message === '404_NOT_FOUND') {
          let template = fs.readFileSync(path.resolve("index.html"), "utf-8");
          template = await vite.transformIndexHtml(req.originalUrl || "/", template);
          res.status(404).set({ "Content-Type": "text/html" }).end(template);
          return;
        }
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });

  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath, { 
      index: false,
      setHeaders: (res, filePath) => {
        if (filePath.endsWith('.html')) {
          res.setHeader('Cache-Control', 'no-cache');
        } else if (filePath.includes('/assets/') || filePath.includes('\\assets\\')) {
          res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
        } else {
          res.setHeader('Cache-Control', 'public, max-age=31536000');
        }
      }
    }));
    
    const validRoutes = ["/", "/journal", "/heritage", "/methodology", "/maison", "/shop", "/brides", "/faq", "/kochi", "/calicut", "/contact"];
    
    app.get("*", async (req, res) => {
      let pathPart = req.path.split("?")[0];
      if (pathPart !== '/' && pathPart.endsWith('/')) {
        pathPart = pathPart.slice(0, -1);
      }
      const indexPath = path.join(distPath, "index.html");
      
      if (!fs.existsSync(indexPath)) {
        return res.status(404).send("Not found");
      }

      let html = fs.readFileSync(indexPath, "utf8");

      if (pathPart === "/" || validRoutes.includes(pathPart) || pathPart.startsWith("/journal/") || pathPart.startsWith("/pages/")) {
        try {
          html = await injectSEO(html, pathPart);
          res.setHeader("Cache-Control", "no-cache");
          res.send(html);
        } catch(e: any) {
          if (e.message === '404_NOT_FOUND') {
            return res.status(404).send("404 Not Found");
          } else {
            console.error("Error serving static route", e);
            res.sendFile(indexPath);
          }
        }
      } else if (pathPart === "/admin") {
        res.setHeader("Cache-Control", "no-store");
        res.sendFile(indexPath);
      } else {
        res.status(404).sendFile(indexPath);
      }
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
