const fs = require('fs');

function fixMistakes(path) {
  let content = fs.readFileSync(path, 'utf8');

  content = content.replace(/text-2xl md:text-4xl lg:text-5xl lg:text-6xl lg:text-8xl/g, 'text-4xl md:text-6xl lg:text-[80px]');
  content = content.replace(/text-2xl md:text-4xl lg:text-5xl lg:text-[72px] lg:text-\[96px\]/g, 'text-4xl md:text-6xl lg:text-[80px]'); // In case there are some like this
  content = content.replace(/text-4xl md:text-7xl lg:text-\[96px\]/g, 'text-4xl md:text-6xl lg:text-[80px]'); 
  content = content.replace(/text-2xl md:text-4xl lg:text-5xl lg:text-6xl/g, 'text-3xl md:text-5xl lg:text-6xl');
  content = content.replace(/text-2xl md:text-4xl lg:text-5xl/g, 'text-2xl md:text-4xl lg:text-5xl'); // This one might be fine as is


  // Let's also ensure px-14 md:px-... doesn't have duplicates or overlapping things
  
  fs.writeFileSync(path, content, 'utf8');
}

const files = [
  'src/App.tsx',
  'src/components/JournalView.tsx',
  'src/components/MaisonView.tsx',
  'src/components/BridesShowcase.tsx',
  'src/components/SavoirFaire.tsx',
  'src/components/LandingView.tsx',
  'src/components/HeritageArchive.tsx',
  'src/components/ShopExperience.tsx',
  'src/components/OrderStatus.tsx'
];

files.forEach(f => {
  if (fs.existsSync(f)) {
    fixMistakes(f);
    console.log('Fixed', f);
  }
});
