const fs = require('fs');
const { createCanvas } = require('canvas');

function createLogoPNG() {
  const canvas = createCanvas(600, 256);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#050505';
  ctx.fillRect(0, 0, 600, 256);
  ctx.fillStyle = '#D4AF37';
  ctx.font = 'italic 60px serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('Kirthi Diamonds', 300, 128);
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync('./public/logo.png', buffer);
}

function createOgCover() {
  const canvas = createCanvas(1200, 630);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#0A0A0A';
  ctx.fillRect(0, 0, 1200, 630);
  ctx.fillStyle = '#D4AF37';
  ctx.font = 'italic 100px serif';
  ctx.textAlign = 'center';
  ctx.fillText('Kirthi Diamonds', 600, 300);
  ctx.font = 'italic 40px serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('Our Diamond Heritage', 600, 400);
  const buffer = canvas.toBuffer('image/jpeg', { quality: 0.9 });
  fs.writeFileSync('./public/og-cover.jpg', buffer);
}

function createFaviconICO() {
  const canvas = createCanvas(64, 64);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#050505';
  ctx.fillRect(0, 0, 64, 64);
  ctx.fillStyle = '#D4AF37';
  ctx.font = 'italic 40px serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('K', 32, 35);
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync('./public/favicon.ico', buffer);
}

createLogoPNG();
createOgCover();
createFaviconICO();
console.log('Images generated!');
