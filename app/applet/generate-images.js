const fs = require('fs');
const { createCanvas } = require('canvas');
const path = require('path');

const publicDir = path.join(__dirname, 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// 1. logo.png (Width: 1200, Height: 400 for example, or simply 300x128)
function createLogoPNG() {
  const canvas = createCanvas(600, 256);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#050505';
  ctx.fillRect(0, 0, 600, 256);
  ctx.fillStyle = '#D4AF37';
  ctx.font = 'italic 60px "Playfair Display", serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('Kirthi Diamonds', 300, 128);
  
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(path.join(publicDir, 'logo.png'), buffer);
}

// 2. og-cover.jpg (1200x630)
function createOgCover() {
  const canvas = createCanvas(1200, 630);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#0A0A0A';
  ctx.fillRect(0, 0, 1200, 630);
  
  // adding some styling
  ctx.fillStyle = '#D4AF37';
  ctx.font = 'italic 100px "Playfair Display", serif';
  ctx.textAlign = 'center';
  ctx.fillText('Kirthi Diamonds', 600, 250);
  
  ctx.font = 'italic 40px "Playfair Display", serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('Our Diamond Heritage', 600, 350);
  
  const buffer = canvas.toBuffer('image/jpeg', { quality: 0.9 });
  fs.writeFileSync(path.join(publicDir, 'og-cover.jpg'), buffer);
}

// 3. logo.svg
function createLogoSVG() {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="256" viewBox="0 0 600 256">
  <rect width="600" height="256" fill="#050505"/>
  <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#D4AF37" font-family="'Playfair Display', serif" font-size="60" font-style="italic">Kirthi Diamonds</text>
</svg>`;
  fs.writeFileSync(path.join(publicDir, 'logo.svg'), svg);
}

// 4. favicon.ico
function createFaviconICO() {
  const canvas = createCanvas(64, 64);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#050505';
  ctx.fillRect(0, 0, 64, 64);
  
  ctx.fillStyle = '#D4AF37';
  ctx.font = 'italic 40px "Playfair Display", serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('K', 32, 32);
  
  const buffer = canvas.toBuffer('image/png'); // Can serve png as ico or just use the name
  fs.writeFileSync(path.join(publicDir, 'favicon.ico'), buffer);
}

// 5. manifest.webmanifest
function createManifest() {
  const manifest = {
    "name": "Kirthi Diamonds",
    "short_name": "Kirthi",
    "description": "Bespoke Luxury Diamond Jewellery in Kochi & Calicut",
    "start_url": "/",
    "display": "standalone",
    "background_color": "#050505",
    "theme_color": "#D4AF37",
    "icons": [
      {
        "src": "/logo.png",
        "sizes": "192x192",
        "type": "image/png"
      },
      {
        "src": "/logo.png",
        "sizes": "512x512",
        "type": "image/png"
      }
    ]
  };
  fs.writeFileSync(path.join(publicDir, 'manifest.webmanifest'), JSON.stringify(manifest, null, 2));
}

try {
  createLogoPNG();
  createOgCover();
  createLogoSVG();
  createFaviconICO();
  createManifest();
  console.log('Successfully generated images');
} catch (e) {
  console.error("Error generating images:", e);
}
