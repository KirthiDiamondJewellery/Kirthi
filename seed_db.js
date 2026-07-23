import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import fs from 'fs';

const config = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(config);
const db = getFirestore(app, config.firestoreDatabaseId);

const defaultContent = {
  logoUrl: '/logo.png',
  heroVideoUrl: 'https://player.vimeo.com/external/477431742.hd.mp4?s=d63a8a3abf1b80d0d832edbf0eac8fcc3df33fc6&profile_id=174',
  landingTitle: 'Legacy in Light',
  landingSubtitle: 'Experience the Kirthi Anthology. A legacy of artisanal diamond mastery since 2006.',
  philosophyTitle: 'The Philosophy',
  philosophySubtitle: 'Purity in\nevery facet',
  philosophyDescription: 'Our artisans spent decades refining the alchemy of carbon and light. Every Kirthi piece is documented, certified, and carved for the permanent archive.',
  philosophyStat1Value: '45+',
  philosophyStat1Label: 'Years of Mastery',
  philosophyStat2Value: 'Inter.',
  philosophyStat2Label: 'Flawless Standard',
  philosophyImage: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800',
  archiveTitle: 'The Centenary Archives',
  archiveDescription: 'Exploring the lineage of our most seminal pieces from the early collections to contemporary masterworks.',
  maisonDetails: 'With a family legacy in the diamond trade since 1975 and Kirthi Diamonds established in 2006, we have established ourselves as a modern pinnacle of high jewelry. Our mission has always been singular: to capture the ephemeral beauty of light through the absolute precision of geological science and artisanal mastery.',
  contactEmail: 'info@kirthidiamonds.com',
  contactPhone: '+91 98470 86990',
  contactAddress: 'Palarivattom, Kochi, Kerala, India',
  maisonImage: 'https://images.unsplash.com/photo-1620331311520-246422fd82f9?auto=format&fit=crop&q=80&w=800'
};

setDoc(doc(db, 'site_content', 'global'), defaultContent, { merge: true })
  .then(() => {
    console.log('Successfully seeded site_content/global');
    process.exit(0);
  })
  .catch((e) => { console.error(e); process.exit(1); });
