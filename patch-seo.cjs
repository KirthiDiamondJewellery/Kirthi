const fs = require('fs');
let content = fs.readFileSync('src/utils/seo.ts', 'utf8');

const target = `export function injectFAQSchema(faqs: FAQItem[], id: string = "dynamic-faq-schema") {
  try {`;
const replacement = `export function injectFAQSchema(faqs: FAQItem[], id: string = "dynamic-faq-schema") {
  try {
    if (window.location.pathname !== "/") {
      const existing = document.getElementById(id);
      if (existing) existing.remove();
      return;
    }`;

content = content.replace(target, replacement);
fs.writeFileSync('src/utils/seo.ts', content, 'utf8');
