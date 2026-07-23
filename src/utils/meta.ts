export const metaMap: Record<string, string> = {
  "investment-grade-diamond-jewellery": "What makes a diamond investment-grade? Certification, cut, carat thresholds, and resale economics for Indian buyers — a practical guide from Kirthi Diamonds.",
  "diamond-jewellery-vs-gold": "Diamonds or gold? How making charges, buyback policies, and resale value compare for Kerala buyers weighing jewellery as a long-term store of value.",
  "gia-vs-igi-certified-diamonds": "GIA and IGI grade diamonds differently in subtle ways. What each certificate tells you, how they compare on rigour and price, and which suits your purchase.",
  "antique-diamond-jewellery": "Traditional Kerala wedding jewellery, reinterpreted: antique diamond designs for Hindu, Christian, and Muslim ceremonies, and how bespoke commissions work.",
  "artisanal-vs-mass-produced": "Individually certified stones, hand-cut settings, and lifetime accountability — the four practical differences between artisanal and mass-produced jewellery.",
  "how-to-identify-quality": "What separates a quality diamond house from a volume retailer: craftsmanship, certification, sourcing, and the questions to ask before you buy.",
  "the-modern-kerala-bride": "How to balance ceremonial gold with bespoke diamond pieces — a practical trousseau framework for the modern Kerala bride."
};

export function getMetaDescription(post: any, slug: string): string {
  for (const key of Object.keys(metaMap)) {
    if (slug.includes(key)) {
      return metaMap[key];
    }
  }
  if (post.metaDescription && post.metaDescription.trim() !== '') {
    return post.metaDescription.replace(/[#*_]/g, '').trim();
  }
  if (post.excerpt) {
    return post.excerpt.replace(/[#*_]/g, '').trim();
  }
  return "Kirthi Diamonds Journal - High Jewellery and Bespoke Masterpieces";
}
