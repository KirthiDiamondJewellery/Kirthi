export function weaveLinks(content: string, id: string): string {
  if (!content) return content;
  let newContent = content;

  // Apply copy corrections
  newContent = newContent.replace(/presented in a private viewing at the boutique\./gi, "presented at a one-on-one consultation at the boutique.");
  newContent = newContent.replace(/taken in person or via private appointment\./gi, "taken in person or by consultation appointment.");
  newContent = newContent.replace(/\bconcierge\b/gi, "atelier");
  newContent = newContent.replace(/\bprivate viewing\b/gi, "one-on-one consultation");
  newContent = newContent.replace(/\bprivate appointment\b/gi, "consultation appointment");
  newContent = newContent.replace(/\.\s+one-on-one/g, ". One-on-one");
  
  // Fix Markdown spacing issues
  newContent = newContent.replace(/\*\*\s+(.*?)\s+\*\*/g, "**$1**");
  newContent = newContent.replace(/([^\n])\n-\s/g, "$1\n\n- ");
  newContent = newContent.replace(/([^\n])\n\d+\.\s/g, "$1\n\n1. ");

  if (id === 'gia-vs-igi-certified-diamonds-which-should-you-choose-when-buying-in-india' || newContent.includes('Gemological Institute of America (GIA)')) {
    if (!newContent.includes('<a href="https://www.gia.edu"')) {
      newContent = newContent.replace('Gemological Institute of America (GIA)', '<a href="https://www.gia.edu" rel="noopener noreferrer">Gemological Institute of America (GIA)</a>');
      newContent = newContent.replace('International Gemological Institute (IGI)', '<a href="https://www.igi.org" rel="noopener noreferrer">International Gemological Institute (IGI)</a>');
    }
  }

  if (id === 'investment-grade-diamond-jewellery-guide' || newContent.includes('GIA or IGI certifications, excellent cut')) {
    if (!newContent.includes('GIA\'s 4Cs')) {
      newContent = newContent.replace('GIA or IGI certifications, excellent cut', 'GIA or IGI certifications, adherence to <a href="https://www.gia.edu/diamond-quality-factor" rel="noopener noreferrer">GIA\'s 4Cs diamond grading system</a>, excellent cut');
    }
  }

  if (id.includes('antique-diamond-jewellery') || newContent.includes('modern interpretations')) {
    if (!newContent.includes('BIS Hallmarking')) {
      newContent = newContent.replace('modern interpretations, and learn', 'modern interpretations, ensuring all pieces meet <a href="https://www.bis.gov.in/hallmarking/" rel="noopener noreferrer">BIS Hallmarking standards</a>, and learn');
    }
  }

  if (id.includes('diamond-jewellery-vs-gold') || newContent.includes('8-12%')) {
    if (!newContent.includes('mcxindia')) {
      newContent = newContent.replace('8-12%,', '8-12% (tracked via <a href="https://www.mcxindia.com/market-data/commodities/gold" rel="noopener noreferrer">MCX gold spot prices</a>),');
    }
    if (!newContent.includes('href="https://www.bis.gov.in')) {
      newContent = newContent.replace('BIS hallmarked gold', '<a href="https://www.bis.gov.in/hallmarking/" rel="noopener noreferrer">BIS hallmarked gold</a>');
    }
  }

  if (id.includes('artisanal-diamond-jewellery-vs-mass-produced') || newContent.includes('certified stones and higher')) {
    if (!newContent.includes('GIA diamond')) {
      newContent = newContent.replace('certified stones and higher', 'certified stones under <a href="https://www.gia.edu/diamond-quality-factor" rel="noopener noreferrer">GIA diamond grading standards</a> and higher');
    }
  }

  if (id.includes('hand-hammering') || newContent.toLowerCase().includes('hand-hammered')) {
    if (!newContent.includes('GIA\'s gemological')) {
      newContent += ' <p>Our commitment to rigorous <a href="https://www.gia.edu/gems-gemology" rel="noopener noreferrer">GIA\'s gemological research</a> ensures lasting quality.</p>';
    }
  }

  if (id.includes('engagement') || newContent.includes('4Cs')) {
    if (!newContent.includes('GIA Diamond')) {
      newContent += ' <p>Informed by the <a href="https://www.gia.edu/diamond-quality-factor" rel="noopener noreferrer">GIA Diamond Grading Report</a>.</p>';
    }
  }

  return newContent;
}
