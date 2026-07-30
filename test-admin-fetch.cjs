const { initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const app = initializeApp({ projectId: 'esoteric-portal-471501-t2' });
const db = getFirestore(app, 'ai-studio-473f78a6-33a4-45ac-be80-762e91a1e764');
db.collection('site_content_blogPosts').get().then(snap => {
  console.log("Admin SDK fetched docs:", snap.size);
}).catch(console.error);
