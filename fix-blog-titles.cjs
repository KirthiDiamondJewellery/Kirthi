const fs = require('fs');

let content = fs.readFileSync('src/contexts/ContentContext.tsx', 'utf8');

// The titles of blog posts in ContentContext.tsx:
// "GIA vs IGI Certified Diamonds: Which Should You Choose When Buying in India?" -> 76 chars
content = content.replace(
  'title: "GIA vs IGI Certified Diamonds: Which Should You Choose When Buying in India?",',
  'title: "GIA vs IGI Certified Diamonds: Which Should You Choose When Buying in India?",\n      seoTitle: "GIA vs IGI Certified Diamonds | Kirthi",'
);

content = content.replace(
  'title: "Diamonds Engagement: A Comprehensive Guide to Choosing the Perfect Ring",',
  'title: "Diamonds Engagement: A Comprehensive Guide to Choosing the Perfect Ring",\n      seoTitle: "Diamond Engagement Rings Guide | Kirthi",'
);

content = content.replace(
  'title: "Antique Diamond Jewellery Designs for Traditional Kerala Weddings",',
  'title: "Antique Diamond Jewellery Designs for Traditional Kerala Weddings",\n      seoTitle: "Kerala Wedding Diamond Jewellery | Kirthi",'
);

content = content.replace(
  'title: "How to Identify Quality in Diamond Jewellery Brands",',
  'title: "How to Identify Quality in Diamond Jewellery Brands",\n      seoTitle: "Quality in Diamond Jewellery Brands | Kirthi",'
);

content = content.replace(
  'title: "Investment-Grade Diamond Jewellery: A Complete Buyer\'s Guide for India",',
  'title: "Investment-Grade Diamond Jewellery: A Complete Buyer\'s Guide for India",\n      seoTitle: "Investment-Grade Diamond Jewellery | Kirthi",'
);

content = content.replace(
  'title: "The Art of Jewellery Design: Finding Inspiration",',
  'title: "The Art of Jewellery Design: Finding Inspiration",\n      seoTitle: "The Art of Jewellery Design | Kirthi Diamonds",'
);

content = content.replace(
  'title: "Diamond Jewellery vs Gold as an Investment in Kerala: What You Need to Know",',
  'title: "Diamond Jewellery vs Gold as an Investment in Kerala: What You Need to Know",\n      seoTitle: "Diamond Jewellery vs Gold Investment | Kirthi",'
);

content = content.replace(
  'title: "The Art of Hand Hammering and Manual Stone Setting: How Kirthi Diamonds Crafts Jewellery Built to Last Generations",',
  'title: "The Art of Hand Hammering and Manual Stone Setting: How Kirthi Diamonds Crafts Jewellery Built to Last Generations",\n      seoTitle: "Hand Hammering & Manual Stone Setting | Kirthi",'
);

content = content.replace(
  'title: "Artisanal Diamond Jewellery vs Mass-Produced: What Is the Real Difference?",',
  'title: "Artisanal Diamond Jewellery vs Mass-Produced: What Is the Real Difference?",\n      seoTitle: "Artisanal vs Mass-Produced Jewellery | Kirthi",'
);

fs.writeFileSync('src/contexts/ContentContext.tsx', content);

