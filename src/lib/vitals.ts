import { onCLS, onINP, onLCP, onFCP, onTTFB, type Metric } from 'web-vitals';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

export function reportWebVitalsToFirestore() {
  const vitalsCollection = collection(db, 'core_web_vitals');

  const sendToFirestore = async (metric: Metric) => {
    try {
      await addDoc(vitalsCollection, {
        name: metric.name,
        value: metric.value,
        rating: metric.rating,
        delta: metric.delta,
        id: metric.id,
        navigationType: metric.navigationType,
        url: window.location.href,
        userAgent: navigator.userAgent,
        timestamp: serverTimestamp(),
      });
    } catch (error: any) {
      if (error && error.code === 'permission-denied') {
        // Suppress permission errors for web vitals in preview/development
        return;
      }
      console.error('Failed to log web vital to Firestore:', error);
    }
  };

  onCLS(sendToFirestore);
  onFCP(sendToFirestore);
  onINP(sendToFirestore);
  onLCP(sendToFirestore);
  onTTFB(sendToFirestore);
}
