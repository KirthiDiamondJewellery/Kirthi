const fs = require('fs');

function replaceFile(path) {
  let content = fs.readFileSync(path, 'utf8');

  // Paddings
  content = content.replace(/px-6 md:px-32/g, 'px-14 md:px-32');
  content = content.replace(/px-6 md:px-28/g, 'px-14 md:px-28');
  content = content.replace(/px-6 md:px-24/g, 'px-14 md:px-24');
  content = content.replace(/px-6 md:px-16 lg:px-28/g, 'px-14 md:px-16 lg:px-28');
  
  // App specific adjustments if there are any other px-6 md..

  // Fonts
  content = content.replace(/text-5xl md:text-\[96px\]/g, 'text-4xl md:text-7xl lg:text-[96px]');
  content = content.replace(/text-5xl md:text-8xl/g, 'text-4xl md:text-6xl lg:text-8xl');
  content = content.replace(/text-4xl md:text-6xl/g, 'text-3xl md:text-5xl lg:text-6xl');
  content = content.replace(/text-3xl md:text-5xl/g, 'text-2xl md:text-4xl lg:text-5xl');
  content = content.replace(/text-4xl md:text-5xl/g, 'text-3xl md:text-4xl lg:text-5xl');
  
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
    replaceFile(f);
    console.log('Fixed', f);
  }
});
