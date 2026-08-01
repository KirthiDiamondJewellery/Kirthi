import { initializeApp, cert } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import fs from "fs";

// Initialize Firebase Admin
const serviceAccount = JSON.parse(fs.readFileSync('firebase-applet-config.json', 'utf8'));
const app = initializeApp({
  credential: cert(serviceAccount),
});
const db = getFirestore(app);

async function run() {
  const globalRef = db.collection('site_content').doc('global');
  const globalDoc = await globalRef.get();
  
  if (globalDoc.exists) {
    let data = globalDoc.data();
    let updated = false;

    // Homepage CTA
    if (data.sections) {
      data.sections.forEach(sec => {
        if (sec.id === 'home' && sec.subtitle) {
           // update tagline
           sec.subtitle = sec.subtitle.replace("diamond mastery jewellery since", "diamond mastery, since");
           sec.description = sec.description.replace("diamond mastery jewellery since", "diamond mastery, since");
           updated = true;
        }
      });
    }

    if (updated) {
      await globalRef.update({ sections: data.sections });
      console.log('Updated global sections');
    }
  }

  // Articles
  const blogRef = db.collection('site_content_blogPosts');
  const blogDocs = await blogRef.get();
  for (const doc of blogDocs.docs) {
    let data = doc.data();
    let updated = false;

    // artisanal-diamond-jewellery-vs-mass-produced-what-is-the-real-difference
    if (data.id === 'artisanal-diamond-jewellery-vs-mass-produced-what-is-the-real-difference' || doc.id === 'artisanal-diamond-jewellery-vs-mass-produced-what-is-the-real-difference') {
       if (data.content && data.content.includes('presented in a private viewing')) {
           data.content = data.content.replace(/presented in a private viewing/g, 'presented at a quiet unveiling');
           updated = true;
       }
       if (data.content && data.content.includes('private appointment.')) {
           data.content = data.content.replace(/private appointment\./g, 'appointment.');
           updated = true;
       }
    }
    
    // antique-diamond-jewellery-designs-for-traditional-kerala-weddings
    if (data.id === 'antique-diamond-jewellery-designs-for-traditional-kerala-weddings' || doc.id === 'antique-diamond-jewellery-designs-for-traditional-kerala-weddings') {
       if (data.content && data.content.includes('private appointment space')) {
           data.content = data.content.replace(/This is held in our private appointment space at Kochi or Calicut\./g, 'This is held in a reserved consultation space at our Kochi or Calicut boutique.');
           updated = true;
       }
    }
    
    // Banned words replace
    const bannedRegex = /concierge|private concierge|private viewing|private-viewing|private appointment|priority access|hurry|limited time|don't miss|offer ends/gi;
    if (data.content && bannedRegex.test(data.content)) {
        data.content = data.content.replace(bannedRegex, (match) => {
            const lower = match.toLowerCase();
            if (lower.includes('private viewing') || lower.includes('private-viewing')) return 'quiet unveiling';
            if (lower.includes('private appointment')) return 'appointment';
            if (lower.includes('concierge')) return 'design team';
            return '';
        });
        updated = true;
    }

    if (updated) {
      await doc.ref.update({ content: data.content });
      console.log(`Updated article ${doc.id}`);
    }
  }

  // Remove onam link from journal hub (not needed in DB, it's about the link on the page, wait, the hub lists all blog posts? No, Journal hub dynamically lists articles from DB, we might need to change its category or unpublish it?)
  // Actually, wait, let's look at how the journal hub is built.

  console.log("Done");
}

run().catch(console.error);
