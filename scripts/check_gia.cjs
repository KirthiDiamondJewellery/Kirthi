const admin = require('firebase-admin');
const { getFirestore } = require('firebase-admin/firestore');
admin.initializeApp({
  projectId: 'esoteric-portal-471501-t2',
});
const db = getFirestore();
db.settings({ databaseId: 'ai-studio-473f78a6-33a4-45ac-be80-762e91a1e764' });

async function run() {
  const snap = await db.collection('site_content_blogPosts').get();
  snap.docs.forEach(doc => {
    const data = doc.data();
    if (data.title && data.title.includes('GIA')) {
      console.log('ID:', doc.id);
      console.log('Slug:', data.slug);
      console.log('Title:', data.title);
    }
  });
}
run();
