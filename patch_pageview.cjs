const fs = require('fs');
let content = fs.readFileSync('src/components/PageView.tsx', 'utf8');

const newExchangePolicy = `
# Kirthi Diamonds Lifetime Buyback and Exchange Policy

**Every Kirthi Diamonds creation — every solitaire, every bridal set, every commissioned piece — is sold with a lifetime buyback and exchange policy. The policy is written on the invoice at the time of purchase, runs for the life of the piece regardless of how many years have passed, and is honoured at both our Kochi and Calicut boutiques.** This page sets out exactly how the policy works, what it covers, and how to use it.

## The Core Valuation Framework

When a piece is returned to the boutique, its value is calculated transparently across its individual components, based on the prevailing market rates on the day of the transaction.

## Diamond Valuation Table

| Transaction Type | Timeframe | Diamond Value |
| :--- | :--- | :--- |
| Exchange (against new jewellery) | Within 12 Months | 100% of prevailing diamond value |
| Exchange (against new jewellery) | After 12 Months | 100% of prevailing diamond value |
| Cash Buyback | Within 12 Months | 90% of prevailing diamond value |
| Cash Buyback | After 12 Months | 85% of prevailing diamond value |

## Gold Valuation Table

| Material | Transaction Type | Valuation |
| :--- | :--- | :--- |
| 18kt / 22kt BIS Hallmarked Gold | Exchange | 100% of prevailing market rate |
| 18kt / 22kt BIS Hallmarked Gold | Cash Buyback | 95% of prevailing market rate |

## Polki & Colourstone Valuations

| Material | Exchange Value | Cash Buyback Value |
| :--- | :--- | :--- |
| Polki (Uncut Diamonds) | 80% of prevailing rate | 70% of prevailing rate |
| Natural Colourstones | 70% of prevailing rate | 70% of prevailing rate |

## Required Documentation and Conditions

1. **Original Certification**: The original GIA or IGI diamond grading reports must be presented alongside the piece.
2. **Kirthi Invoice**: The original purchase invoice from Kirthi Diamonds is required.
3. **Condition Assessment**: The jewellery must undergo a brief inspection by our master artisans to confirm the stones match the certificate and that the piece has not been altered or repaired by third-party jewellers.

*Note: For the protection of our clients and our inventory integrity, buyback and exchange transactions can only be processed in person at our Palarivattom (Kochi) or Puthiyara (Calicut) boutiques.*
`;

content = content.replace(
  /"exchange-policy": `# Kirthi Diamonds Lifetime Buyback and Exchange Policy[\s\S]*?4\. \*\*The Colourstones\*\* Natural stones at 70% of prevailing rates.\n\n/,
  `"exchange-policy": \`${newExchangePolicy}\n\n`
);

fs.writeFileSync('src/components/PageView.tsx', content);
