const { initializeApp } = require("firebase/app");
const { initializeFirestore, doc, updateDoc, setDoc, getDocs, collection } = require("firebase/firestore");
const cfg = require("../firebase-applet-config.json");

const app = initializeApp(cfg);
const db = initializeFirestore(app, { experimentalForceLongPolling: true }, cfg.firestoreDatabaseId);

async function seedFirebase() {
  console.log("1. Updating site_content/global with heroVideoUrl and branding...");
  const globalRef = doc(db, "site_content", "global");
  await updateDoc(globalRef, {
    heroVideoUrl: "https://youtu.be/cGrZrg3_BQw",
    philosophyImage: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=1200",
    logoUrl: "/logo.svg"
  });
  console.log("Global doc updated successfully!");

  console.log("2. Updating site_content_pageVideos with home hero video...");
  await setDoc(doc(db, "site_content_pageVideos", "home"), {
    id: "home",
    title: "Master Artisanal Diamond Craftsmanship",
    description: "The bespoke diamond jewellery creation process at Kirthi Diamonds Kochi & Calicut.",
    videoUrl: "https://youtu.be/cGrZrg3_BQw",
    uploadDate: "2026-08-04"
  });

  console.log("3. Seeding site_content_shopProducts...");
  const products = [
    {
      id: "luna-tear-pendenta",
      title: "Luna Tear Pendenta",
      description: "Centered around a D-color, internally flawless pear-cut diamond, this piece captures the essence of nocturnal brilliance. Every micro-diamond in the platinum chain is hand-selected. 5.02 Carat Center Stone, D/IF, 950 Platinum, GIA Certified.",
      price: 4500000,
      category: "Necklaces",
      image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=1000",
      images: [
        "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=1000",
        "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=1000",
        "https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?auto=format&fit=crop&q=80&w=1000"
      ]
    },
    {
      id: "solaris-eternal",
      title: "Solaris Eternal Ring",
      description: "Inspired by the first light of dawn, the Solaris Eternal features a rare vivid yellow diamond. The emerald cut provides a clean, architectural brilliance that contrasts beautifully with hand-crafted 18k rose gold.",
      price: 3200000,
      category: "Rings",
      image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=1000",
      images: [
        "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=1000",
        "https://images.unsplash.com/photo-1598560912005-5976593c888e?auto=format&fit=crop&q=80&w=1000"
      ]
    },
    {
      id: "aurora-borealis",
      title: "Aurora Borealis Ear Pendants",
      description: "Capturing the dancing lights of the north, these earrings feature a complex pattern of marquise and brilliant-cut diamonds. Articulated design with 8.2 carats total weight, E color, VVS1 clarity in 18k white gold.",
      price: 2800000,
      category: "Earrings",
      image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=1000",
      images: [
        "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=1000",
        "https://images.unsplash.com/photo-1626497346313-94c39f0e6573?auto=format&fit=crop&q=80&w=1000"
      ]
    },
    {
      id: "nizami-heritage-choker",
      title: "Nizami Heritage Polki Choker",
      description: "Masterwork handcrafted in 22kt BIS hallmarked gold, featuring uncut syndicate Polki diamonds framed by Colombian emerald droplets and intricate Meenakari enamel on the reverse.",
      price: 3800000,
      category: "Necklaces",
      image: "https://images.unsplash.com/photo-1611591475152-47831c367285?auto=format&fit=crop&q=80&w=1000",
      images: [
        "https://images.unsplash.com/photo-1611591475152-47831c367285?auto=format&fit=crop&q=80&w=1000"
      ]
    },
    {
      id: "celestial-tennis-bracelet",
      title: "Celestial Diamond Tennis Bracelet",
      description: "A continuous line of fire featuring 45 hand-matched F/VVS round brilliant diamonds totalling 12.0 carats, bezel set in hand-drawn 950 platinum with double-safety clasp.",
      price: 1950000,
      category: "Bracelets",
      image: "https://images.unsplash.com/photo-1611591475152-47831c367285?auto=format&fit=crop&q=80&w=1000",
      images: [
        "https://images.unsplash.com/photo-1611591475152-47831c367285?auto=format&fit=crop&q=80&w=1000"
      ]
    }
  ];

  for (const p of products) {
    await setDoc(doc(db, "site_content_shopProducts", p.id), p);
  }
  console.log("Shop products seeded successfully!");

  console.log("4. Seeding site_content_heritageItems...");
  const heritage = [
    {
      id: "heritage-1975",
      year: "1975",
      title: "Foundational Roots",
      description: "Originating as trusted diamond and gemstone merchants supplying southern India's royal houses and master jewelers, establishing a five-decade lineage of direct sourcing.",
      image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=1200"
    },
    {
      id: "heritage-2006",
      year: "2006",
      title: "Establishment of the Maison",
      description: "Opening of Kirthi Diamonds' dedicated bespoke atelier and flagship boutique in Palarivattom, Kochi, bringing certified high jewellery directly to Kerala's discerning collectors.",
      image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=1200"
    },
    {
      id: "heritage-2026",
      year: "2026",
      title: "A Legacy of Trust",
      description: "Expanding to our landmark Calicut showroom in Puthiyara, solidifying our position as the pinnacle of conflict-free GIA/IGI certified diamonds in Kerala.",
      image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=1200"
    }
  ];
  for (const h of heritage) {
    await setDoc(doc(db, "site_content_heritageItems", h.id), h);
  }
  console.log("Heritage items seeded successfully!");

  console.log("5. Seeding site_content_methodologySteps...");
  const steps = [
    {
      id: "sourcing",
      title: "1. Geological Sourcing",
      subtitle: "Rough Stone Selection",
      description: "Direct relationship with ethical sight-holders in Antwerp, Surat, and Mumbai. Only the top 1% of rough diamonds meeting conflict-free Kimberly Process certification are selected.",
      image: "https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?auto=format&fit=crop&q=80&w=1000"
    },
    {
      id: "design-adaptation",
      title: "2. Bespoke Design",
      subtitle: "Gouache & Spatial CAD",
      description: "Translating individual client narratives into hand-painted gouache renderings, followed by micrometer-precise architectural CAD modeling.",
      image: "https://images.unsplash.com/photo-1582234373453-6a908901867c?auto=format&fit=crop&q=80&w=1000"
    },
    {
      id: "fabrication",
      title: "3. Hand Fabrication",
      subtitle: "Wax, Casting & Wire",
      description: "Foundational structure forged by master goldsmiths in 18kt/22kt gold or 950 platinum with zero porosity.",
      image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=1000"
    },
    {
      id: "setting",
      title: "4. Master Setting",
      subtitle: "Loupe Magnification",
      description: "Prongs individually sculpted and burnished under 40x stereo-microscope inspection, maximizing light refractive return.",
      image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=1000"
    },
    {
      id: "finishing",
      title: "5. Polish & Presentation",
      subtitle: "Final Quality Assurance",
      description: "Multi-stage diamond polishing followed by strict BIS hallmarking certification and independent GIA verification.",
      image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=1000"
    }
  ];
  for (const s of steps) {
    await setDoc(doc(db, "site_content_methodologySteps", s.id), s);
  }
  console.log("Methodology steps seeded successfully!");

  console.log("6. Seeding site_content_brideGallery...");
  const brides = [
    {
      id: "anjali-k",
      name: "Anjali & Karthik",
      story: "A bespoke emerald-cut creation with pavé diamond halo for a traditional sunset ceremony in Kochi.",
      image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=1000"
    },
    {
      id: "meera-r",
      name: "Meera & Rohan",
      story: "A royal Nizami uncut Polki choker set complemented by Colombian emerald drops for a grand Calicut wedding.",
      image: "https://images.unsplash.com/photo-1611591475152-47831c367285?auto=format&fit=crop&q=80&w=1000"
    }
  ];
  for (const b of brides) {
    await setDoc(doc(db, "site_content_brideGallery", b.id), b);
  }
  console.log("Bride gallery seeded successfully!");

  console.log("7. Updating site_content_blogPosts with rich photography...");
  const blogImages = [
    "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1611591475152-47831c367285?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1582234373453-6a908901867c?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1600003014755-ba31aa59c4b6?auto=format&fit=crop&q=80&w=1000",
    "https://images.unsplash.com/photo-1598560912005-5976593c888e?auto=format&fit=crop&q=80&w=1000"
  ];
  const postsSnap = await getDocs(collection(db, "site_content_blogPosts"));
  let idx = 0;
  for (const d of postsSnap.docs) {
    const img = blogImages[idx % blogImages.length];
    await updateDoc(doc(db, "site_content_blogPosts", d.id), {
      image: img,
      featuredImage: img
    });
    idx++;
  }
  console.log(`Updated ${postsSnap.size} blog posts with photography!`);

  console.log("ALL FIREBASE DATA SUCCESSFULLY SEEDED!");
  process.exit(0);
}

seedFirebase().catch(e => {
  console.error("Seed error:", e);
  process.exit(1);
});
