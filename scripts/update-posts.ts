import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import fs from 'fs';

const rawConfig = fs.readFileSync('./firebase-applet-config.json', 'utf8');
const firebaseConfig = JSON.parse(rawConfig);

const app = initializeApp(firebaseConfig);
const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || "(default)");

async function run() {
  const postsCollection = collection(db, "site_content_blogPosts");
  const snapshot = await getDocs(postsCollection);
  
  if (snapshot.empty) {
    console.log("No posts found in DB.");
    return;
  }

  for (const d of snapshot.docs) {
    const data = d.data();
    let content = data.content;
    let modified = false;

    if (!content) continue;

    if (d.id === 'gia-vs-igi-certified-diamonds-india-guide' || content.includes('Gemological Institute of America (GIA)')) {
      if (!content.includes('<a href="https://www.gia.edu"')) {
        content = content.replace('Gemological Institute of America (GIA)', '<a href="https://www.gia.edu" rel="noopener noreferrer">Gemological Institute of America (GIA)</a>');
        content = content.replace('International Gemological Institute (IGI)', '<a href="https://www.igi.org" rel="noopener noreferrer">International Gemological Institute (IGI)</a>');
        modified = true;
      }
    }

    if (d.id === 'investment-grade-diamond-jewellery-guide' || content.includes('investment-grade stones is critical')) {
      if (!content.includes('GIA\'s 4Cs')) {
         content = content.replace('GIA or IGI certifications, excellent cut', 'GIA or IGI certifications, adherence to <a href="https://www.gia.edu/diamond-quality-factor" rel="noopener noreferrer">GIA\\\'s 4Cs diamond grading system</a>, excellent cut');
         modified = true;
      }
    }

    if (d.id.includes('antique-diamond-jewellery') || content.includes('modern interpretations')) {
      if (!content.includes('BIS Hallmarking standards')) {
         content = content.replace('modern interpretations, and learn', 'modern interpretations, ensuring all pieces meet <a href="https://www.bis.gov.in/hallmarking/" rel="noopener noreferrer">BIS Hallmarking standards</a>, and learn');
         modified = true;
      }
    }

    if (d.id.includes('diamond-jewellery-vs-gold-investment') || content.includes('8-12%')) {
      if (!content.includes('mcxindia')) {
         content = content.replace('8-12%,', '8-12% (tracked via <a href="https://www.mcxindia.com/market-data/commodities/gold" rel="noopener noreferrer">MCX gold spot prices</a>),');
         modified = true;
      }
      if (!content.includes('href="https://www.bis.gov.in')) {
         content = content.replace('BIS hallmarked gold', '<a href="https://www.bis.gov.in/hallmarking/" rel="noopener noreferrer">BIS hallmarked gold</a>');
         modified = true;
      }
    }

    if (d.id.includes('artisanal-vs-mass-produced') || content.includes('higher construction')) {
      if (!content.includes('GIA diamond')) {
         content = content.replace('certified stones and higher', 'certified stones under <a href="https://www.gia.edu/diamond-quality-factor" rel="noopener noreferrer">GIA diamond grading standards</a> and higher');
         modified = true;
      }
    }

    if (d.id.includes('hand-hammering') || content.includes('hand-hammered')) {
      if (!content.includes('GIA\'s gemological')) {
         content += ' <p>Our commitment to rigorous <a href="https://www.gia.edu/gems-gemology" rel="noopener noreferrer">GIA\'s gemological research</a> ensures lasting quality.</p>';
         modified = true;
      }
    }

    if (d.id.includes('engagement') || content.includes('4Cs')) {
      if (!content.includes('GIA Diamond')) {
         content += ' <p>Informed by the <a href="https://www.gia.edu/diamond-quality-factor" rel="noopener noreferrer">GIA Diamond Grading Report</a>.</p>';
         modified = true;
      }
    }

    if (modified) {
      console.log("Updating DB for:", d.id);
      await updateDoc(doc(db, "site_content_blogPosts", d.id), { content });
    }
  }
  process.exit(0);
}
run().catch(err => {
    console.error(err);
    process.exit(1);
});
