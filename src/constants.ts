export interface Section {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  index: string;
  image?: string;
  location?: string;
  isShop?: boolean;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
}

export interface Product {
  id: string;
  variantId?: string;
  name: string;
  category: string;
  price: number;
  description: string;
  longDescription: string;
  image: string;
  details: string[];
  angles: string[];
  metalWeight?: number | string;
  diamondWeight?: number | string;
  polkiWeight?: number | string;
  metalQuality?: string;
  diamondQuality?: string;
  colourStoneWeight?: number | string;
  availableMetals?: string[];
  availableSizes?: string[];
}

export interface BlogPost {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  content: string;
  readTime?: string;
  image: string;
  images?: string[];
  category?: string;
  metaDescription?: string;
  featuredImage?: string;
  seoTitle?: string;
}

export interface HeritageItem {
  id: string;
  title: string;
  year: string;
  description: string;
  image: string;
}

export interface MethodologyStep {
  id: string;
  title: string;
  description: string;
  image: string;
}

export interface Bride {
  id: string;
  name: string;
  story: string;
  description?: string;
  image: string;
  images?: string[];
  weddingDate?: string;
}

export const SECTIONS: Section[] = [
  {
    id: 'home',
    title: 'Kirthi Diamonds',
    subtitle: 'Arisanal Legacy',
    description: 'A bespoke diamond house est. 2006, rooted in a family diamond trade since 1975. VVS1 clarity, E/F colour, 18kt gold. Visit our Kochi & Calicut showrooms or order online.',
    index: '00 / 08',
    location: 'Foundry of Light',
    image: '',
  },
  {
    id: 'journal',
    title: 'The Journal',
    subtitle: 'Insights',
    description: 'This journal explores the artistry, craftsmanship, and science behind high jewellery. Understand how exceptional pieces are designed, made, and valued. Expect practical insights, heritage stories, and expert perspectives from Kirthi Diamonds.',
    index: '01 / 08',
    location: 'Editorial Office',
    image: '',
  },
  {
    id: 'heritage',
    title: 'The Heritage',
    seoTitle: 'Kirthi Diamonds Heritage | Bespoke Diamond House Since 1975, Kochi',
    subtitle: 'Archive',
    description: "The story of Kirthi Diamonds is woven deeply into the fabric of time. Established as a bespoke diamond house in 2006, our roots trace back to a family diamond trade that began in 1975. In that year, our grandfather set up a diamond cutting factory in Irinjalakuda, Kerala—the first of its kind in South India for cutting diamonds. Our masterfully cut stones reached clients globally, from Japan to the United States. This rich heritage forms the foundation of every masterpiece we create. We are custodians of a legacy that values uncompromising quality and enduring elegance. From our exclusive boutiques in Kochi and Calicut, we serve discerning patrons who appreciate the subtle luxury of authentic craftsmanship. Our journey is defined by a steadfast commitment to transparency, demonstrated by our strict adherence to independent GIA and IGI certification for all significant diamonds, and BIS Hallmarking for our gold settings. Because we operate on a bespoke, low-volume model, we preserve the intimacy of the traditional jeweller-patron relationship. Each piece in our archive represents a milestone—both for the client who commissioned it and for the artisan who forged it. We invite you to explore this heritage of brilliance.",
    index: '02 / 08',
    location: 'Kerala, India',
    image: '',
  },
  {
    id: 'methodology',
    title: 'Savoir-Faire',
    seoTitle: 'Kirthi Diamonds Methodology: From Concept to Masterpiece',
    subtitle: 'Craft',
    description: "The Kirthi methodology is a meticulous journey from raw potential to final brilliance, rejecting the compromises of mass production in favor of deliberate, low-volume craftsmanship. The process begins with the rigorous selection of rough stones, prioritizing inherent clarity and potential light return. We rely on independent grading from world-renowned institutes, including the GIA and IGI, ensuring that every significant diamond meets our exacting standards before it even reaches the bench. Our master artisans then undertake the delicate process of cutting and polishing, calculating angles and facets to maximize the stone's natural fire and scintillation.\n\nOnce the diamond achieves its optimal brilliance, the setting is individually engineered. Rather than using pre-cast, standardized mounts, our bench jewellers hand-pull platinum wires and forge BIS-hallmarked 18kt and 22kt gold to perfectly accommodate the unique physical characteristics of the chosen stone. This bespoke tailoring prevents microscopic misalignments, ensuring that the diamond sits perfectly secure while capturing and refracting light from every angle. The final stage is a rigorous quality control inspection, after which the piece is registered in our permanent archive. We specifically champion the use of precision burs, alongside traditional jadai and intricate nakashi work as our specific setting techniques, honoring ancient craftsmanship with modern precision.",
    index: '03 / 08',
    location: 'Kochi Boutique',
    image: '',
  },
  {
    id: 'maison',
    title: 'The Maison',
    subtitle: 'Company',
    seoTitle: 'High Jewellery Boutique Kochi | Kirthi Diamonds Maison',
    description: `Established in 2006 and built upon a family heritage in the diamond trade dating back to 1975, Kirthi Diamonds operates as a premier high jewellery boutique in Kochi and Calicut dedicated to the preservation of diamond craftsmanship as an art form. We reject the commercialized, high-throughput model of modern retailing in favor of deliberate, low-volume, artisanal craftsmanship. True luxury cannot be mass-produced; it requires time, intimacy, and an uncompromising focus on singular creations.

By maintaining a strict limit on our workshop output, we ensure that every creation receives the undivided attention of our master bench jewellers. This philosophy directly influences the setting outcomes of our jewellery. Our artisans individually forge BIS-hallmarked 18kt and 22kt gold mounts to fit the precise, unique physical characteristics of each GIA or IGI certified diamond. We operate offering a slow-paced, advisory-led environment where clients collaborate directly with our design team. Through our transparent sourcing and legendary lifetime buyback policy, Kirthi Diamonds stands as a sanctuary of trust and artistic integrity. The design of the interiors of the showroom is inspired by painting of florals and is hand painted to give the same textural quality, reflecting our dedication to art. As a high jewellery boutique in Kochi, we ensure that every piece is an heirloom designed to transcend generations.`,

    index: '04 / 08',
    location: 'A bespoke diamond house est. 2006, rooted in a family diamond trade since 1975',
    image: '',
  },
  {
    id: 'shop',
    title: 'The Shop',
    subtitle: 'Boutique',
    description: 'A selection of our pieces, shown in detail. For acquisitions and bespoke commissions, we recommend a visit to the boutique.',
    index: '05 / 08',
    location: 'Digital Flagship',
    image: '',
    isShop: true,
  },
  {
    id: 'brides',
    title: 'Our Patrons',
    seoTitle: 'Bespoke Bridal Jewellery Kerala | Kirthi Diamonds Brides',
    subtitle: 'Stories',
    description: `Kirthi Brides represent the pinnacle of our bespoke bridal jewellery in Kerala. For nearly two decades, since our formal establishment in 2006, we have had the distinct privilege of crafting the foundational heirlooms for countless new beginnings. We understand that an engagement ring or bridal suite is not merely a purchase; it is a profoundly personal symbol of enduring commitment. That is why our approach to bridal jewellery is inherently consultative, never transactional. From our quiet boutiques in Kochi and Calicut, our design team works one-on-one with patrons to understand their unique vision, guiding them through the nuances of VVS1 clarity, E/F colour standard, with GIA/IGI certification for diamonds above 0.30 ct.

Our master artisans meticulously map designs to the individual stones, hand-forging each setting in BIS-hallmarked gold or platinum, and securing the centre stone with absolute precision. We maintain a steadfast focus on heirloom preservation over seasonal trends. The result is a bespoke masterpiece designed to be worn, cherished, and eventually passed down through generations. Understanding and deciphering a customer's requirement and creating a beautiful creation which talks about both the brand and the bride in question is the main challenge we passionately embrace.`,

    index: '06 / 08',
    location: 'Calicut Boutique',
    image: '',
  },
  
  {
    id: 'contact',

    title: 'Contact',
    subtitle: 'Appointments',
    description: 'Book a bespoke consultation with our diamond specialists in Kochi or Calicut.',
    index: '07 / 08',
    location: 'Boutiques',
    image: '',
  },
  {
    id: 'bespoke',
    title: 'Bespoke',
    seoTitle: 'Bespoke Diamond Commissions | Kirthi Diamonds',
    subtitle: 'Consultation',
    description: "Information on commissioning bespoke diamond and gold jewellery at Kirthi Diamonds Kochi and Calicut.",
    index: '08 / 08',
    location: 'Kerala, India',
    image: '',
  },
];

export const HERITAGE_ITEMS: HeritageItem[] = [
  {
    id: 'heritage-1975',
    year: '1975',
    title: 'Foundational Roots',
    description: 'Our grandfather established the first diamond cutting factory of its kind in South India, located in Irinjalakuda, Kerala. Our masterfully cut diamonds were sought after globally, with clients spanning from Japan to the United States.',
    image: ''
  },
  {
    id: 'heritage-2006',
    year: '2006',
    title: 'Establishment of the Maison',
    description: 'Kirthi Diamonds is formally established as a bespoke high-jewellery house in Kerala, shifting focus from wholesale distribution to artisanal, low-volume craftsmanship for discerning patrons.',
    image: ''
  },
  {
    id: 'heritage-2026',
    year: '2026',
    title: 'A Legacy of Trust',
    description: 'Two decades of crafting bespoke heirlooms and historic bridal commissions. We continue to champion the use of precision burs, traditional jadai, and intricate nakashi work in our exclusive Kerala workshops.',
    image: ''
  }
];

export const METHODOLOGY_STEPS: MethodologyStep[] = [
  {
    id: 'stone-selection',
    title: '1. Stone Selection',
    subtitle: 'Sourced to the Certificate',
    description: 'Every diamond is hand-selected against its individual GIA or IGI certificate. We evaluate the cut parameters, fluorescence, and inclusions, choosing only those stones that meet our strict tolerances for brilliance and structural integrity.',
    image: '',
  },
  {
    id: 'design-adaptation',
    title: '2. Design Adaptation',
    subtitle: 'Proportioned to the Stone',
    description: 'Unlike commercial settings drawn to generic sizes, our designs are adapted to the exact dimensions and proportions of the specific stone we have selected, down to hundredths of a millimetre.',
    image: ''
  },
  {
    id: 'fabrication',
    title: '3. Hand Fabrication',
    subtitle: 'Wax, Casting & Wire',
    description: 'The foundation of the piece is built. Depending on the complexity of the design, our artisans use hand-finished wax and precision casting, or build the structure directly from sheet and drawn wire.',
    image: '',
  },
  {
    id: 'setting',
    title: '4. Master Setting',
    subtitle: 'Magnified Precision',
    description: 'The master setter mounts the stone under loupe magnification. We use no generic templates; each prong is individually cut, shaped, and burnished precisely to the individual stone to ensure absolute security and maximum light exposure.',
    image: '',
  },
  {
    id: 'finishing',
    title: '5. Polish & Presentation',
    subtitle: 'Final Inspection',
    description: 'The piece undergoes a final polish and rigorous quality control inspection against both the original design rendering and the diamond certificate, before its final presentation at the boutique.',
    image: ""
  }
];

export const BRIDE_GALLERY: Bride[] = [
  {
    id: 'anjali-k',
    name: 'Anjali & Karthik',
    story: 'A bespoke emerald-cut creation for a sunset ceremony in Kerala.',
    image: '',
  }
];

export const PRODUCTS: Product[] = [];

export const DIAMOND_SHAPES = [
  { id: 'round', label: 'Round Brilliant', price: 5000 },
  { id: 'oval', label: 'Oval Cut', price: 4800 },
  { id: 'emerald', label: 'Emerald Cut', price: 5200 },
  { id: 'pear', label: 'Pear Shape', price: 4900 },
];

export const METALS = [
  { id: 'yellow', label: 'Yellow Gold', color: '#D4AF37', hex: '#D4AF37' },
  { id: 'white', label: 'White Gold', color: '#E5E4E2', hex: '#E5E4E2' },
  { id: 'rose', label: 'Rose Gold', color: '#B76E79', hex: '#B76E79' },
  { id: 'platinum', label: 'Platinum', color: '#E5E4E2', hex: '#A9A9A9' },
];

export const SETTINGS = [
  { id: 'solitaire', label: 'Classic Solitaire', description: 'Timeless focus on the center stone' },
  { id: 'halo', label: 'Radiant Halo', description: 'Surrounded by a shimmer of micro-diamonds' },
  { id: 'pave', label: 'Vintage Pavé', description: 'Diamond-encrusted band for ultimate sparkle' },
];

export const SEO_PLACEHOLDERS = {
  kochi: {
    latitude: "10.006514026736081",
    longitude: "76.31304050997015",
    postalCode: "682025"
  },
  calicut: {
    latitude: "11.255769028405163",
    longitude: "75.78922844417963",
    postalCode: "673004"
  },
  openingHours: {
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    opens: "10:00",
    closes: "19:00"
  },
  logoUrl: "/logo.png",
  images: {
    kochi: "https://kirthidiamonds.com/image.png",
    calicut: "https://kirthidiamonds.com/calicut.png"
  }
};

