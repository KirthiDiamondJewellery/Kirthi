export const compressImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = event => {
      const dataUrl = event.target?.result as string;
      
      // If SVG or GIF, avoid canvas to preserve vectors/animations
      if (file.type === 'image/svg+xml' || file.type === 'image/gif') {
        resolve(dataUrl);
        return;
      }

      const img = new Image();
      img.src = dataUrl;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 1200;
        const MAX_HEIGHT = 1200;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        
        const isPng = file.type === 'image/png';
        const format = isPng ? 'image/png' : 'image/webp';
        const quality = 0.95;
        
        const tryCompress = (w: number, h: number, q: number) => {
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext('2d');
          ctx?.clearRect(0, 0, w, h);
          ctx?.drawImage(img, 0, 0, w, h);
          return canvas.toDataURL(format, q);
        };
        
        const base64 = tryCompress(width, height, quality);
        resolve(base64);
      }
    };
    reader.onerror = error => reject(error);
  });
};

import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../lib/firebase';

export const uploadImage = async (file: File): Promise<string> => {
  let finalFile = file;
  if (file.type !== 'image/svg+xml' && file.type !== 'image/gif') {
    try {
      const base64 = await compressImage(file);
      const res = await fetch(base64);
      const blob = await res.blob();
      finalFile = new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".webp", { type: 'image/webp' });
    } catch (e) {
      console.warn("Compression failed, using original file", e);
    }
  }

  const storageRef = ref(storage, `uploads/${Date.now()}_${finalFile.name}`);
  const snapshot = await uploadBytes(storageRef, finalFile);
  const downloadURL = await getDownloadURL(snapshot.ref);
  return downloadURL;
};
