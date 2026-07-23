const fs = require('fs');

let sf = fs.readFileSync('src/components/SavoirFaire.tsx', 'utf8');

// Remove the AnimatePresence and isExpanded condition
sf = sf.replace(/<AnimatePresence>[\s\S]*?\{isExpanded && \([\s\S]*?<motion\.div[^>]*>[\s\S]*?<div className="[^"]*">([\s\S]*?)<\/div>[\s\S]*?<\/motion\.div>[\s\S]*?\)\]?\s*\}[\s\S]*?<\/AnimatePresence>/, 
  `<div className="text-sm tracking-widest text-white/40 font-light leading-loose pb-6 blog-content border-t border-white/10 pt-6 mt-4 whitespace-pre-wrap">
                              $1
                            </div>`);

// Remove the button
sf = sf.replace(/<button[\s\S]*?toggleExpand[\s\S]*?<\/button>/, '');

fs.writeFileSync('src/components/SavoirFaire.tsx', sf);
console.log('Fixed SavoirFaire.tsx hidden text');
