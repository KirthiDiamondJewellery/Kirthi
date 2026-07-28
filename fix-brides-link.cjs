const fs = require('fs');

let fileContent = fs.readFileSync('src/components/BridesShowcase.tsx', 'utf8');

const oldLink = `<Link to="/pages/policies" className="inline-block border-b border-[#D4AF37] text-[#D4AF37] hover:text-white hover:border-white transition-colors pb-1">
                View the lifetime buyback and exchange policy
              </Link>`;

const newLink = `<a 
                href="/pages/policies" 
                onClick={(e) => {
                  e.preventDefault();
                  window.history.pushState(null, "", "/pages/policies");
                  window.dispatchEvent(new Event("popstate"));
                }}
                className="inline-block border-b border-[#D4AF37] text-[#D4AF37] hover:text-white hover:border-white transition-colors pb-1"
              >
                View the lifetime buyback and exchange policy
              </a>`;

fileContent = fileContent.replace(oldLink, newLink);
fs.writeFileSync('src/components/BridesShowcase.tsx', fileContent);
