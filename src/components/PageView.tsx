import { marked } from 'marked';
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ChevronLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import ExchangeCalculator from "./ExchangeCalculator";
import BreadcrumbNavigation from "./BreadcrumbNavigation";
import { SharedFooter } from "./SharedFooter";

const pagesContent = {
  "diamond-jewellery": `
# Diamond Jewellery in Kochi — Kirthi Diamonds Palarivattom Boutique

**Kirthi Diamonds is a bespoke diamond house est. 2006, rooted in a family diamond trade since 1975, based at 34/572 By Pass Road, Palarivattom.** Every loose diamond we sell above 0.30 carats is GIA or IGI certified, every gram of gold is BIS hallmarked at 18kt or 22kt purity, and every Kirthi creation carries our lifetime buyback and exchange policy. We are open Monday to Saturday, 10:00am to 7:30pm.

## Why Kirthi is one of the best diamond jewellers in Kochi

Kochi has no shortage of jewellers — but a boutique house is structurally different from a chain store. At Kirthi we keep three things constant that the volume retailers cannot:

- **Individually certified diamonds.** Every stone is graded against its own GIA or IGI certificate. There is no "graded to a range" — the report you receive describes the exact diamond you are buying.
- **Master artisanal craftsmanship.** Every piece is finished by a bench jeweller with 15+ years of mastery, under loupe magnification, in our workshop. Setting templates are not used; each prong is cut to the individual stone.
- **A lifetime relationship, not a transaction.** Our buyback and exchange policy runs for the lifetime of the piece. Pieces bought in 2008 are still serviced and re-valued today by the same workshop.

## What you will find in our Kochi boutique

The Palarivattom boutique carries our full range:

- **Bridal collections** — antique-style and contemporary Kerala bridal sets for Hindu, Christian and Muslim weddings. Mullamottu Mala, Palakka Mala, Lakshmi Haram, Nagapadam, diamond chokers, jhumkas and matched bridal sets.
- **Engagement rings and solitaires** — GIA-certified investment-grade solitaires from 0.50 carat upwards, plus the full range of contemporary settings.
- **Wedding bands** — diamond eternity bands and matched his-and-hers pairs in 18kt and platinum.
- **Daily-wear and gifting pieces** — diamond pendants, studs, slim chains, slider necklaces.
- **Custom and bespoke commissions** — heritage-design reproductions, family-heirloom restyling, and entirely new commissions designed in conversation with you.

## The Kochi private boutique experience

Walking into a Kirthi appointment is not the same as walking onto a high-street showroom floor. We work by **by-appointment boutique visit** for bridal consultations and bespoke commissions, with a dedicated viewing room, refreshments, and your own Diamond Specialist for the visit. Walk-in browsing is welcome at any time during boutique hours; longer consultations are best booked ahead.

## Visit the Kochi boutique

**Address:** 34/572 By Pass Road, Palarivattom, Kochi, Kerala 682024  
**Hours:** Monday – Saturday, 10:00am – 7:30pm  
**Phone:** +91 98470 86990  
**WhatsApp:** +91 98470 86990  
**Instagram / Facebook / Twitter:** @kirthidiamonds

To book a private bridal consultation, a bespoke commission appointment, or simply to view our investment-grade solitaire inventory, call us or message via WhatsApp.

## Key facts (for structured data)

- **Founded:** A bespoke diamond house est. 2006, rooted in a family diamond trade since 1975
- **Boutique location:** Palarivattom, Kochi
- **Certifications:** GIA, IGI, BIS
- **Buyback policy:** Lifetime on all Kirthi creations
- **Diamond standard:** VVS1+ clarity, E/F colour, Internally Flawless standard with exclusively 100% natural diamonds
- **Gold standard:** BIS hallmarked 18kt and 22kt
- **Price range:** ₹40,000 — ₹40,00,000+

## Call to action

**Visit the Kochi boutique** at Palarivattom or call **+91 98470 86990** to book a by-appointment boutique visit. For bespoke commissions, allow 6–10 weeks for full bridal sets and 3–4 weeks for solitaires and engagement rings.
  `,
  "certified-diamonds": `
# GIA & IGI Certified Diamonds in Kerala — Authenticity, Ethics, and How to Verify

**Kirthi Diamonds sells only certified diamonds. Every loose stone above 0.30 carats carries an independent grading report from GIA (Gemological Institute of America) or IGI (International Gemological Institute), and every diamond in our inventory is sourced through Kimberley Process compliant channels.** This page sets out exactly what those certifications mean, how you can verify any certificate yourself before purchase, and how we approach ethical sourcing.

## What "certified" means at Kirthi Diamonds

A certified diamond is one that has been graded by an independent laboratory against the international 4C standard — Cut, Colour, Clarity, Carat — and issued a tamper-evident report with a unique number traceable online.

We work with **GIA** and **IGI** because they are the two most globally recognised diamond grading laboratories. Both publish their grading reports online, both inscribe a microscopic report number on the diamond's girdle for permanent identification, and both maintain laboratories in India (Mumbai and Surat) for fast turnaround.

For Kerala buyers, the practical effect is that you receive, with every Kirthi piece:

- The original GIA or IGI grading report for the central stone (or each significant stone).
- The unique report number, which you can verify yourself at gia.edu or igi.org.
- The BIS hallmark on every gold component.
- A written invoice that names every certified stone in the piece.

## How to verify a diamond certificate yourself

Do not take any retailer's word for the certificate — verify it. The process takes 30 seconds:

- **For a GIA certificate**, open \`gia.edu/report-check\`, enter the report number from the certificate, and the full report is returned.
- **For an IGI certificate**, open \`igi.org/verify-your-report\`, enter the report number, and the full report is returned.

If the report number does not match what you see in the printed certificate, do not buy the piece. At Kirthi we encourage every client to perform this verification in front of the Diamond Specialist, on their own phone, before any commitment to purchase.

## Ethical sourcing — what we actually do

Beyond certification of individual stones, ethical sourcing covers the supply chain itself. Our approach:

1. **Kimberley Process compliance** on every parcel of rough or polished diamond that enters our inventory. The Kimberley Process is the United Nations-backed system that prevents conflict diamonds from entering the global supply chain.
2. **Named-cutting-centre sourcing** — we work with established cutting centres in Surat, Mumbai, and Antwerp, all of which maintain auditable chain-of-custody records.
3. **No grey-market rough.** We do not purchase from unsourced rough channels regardless of price advantage.
4. **Traceable invoicing** — our supplier invoices identify the cutting centre and parcel reference for every loose stone, retained as part of our internal provenance file.

For larger investment-grade single stones, we provide chain-of-custody documentation alongside the GIA or IGI certificate on request.

## Diamond authenticity in Kerala — what to check

Beyond paper certification, three physical checks confirm a diamond's authenticity at the boutique:

1. **The laser inscription on the girdle.** Almost every certified loose diamond has its report number etched onto the girdle. Under 10× loupe magnification, the number should be legible and match the certificate.
2. **The diamond tester.** An electronic diamond tester reads the stone's thermal conductivity and confirms it is diamond rather than a simulant (cubic zirconia, moissanite, etc.). We are happy to test any stone in your existing collection at the boutique without obligation.
3. **The certificate verification.** Already covered above — verify the report number on the GIA or IGI website at the boutique.

## What about BIS hallmarking?

BIS (Bureau of Indian Standards) hallmarking is the parallel certification for the **gold** in your jewellery. Where GIA and IGI certify diamonds, BIS certifies gold purity. Every Kirthi gold component carries the BIS hallmark, the karat purity mark (18K or 22K), the assaying centre mark, and our jeweller's identification mark.

## Visit either boutique to inspect certified inventory

**Kochi:** 34/572 By Pass Road, Palarivattom, Kochi, Kerala 682024 · Mon–Sat 10:00–19:30 · +91 98470 86990  
**Calicut:** 61/11508A, opposite Federal Bank, Puthiyara, Kozhikode, Kerala 673004 · Mon–Sat 10:00–19:30 · +91 98470 86002

## Key facts (for structured data)

- Certifications: GIA, IGI for diamonds; BIS for gold
- Lab verification URLs: gia.edu/report-check, igi.org/verify-your-report
- Diamond standard: VVS1 clarity or higher, E/F colour, Excellent/Ideal cut
- Sourcing: Kimberley Process compliant; Antwerp / Mumbai / Surat cutting centres
- Boutiques: Kochi (Palarivattom), Calicut (Puthiyara)
  `,
  "exchange-policy": `
# Kirthi Diamonds Lifetime Buyback and Exchange Policy

**Every Kirthi Diamonds creation — every solitaire, every bridal set, every commissioned piece — is sold with a lifetime buyback and exchange policy. The policy is written on the invoice at the time of purchase, runs for the life of the piece regardless of how many years have passed, and is honoured at both our Kochi and Calicut boutiques.** This page sets out exactly how the policy works, what it covers, and how to use it.

## How the lifetime buyback works

When you bring a Kirthi Diamonds piece back to either boutique, we re-value it on two components separately:

1. **The diamonds**, valued against their original GIA or IGI certificate and the prevailing market for the specific 4C grades. Investment-grade certified solitaires typically hold strong value over decades; bridal-set diamonds are valued in aggregate against their certification. and for smaller stone against prevailing diamond prices 
2. **The Polki**, 80% for exchange and 70% for buyback of prevaling rates of polki.
3. **The gold**, valued at the prevailing BIS hallmarked gold rate on the day of buyback, by weight.
4. **The Colourstones** Natural stones at 70% of prevailing rates.

The buyback offer is made on the spot with a written valuation. You may accept the offer in cash (subject to standard banking limits and KYC), credit toward another Kirthi piece, or decline and keep the original — there is no obligation.

## How the exchange and upgrade option works

The exchange and upgrade option allows you to trade a Kirthi piece against any other Kirthi piece of equal or greater value, at any time during the original piece's life. The most common use cases:

- **Upgrading a starter solitaire** to a larger investment-grade stone when budget allows.
- **Restyling a bridal set** into separate everyday pieces once the bride moves into daily wear.
- **Trading one generation's design for the next** when a family heirloom passes to a daughter or daughter-in-law and the style preference shifts.
- **Combining two smaller pieces** into a single statement piece.

The exchange credit is the full buyback valuation of the original piece, applied directly against the new piece. No making-charge or design-cost is double-paid; only the difference in net value is charged.

## What the policy specifically covers

| Covered | Notes |
|---|---|
| Original gold weight | Valued at prevailing BIS rate |
| Certified diamond stones | Against original certificate |
| Standard wear-and-tear | Polish and re-prong included free |
| Restyling and remaking | Original materials retained, labour only |
| Resizing for life | Free, on any Kirthi piece |
| Lifetime cleaning | Complimentary at either boutique |

## What is excluded

- Damage from improper repair by a third party.
- Loss of the original GIA or IGI certificate (a duplicate can usually be obtained from the laboratory; we assist in this process where possible).
- Diamonds not originally certified at point of sale (which would never have left our boutique).

## Why we offer a lifetime policy

Two reasons. The first is straightforward — we are confident in what we make. Every piece is built to last a generation, and the diamonds we sell are certified to international standards, so a lifetime valuation framework is a natural extension of our craft.

The second is structural. A lifetime buyback policy changes the economics of buying diamond jewellery. **It transforms a one-way retail transaction into a structured long-term holding,** because the buyer knows they have an exit valuation tied to a real, traceable certificate. This is the single biggest factor that differentiates boutique jewellers like Kirthi from chain retailers whose buyback policies are typically capped or limited in time.

## Using the policy — process

1. **Bring the piece**, the original invoice, and the GIA or IGI certificate(s) to either boutique.
2. **The Diamond Specialist inspects the piece** and verifies the certificate against the diamond.
3. **Written valuation** is provided on the spot — typically within 30 minutes for solitaires, longer for full bridal sets.
4. **You decide** — accept the cash offer, apply the credit to a new piece, or keep the original.

There is no minimum holding period. A piece purchased today can be brought back tomorrow for buyback at fair valuation.

## Visit either boutique to exercise the policy

**Kochi:** 34/572 By Pass Road, Palarivattom · Mon–Sat 10:00–19:30 · +91 98470 86990  
**Calicut:** 61/11508A, opposite Federal Bank, Puthiyara · Mon–Sat 10:00–19:30 · +91 98470 86002

## Key facts (for structured data)

- Policy duration: **Lifetime**
- Policy basis: GIA / IGI certificate + BIS gold weight
- Applies to: Every Kirthi creation, all collections
- Exchange credit: Full buyback valuation applied to new piece
- Required documentation: Original invoice + certificate(s)
- Honoured at: Both Kochi and Calicut boutiques
  `,
  "policies": `
# Policies & Ethics — Kirthi Diamonds

**At Kirthi Diamonds, transparency, privacy, and absolute integrity form the foundation of our Maison.** This page outlines our comprehensive policies regarding returns, exchanges, ethical sourcing, and client confidentiality.

## Returns & Exchanges

Because the majority of our pieces are bespoke commissions or sized to order, **returns for a refund are not accepted**. However, we offer a comprehensive **Lifetime Exchange & Buyback Policy**:
- Pieces can be exchanged for 100% of the prevailing gold and diamond value (minus making charges/taxes).
- Pieces can be liquidated (buyback) at the prevailing gold and diamond value minus a standard 10% deduction (and making charges/taxes).
- The original invoice and GIA/IGI certificates must be presented intact.
- The piece must remain in its original condition, without third-party modifications.

## Ethical Sourcing & The Kimberley Process

Our stones are exclusively sourced from conflict-free regions compliant with the **Kimberley Process**, ensuring traceability from mine to Maison. 
- We do not purchase rough diamonds from unsourced or grey-market channels.
- We work closely with established cutting centres in Surat, Mumbai, and Antwerp, maintaining auditable chain-of-custody records.
- We pledge rigorous standards toward ecological stewardship and human rights.

## Client Privacy & Confidentiality

We maintain absolute confidentiality for our private clientele. 
- Private consultation details, bespoke commission records, and purchase histories are kept strictly confidential.
- We will never share or sell a client's information to third parties.
- High-profile commissions and heirloom restyling projects are conducted securely, with NDAs available upon request.

## Care & Maintenance

High jewellery requires meticulous attention. We recommend annual inspections by our master jewellers at our Kochi or Calicut boutiques at no charge. When not worn, pieces should be stored individually in their original presentation boxes to prevent friction. Avoid exposure to harsh chemicals, extreme temperatures, and abrasive surfaces.

For any questions regarding our policies, please contact our Diamond Specialist at **+91 98470 86990**.
  `,
  "contact": `
# Contact The Maison — Kirthi Diamonds

**Kirthi Diamonds creates bespoke, direct-sourced diamond masterpieces for discerning brides and collectors.** To maintain our standards of absolute exclusivity, a dedicated Maison Diamond Specialist handles all inquiries personally.

## Kochi Boutique
**Address:** 34/572, By Pass Road, Palarivattom, Kerala 682024  
**Phone:** +91 98470 86990  
**WhatsApp:** +91 98470 86990  
**Hours:** Monday to Saturday, 10:00 AM – 8:00 PM (Closed on Sundays)  

## Calicut Boutique
**Address:** 61/11508A, Opposite Federal Bank, Puthiyara, Kerala 673004  
**Phone:** +91 98470 86002  
**WhatsApp:** +91 98470 86002  
**Hours:** Monday to Saturday, 10:00 AM – 8:00 PM (Closed on Sundays)  

## Direct Inquiries
- **Email:** info@kirthidiamonds.com
- **Instagram:** @kirthidiamonds
- **Facebook:** @kirthidiamonds

You can walk in during boutique hours, or schedule a highly requested private consultation for bridal collections and bespoke high jewellery.
  `
};

const PAGE_SCHEMAS: Record<string, any[]> = {
  "policies": [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": "https://kirthidiamonds.com/pages/policies",
      "url": "https://kirthidiamonds.com/pages/policies",
      "name": "Policies & Ethics — Kirthi Diamonds",
      "description": "Comprehensive policies regarding returns, lifetime exchange, ethical sourcing, and client confidentiality at Kirthi Diamonds.",
      "isPartOf": { "@type": "WebSite", "url": "https://kirthidiamonds.com" }
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://kirthidiamonds.com" },
        { "@type": "ListItem", "position": 2, "name": "Policies & Ethics", "item": "https://kirthidiamonds.com/pages/policies" }
      ]
    }
  ],
  "contact": [
    {
      "@context": "https://schema.org",
      "@type": "ContactPage",
      "@id": "https://kirthidiamonds.com/contact#page",
      "url": "https://kirthidiamonds.com/contact",
      "name": "Contact Kirthi Diamonds",
      "description": "Kirthi Diamonds creates bespoke, direct-sourced diamond masterpieces for discerning brides and collectors, avoiding retail markups through our bespoke consultation experience. Get in touch to schedule a bespoke consultation at our Kochi showroom at 34/572, By Pass Road, Palarivattom or Calicut showroom at 61/11508A, Opposite Federal Bank, Puthiyara.",
      "mainEntity": [
        { "@id": "https://kirthidiamonds.com/#kochi" },
        { "@id": "https://kirthidiamonds.com/#calicut" }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://kirthidiamonds.com" },
        { "@type": "ListItem", "position": 2, "name": "Contact The Maison", "item": "https://kirthidiamonds.com/contact" }
      ]
    }
  ],
  "diamond-jewellery": [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": "https://kirthidiamonds.com/pages/diamond-jewellery",
      "url": "https://kirthidiamonds.com/pages/diamond-jewellery",
      "name": "Diamond Jewellery in Kochi & Calicut — Kirthi Diamonds",
      "description": "Boutique luxury diamond jewellers in Kochi and Calicut with GIA and IGI certified diamonds, BIS hallmarked gold, lifetime buyback.",
      "isPartOf": { "@type": "WebSite", "url": "https://kirthidiamonds.com" },
      "about": { "@id": "https://kirthidiamonds.com/#organization" }
    },
    {
      "@context": "https://schema.org",
      "@type": "JewelryStore",
      "@id": "https://kirthidiamonds.com/#kochi",
      "name": "Kirthi Diamonds Kochi",
      "image": "https://kirthidiamonds.com/og-cover.jpg",
      "url": "https://kirthidiamonds.com/pages/diamond-jewellery",
      "telephone": "+919847086990",
      "priceRange": "$$$$",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "34/572, By Pass Road, Palarivattom",
        "addressLocality": "Kochi",
        "addressRegion": "Kerala",
        "postalCode": "682024",
        "addressCountry": "IN"
      },
      "openingHoursSpecification": [{
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],
        "opens": "10:00",
        "closes": "19:30"
      }],
      "parentOrganization": { "@id": "https://kirthidiamonds.com/#organization" }
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://kirthidiamonds.com" },
        { "@type": "ListItem", "position": 2, "name": "Diamond Jewellery in Kochi & Calicut", "item": "https://kirthidiamonds.com/pages/diamond-jewellery" }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        { "@type": "Question", "name": "Where is Kirthi Diamonds in Kochi?", "acceptedAnswer": { "@type": "Answer", "text": "34/572 By Pass Road, Palarivattom, Kochi, Kerala 682024. Open Monday to Saturday, 10:00am to 7:30pm. Phone +91 98470 86990." } },
        { "@type": "Question", "name": "Are Kirthi Diamonds pieces in Kochi certified?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Every loose diamond above 0.30 carats is GIA or IGI certified, and every gold component is BIS hallmarked at 18kt or 22kt purity." } },
        { "@type": "Question", "name": "Does the Kochi boutique offer a buyback policy?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Every Kirthi creation includes a lifetime buyback and exchange policy written on the invoice." } }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "Product",
      "name": "Bespoke Diamond Jewellery",
      "image": "https://kirthidiamonds.com/og-cover.jpg",
      "description": "GIA and IGI certified bespoke diamond jewellery, including engagement rings, bridal sets, necklaces, and earrings crafted in 18kt gold and platinum.",
      "sku": "KD-BESPOKE-JW",
      "mpn": "KD-BESPOKE-JW",
      "brand": {
        "@type": "Brand",
        "name": "Kirthi Diamonds"
      },
      "material": "Diamond, 18kt Gold, Platinum",
      "offers": {
        "@type": "Offer",
        "url": "https://kirthidiamonds.com/pages/diamond-jewellery",
        "priceCurrency": "INR",
        "price": 50000,
        "priceValidUntil": "2027-12-31",
        "itemCondition": "https://schema.org/NewCondition",
        "availability": "https://schema.org/InStock"
      },
      
    }
  ],
  "certified-diamonds": [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": "https://kirthidiamonds.com/gia-igi-certified-diamonds-kerala",
      "url": "https://kirthidiamonds.com/gia-igi-certified-diamonds-kerala",
      "name": "GIA & IGI Certified Diamonds in Kerala — Kirthi Diamonds",
      "description": "Every diamond above 0.30 carats at Kirthi Diamonds is GIA or IGI certified. Learn how to verify the certificate, what ethical sourcing means in our supply chain, and how BIS hallmarking covers your gold.",
      "isPartOf": { "@type": "WebSite", "url": "https://kirthidiamonds.com" },
      "about": { "@id": "https://kirthidiamonds.com/#organization" }
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://kirthidiamonds.com" },
        { "@type": "ListItem", "position": 2, "name": "GIA & IGI Certified Diamonds Kerala", "item": "https://kirthidiamonds.com/gia-igi-certified-diamonds-kerala" }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        { "@type": "Question", "name": "How do I verify a GIA or IGI diamond certificate?", "acceptedAnswer": { "@type": "Answer", "text": "Visit gia.edu/report-check for GIA or igi.org/verify-your-report for IGI. Enter the report number from the certificate; the full report is returned. Kirthi Diamonds encourages every client to perform this verification at the boutique before purchase." } },
        { "@type": "Question", "name": "What does ethical diamond sourcing mean at Kirthi Diamonds?", "acceptedAnswer": { "@type": "Answer", "text": "Kimberley Process compliance on every parcel, named-cutting-centre sourcing from Surat / Mumbai / Antwerp, no grey-market rough, and traceable invoicing retained in our provenance file." } },
        { "@type": "Question", "name": "Are all Kirthi Diamonds stones certified?", "acceptedAnswer": { "@type": "Answer", "text": "Every loose diamond above 0.30 carats is GIA or IGI certified. Smaller accent diamonds are certified at the piece level under IGI Jewellery Identification Reports for studded items." } },
        { "@type": "Question", "name": "Does the Kerala BIS hallmark certify the diamond or the gold?", "acceptedAnswer": { "@type": "Answer", "text": "BIS hallmarking certifies the gold's purity only (18kt or 22kt). Diamonds are certified separately under GIA or IGI." } }
      ]
    }
  ],
  "exchange-policy": [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      "@id": "https://kirthidiamonds.com/diamond-exchange-buyback-policy",
      "url": "https://kirthidiamonds.com/diamond-exchange-buyback-policy",
      "name": "Lifetime Diamond Buyback and Exchange Policy — Kirthi Diamonds",
      "description": "Kirthi Diamonds lifetime buyback and exchange policy explained in full — how the valuation works, what's covered, how to use it. Honoured at the Kochi and Calicut boutiques.",
      "isPartOf": { "@type": "WebSite", "url": "https://kirthidiamonds.com" },
      "about": { "@id": "https://kirthidiamonds.com/#organization" }
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://kirthidiamonds.com" },
        { "@type": "ListItem", "position": 2, "name": "Buyback & Exchange Policy", "item": "https://kirthidiamonds.com/diamond-exchange-buyback-policy" }
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        { "@type": "Question", "name": "Does Kirthi Diamonds offer a buyback guarantee?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. Every Kirthi Diamonds creation is sold with a lifetime buyback and exchange policy written on the invoice and honoured at both the Kochi and Calicut boutiques." } },
        { "@type": "Question", "name": "How is the buyback value calculated?", "acceptedAnswer": { "@type": "Answer", "text": "Diamonds are valued against their original GIA or IGI certificate and current market; gold is valued at the prevailing BIS hallmarked rate on the day, by weight." } },
        { "@type": "Question", "name": "Can I upgrade my Kirthi piece for a larger one?", "acceptedAnswer": { "@type": "Answer", "text": "Yes. The full buyback valuation of the original piece is applied as exchange credit toward the new piece. Only the net difference in value is charged." } },
        { "@type": "Question", "name": "Is the buyback policy time-limited?", "acceptedAnswer": { "@type": "Answer", "text": "No. The policy is for the lifetime of the piece, with no minimum or maximum holding period." } },
        { "@type": "Question", "name": "What if I lose the GIA or IGI certificate?", "acceptedAnswer": { "@type": "Answer", "text": "A duplicate is usually obtainable from the laboratory; Kirthi Diamonds assists in the duplicate process. The diamond is identifiable by its laser-inscribed report number on the girdle." } }
      ]
    }
  ]
};

export default function PageView() {
  const onGoHome = () => {
    window.location.href = "/";
  };
  const [slug, setSlug] = useState<string>(() => {
    const pathPart = window.location.pathname.replace("/pages/", "");
    if (Object.keys(pagesContent).includes(pathPart)) {
      return pathPart;
    }
    return "diamond-jewellery";
  });

  useEffect(() => {
    // Determine title and description based on slug
    let pTitle = "Kirthi Diamond Jewellery";
    let pDesc = "A bespoke diamond house est. 2006, rooted in a family diamond trade since 1975. VVS1 clarity, E/F colour, 18kt gold.";
    
    if (slug === 'diamond-jewellery') {
      pTitle = "Diamond Jewellery in Kochi | Kirthi Diamonds";
      pDesc = "Discover bespoke diamond jewellery in Kochi at Kirthi Diamonds. GIA & IGI certified, 18kt/22kt gold, lifetime buyback.";
    } else if (slug === 'certified-diamonds') {
      pTitle = "Certified Diamonds in Kerala | Kirthi Diamonds";
      pDesc = "GIA and IGI certified investment-grade solitaires and diamond jewellery in Kerala. Learn how to verify certificates.";
    } else if (slug === 'exchange-policy') {
      pTitle = "Lifetime Buyback & Exchange Policy | Kirthi Diamonds";
      pDesc = "Learn about our transparent, lifetime buyback and exchange policy for diamond jewellery and gold in Kerala.";
    } else if (slug === 'policies') {
      pTitle = "Policies & Ethics | Kirthi Diamonds";
      pDesc = "Read Kirthi Diamonds' policies on returns, ethical conflict-free sourcing, privacy, and our lifetime exchange promise.";
    } else if (slug === 'contact') {
      pTitle = "Contact The Maison | Kirthi Diamonds Kochi & Calicut";
      pDesc = "Get in touch to schedule a bespoke consultation at Kirthi Diamonds' Kochi or Calicut boutiques.";
    }

    

    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) metaDescription.setAttribute("content", pDesc);
    const ogDescription = document.querySelector('meta[property="og:description"]');
    if (ogDescription) ogDescription.setAttribute("content", pDesc);
    const twitterDescription = document.querySelector('meta[name="twitter:description"]');
    if (twitterDescription) twitterDescription.setAttribute("content", pDesc);

    // Canonical link
    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.setAttribute('rel', 'canonical');
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.setAttribute('href', `https://kirthidiamonds.com/pages/${slug}`);
  }, [slug]);

  const content = (pagesContent as any)[slug] || "";
  const structuredData = PAGE_SCHEMAS[slug];

  return (
    <div className="relative w-full h-[100dvh] overflow-y-auto custom-scrollbar bg-[#050505] text-[#F5F5F0] font-sans selection:bg-[#D4AF37] selection:text-black">
      {/* Schema Markup */}
      {structuredData && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      )}

      {/* Header */}
      <header className="fixed top-0 w-full flex justify-between items-center px-4 sm:px-6 md:px-12 py-4 sm:py-6 md:py-8 z-[70] bg-[#050505]/90 backdrop-blur-md border-b border-white/5">
        <a
          href="/"
          className="flex items-center space-x-4 md:space-x-6 cursor-pointer group"
          onClick={(e) => {
            e.preventDefault();
            window.history.pushState(null, "", "/");
            onGoHome();
          }}
        >
          <span className="text-xl group-hover:-translate-x-2 transition-transform duration-300">
            <ChevronLeft size={20} className="font-light" />
          </span>
          <span className="text-xs md:text-[10px] uppercase tracking-[0.4em]">
            Back to Experience
          </span>
        </a>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 md:px-12 pt-32 pb-32">
        <BreadcrumbNavigation className="relative justify-start pb-8 px-0" onHomeClick={() => {
            window.history.pushState(null, "", "/");
            onGoHome();
        }} />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="prose prose-invert prose-p:text-white/70 prose-a:text-[#D4AF37] prose-headings:font-serif prose-headings:font-light prose-h1:text-4xl md:prose-h1:text-6xl prose-h1:italic prose-h2:text-2xl md:prose-h2:text-3xl prose-h2:mt-16 prose-h2:mb-8 prose-li:text-white/70 hover:prose-a:text-white transition-all max-w-none prose-td:border prose-td:border-white/20 prose-th:border prose-th:border-white/20 prose-th:bg-white/5 prose-table:border-collapse"
        >
          <div className="markdown-body">
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{content}</ReactMarkdown>
          </div>
        </motion.div>
        {slug === 'exchange-policy' && <ExchangeCalculator />}
      </main>
      <SharedFooter />
    </div>
  );
}
