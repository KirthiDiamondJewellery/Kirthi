import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, limit, query } from 'firebase/firestore';

const firebaseConfig = {
  projectId: "ai-studio-473f78a6-33a4-45ac-be80-762e91a1e764"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function check() {
  const q = query(collection(db, "site_content_blogPosts"), limit(1));
  const snap = await getDocs(q);
  snap.forEach(doc => console.log(doc.id, doc.data()));
  process.exit(0);
}
check();
