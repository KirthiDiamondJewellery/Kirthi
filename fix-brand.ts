import fs from 'fs';
import path from 'path';

function replaceInFile(filePath: string) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  
  content = content.replace(/private concierge/gi, 'one-on-one bespoke consultation');
  content = content.replace(/a private concierge/gi, 'an exclusive bespoke consultation');
  content = content.replace(/concierge/gi, 'Diamond Specialist');
  content = content.replace(/private viewing/gi, 'one-on-one consultation');
  content = content.replace(/private appointment/gi, 'by-appointment boutique visit');
  
  fs.writeFileSync(filePath, content);
}

const files = [
  'src/components/PageView.tsx',
  'src/components/MaisonView.tsx',
  'src/components/SavoirFaire.tsx',
  'src/components/ContactView.tsx',
  'src/components/FAQView.tsx',
  'src/components/TermsView.tsx',
  'src/components/LandingView.tsx',
  'src/components/AdminView.tsx',
  'src/App.tsx',
  'server.ts',
  'index.html',
  'src/constants.ts',
  'src/contexts/ContentContext.tsx',
  'src/components/ShopExperience.tsx',
  'src/components/BridesShowcase.tsx'
];

files.forEach(replaceInFile);
console.log('Done!');
