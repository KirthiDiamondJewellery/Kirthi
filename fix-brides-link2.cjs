const fs = require('fs');

let fileContent = fs.readFileSync('src/components/BridesShowcase.tsx', 'utf8');

const oldLink2 = `<Link
            to="/contact"
            className="mb-12 inline-block px-8 py-4 border border-[#D4AF37]/50 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-colors text-xs md:text-[10px] uppercase tracking-[0.3em]"
          >
            Book a Consultation
          </Link>`;

const newLink2 = `<a 
            href="/contact"
            onClick={(e) => {
              e.preventDefault();
              window.history.pushState(null, "", "/contact");
              window.dispatchEvent(new Event("popstate"));
            }}
            className="mb-12 inline-block px-8 py-4 border border-[#D4AF37]/50 text-[#D4AF37] hover:bg-[#D4AF37] hover:text-black transition-colors text-xs md:text-[10px] uppercase tracking-[0.3em]"
          >
            Book a Consultation
          </a>`;

fileContent = fileContent.replace(oldLink2, newLink2);

// Remove the import of Link if it's there
fileContent = fileContent.replace("import { Link } from 'react-router-dom';", "");

fs.writeFileSync('src/components/BridesShowcase.tsx', fileContent);
