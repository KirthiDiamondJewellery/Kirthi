const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// 1. Horizontal Logo SVG (Transparent background, brilliant gold diamond crest + typography)
const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 160" width="640" height="160">
  <defs>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FDF4D4" />
      <stop offset="25%" stop-color="#E5C158" />
      <stop offset="50%" stop-color="#D4AF37" />
      <stop offset="75%" stop-color="#AA7C11" />
      <stop offset="100%" stop-color="#F3E096" />
    </linearGradient>
    <linearGradient id="goldLight" x1="0%" y1="100%" x2="0%" y2="0%">
      <stop offset="0%" stop-color="#AA7C11" />
      <stop offset="50%" stop-color="#E5C158" />
      <stop offset="100%" stop-color="#FFFDF0" />
    </linearGradient>
    <linearGradient id="goldDark" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#8C6400" />
      <stop offset="50%" stop-color="#B8860B" />
      <stop offset="100%" stop-color="#694800" />
    </linearGradient>
    <filter id="goldGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="3" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Diamond Emblem on Left -->
  <g transform="translate(48, 20)">
    <!-- Subtle outer glow -->
    <circle cx="60" cy="60" r="54" fill="none" stroke="url(#goldGrad)" stroke-width="0.75" stroke-dasharray="3,3" opacity="0.4" />
    
    <!-- Outer concentric ring -->
    <circle cx="60" cy="60" r="58" fill="none" stroke="url(#goldGrad)" stroke-width="0.5" opacity="0.2" />

    <!-- Brilliant Cut Diamond Geometry (Table, Crown, Pavilion) -->
    <!-- Table -->
    <polygon points="40,38 80,38 96,56 60,56" fill="url(#goldLight)" opacity="0.9" />
    <polygon points="40,38 60,56 24,56" fill="url(#goldGrad)" opacity="0.85" />
    
    <!-- Upper facets / Star facets -->
    <polygon points="60,30 40,38 60,56" fill="url(#goldLight)" opacity="0.95" />
    <polygon points="60,30 80,38 60,56" fill="url(#goldGrad)" opacity="0.9" />
    
    <!-- Outer Crown corners -->
    <polygon points="20,44 40,38 24,56" fill="url(#goldDark)" opacity="0.8" />
    <polygon points="100,44 80,38 96,56" fill="url(#goldDark)" opacity="0.8" />
    <polygon points="60,30 20,44 40,38" fill="url(#goldGrad)" opacity="0.75" />
    <polygon points="60,30 100,44 80,38" fill="url(#goldLight)" opacity="0.75" />

    <!-- Girdle line -->
    <line x1="16" y1="56" x2="104" y2="56" stroke="url(#goldGrad)" stroke-width="1.2" />

    <!-- Pavilion / Lower facets converging to culet (60, 98) -->
    <polygon points="24,56 60,56 60,98" fill="url(#goldGrad)" opacity="0.95" />
    <polygon points="60,56 96,56 60,98" fill="url(#goldLight)" opacity="0.9" />
    <polygon points="16,56 24,56 60,98" fill="url(#goldDark)" opacity="0.85" />
    <polygon points="96,56 104,56 60,98" fill="url(#goldDark)" opacity="0.85" />

    <!-- Facet accent lines -->
    <line x1="60" y1="56" x2="60" y2="98" stroke="#FFFDF0" stroke-width="0.8" opacity="0.8" />
    <line x1="40" y1="38" x2="60" y2="56" stroke="#FFFDF0" stroke-width="0.6" opacity="0.6" />
    <line x1="80" y1="38" x2="60" y2="56" stroke="#FFFDF0" stroke-width="0.6" opacity="0.6" />

    <!-- Center Monogram "K" facet accent -->
    <path d="M52,50 L52,72 M52,61 L68,50 M52,61 L68,72" stroke="url(#goldLight)" stroke-width="1.2" stroke-linecap="round" opacity="0.7" />

    <!-- Sparkle / Glint at apex -->
    <g transform="translate(60, 30)">
      <line x1="0" y1="-6" x2="0" y2="6" stroke="#FFFDF0" stroke-width="1.2" />
      <line x1="-6" y1="0" x2="6" y2="0" stroke="#FFFDF0" stroke-width="1.2" />
      <circle cx="0" cy="0" r="1.5" fill="#FFFDF0" />
    </g>
  </g>

  <!-- Brand Typography -->
  <!-- "KIRTHI" -->
  <text x="210" y="74" 
        fill="url(#goldGrad)" 
        font-family="'Playfair Display', 'Didot', 'Cinzel', 'Georgia', serif" 
        font-size="44" 
        font-weight="500" 
        letter-spacing="9"
        style="text-transform: uppercase;">
    KIRTHI
  </text>

  <!-- "DIAMONDS" -->
  <text x="212" y="106" 
        fill="#FFFFFF" 
        font-family="'Montserrat', 'Cinzel', 'Helvetica Neue', 'Arial', sans-serif" 
        font-size="16" 
        font-weight="300" 
        letter-spacing="12"
        opacity="0.9"
        style="text-transform: uppercase;">
    DIAMONDS
  </text>

  <!-- Separator rule & Subtitle -->
  <line x1="212" y1="118" x2="490" y2="118" stroke="url(#goldGrad)" stroke-width="0.6" opacity="0.5" />
  
  <text x="214" y="132" 
        fill="url(#goldGrad)" 
        font-family="'Montserrat', 'Helvetica Neue', sans-serif" 
        font-size="8.5" 
        font-weight="400" 
        letter-spacing="5"
        opacity="0.8"
        style="text-transform: uppercase;">
    HAUTE JOAILLERIE • BESPOKE • EST. 1975
  </text>
</svg>`;

// 2. Square Emblem SVG for Favicons and App Icons
const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <radialGradient id="bgGrad" cx="50%" cy="50%" r="65%">
      <stop offset="0%" stop-color="#141414" />
      <stop offset="60%" stop-color="#080808" />
      <stop offset="100%" stop-color="#020202" />
    </radialGradient>
    <linearGradient id="goldIconGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFDF0" />
      <stop offset="25%" stop-color="#F3E5AB" />
      <stop offset="50%" stop-color="#D4AF37" />
      <stop offset="75%" stop-color="#AA7C11" />
      <stop offset="100%" stop-color="#E5C158" />
    </linearGradient>
    <linearGradient id="goldLightFacet" x1="0%" y1="100%" x2="0%" y2="0%">
      <stop offset="0%" stop-color="#B8860B" />
      <stop offset="50%" stop-color="#F3E5AB" />
      <stop offset="100%" stop-color="#FFFFFF" />
    </linearGradient>
    <linearGradient id="goldDarkFacet" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#7B5600" />
      <stop offset="50%" stop-color="#9C7308" />
      <stop offset="100%" stop-color="#553A00" />
    </linearGradient>
  </defs>

  <!-- Background -->
  <rect width="512" height="512" rx="96" fill="url(#bgGrad)" />
  <rect width="504" height="504" x="4" y="4" rx="92" fill="none" stroke="url(#goldIconGrad)" stroke-width="1.5" opacity="0.3" />

  <!-- Circular Guilloché halo -->
  <circle cx="256" cy="235" r="160" fill="none" stroke="url(#goldIconGrad)" stroke-width="0.8" opacity="0.25" stroke-dasharray="4,4" />
  <circle cx="256" cy="235" r="175" fill="none" stroke="url(#goldIconGrad)" stroke-width="0.5" opacity="0.15" />

  <!-- Main Diamond Emblem scaled & centered -->
  <g transform="translate(256, 235) scale(2.8) translate(-60, -60)">
    <!-- Table -->
    <polygon points="40,38 80,38 96,56 60,56" fill="url(#goldLightFacet)" opacity="0.95" />
    <polygon points="40,38 60,56 24,56" fill="url(#goldIconGrad)" opacity="0.9" />
    
    <!-- Upper facets / Star facets -->
    <polygon points="60,30 40,38 60,56" fill="url(#goldLightFacet)" opacity="1" />
    <polygon points="60,30 80,38 60,56" fill="url(#goldIconGrad)" opacity="0.95" />
    
    <!-- Outer Crown corners -->
    <polygon points="20,44 40,38 24,56" fill="url(#goldDarkFacet)" opacity="0.85" />
    <polygon points="100,44 80,38 96,56" fill="url(#goldDarkFacet)" opacity="0.85" />
    <polygon points="60,30 20,44 40,38" fill="url(#goldIconGrad)" opacity="0.8" />
    <polygon points="60,30 100,44 80,38" fill="url(#goldLightFacet)" opacity="0.8" />

    <!-- Girdle line -->
    <line x1="16" y1="56" x2="104" y2="56" stroke="url(#goldIconGrad)" stroke-width="1.5" />

    <!-- Pavilion / Lower facets converging to culet -->
    <polygon points="24,56 60,56 60,98" fill="url(#goldIconGrad)" opacity="0.95" />
    <polygon points="60,56 96,56 60,98" fill="url(#goldLightFacet)" opacity="0.9" />
    <polygon points="16,56 24,56 60,98" fill="url(#goldDarkFacet)" opacity="0.85" />
    <polygon points="96,56 104,56 60,98" fill="url(#goldDarkFacet)" opacity="0.85" />

    <!-- Facet lines -->
    <line x1="60" y1="56" x2="60" y2="98" stroke="#FFFDF0" stroke-width="1" opacity="0.85" />
    <line x1="40" y1="38" x2="60" y2="56" stroke="#FFFDF0" stroke-width="0.8" opacity="0.7" />
    <line x1="80" y1="38" x2="60" y2="56" stroke="#FFFDF0" stroke-width="0.8" opacity="0.7" />

    <!-- Center Monogram "K" -->
    <path d="M52,50 L52,72 M52,61 L68,50 M52,61 L68,72" stroke="#FFFDF0" stroke-width="1.5" stroke-linecap="round" opacity="0.9" />

    <!-- Sparkle at apex -->
    <g transform="translate(60, 30)">
      <line x1="0" y1="-8" x2="0" y2="8" stroke="#FFFDF0" stroke-width="1.8" />
      <line x1="-8" y1="0" x2="8" y2="0" stroke="#FFFDF0" stroke-width="1.8" />
      <circle cx="0" cy="0" r="2" fill="#FFFDF0" />
    </g>
  </g>

  <!-- Typography below emblem -->
  <text x="256" y="420" 
        text-anchor="middle"
        fill="url(#goldIconGrad)" 
        font-family="'Playfair Display', 'Didot', 'Georgia', serif" 
        font-size="34" 
        font-weight="500" 
        letter-spacing="10"
        style="text-transform: uppercase;">
    KIRTHI
  </text>
  <text x="256" y="450" 
        text-anchor="middle"
        fill="#FFFFFF" 
        font-family="'Montserrat', 'Arial', sans-serif" 
        font-size="14" 
        font-weight="300" 
        letter-spacing="8"
        opacity="0.8"
        style="text-transform: uppercase;">
    DIAMONDS
  </text>
</svg>`;

// 3. Social OpenGraph Banner (1200x630)
const ogBannerSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630" width="1200" height="630">
  <defs>
    <radialGradient id="ogBg" cx="50%" cy="40%" r="70%">
      <stop offset="0%" stop-color="#141416" />
      <stop offset="65%" stop-color="#080809" />
      <stop offset="100%" stop-color="#020202" />
    </radialGradient>
    <linearGradient id="ogGold" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FFFDF0" />
      <stop offset="25%" stop-color="#F3E5AB" />
      <stop offset="50%" stop-color="#D4AF37" />
      <stop offset="75%" stop-color="#AA7C11" />
      <stop offset="100%" stop-color="#E5C158" />
    </linearGradient>
  </defs>

  <rect width="1200" height="630" fill="url(#ogBg)" />
  <rect width="1176" height="606" x="12" y="12" fill="none" stroke="url(#ogGold)" stroke-width="1" opacity="0.25" />

  <!-- Diamond Halo & Crest -->
  <g transform="translate(600, 200) scale(2.2) translate(-60, -60)">
    <circle cx="60" cy="60" r="54" fill="none" stroke="url(#ogGold)" stroke-width="0.8" opacity="0.3" stroke-dasharray="3,3" />
    <!-- Table -->
    <polygon points="40,38 80,38 96,56 60,56" fill="#FDF4D4" opacity="0.95" />
    <polygon points="40,38 60,56 24,56" fill="url(#ogGold)" opacity="0.9" />
    <!-- Crown -->
    <polygon points="60,30 40,38 60,56" fill="#FFFDF0" opacity="1" />
    <polygon points="60,30 80,38 60,56" fill="url(#ogGold)" opacity="0.95" />
    <polygon points="20,44 40,38 24,56" fill="#8C6400" opacity="0.85" />
    <polygon points="100,44 80,38 96,56" fill="#8C6400" opacity="0.85" />
    <polygon points="60,30 20,44 40,38" fill="url(#ogGold)" opacity="0.8" />
    <polygon points="60,30 100,44 80,38" fill="#FFFDF0" opacity="0.8" />
    <!-- Girdle -->
    <line x1="16" y1="56" x2="104" y2="56" stroke="url(#ogGold)" stroke-width="1.5" />
    <!-- Pavilion -->
    <polygon points="24,56 60,56 60,98" fill="url(#ogGold)" opacity="0.95" />
    <polygon points="60,56 96,56 60,98" fill="#F3E5AB" opacity="0.9" />
    <polygon points="16,56 24,56 60,98" fill="#8C6400" opacity="0.85" />
    <polygon points="96,56 104,56 60,98" fill="#8C6400" opacity="0.85" />
    <!-- Monogram K -->
    <path d="M52,50 L52,72 M52,61 L68,50 M52,61 L68,72" stroke="#FFFFFF" stroke-width="1.5" stroke-linecap="round" opacity="0.9" />
    <!-- Glint -->
    <g transform="translate(60, 30)">
      <line x1="0" y1="-8" x2="0" y2="8" stroke="#FFFDF0" stroke-width="1.8" />
      <line x1="-8" y1="0" x2="8" y2="0" stroke="#FFFDF0" stroke-width="1.8" />
      <circle cx="0" cy="0" r="2" fill="#FFFDF0" />
    </g>
  </g>

  <!-- Typography -->
  <text x="600" y="380" 
        text-anchor="middle"
        fill="url(#ogGold)" 
        font-family="'Playfair Display', serif" 
        font-size="64" 
        font-weight="500" 
        letter-spacing="16"
        style="text-transform: uppercase;">
    KIRTHI DIAMONDS
  </text>
  
  <text x="600" y="430" 
        text-anchor="middle"
        fill="#FFFFFF" 
        font-family="'Montserrat', sans-serif" 
        font-size="20" 
        font-weight="300" 
        letter-spacing="14"
        opacity="0.85"
        style="text-transform: uppercase;">
    BESPOKE HAUTE JOAILLERIE
  </text>

  <line x1="420" y1="465" x2="780" y2="465" stroke="url(#ogGold)" stroke-width="1" opacity="0.5" />

  <text x="600" y="505" 
        text-anchor="middle"
        fill="url(#ogGold)" 
        font-family="'Montserrat', sans-serif" 
        font-size="14" 
        font-weight="400" 
        letter-spacing="8"
        opacity="0.9"
        style="text-transform: uppercase;">
    GIA &amp; IGI CERTIFIED DIAMONDS • KOCHI • CALICUT
  </text>
</svg>`;

async function main() {
  const publicDir = path.resolve(__dirname, '../public');
  
  console.log("Generating brand assets...");
  
  // Save SVG assets
  fs.writeFileSync(path.join(publicDir, 'logo.svg'), logoSvg);
  fs.writeFileSync(path.join(publicDir, 'favicon.svg'), iconSvg);
  console.log("✓ Saved logo.svg and favicon.svg");

  // Generate transparent high-res logo.png (width 640, height 160)
  await sharp(Buffer.from(logoSvg))
    .png()
    .toFile(path.join(publicDir, 'logo.png'));
  console.log("✓ Generated public/logo.png");

  // Generate favicons
  await sharp(Buffer.from(iconSvg))
    .resize(32, 32)
    .png()
    .toFile(path.join(publicDir, 'favicon-32x32.png'));
  console.log("✓ Generated public/favicon-32x32.png");

  await sharp(Buffer.from(iconSvg))
    .resize(192, 192)
    .png()
    .toFile(path.join(publicDir, 'favicon.png'));
  console.log("✓ Generated public/favicon.png");

  await sharp(Buffer.from(iconSvg))
    .resize(512, 512)
    .png()
    .toFile(path.join(publicDir, 'favicon-512.png'));
  console.log("✓ Generated public/favicon-512.png");

  await sharp(Buffer.from(iconSvg))
    .resize(180, 180)
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));
  console.log("✓ Generated public/apple-touch-icon.png");

  // Generate og-cover.jpg
  await sharp(Buffer.from(ogBannerSvg))
    .jpeg({ quality: 90 })
    .toFile(path.join(publicDir, 'og-cover.jpg'));
  console.log("✓ Generated public/og-cover.jpg");

  console.log("All brand assets generated successfully!");
}

main().catch(err => {
  console.error("Error generating brand assets:", err);
  process.exit(1);
});
