const fs = require('fs');
let code = fs.readFileSync('src/components/AdminView.tsx', 'utf8');
code = code.replace(/const removeImage = \(idx: number\) => \{\s+const toRemove = displayImages\[idx\];\s+const newImages = displayImages\.filter\(\(_, i\) => i !== idx\);\s+onChange\(newImages, newHero\);\s+if \(heroImage === toRemove\) \{\s+onHeroChange\(newImages\[0\] \|\| ''\);\s+\}\s+\};/g, 
`const removeImage = (idx: number) => {
    const toRemove = displayImages[idx];
    const newImages = displayImages.filter((_, i) => i !== idx);
    let newHero = heroImage;
    if (heroImage === toRemove) {
      newHero = newImages[0] || '';
    }
    onChange(newImages, newHero);
  };`);
fs.writeFileSync('src/components/AdminView.tsx', code);
