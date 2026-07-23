const fs = require('fs');

let appContent = fs.readFileSync('src/App.tsx', 'utf8');

// The if-else block for SEO targetTitle is around here:
/*
      if (viewMode === "boutique") {
        ...
      } else if (currentSection?.id === 'shop') {
*/

// Let's add a condition for viewMode === "page" and viewMode === "faq" and viewMode === "article"
const insertPoint = `      if (viewMode === "boutique") {`;

const newCode = `      if (viewMode === "page") {
        if (path === '/contact' || path === '/pages/contact') {
          targetTitle = "Contact | Kirthi Diamonds";
          descContent = "Get in touch to schedule a one-on-one bespoke consultation at our Kochi or Calicut showrooms.";
        } else if (path === '/pages/policies') {
          targetTitle = "Policies & Ethics | Kirthi Diamonds";
          descContent = "Comprehensive policies regarding returns, lifetime exchange, ethical sourcing, and client confidentiality at Kirthi Diamonds.";
        } else if (path === '/pages/exchange-policy') {
          targetTitle = "Lifetime Exchange Policy | Kirthi Diamonds";
          descContent = "Kirthi Diamonds lifetime buyback and exchange policy explained in full — how the valuation works, what's covered, how to use it.";
        } else if (path === '/pages/diamond-jewellery') {
          targetTitle = "Diamond Jewellery | Kirthi Diamonds";
          descContent = "Boutique luxury diamond jewellers in Kochi and Calicut with GIA and IGI certified diamonds, BIS hallmarked gold, lifetime buyback.";
        }
      } else if (viewMode === "faq" || path === '/faq') {
        targetTitle = "Frequently Asked Questions | Kirthi Diamonds";
        descContent = "Find answers to frequently asked questions regarding GIA/IGI certification, bespoke diamond commissions, and our lifetime exchange policies.";
      } else if (viewMode === "boutique") {`;

appContent = appContent.replace(insertPoint, newCode);

fs.writeFileSync('src/App.tsx', appContent);
