const { initializeApp } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
initializeApp({ projectId: 'ai-studio-473f78a6-33a4-45ac-be80-762e91a1e764' });
const db = getFirestore('ai-studio-473f78a6-33a4-45ac-be80-762e91a1e764');
console.log(db ? "OK" : "FAILED");
