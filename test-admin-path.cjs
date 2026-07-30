const { initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
initializeApp({ projectId: 'esoteric-portal-471501-t2' });
const db1 = getFirestore('ai-studio-473f78a6-33a4-45ac-be80-762e91a1e764');
console.log(db1.collection('test').path);
const db2 = getFirestore();
console.log(db2.collection('test').path);
