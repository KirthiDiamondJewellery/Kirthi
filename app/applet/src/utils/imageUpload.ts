import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../lib/firebase';
import imageCompression from 'browser-image-compression';

export const compressImage = async (file: File): Promise<File> => {
  if (file.type === 'image/svg+xml' || file.type === 'image/gif') {
    return file;
  }
  
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1200,
    useWebWorker: true,
    fileType: file.type === 'image/png' ? 'image/png' : 'image/webp'
  };
  
  try {
    const compressedFile = await imageCompression(file, options);
    return compressedFile;
  } catch (error) {
    console.error("Compression error:", error);
    return file; // fallback to original file if compression fails
  }
};

export const uploadImage = async (file: File): Promise<string> => {
  let finalFile = file;
  try {
    finalFile = await compressImage(file);
    if (finalFile.name === file.name && finalFile.type === 'image/webp' && !file.name.endsWith('.webp')) { 
      finalFile = new File([finalFile], file.name.replace(/\.[^/.]+$/, "") + '.webp', { type: 'image/webp' });
    }
  } catch (e) {
    console.warn("Compression failed, using original file", e);
  }

  // 1. First, attempt upload via the server API endpoint (/api/upload)
  try {
    const formData = new FormData();
    formData.append('file', finalFile);
    const res = await fetch('/api/upload', {
      method: 'POST',
      body: formData
    });
    if (res.ok) {
      const data = await res.json();
      if (data && data.url) {
        return data.url;
      }
    }
  } catch (apiErr) {
    console.warn("Direct /api/upload failed, trying fallback:", apiErr);
  }

  // 2. Second, attempt Firebase Storage upload
  try {
    const storageRef = ref(storage, `uploads/${Date.now()}_${finalFile.name}`);
    const snapshot = await uploadBytes(storageRef, finalFile);
    const downloadURL = await getDownloadURL(snapshot.ref);
    return downloadURL;
  } catch (storageErr) {
    console.warn("Firebase Storage unavailable, falling back to data URL:", storageErr);
  }

  // 3. Fallback: Compact Data URL
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') resolve(reader.result);
      else reject(new Error('Failed to read image as Data URL'));
    };
    reader.onerror = reject;
    reader.readAsDataURL(finalFile);
  });
};
