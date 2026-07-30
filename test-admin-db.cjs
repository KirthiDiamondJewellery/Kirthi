const { initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const app = initializeApp({ projectId: 'esoteric-portal-471501-t2' });
const db = getFirestore(app, 'ai-studio-473f78a6-33a4-45ac-be80-762e91a1e764');
// wait, does getFirestore take two arguments?
console.log(db.collection('site_content_shopProducts').path);
