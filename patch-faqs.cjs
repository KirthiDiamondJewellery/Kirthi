const fs = require('fs');
let content = fs.readFileSync('src/contexts/ContentContext.tsx', 'utf8');

const faqs = [
  {
    question: "Where can I buy diamond jewellery in Kochi?",
    answer: "Kochi's main jewellery districts include MG Road, Broadway, and Edapally Bypass Road. Most established jewellers offer bridal collections ranging from traditional Kerala temple designs to contemporary styles. When buying, look for GIA or IGI certification on all diamonds, transparent pricing with itemised invoices, lifetime exchange policies, custom design services, and BIS hallmarking on gold."
  },
  {
    question: "How does custom jewellery design work at a jeweller in Kerala?",
    answer: "Most established jewellers in Kerala offer custom design services. The typical process includes a free design consultation, diamond selection from certified inventory, 3D preview or sketches, a crafting timeline of 2 to 4 weeks, and final delivery with certification. Before committing, ask to see a portfolio of custom work, confirm what is included in the design fee, ask whether you can approve the design before crafting begins, and confirm whether the diamond will be GIA or IGI certified."
  },
  {
    question: "How do I verify a diamond solitaire certificate?",
    answer: "Look for GIA or IGI certificates, which are internationally recognised standards. Verify online at GIA.edu/report-check or IGI.org/verify-your-report, then check that the 4Cs - carat, cut, clarity, and colour - match exactly what you are being shown. Certified diamonds above 0.3 carats typically carry a microscopic laser inscription on the girdle that should match the certificate number under 10x magnification. Red flags include refusal to verify the certificate online, missing laser inscriptions, photocopied or altered documents, and certificates from unknown laboratories."
  },
  {
    question: "How can I tell if a diamond is real?",
    answer: "Professional verification is always recommended. Ask the jeweller to test the stone with a diamond tester using thermal conductivity, examine it under a loupe for natural inclusions, verify the certification online using the GIA or IGI portal, and get an independent appraisal if you are purchasing an expensive piece."
  },
  {
    question: "What should I know about jewellery exchange and buyback policies in Kerala?",
    answer: "Most jewellers offer lifetime exchange on their own jewellery. Exchange value typically covers 100% of the gold and diamond value, and you pay the difference in price plus any new making charges. Before buying, ask what the exchange policy is after 5 years, whether the jeweller offers buyback or only exchange, whether the policy is documented on the invoice, and whether there are any conditions or time limits. Always get all policies in writing on your invoice as verbal promises are not enforceable."
  },
  {
    question: "What credentials should I look for when choosing a jeweller in Kerala?",
    answer: "Look for a minimum of 10 years in business, a physical showroom with a permanent address, a BIS licence for hallmarking, membership of recognised jewellery associations, and transparent pricing with itemised invoices. Good signs include encouragement of independent certificate verification, written exchange and buyback policies, detailed diamond education, and positive long-term customer reviews."
  },
  {
    question: "Is GIA or IGI certification better when buying diamonds in India?",
    answer: "Both GIA and IGI are internationally recognised diamond grading laboratories. The practical answer: **GIA is the global gold standard for loose investment-grade solitaires** — particularly for stones above 1 carat that you might resell internationally. **IGI is the more common and faster-turnaround certification for jewellery pieces**, especially studded bridal sets, because IGI grades both loose stones and finished jewellery. At Kirthi Diamonds we stock and certify against both standards. A GIA certificate carries a 5–15% resale premium over an equivalent IGI grade in India, but for finished bridal sets IGI is the practical industry standard.",
    schemaAnswer: "Both are internationally recognised. GIA is the global gold standard for loose investment-grade solitaires. IGI is the more common and faster-turnaround certification for jewellery pieces, especially bridal sets. GIA carries a 5–15% resale premium over equivalent IGI grades in India. Kirthi Diamonds stocks and certifies against both standards."
  },
  {
    question: "What is the difference between artisanal and mass-produced diamond jewellery?",
    answer: "Mass-produced jewellery is cast in standardised batches from a single CAD model, with diamonds sourced to grade-ranges rather than individual certificates. Artisanal jewellery is built around the specific stone — each diamond hand-selected against its own GIA or IGI certificate, the setting designed to its dimensions, and the prongs cut individually by a master bench jeweller. The practical buyer-level differences are: per-stone certification, hand-finished tolerances measured in hundredths of a millimetre, and lifetime accountability tied to the individual piece. At Kirthi Diamonds, every piece is artisanally finished by jewellers with 15+ years of mastery.",
    schemaAnswer: "Mass-produced jewellery is cast in batches with diamonds graded to ranges. Artisanal jewellery is built around the specific stone — each diamond hand-selected against its own GIA or IGI certificate, the setting designed to its dimensions, and prongs cut individually by a master bench jeweller. Kirthi Diamonds pieces are artisanally finished by jewellers with 15+ years of mastery."
  },
  {
    question: "How does diamond jewellery compare to gold as an investment in Kerala?",
    answer: "Gold has historically delivered 8–12% annual appreciation in INR over the last decade, with universal liquidity. Certified diamond jewellery delivers 4–8% on retail pieces and higher on investment-grade solitaires above 1 carat — but with lower liquidity and reliance on the original jeweller's buyback policy. The most balanced approach for a Kerala buyer is to hold both: gold for daily-wear and short-term liquidity, certified diamonds for long-term holdings and design value. Kirthi Diamonds' lifetime buyback policy materially changes the diamond investment math by guaranteeing a real exit valuation against the original certificate.",
    schemaAnswer: "Gold has delivered 8–12% annual INR appreciation with universal liquidity. Certified diamond jewellery delivers 4–8% on retail pieces, higher on investment-grade solitaires above 1 carat — with lower liquidity and reliance on the jeweller's buyback policy. The balanced approach is to hold both. Kirthi Diamonds' lifetime buyback materially changes the diamond investment math."
  },
  {
    question: "What traditional jewellery designs are available for Kerala Hindu weddings?",
    answer: "The traditional Kerala Hindu bridal vocabulary includes the **Mullamottu Mala** (jasmine-bud choker), **Palakka Mala** (leaf necklace), **Lakshmi Haram** (multi-strand goddess Lakshmi necklace), **Nagapadam pendant** (hooded-cobra), **Kasu Mala** (gold-coin chain) and **Manga Mala** (mango-motif chain). The set typically extends to matched jhumka earrings, vanki arm bands, kada bangles and a diamond-studded waist belt. Pieces are traditionally executed in 22kt yellow gold with diamond accents set into each component. Kirthi Diamonds maintains a heritage archive of antique-style designs across all of these traditional Kerala pieces, with bespoke commissions available at the Kochi and Calicut boutiques.",
    schemaAnswer: "Mullamottu Mala, Palakka Mala, Lakshmi Haram, Nagapadam pendant, Kasu Mala and Manga Mala, with matched jhumkas, vanki arm bands, kada bangles and a diamond-studded waist belt — typically in 22kt yellow gold with diamond accents. Kirthi Diamonds maintains a heritage archive of all traditional Kerala designs."
  },
  {
    question: "Are diamond jewellery showrooms in Kochi open on Sundays?",
    answer: "Most Kerala diamond boutiques — including Kirthi Diamonds — are closed on Sundays. Kirthi Diamonds Kochi is open **Monday to Saturday, 10:00am to 7:30pm** at 34/572 By Pass Road, Palarivattom. The Calicut boutique opens slightly earlier, at 9:30am, with the same Monday-to-Saturday schedule. For Sunday and late-evening enquiries, our Diamond Specialist responds via WhatsApp at +91 98470 86990 — including by-appointment boutique visit booking, certificate verification questions, and bespoke design discussions. For urgent visits outside boutique hours, after-hours by-appointment boutique visits can be arranged on request.",
    schemaAnswer: "Most Kerala diamond boutiques, including Kirthi Diamonds, are closed on Sundays. Kirthi Diamonds Kochi is open Monday to Saturday, 10:00am to 7:30pm. For Sunday queries, our Diamond Specialist responds via WhatsApp at +91 98470 86990, including for after-hours by-appointment boutique visits."
  },
  {
    question: "What should I know about diamond buyback guarantees in Kerala?",
    answer: "The most important things to verify in any diamond buyback guarantee: (1) the policy is **written on the invoice**, not stated verbally; (2) it covers **the lifetime** of the piece without time caps; (3) diamonds are valued against their **original GIA or IGI certificate** at current market, not at a fixed percentage discount; (4) gold is valued at the **prevailing BIS hallmarked rate** by weight; (5) the policy is **honoured at the original jeweller's outlets**, not subcontracted. Kirthi Diamonds offers a lifetime buyback and exchange policy on every Kirthi creation, honoured at both the Kochi and Calicut boutiques.",
    schemaAnswer: "Verify: (1) policy written on the invoice; (2) covers the lifetime of the piece; (3) diamonds valued against original GIA/IGI certificate at current market; (4) gold valued at prevailing BIS hallmarked rate; (5) honoured at the original jeweller's outlets. Kirthi Diamonds offers a lifetime buyback at both the Kochi and Calicut boutiques."
  },
  {
    question: "How do I negotiate diamond jewellery prices in Kochi?",
    answer: "Diamond jewellery pricing decomposes into four components: **stone cost**, **gold weight at the prevailing BIS rate**, **making charges** (8–25% of gold value), and **certification cost**. Stone cost and gold rate are not negotiable — they're tied to international markets. The negotiable component is **making charges**, and the genuine savings come from comparing total inclusions rather than headline discounts. Ask three questions: is every stone individually certified? Is the buyback policy written on the invoice for the lifetime of the piece? Is restyle and remake included? At Kirthi Diamonds the policy answer is yes to all three, and pricing is consistent year-round.",
    schemaAnswer: "Stone cost and gold rate are not negotiable. The negotiable component is making charges (8–25% of gold value). Genuine savings come from comparing total inclusions — certification, buyback policy, restyle service — rather than headline discounts. Kirthi Diamonds pricing is consistent year-round with all policies included as standard."
  },
  {
    question: "What makes a diamond investment-grade?",
    answer: "An investment-grade diamond meet five criteria: (1) **independent GIA or IGI certification** with a verifiable report number; (2) **Cut grade of Excellent (GIA) or Ideal (IGI)**; (3) **Colour grade of D, E or F** — the colourless band; (4) **Clarity grade of VS1 or higher** — VS1, VVS2, VVS1, IF, or FL; (5) **Carat weight of at least 0.50, ideally 1 carat or above**. Below these thresholds, certificate cost erodes the investment premium. Kirthi Diamonds' investment-grade inventory begins at 0.50 carat GIA-certified, with every piece sold with a lifetime buyback policy against the original certificate.",
    schemaAnswer: "GIA or IGI certification, Cut grade Excellent/Ideal, Colour D–F, Clarity VS1 or higher, and Carat weight at least 0.50 (ideally 1+). Kirthi Diamonds' investment-grade inventory begins at 0.50 carat GIA-certified with the lifetime buyback policy applied."
  },
  {
    question: "What is BIS hallmarking and why does it matter for gold jewellery?",
    answer: "BIS hallmarking is the Bureau of Indian Standards certification confirming the **purity of the gold** in a jewellery piece. Every BIS hallmarked piece carries four marks: the BIS logo, the karat purity (18K or 22K), the assaying centre mark, and the jeweller's identification mark. BIS hallmarking is **legally required** for all gold jewellery sold in India and is the only standardised guarantee a Kerala buyer has against under-karatage. You can verify standards at the [official BIS portal](https://www.bis.gov.in/hallmarking/). Kirthi Diamonds uses only BIS hallmarked gold at 18kt or 22kt across every collection. BIS certifies the gold; the diamonds are separately certified under GIA or IGI.",
    schemaAnswer: "BIS hallmarking is the Bureau of Indian Standards certification confirming gold purity. Each piece carries the BIS logo, karat purity (18K or 22K), assaying centre mark, and jeweller's identification mark. BIS hallmarking is legally required for all gold jewellery sold in India. Kirthi Diamonds uses only BIS hallmarked 18kt or 22kt gold."
  },
  {
    question: "How do I verify a diamond certificate before buying in India?",
    answer: "Both major laboratories publish their grading reports online. **For GIA:** visit [gia.edu/report-check](https://www.gia.edu/report-check), enter the report number from the printed certificate, and the full report is returned with all 4C grades, measurements, fluorescence, and a diamond plot. **For IGI:** visit [igi.org/verify-your-report](https://www.igi.org/verify-your-report), enter the report number, and the full report is returned. The printed details must match the online record exactly. Additionally, almost every certified loose diamond carries a laser inscription on the girdle that should match the report number under 10× loupe magnification. Kirthi Diamonds encourages every client to perform both checks live at the boutique before any purchase commitment.",
    schemaAnswer: "For GIA: visit gia.edu/report-check, enter the report number. For IGI: visit igi.org/verify-your-report, enter the report number. The printed details must match the online record exactly. Most certified diamonds also carry a laser-inscribed report number on the girdle. Kirthi Diamonds encourages every client to verify at the boutique before purchase."
  }
];

const homeFAQs = [
  {
    question: "Are Kirthi Diamonds' jewellery pieces certified?",
    answer: "Yes. Every diamond above 0.30 carats at Kirthi Diamonds is certified by GIA (Gemological Institute of America) or IGI (International Gemological Institute), ensuring internationally recognised grading for cut, colour, clarity, and carat weight."
  },
  {
    question: "Is the gold jewellery at Kirthi Diamonds hallmarked?",
    answer: "Yes. All gold jewellery at Kirthi Diamonds is 100% BIS Hallmarked, guaranteeing purity in both 18kt and 22kt alloy configurations. Every piece is rigorously tested and stamped before leaving the atelier."
  },
  {
    question: "Does Kirthi Diamonds offer bespoke and custom jewellery?",
    answer: "Yes. Kirthi Diamonds specialises in bespoke commissions, from custom masterpieces and engagement rings to bridal jewellery. Each piece is crafted through a one-on-one bespoke consultation process, from conceptual sketches to final polish, ensuring a unique personal narrative."
  },
  {
    question: "What is Kirthi Diamonds' exchange and buyback policy?",
    answer: "Kirthi Diamonds offers a lifetime buyback and exchange policy on all Kirthi creations. The policy is transparent and honours the enduring value of every piece purchased."
  },
  {
    question: "Where are Kirthi Diamonds' showrooms located?",
    answer: "Kirthi Diamonds has two boutiques in Kerala. The Kochi showroom is at 34/572, By Pass Road, Palarivattom, Ernakulam, Kerala 682024, open Monday to Saturday 10:00 am to 7:30 pm. The Calicut showroom is at 61/11508A, Opposite Federal Bank, Puthiyara, Kozhikode, Kerala 673004, open Monday to Saturday 9:30 am to 7:30 pm."
  },
  {
    question: "How long has Kirthi Diamonds been in business?",
    answer: "A bespoke diamond house est. 2006, rooted in a family diamond trade since 1975."
  },
  {
    question: "Does Kirthi Diamonds sell bridal jewellery and engagement rings?",
    answer: "Yes. Kirthi Diamonds offers a dedicated bridal jewellery collection, including engagement rings, wedding bands, and custom bridal masterpieces. Bespoke bridal commissions are available through one-on-one bespoke consultation appointments at both the Kochi and Calicut boutiques."
  },
  {
    question: "What diamond quality standard does Kirthi Diamonds use?",
    answer: "Kirthi Diamonds sources exclusively 100% natural diamonds to an Internally Flawless standard, with VVS1 clarity and E/F colour grades. All diamonds above 0.30 carats carry GIA or IGI certification, and every piece is documented and archived for full traceability."
  }
];

content = content.replace(
  'const listCollections = [\'blogPosts\', \'shopProducts\', \'heritageItems\', \'methodologySteps\', \'brideGallery\', \'journalTrends\'];',
  'const listCollections = [\'blogPosts\', \'shopProducts\', \'heritageItems\', \'methodologySteps\', \'brideGallery\', \'journalTrends\', \'faqs\', \'homeFAQs\'];'
);

content = content.replace(
  'const defaultContent: SiteContent = {',
  `const defaultContent: SiteContent = {\n  faqs: ${JSON.stringify(faqs, null, 2)},\n  homeFAQs: ${JSON.stringify(homeFAQs, null, 2)},`
);

content = content.replace(
  'if (\'blogPosts\' in newContent) promises.push(replaceCollection("blogPosts", newContent.blogPosts as any[]));',
  'if (\'blogPosts\' in newContent) promises.push(replaceCollection("blogPosts", newContent.blogPosts as any[]));\n      if (\'faqs\' in newContent) promises.push(replaceCollection("faqs", newContent.faqs as any[]));\n      if (\'homeFAQs\' in newContent) promises.push(replaceCollection("homeFAQs", newContent.homeFAQs as any[]));'
);

content = content.replace(
  'const { \n         blogPosts, \n         journalTrends,\n        shopProducts, \n         heritageItems, \n         methodologySteps, \n         brideGallery, \n         ...globalData \n       } = { ...content, ...newContent } as any;',
  'const { \n         blogPosts, \n         journalTrends,\n        shopProducts, \n         heritageItems, \n         methodologySteps, \n         brideGallery, \n         faqs, \n         homeFAQs, \n         ...globalData \n       } = { ...content, ...newContent } as any;'
);

fs.writeFileSync('src/contexts/ContentContext.tsx', content, 'utf8');
console.log('patched ContentContext.tsx');
