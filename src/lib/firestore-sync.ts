import { db } from './firebase.ts';
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  deleteDoc 
} from 'firebase/firestore';

export async function fetchContentFromFirestore() {
  try {
    // 1. Global data
    let globalData: any = {};
    const globalSnap = await getDoc(doc(db, "site_content", "global"));
    if (globalSnap.exists()) {
      globalData = globalSnap.data();
    }

    // 2. Blog posts
    const postsSnap = await getDocs(collection(db, "site_content_blogPosts"));
    const blogPosts = postsSnap.docs.map(d => ({ id: d.id, ...d.data() }));

    // 3. Journal trends
    const trendsSnap = await getDocs(collection(db, "site_content_journalTrends"));
    const journalTrends = trendsSnap.docs.map(d => ({ id: d.id, ...d.data() }));

    // 4. Products
    const prodSnap = await getDocs(collection(db, "site_content_shopProducts"));
    const shopProducts = prodSnap.docs.map(d => ({ id: d.id, ...d.data() }));

    // 5. Heritage items
    const heritageSnap = await getDocs(collection(db, "site_content_heritageItems"));
    const heritageItems = heritageSnap.docs.map(d => ({ id: d.id, ...d.data() }));

    // 6. Methodology steps
    const methodSnap = await getDocs(collection(db, "site_content_methodologySteps"));
    const methodologySteps = methodSnap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a: any, b: any) => (a.stepOrder || 0) - (b.stepOrder || 0));

    // 7. Bride gallery
    const brideSnap = await getDocs(collection(db, "site_content_brideGallery"));
    const brideGallery = brideSnap.docs.map(d => ({ id: d.id, ...d.data() }));

    return {
      ...globalData,
      blogPosts,
      journalTrends,
      shopProducts,
      heritageItems,
      methodologySteps,
      brideGallery
    };
  } catch (err) {
    console.error("fetchContentFromFirestore error:", err);
    return null;
  }
}

export async function getCollectionFromFirestore(name: string): Promise<any[]> {
  try {
    const cleanName = name.replace(/^site_content_/, '');
    const firestoreCollection = `site_content_${cleanName}`;
    const snap = await getDocs(collection(db, firestoreCollection));
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (err) {
    console.error(`getCollectionFromFirestore error on ${name}:`, err);
    return [];
  }
}

export function sanitizeForFirestore(obj: any): any {
  if (obj === undefined) return null;
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(sanitizeForFirestore);
  const clean: Record<string, any> = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v !== undefined) {
      clean[k] = sanitizeForFirestore(v);
    }
  }
  return clean;
}

export async function saveCollectionToFirestore(name: string, items: any[]) {
  const cleanName = name.replace(/^site_content_/, '');
  const firestoreCollection = `site_content_${cleanName}`;
  const validItems = Array.isArray(items) ? items : [];

  for (let idx = 0; idx < validItems.length; idx++) {
    const item = validItems[idx];
    if (!item || typeof item !== 'object') continue;
    const id = String(item.id || `${cleanName}_${Date.now()}_${idx}`);
    const sanitized = sanitizeForFirestore({ ...item, id });
    await setDoc(doc(db, firestoreCollection, id), sanitized, { merge: true });
  }

  // Delete removed items
  try {
    const currentSnap = await getDocs(collection(db, firestoreCollection));
    const newIds = new Set(validItems.map(it => String(it.id)).filter(Boolean));
    for (const d of currentSnap.docs) {
      if (!newIds.has(d.id)) {
        await deleteDoc(d.ref);
      }
    }
  } catch (err) {
    console.warn(`Could not prune deleted items from ${firestoreCollection}:`, err);
  }

  return { success: true };
}

export async function saveContentToFirestore(newContent: any) {
  const {
    shopProducts,
    blogPosts,
    journalTrends,
    heritageItems,
    methodologySteps,
    brideGallery,
    ...globalFields
  } = newContent;

  if (Object.keys(globalFields).length > 0) {
    const existingSnap = await getDoc(doc(db, "site_content", "global"));
    const existing = existingSnap.exists() ? existingSnap.data() : {};
    const sanitized = sanitizeForFirestore({ ...existing, ...globalFields });
    await setDoc(doc(db, "site_content", "global"), sanitized, { merge: true });
  }

  if (Array.isArray(shopProducts)) await saveCollectionToFirestore('shopProducts', shopProducts);
  if (Array.isArray(blogPosts)) await saveCollectionToFirestore('blogPosts', blogPosts);
  if (Array.isArray(journalTrends)) await saveCollectionToFirestore('journalTrends', journalTrends);
  if (Array.isArray(heritageItems)) await saveCollectionToFirestore('heritageItems', heritageItems);
  if (Array.isArray(methodologySteps)) await saveCollectionToFirestore('methodologySteps', methodologySteps);
  if (Array.isArray(brideGallery)) await saveCollectionToFirestore('brideGallery', brideGallery);

  return { success: true };
}
