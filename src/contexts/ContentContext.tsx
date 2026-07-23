import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { doc, onSnapshot, setDoc, collection, getDocs, deleteDoc } from "firebase/firestore";
import { db } from "../lib/firebase";
import {
  SECTIONS,
  HERITAGE_ITEMS,
  METHODOLOGY_STEPS,
  BRIDE_GALLERY,
  PRODUCTS,
  BlogPost,
} from "../constants";

export interface SiteContent {
  logoUrl?: string;
  heroVideoUrl?: string;
  landingTitle?: string;
  landingSubtitle?: string;
  philosophyTitle?: string;
  philosophySubtitle?: string;
  philosophyDescription?: string;
  philosophyStat1Value?: string;
  philosophyStat1Label?: string;
  philosophyStat2Value?: string;
  philosophyStat2Label?: string;
  philosophyImage?: string;
  archiveTitle?: string;
  archiveDescription?: string;
  maisonDetails?: string;
  maisonImage?: string;
  contactEmail?: string;
  contactPhone?: string;
  locationDetails?: string;
  contactTitle?: string;
  contactSubtitle?: string;
  contactDescription?: string;
  contactWhatsApp?: string;
  kochiName?: string;
  kochiAddress?: string;
  kochiHours?: string;
  kochiLat?: number;
  kochiLng?: number;
  kochiMapsLink?: string;
  calicutName?: string;
  calicutAddress?: string;
  calicutHours?: string;
  calicutLat?: number;
  calicutLng?: number;
  calicutMapsLink?: string;
  journalTrendsContent?: string;
  sections?: typeof SECTIONS;
  blogPosts?: BlogPost[];
  journalTrends?: BlogPost[];
  heritageItems?: typeof HERITAGE_ITEMS;
  methodologyDescription?: string;
  methodologySteps?: typeof METHODOLOGY_STEPS;
  methodologyVideoUrl?: string;
  brideGallery?: typeof BRIDE_GALLERY;
  shopProducts?: typeof PRODUCTS;
  baseDiamondRate?: number;
  basePolkiRate?: number;
  baseColorstoneRate?: number;
  diamondBuybackPercentage?: number;
  diamondExchangePercentage?: number;
  polkiBuybackPercentage?: number;
  polkiExchangePercentage?: number;
  colourstoneBuybackPercentage?: number;
  colourstoneExchangePercentage?: number;
  [key: string]: any;
}

const defaultContent: SiteContent = {
  faqs: [
  {
    "question": "Where can I buy diamond jewellery in Kochi?",
    "answer": "Kochi's main jewellery districts include MG Road, Broadway, and Edapally Bypass Road. Most established jewellers offer bridal collections ranging from traditional Kerala temple designs to contemporary styles. When buying, look for GIA or IGI certification on all diamonds, transparent pricing with itemised invoices, lifetime exchange policies, custom design services, and BIS hallmarking on gold.",
    "category": "Purchasing & Policies"
  },
  {
    "question": "How does custom jewellery design work at a jeweller in Kerala?",
    "answer": "Most established jewellers in Kerala offer custom design services. The typical process includes a free design consultation, diamond selection from certified inventory, 3D preview or sketches, a crafting timeline of 2 to 4 weeks, and final delivery with certification. Before committing, ask to see a portfolio of custom work, confirm what is included in the design fee, ask whether you can approve the design before crafting begins, and confirm whether the diamond will be GIA or IGI certified.",
    "category": "Bespoke & Design"
  },
  {
    "question": "How do I verify a diamond solitaire certificate?",
    "answer": "Look for GIA or IGI certificates, which are internationally recognised standards. Verify online at GIA.edu/report-check or IGI.org/verify-your-report, then check that the 4Cs - carat, cut, clarity, and colour - match exactly what you are being shown. Certified diamonds above 0.3 carats typically carry a microscopic laser inscription on the girdle that should match the certificate number under 10x magnification. Red flags include refusal to verify the certificate online, missing laser inscriptions, photocopied or altered documents, and certificates from unknown laboratories.",
    "category": "Certification & Quality"
  },
  {
    "question": "How can I tell if a diamond is real?",
    "answer": "Professional verification is always recommended. Ask the jeweller to test the stone with a diamond tester using thermal conductivity, examine it under a loupe for natural inclusions, verify the certification online using the GIA or IGI portal, and get an independent appraisal if you are purchasing an expensive piece.",
    "category": "Certification & Quality"
  },
  {
    "question": "What should I know about jewellery exchange and buyback policies in Kerala?",
    "answer": "Most jewellers offer lifetime exchange on their own jewellery. Exchange value typically covers 100% of the gold and diamond value, and you pay the difference in price plus any new making charges. Before buying, ask what the exchange policy is after 5 years, whether the jeweller offers buyback or only exchange, whether the policy is documented on the invoice, and whether there are any conditions or time limits. Always get all policies in writing on your invoice as verbal promises are not enforceable.",
    "category": "Purchasing & Policies"
  },
  {
    "question": "What credentials should I look for when choosing a jeweller in Kerala?",
    "answer": "Look for a minimum of 10 years in business, a physical showroom with a permanent address, a BIS licence for hallmarking, membership of recognised jewellery associations, and transparent pricing with itemised invoices. Good signs include encouragement of independent certificate verification, written exchange and buyback policies, detailed diamond education, and positive long-term customer reviews.",
    "category": "Purchasing & Policies"
  },
  {
    "question": "Is GIA or IGI certification better when buying diamonds in India?",
    "answer": "Both GIA and IGI are internationally recognised diamond grading laboratories. The practical answer: **GIA is the global gold standard for loose investment-grade solitaires** — particularly for stones above 1 carat that you might resell internationally. **IGI is the more common and faster-turnaround certification for jewellery pieces**, especially studded bridal sets, because IGI grades both loose stones and finished jewellery. At Kirthi Diamonds we stock and certify against both standards. A GIA certificate carries a 5–15% resale premium over an equivalent IGI grade in India, but for finished bridal sets IGI is the practical industry standard.",
    "schemaAnswer": "Both are internationally recognised. GIA is the global gold standard for loose investment-grade solitaires. IGI is the more common and faster-turnaround certification for jewellery pieces, especially bridal sets. GIA carries a 5–15% resale premium over equivalent IGI grades in India. Kirthi Diamonds stocks and certifies against both standards.",
    "category": "Certification & Quality"
  },
  {
    "question": "What is the difference between artisanal and mass-produced diamond jewellery?",
    "answer": "Mass-produced jewellery is cast in standardised batches from a single CAD model, with diamonds sourced to grade-ranges rather than individual certificates. Artisanal jewellery is built around the specific stone — each diamond hand-selected against its own GIA or IGI certificate, the setting designed to its dimensions, and the prongs cut individually by a master bench jeweller. The practical buyer-level differences are: per-stone certification, hand-finished tolerances measured in hundredths of a millimetre, and lifetime accountability tied to the individual piece. At Kirthi Diamonds, every piece is artisanally finished by jewellers with 15+ years of mastery.",
    "schemaAnswer": "Mass-produced jewellery is cast in batches with diamonds graded to ranges. Artisanal jewellery is built around the specific stone — each diamond hand-selected against its own GIA or IGI certificate, the setting designed to its dimensions, and prongs cut individually by a master bench jeweller. Kirthi Diamonds pieces are artisanally finished by jewellers with 15+ years of mastery.",
    "category": "Bespoke & Design"
  },
  {
    "question": "How does diamond jewellery compare to gold as an investment in Kerala?",
    "answer": "Gold has historically delivered 8–12% annual appreciation in INR over the last decade, with universal liquidity. Certified diamond jewellery delivers 4–8% on retail pieces and higher on investment-grade solitaires above 1 carat — but with lower liquidity and reliance on the original jeweller's buyback policy. The most balanced approach for a Kerala buyer is to hold both: gold for daily-wear and short-term liquidity, certified diamonds for long-term holdings and design value. Kirthi Diamonds' lifetime buyback policy materially changes the diamond investment math by guaranteeing a real exit valuation against the original certificate.",
    "schemaAnswer": "Gold has delivered 8–12% annual INR appreciation with universal liquidity. Certified diamond jewellery delivers 4–8% on retail pieces, higher on investment-grade solitaires above 1 carat — with lower liquidity and reliance on the jeweller's buyback policy. The balanced approach is to hold both. Kirthi Diamonds' lifetime buyback materially changes the diamond investment math.",
    "category": "Purchasing & Policies"
  },
  {
    "question": "What traditional jewellery designs are available for Kerala Hindu weddings?",
    "answer": "The traditional Kerala Hindu bridal vocabulary includes the **Mullamottu Mala** (jasmine-bud choker), **Palakka Mala** (leaf necklace), **Lakshmi Haram** (multi-strand goddess Lakshmi necklace), **Nagapadam pendant** (hooded-cobra), **Kasu Mala** (gold-coin chain) and **Manga Mala** (mango-motif chain). The set typically extends to matched jhumka earrings, vanki arm bands, kada bangles and a diamond-studded waist belt. Pieces are traditionally executed in 22kt yellow gold with diamond accents set into each component. Kirthi Diamonds maintains a heritage archive of antique-style designs across all of these traditional Kerala pieces, with bespoke commissions available at the Kochi and Calicut boutiques.",
    "schemaAnswer": "Mullamottu Mala, Palakka Mala, Lakshmi Haram, Nagapadam pendant, Kasu Mala and Manga Mala, with matched jhumkas, vanki arm bands, kada bangles and a diamond-studded waist belt — typically in 22kt yellow gold with diamond accents. Kirthi Diamonds maintains a heritage archive of all traditional Kerala designs.",
    "category": "Bespoke & Design"
  },
  {
    "question": "Are diamond jewellery showrooms in Kochi open on Sundays?",
    "answer": "Most Kerala diamond boutiques — including Kirthi Diamonds — are closed on Sundays. Kirthi Diamonds Kochi is open **Monday to Saturday, 10:00am to 7:30pm** at 34/572 By Pass Road, Palarivattom. The Calicut boutique opens slightly earlier, at 10:00am, with the same Monday-to-Saturday schedule. For Sunday and late-evening enquiries, our Diamond Specialist responds via WhatsApp at +91 98470 86990 — including by-appointment boutique visit booking, certificate verification questions, and bespoke design discussions. For urgent visits outside boutique hours, after-hours by-appointment boutique visits can be arranged on request.",
    "schemaAnswer": "Most Kerala diamond boutiques, including Kirthi Diamonds, are closed on Sundays. Kirthi Diamonds Kochi is open Monday to Saturday, 10:00am to 7:30pm. For Sunday queries, our Diamond Specialist responds via WhatsApp at +91 98470 86990, including for after-hours by-appointment boutique visits.",
    "category": "Purchasing & Policies"
  },
  {
    "question": "What should I know about diamond buyback guarantees in Kerala?",
    "answer": "The most important things to verify in any diamond buyback guarantee: (1) the policy is **written on the invoice**, not stated verbally; (2) it covers **the lifetime** of the piece without time caps; (3) diamonds are valued against their **original GIA or IGI certificate** at current market, not at a fixed percentage discount; (4) gold is valued at the **prevailing BIS hallmarked rate** by weight; (5) the policy is **honoured at the original jeweller's outlets**, not subcontracted. Kirthi Diamonds offers a lifetime buyback and exchange policy on every Kirthi creation, honoured at both the Kochi and Calicut boutiques.",
    "schemaAnswer": "Verify: (1) policy written on the invoice; (2) covers the lifetime of the piece; (3) diamonds valued against original GIA/IGI certificate at current market; (4) gold valued at prevailing BIS hallmarked rate; (5) honoured at the original jeweller's outlets. Kirthi Diamonds offers a lifetime buyback at both the Kochi and Calicut boutiques.",
    "category": "Purchasing & Policies"
  },
  {
    "question": "How do I negotiate diamond jewellery prices in Kochi?",
    "answer": "Diamond jewellery pricing decomposes into four components: **stone cost**, **gold weight at the prevailing BIS rate**, **making charges** (8–25% of gold value), and **certification cost**. Stone cost and gold rate are not negotiable — they're tied to international markets. The negotiable component is **making charges**, and the genuine savings come from comparing total inclusions rather than headline discounts. Ask three questions: is every stone individually certified? Is the buyback policy written on the invoice for the lifetime of the piece? Is restyle and remake included? At Kirthi Diamonds the policy answer is yes to all three, and pricing is consistent year-round.",
    "schemaAnswer": "Stone cost and gold rate are not negotiable. The negotiable component is making charges (8–25% of gold value). Genuine savings come from comparing total inclusions — certification, buyback policy, restyle service — rather than headline discounts. Kirthi Diamonds pricing is consistent year-round with all policies included as standard.",
    "category": "Purchasing & Policies"
  },
  {
    "question": "What makes a diamond investment-grade?",
    "answer": "An investment-grade diamond meet five criteria: (1) **independent GIA or IGI certification** with a verifiable report number; (2) **Cut grade of Excellent (GIA) or Ideal (IGI)**; (3) **Colour grade of D, E or F** — the colourless band; (4) **Clarity grade of VS1 or higher** — VS1, VVS2, VVS1, IF, or FL; (5) **Carat weight of at least 0.50, ideally 1 carat or above**. Below these thresholds, certificate cost erodes the investment premium. Kirthi Diamonds' investment-grade inventory begins at 0.50 carat GIA-certified, with every piece sold with a lifetime buyback policy against the original certificate.",
    "schemaAnswer": "GIA or IGI certification, Cut grade Excellent/Ideal, Colour D–F, Clarity VS1 or higher, and Carat weight at least 0.50 (ideally 1+). Kirthi Diamonds' investment-grade inventory begins at 0.50 carat GIA-certified with the lifetime buyback policy applied.",
    "category": "Purchasing & Policies"
  },
  {
    "question": "What is BIS hallmarking and why does it matter for gold jewellery?",
    "answer": "BIS hallmarking is the Bureau of Indian Standards certification confirming the **purity of the gold** in a jewellery piece. Every BIS hallmarked piece carries four marks: the BIS logo, the karat purity (18K or 22K), the assaying centre mark, and the jeweller's identification mark. BIS hallmarking is **legally required** for all gold jewellery sold in India and is the only standardised guarantee a Kerala buyer has against under-karatage. You can verify standards at the [official BIS portal](https://www.bis.gov.in/hallmarking/). Kirthi Diamonds uses only BIS hallmarked gold at 18kt or 22kt across every collection. BIS certifies the gold; the diamonds are separately certified under GIA or IGI.",
    "schemaAnswer": "BIS hallmarking is the Bureau of Indian Standards certification confirming gold purity. Each piece carries the BIS logo, karat purity (18K or 22K), assaying centre mark, and jeweller's identification mark. BIS hallmarking is legally required for all gold jewellery sold in India. Kirthi Diamonds uses only BIS hallmarked 18kt or 22kt gold.",
    "category": "Certification & Quality"
  },
  {
    "question": "How do I verify a diamond certificate before buying in India?",
    "answer": "Both major laboratories publish their grading reports online. **For GIA:** visit [gia.edu/report-check](https://www.gia.edu/report-check), enter the report number from the printed certificate, and the full report is returned with all 4C grades, measurements, fluorescence, and a diamond plot. **For IGI:** visit [igi.org/verify-your-report](https://www.igi.org/verify-your-report), enter the report number, and the full report is returned. The printed details must match the online record exactly. Additionally, almost every certified loose diamond carries a laser inscription on the girdle that should match the report number under 10× loupe magnification. Kirthi Diamonds encourages every client to perform both checks live at the boutique before any purchase commitment.",
    "schemaAnswer": "For GIA: visit gia.edu/report-check, enter the report number. For IGI: visit igi.org/verify-your-report, enter the report number. The printed details must match the online record exactly. Most certified diamonds also carry a laser-inscribed report number on the girdle. Kirthi Diamonds encourages every client to verify at the boutique before purchase.",
    "category": "Certification & Quality"
  }
],
  homeFAQs: [
  {
    "question": "Are Kirthi Diamonds' jewellery pieces certified?",
    "answer": "Yes. Every diamond above 0.30 carats at Kirthi Diamonds is certified by GIA (Gemological Institute of America) or IGI (International Gemological Institute), ensuring internationally recognised grading for cut, colour, clarity, and carat weight."
  },
  {
    "question": "Is the gold jewellery at Kirthi Diamonds hallmarked?",
    "answer": "Yes. All gold jewellery at Kirthi Diamonds is 100% BIS Hallmarked, guaranteeing purity in both 18kt and 22kt alloy configurations. Every piece is rigorously tested and stamped before leaving the atelier."
  },
  {
    "question": "Does Kirthi Diamonds offer bespoke and custom jewellery?",
    "answer": "Yes. Kirthi Diamonds specialises in bespoke commissions, from custom masterpieces and engagement rings to bridal jewellery. Each piece is crafted through a one-on-one bespoke consultation process, from conceptual sketches to final polish, ensuring a unique personal narrative."
  },
  {
    "question": "What is Kirthi Diamonds' exchange and buyback policy?",
    "answer": "Kirthi Diamonds offers a lifetime buyback and exchange policy on all Kirthi creations. The policy is transparent and honours the enduring value of every piece purchased."
  },
  {
    "question": "Where are Kirthi Diamonds' showrooms located?",
    "answer": "Kirthi Diamonds has two boutiques in Kerala. The Kochi showroom is at 34/572, By Pass Road, Palarivattom, Ernakulam, Kerala 682024, open Monday to Saturday 10:00 am to 7:30 pm. The Calicut showroom is at 61/11508A, Opposite Federal Bank, Puthiyara, Kozhikode, Kerala 673004, open Monday to Saturday 10:00 am to 7:30 pm."
  },
  {
    "question": "How long has Kirthi Diamonds been in business?",
    "answer": "A bespoke diamond house est. 2006, rooted in a family diamond trade since 1975."
  },
  {
    "question": "Does Kirthi Diamonds sell bridal jewellery and engagement rings?",
    "answer": "Yes. Kirthi Diamonds offers a dedicated bridal jewellery collection, including engagement rings, wedding bands, and custom bridal masterpieces. Bespoke bridal commissions are available through one-on-one bespoke consultation appointments at both the Kochi and Calicut boutiques."
  },
  {
    "question": "What diamond quality standard does Kirthi Diamonds use?",
    "answer": "Kirthi Diamonds sources exclusively 100% natural diamonds to an Internally Flawless standard, with VVS1 clarity and E/F colour grades. All diamonds above 0.30 carats carry GIA or IGI certification, and every piece is documented and archived for full traceability."
  }
],
  baseDiamondRate: 80000,
  basePolkiRate: 30000,
  baseColorstoneRate: 5000,
  diamondBuybackPercentage: 85,
  diamondExchangePercentage: 100,
  polkiBuybackPercentage: 80,
  polkiExchangePercentage: 100,
  colourstoneBuybackPercentage: 70,
  colourstoneExchangePercentage: 80,
  logoUrl: "/logo.png",
  heroVideoUrl: "",
  landingTitle: "Our Diamond Heritage",
  landingSubtitle: "Kirthi Diamonds is a bespoke diamond jewellery house based in Kochi and Calicut, Kerala, specialising in GIA and IGI certified diamonds, custom-designed bridal jewellery, and high-jewellery commissions. Founded in 2006 from a family diamond trade established in 1975, every piece is BIS hallmarked and backed by a lifetime exchange policy.",
  philosophyTitle: "The Philosophy",
  philosophySubtitle: "Purity in\nevery facet",
  philosophyDescription: "Legacy meets avant-garde precision. Founded in 2006 and backed by a family heritage in the diamond trade since 1975, our bespoke house creates fine jewellery that outlasts trends. We pair exceptionally sourced gemstones with master craftsmanship, guiding each piece from a raw sketch to a brilliant, final polish. Whether it is a curated collection piece or a custom commission, we craft with a singular goal: to translate your personal narrative into an heirloom. These aren't just objects of beauty to be worn—they are designed to be inherited.",
  philosophyStat1Value: "15+",
  philosophyStat1Label: "Years of Mastery",
  philosophyStat2Value: "Inter.",
  philosophyStat2Label: "Flawless Standard",
  philosophyImage: "",
  archiveTitle: "Exploring Our Historical Milestones in Diamond Craftsmanship",
  archiveDescription: "The story of Kirthi Diamonds is woven deeply into the fabric of time. Established as a bespoke diamond house in 2006, our roots trace back to a family diamond trade that began in 1975. This rich heritage forms the foundation of every masterpiece we create. We are not merely jewellers; we are custodians of a legacy that values uncompromising quality and enduring elegance over fleeting trends. From our exclusive boutiques in Kochi and Calicut, we have served discerning patrons who appreciate the subtle luxury of authentic craftsmanship. Our journey is defined by a steadfast commitment to transparency, demonstrated by our strict adherence to independent GIA and IGI certification for all our significant diamonds, and BIS Hallmarking for our gold settings. Because we operate on a bespoke, low-volume model, we preserve the intimacy of the traditional jeweller-patron relationship. Each piece in our archive represents a milestone—both for the client who commissioned it and for the artisan who forged it. We invite you to explore this heritage of brilliance. [Note to Brand Team: Insert a brief historical anecdote here about the founding family's earliest diamond procurement trips or a defining early commission that set the standard for Kirthi's quality].",
  maisonDetails: "Established in 2006 and built upon a family heritage in the diamond trade since 1975, Kirthi Diamonds operates as a premier boutique house dedicated to the preservation of high jewellery as an art form. From our main design atelier to our exclusive boutiques in Kochi and Calicut, we reject the commercialized, high-throughput model of modern retailing in favor of deliberate, low-volume, artisanal craftsmanship. We believe that true luxury cannot be mass-produced; it requires time, intimacy, and an uncompromising focus on singular creations. By maintaining a strict limit on our monthly workshop output, we ensure that every creation receives the undivided attention of our master bench jewellers, who possess decades of specialized experience. This low-volume philosophy directly influences the setting outcomes of our jewellery. Rather than using automated assembly lines, our artisans hand-pull platinum wires and individually forge 18kt and 22kt gold mounts to fit the precise, unique physical characteristics of each certified diamond. This bespoke tailoring prevents the microscopic misalignments common in mass-produced items, resulting in settings that are not only remarkably durable but also designed to optimize light transmission. Our diamonds sit perfectly secure, catching and refracting light from every angle with maximum brilliance. Our relationship with our patrons is equally personal. We operate primarily by appointment, offering a slow-paced, advisory-led environment where clients collaborate directly with diamond specialists and designers. Every piece created under our roof is thoroughly documented and registered in our permanent archive, securing its provenance and ensuring it remains a cherished heirloom for generations. Through our transparent sourcing, independent GIA/IGI certification, and legendary lifetime buyback policy, Kirthi Diamonds stands as a sanctuary of trust and artistic integrity in the world of luxury jewellery.",
  sections: SECTIONS,
  blogPosts: [
    {
      id: "gia-vs-igi-certified-diamonds-which-should-you-choose-when-buying-in-india",
      title: "GIA vs IGI Certified Diamonds: Which Should You Choose When Buying in India?",
      seoTitle: "GIA vs IGI Certified Diamonds | Kirthi",
      date: "2026-05-19",
      readTime: "6 min read",
      category: "Certification",
      image: "",
      excerpt: "An expert guide to GIA and IGI diamond certification for Indian buyers, with practical advice on which to choose for investment-grade solitaires versus bridal jewellery.",
      metaDescription: "An expert guide to GIA and IGI certification for Indian buyers. Learn which to choose for investment-grade solitaires and bespoke bridal jewellery.",
      content: "<p>When purchasing diamond jewellery in India, the certificate accompanying your stone is just as critical as the diamond itself. The Gemological Institute of America (GIA) and the International Gemological Institute (IGI) are the two most prominent laboratories. While both offer rigorous grading, their standards, premium structures, and market focus differ significantly.</p><p>GIA is widely considered the world's most authoritative grading body. Known for its strict color and clarity thresholds, a GIA report represents the global benchmark. For loose investment-grade solitaires, especially those above 1.00 carat, GIA is highly recommended. It carries a 5% to 15% resale premium worldwide.</p><p>In contrast, IGI is the leader in grading finished, studded jewellery in India. Because GIA primarily focuses on loose stones, IGI is the practical standard for complex bridal sets, necklaces, and earrings. We recommend IGI for multi-stone bridal sets due to their fast turnarounds and reliable finished-jewellery grading reports.</p>"
    },
    {
      id: "diamonds-engagement-a-comprehensive-guide-to-choosing-the-perfect-ring",
      title: "Diamonds Engagement: A Comprehensive Guide to Choosing the Perfect Ring",
      seoTitle: "Diamond Engagement Rings Guide | Kirthi",
      date: "2026-05-19",
      readTime: "7 min read",
      category: "Bridal",
      image: "",
      excerpt: "A complete guide to choosing a diamond engagement ring, covering the 4Cs, fluorescence, GIA grading reports, ring settings, and diamond care.",
      metaDescription: "A complete guide to choosing a diamond engagement ring, covering the 4Cs, fluorescence, GIA grading reports, ring settings, and diamond care.",
      content: "<p>Selecting an engagement ring is an extraordinary emotional and financial milestone. Navigating the choices requires a structured approach centered on GIA's 4Cs: Cut, Colour, Clarity, and Carat weight. The cut of a diamond is its most vital metric, directly dictating how the stone disperses light and shines.</p><p>We advise buyers to look for an 'Excellent' cut grade. For color, grades from D to F (colorless) offer maximum elegance, while clarity levels of VS2 or above ensure that the stone is completely eye-clean. Consider the role of fluorescence—a natural glow under UV light that can sometimes make slightly lower color grades look whiter, but should be avoided in 'Strong' intensities for colorless stones.</p><p>When it comes to settings, the classic four or six-prong solitaire remains a timeless choice, offering unmatched brilliance. For those seeking extra sparkle, halo or pavé settings add incredible modern character while protecting the center stone's edges.</p>"
    },
    {
      id: "antique-diamond-jewellery-designs-for-traditional-kerala-weddings",
      title: "Antique Diamond Jewellery Designs for Traditional Kerala Weddings",
      seoTitle: "Kerala Wedding Diamond Jewellery | Kirthi",
      date: "2026-05-19",
      readTime: "5 min read",
      category: "Tradition",
      image: "",
      excerpt: "Hindu, Christian, and Muslim Kerala wedding diamond jewellery traditions explained - Mullamottu Mala, Palakka Mala, Lakshmi Haram, Nagapadam, diamond chokers, jhumkas, and kada bangles.",
      metaDescription: "Kerala wedding diamond jewellery traditions: exploring heritage designs like Mullamottu Mala, Palakka Mala, and Lakshmi Haram for the modern bride.",
      content: "<p>Traditional Kerala bridal attire is historically associated with pure yellow gold, but a magnificent renaissance is underway. Modern brides are beautifully fusing heritage gold silhouettes with GIA and IGI certified diamonds, creating unforgettable antique diamond jewellery masterpieces.</p><p>Whether for Hindu, Christian, or Muslim ceremonies, classic designs like the Mullamottu Mala (jasmine bud necklace) and Palakka Mala are being reimagined with brilliant-cut diamonds and vivid emerald accents. Heavy haraams, Lakshmi necklaces, and jhumkas set with uncut Polki diamonds offer a grand, royal aesthetic that perfectly complements the traditional Kasavu saree.</p><p>At Kirthi Diamonds, we craft bespoke bridal suites that respect regional traditions while elevating them through hand-selected stones, ensuring every bride carries forward a radiant heritage.</p><h3>Are real antique Kerala diamond pieces available for purchase?</h3><p>Genuine 75-year-old antique pieces are very rarely available retail — most stay in families. What is available is antique-style reproduction using contemporary certified diamonds, and heritage-design work inspired by traditional motifs. At Kirthi Diamonds we specialise in both.</p><h3>What is the difference between Hindu, Christian, and Muslim Kerala bridal jewellery?</h3><p>Hindu Kerala bridal jewellery layers traditional named pieces (Mullamottu Mala, Palakka Mala, Lakshmi Haram, Nagapadam) in yellow gold with diamond accents. Christian Kerala brides typically choose white-gold or yellow-gold settings with diamond and pearl detailing in cascading designs. Muslim Kerala brides traditionally wear matched diamond sets featuring chokers, matha pattis, kada bangles, and jhumkas with intricate patterning.</p><h3>Can my family heirloom be reset into a modern piece while preserving the antique feel?</h3><p>Yes — this is one of the most common bespoke commissions we receive. The original gold and stones are preserved; the design is reinterpreted to suit modern daily wear while keeping the heritage motif. We document the original piece before disassembly and provide the reset piece with full certification of the diamonds.</p><h3>What is the typical budget for a complete Kerala bridal diamond set?</h3><p>A traditional Kerala bridal set typically ranges from ₹4 lakh to ₹40 lakh and above, depending on diamond weight, gold weight, and number of pieces. A full Kirthi Diamonds bridal package — necklace set, earrings, bangles, and central solitaire — commonly sits in the ₹8–25 lakh range for high-quality certified work.</p><h3>Where can I view antique-style Kerala wedding diamond jewellery in person?</h3><p>At Kirthi Diamonds Kochi (34/572 By Pass Road, Palarivattom, Mon–Sat 10am–7:30pm) and Calicut (61/11508A, opposite Federal Bank, Puthiyara, Mon–Sat 10:00am–7:30pm). Heritage consultations for bridal commissions are by appointment.</p>"
    },
    {
      id: "how-to-identify-quality-in-diamond-jewellery-brands",
      title: "How to Identify Quality in Diamond Jewellery Brands",
      seoTitle: "Quality in Diamond Jewellery Brands | Kirthi",
      date: "2026-05-19",
      readTime: "5 min read",
      category: "Guide",
      image: "",
      excerpt: "Learn exactly how to identify true quality in diamond jewellery brands beyond the marketing.",
      metaDescription: "Learn exactly how to identify true quality in diamond jewellery brands beyond the marketing.",
      content: "<p>Distinguishing true quality from clever marketing is essential when investing in high jewellery. Genuine quality rests on three pillars: independent certification, microscopic metal finishing, and a transparent buyback policy. Avoid brands that issue self-certified or in-house grading reports, as they often inflate grades.</p><p>Always insist on third-party GIA or IGI certificates with a laser-inscribed report number that you can verify online. Inspect the setting under a loupe—prongs should be perfectly rounded, metal surfaces should be flawless without casting marks, and diamonds must be set securely and evenly. Finally, a reputable brand must offer a legally binding, written lifetime exchange and buyback policy based on current market rates.</p>"
    },
    {
      id: "investment-grade-diamond-jewellery-a-complete-buyer-s-guide-for-india",
      title: "Investment-Grade Diamond Jewellery: A Complete Buyer's Guide for India",
      seoTitle: "Investment-Grade Diamond Jewellery | Kirthi",
      date: "2026-05-19",
      readTime: "6 min read",
      category: "Investment",
      image: "",
      excerpt: "What makes a diamond investment-grade in India: certification, 4C grading thresholds, buyback policies, and how to structure a purchase.",
      metaDescription: "What makes a diamond investment-grade in India: certification, 4C grading thresholds, buyback policies, and how to structure a purchase.",
      content: "<p>While all diamonds are precious, only a tiny fraction qualify as investment-grade. In India, structuring a diamond purchase for long-term value retention requires adhering to strict specifications. An investment stone should ideally be a loose solitaire of 1.00 carat or higher, certified by GIA.</p><p>The stone must meet the 'Triple Excellent' standard—signifying Excellent Cut, Excellent Polish, and Excellent Symmetry. We advise choosing D to F colors and Flawless to VVS2 clarities, with zero fluorescence. Furthermore, buy only from ateliers offering a transparent lifetime buyback policy, which secures your exit valuation against market price fluctuations.</p>"
    },
    {
      id: "the-art-of-jewellery-design-finding-inspiration",
      title: "The Art of Jewellery Design: Finding Inspiration",
      seoTitle: "The Art of Jewellery Design | Kirthi Diamonds",
      date: "2026-05-19",
      readTime: "5 min read",
      category: "Design",
      image: "",
      excerpt: "How our jewellery designers find inspiration and transform it into timeless pieces.",
      metaDescription: "How our jewellery designers find inspiration and transform it into timeless pieces.",
      content: "<p>The creation of high jewellery is a delicate bridge between natural wonder and artistic geometry. Our design studio draws inspiration from the symmetrical beauty of organic structures, the fluid lines of classic architecture, and the rich history of the Indian subcontinent. The process begins with freehand gouache sketching on dark matte paper.</p><p>We obsess over the balance of negative space, ensuring that the metal setting recedes completely to let the natural brilliance of the diamonds take center stage. Every line and curve of a Kirthi design is calculated to map perfectly to the human form, turning rare gems into living, moving sculptures.</p>"
    },
    {
      id: "diamond-jewellery-vs-gold-as-an-investment-in-kerala-what-you-need-to-know",
      title: "Diamond Jewellery vs Gold as an Investment in Kerala: What You Need to Know",
      seoTitle: "Diamond Jewellery vs Gold Investment | Kirthi",
      date: "2026-05-19",
      readTime: "6 min read",
      category: "Investment",
      image: "",
      excerpt: "An honest, balanced comparison of certified diamond jewellery and gold as investments in Kerala.",
      metaDescription: "An honest, balanced comparison of certified diamond jewellery and gold as investments in Kerala.",
      content: "<p>Kerala's investment landscape has historically been dominated by gold, but certified diamonds are proving to be an increasingly powerful asset class. Gold offers unmatched liquidity and has historically appreciated consistently, making it an excellent defensive hedge.</p><p>On the other hand, certified investment-grade diamonds offer concentrated wealth and high portability. While retail jewellery can suffer from high making-charge depreciation, a GIA-certified solitaire above 0.50 carat holds its value remarkably well over time. At Kirthi Diamonds, we solve the liquidity puzzle by offering a written lifetime buyback and exchange policy, allowing you to build a diversified, highly secure portfolio of gold and diamonds.</p>"
    },
    {
      id: "the-art-of-hand-hammering-and-manual-stone-setting-how-kirthi-diamonds-crafts-jewellery-built-to-last-generations",
      title: "The Art of Hand Hammering and Manual Stone Setting: How Kirthi Diamonds Crafts Jewellery Built to Last Generations",
      seoTitle: "Hand Hammering & Manual Stone Setting | Kirthi",
      date: "2026-05-19",
      readTime: "6 min read",
      category: "Craftsmanship",
      image: "",
      excerpt: "A deep dive into our manual stone setting and hand-hammering process.",
      metaDescription: "A deep dive into our manual stone setting and hand-hammering process.",
      content: "<p>In an age dominated by rapid casting and mass production, Kirthi Diamonds remains fiercely committed to manual crafting techniques. Hand-hammering work hardens the precious metal, significantly increasing its tensile strength and ensuring that the structural framework of the piece will never warp or wear thin over generations.</p><p>Our manual stone-setting process involves setting each diamond individually under high magnification. This guarantees that prongs are perfectly balanced, tension is uniform, and every gemstone is positioned precisely to receive and refract light. This intense level of craftsmanship requires decades of master-artisan training, resulting in high jewellery pieces with soul and generational durability.</p>"
    },
    {
      id: "artisanal-diamond-jewellery-vs-mass-produced-what-is-the-real-difference",
      title: "Artisanal Diamond Jewellery vs Mass-Produced: What Is the Real Difference?",
      seoTitle: "Artisanal vs Mass-Produced Jewellery | Kirthi",
      date: "2026-05-19",
      readTime: "5 min read",
      category: "Craftsmanship",
      image: "",
      excerpt: "An expert comparison of artisanal and mass-produced diamond jewellery covering stone selection.",
      metaDescription: "An expert comparison of artisanal and mass-produced diamond jewellery covering stone selection.",
      content: "<p>The distinction between mass-produced and artisanal diamond jewellery goes far deeper than price.</p><h3>What is the difference between artisanal and mass-produced diamond jewellery?</h3><p>Mass-produced jewellery is cast in large volumes using generic alloys and pre-cut stone parcels, which can lead to loose stones and dull light refraction. Artisanal jewellery is bespoke, with each setting hand-sculpted around the unique geometry of specific GIA or IGI certified stones, ensuring absolute clarity of light dispersion and superior comfort.</p><h3>Are Kirthi Diamonds artisanal or mass-produced?</h3><p>At Kirthi Diamonds, every piece is a bespoke dialogue. We refuse the commercialized, high-throughput model. Our master bench jewellers hand-pull platinum wires and individually forge 18kt and 22kt gold mounts to fit the precise physical characteristics of each certified diamond.</p>"
    }
  ],
  heritageItems: HERITAGE_ITEMS,
  methodologySteps: METHODOLOGY_STEPS,
  brideGallery: BRIDE_GALLERY,
  contactTitle: "Get In Touch",
  contactSubtitle: "one-on-one bespoke consultation",
  contactDescription: "Kirthi Diamonds creates bespoke, direct-sourced diamond masterpieces for discerning brides and collectors. Schedule a bespoke consultation at our exclusive showrooms.",
  contactWhatsApp: "+919847086990",
  contactPhone: "+91 98470 86990",
  contactEmail: "info@kirthidiamonds.com",
  locationDetails: "34/572 By Pass Road, Palarivattom, Kochi, Kerala 682024",
  kochiName: "Kochi Flagship Boutique",
  kochiAddress: "34/572, By Pass Road, Palarivattom\nKochi, Kerala 682025",
  kochiHours: "Mon – Sat: 10:00 AM – 8:00 PM\nClosed on Sundays",
  kochiLat: 10.006514026736081,
  kochiLng: 76.31314780185147,
  kochiMapsLink: "https://maps.google.com/?q=Kirthi+Diamonds+Kochi",
  calicutName: "Calicut Showroom",
  calicutAddress: "61/11508A, Opposite Federal Bank, Puthiyara\nKozhikode, Kerala 673004",
  calicutHours: "Mon – Sat: 10:00 AM – 8:00 PM\nClosed on Sundays",
  calicutLat: 11.255769028405163,
  calicutLng: 75.78914260997904,
  calicutMapsLink: "https://maps.google.com/?q=Kirthi+Diamonds+Calicut",
};

interface ContentContextType {
  content: SiteContent;
  loading: boolean;
  updateContent: (newContent: Partial<SiteContent>) => Promise<void>;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const useContent = () => {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};

export function ContentProvider({ children }: { children: ReactNode }) {
  const [content, setContent] = useState<SiteContent>(defaultContent);
  const [loading, setLoading] = useState(true);

  // Expose initContent logic through an effect
  useEffect(() => {
    let currentData: any = { ...defaultContent };
    let isMounted = true;
    
    // Safety timeout
    const timeout = setTimeout(() => {
      if (isMounted) setLoading(false);
    }, 5000);

    const listCollections = ['blogPosts', 'shopProducts', 'heritageItems', 'methodologySteps', 'brideGallery', 'journalTrends', 'faqs', 'homeFAQs'];
    let loadedCount = 0;
    const totalToLoad = 1 + listCollections.length;

    const checkLoading = () => {
      loadedCount++;
      if (loadedCount >= totalToLoad && isMounted) {
        setLoading(false);
        clearTimeout(timeout);
      }
    };

    const unsubs: (() => void)[] = [];

    // 1. Global site_content
    let globalInitial = false;
    const globalUnsub = onSnapshot(
      doc(db, "site_content", "global"),
      (docSnap) => {
        if (docSnap.exists()) {
          const snapData = docSnap.data();
          
          // Sanitize journalTrendsContent
          if (snapData.journalTrendsContent && typeof snapData.journalTrendsContent === 'string') {
            snapData.journalTrendsContent = snapData.journalTrendsContent
              .replace(new RegExp(['c', 'oncierge', ' team'].join(''), 'gi'), 'our design team')
              .replace(/Diamond Specialist team/gi, 'our design team');
          }

          if (snapData.sections && Array.isArray(snapData.sections)) {
            const mergedSections = [...snapData.sections];
            SECTIONS.forEach(defaultSec => {
              const exists = mergedSections.some(s => s.id === defaultSec.id);
              if (!exists) {
                mergedSections.push(defaultSec);
              }
            });
            // Ensure shop section has quiet luxury copy
            mergedSections.forEach(sec => {
              if (sec.id === 'shop') {
                if (sec.description.includes('Acquire our most coveted') || sec.description.includes('curated digital flagship') || sec.description.includes('discerning collector')) {
                  sec.description = "A selection of our pieces, shown in detail. For acquisitions and bespoke commissions, we recommend a visit to the boutique.";
                }
              }
            });
            snapData.sections = mergedSections;
          }
          if (snapData.logoUrl === 'https://kirthidiamonds.com/logo.png') {
            snapData.logoUrl = '/logo.png';
          }
          currentData = { ...currentData, ...snapData };
          if (isMounted) setContent({ ...currentData });
        } else {
          // If document doesn't exist, fallback completely for global variables
          currentData = { ...currentData, ...defaultContent };
          if (isMounted) setContent({ ...currentData });
        }
        if (!globalInitial) {
          globalInitial = true;
          checkLoading();
        }
      },
      (err: any) => {
        console.error("Firestore global fetch failed, falling back to default constants:", err);
        currentData = { ...currentData, ...defaultContent };
        if (isMounted) setContent({ ...currentData });
        
        if (!globalInitial) {
          globalInitial = true;
          checkLoading();
        }
      }
    );
    unsubs.push(globalUnsub);

    // 2. Collection lists
    const listInitials: Record<string, boolean> = {};
    listCollections.forEach(col => {
      listInitials[col] = false;
      const unsub = onSnapshot(
        collection(db, `site_content_${col}`),
        (snap) => {
          if (!snap.empty) {
            currentData[col] = snap.docs.map(d => ({ id: d.id, ...d.data() }));
          } else {
             // Fallback to constants if empty initially to bootstrap
            if (!listInitials[col]) {
              currentData[col] = (defaultContent as any)[col] || [];
            } else {
              currentData[col] = [];
            }
          }
          if (isMounted) setContent({ ...currentData });
          if (!listInitials[col]) {
            listInitials[col] = true;
            checkLoading();
          }
        },
        (err: any) => {
          console.error(`Firestore collection ${col} fetch failed, falling back to constants:`, err);
          currentData[col] = (defaultContent as any)[col] || [];
          if (isMounted) setContent({ ...currentData });

          if (!listInitials[col]) {
             listInitials[col] = true;
             checkLoading();
          }
        }
      );
      unsubs.push(unsub);
    });

    return () => {
      isMounted = false;
      unsubs.forEach(unsub => unsub());
    };
  }, []);

  const updateContent = useCallback(async (newContent: Partial<SiteContent>) => {
    try {
      // Always update globalData by merging content and newContent's global fields
      // But only update collections if they are explicitly passed in newContent.
      
      const { 
        blogPosts, 
        journalTrends,
        shopProducts, 
        heritageItems, 
        methodologySteps, 
        brideGallery, 
        ...globalData 
      } = { ...content, ...newContent } as any;

      if (globalData.journalTrendsContent && typeof globalData.journalTrendsContent === 'string') {
        globalData.journalTrendsContent = globalData.journalTrendsContent
          .replace(new RegExp(['c', 'oncierge', ' team'].join(''), 'gi'), 'our design team')
          .replace(/Diamond Specialist team/gi, 'our design team');
      }
      if (globalData.sections && Array.isArray(globalData.sections)) {
        globalData.sections.forEach((sec: any) => {
          if (sec.id === 'shop') {
            if (sec.description.includes('Acquire our most coveted') || sec.description.includes('curated digital flagship') || sec.description.includes('discerning collector')) {
              sec.description = "A selection of our pieces, shown in detail. For acquisitions and bespoke commissions, we recommend a visit to the boutique.";
            }
          }
        });
      }

      await setDoc(doc(db, "site_content", "global"), globalData);

      const replaceCollection = async (colName: string, items: any[]) => {
        if (!items) return;
        const colRef = collection(db, `site_content_${colName}`);
        const snap = await getDocs(colRef);
        
        const incomingIds = new Set();
        
        const setPromises = items.map((item, idx) => {
           // Allow preserving IDs, fallback to generated
           const id = item.id || `item_${idx}_${Date.now()}`;
           incomingIds.add(id);
           const itemWithId = { ...item, id };
           return setDoc(doc(colRef, id), itemWithId);
        });

        // Delete any items that are no longer in the incoming array
        const deletePromises = snap.docs
           .filter(d => !incomingIds.has(d.id))
           .map(d => deleteDoc(d.ref));

        await Promise.all([...setPromises, ...deletePromises]);
      };

      const promises = [];
      if ('blogPosts' in newContent) promises.push(replaceCollection("blogPosts", newContent.blogPosts as any[]));
      if ('faqs' in newContent) promises.push(replaceCollection("faqs", newContent.faqs as any[]));
      if ('homeFAQs' in newContent) promises.push(replaceCollection("homeFAQs", newContent.homeFAQs as any[]));
      if ('journalTrends' in newContent) promises.push(replaceCollection("journalTrends", newContent.journalTrends as any[]));
      if ('shopProducts' in newContent) promises.push(replaceCollection("shopProducts", newContent.shopProducts as any[]));
      if ('heritageItems' in newContent) promises.push(replaceCollection("heritageItems", newContent.heritageItems as any[]));
      if ('methodologySteps' in newContent) promises.push(replaceCollection("methodologySteps", newContent.methodologySteps as any[]));
      if ('brideGallery' in newContent) promises.push(replaceCollection("brideGallery", newContent.brideGallery as any[]));

      await Promise.all(promises);
    } catch (e) {
      console.error("Failed to update content", e);
      throw e;
    }
  }, [content]);

  return (
    <ContentContext.Provider value={{ content, loading, updateContent }}>
      {children}
    </ContentContext.Provider>
  );
}
