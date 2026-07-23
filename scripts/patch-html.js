import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const htmlPath = path.join(__dirname, '../dist/index.html');
let html = fs.readFileSync(htmlPath, 'utf8');

// Convert blocking CSS link to async preload
html = html.replace(
  /<link rel="stylesheet" (?:crossorigin )?href="(\/assets\/[^"]+\.css)">/g,
  (match, href) => `<link rel="preload" as="style" href="${href}" onload="this.onload=null;this.rel='stylesheet'" crossorigin>\n<noscript><link rel="stylesheet" href="${href}" crossorigin></noscript>`
);

// Convert module script to deferred module script
html = html.replace(
  /<script type="module" (?:crossorigin )?src="(\/assets\/[^"]+\.js)"><\/script>/g,
  (match, src) => `<script type="module" src="${src}" defer></script>`
);

fs.writeFileSync(htmlPath, html);
console.log('CSS async patch applied to dist/index.html');
