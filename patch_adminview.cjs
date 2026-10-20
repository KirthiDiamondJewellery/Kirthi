const fs = require('fs');
let content = fs.readFileSync('src/components/AdminView.tsx', 'utf8');

const oldUploadImage = `export const uploadImage = async (file: File): Promise<string> => {
  let finalFile = file;
  if (file.type !== 'image/svg+xml' && file.type !== 'image/gif') {
    try {
      const dataUrl = await compressImage(file);
      const res = await fetch(dataUrl);
      const blob = await res.blob();
      finalFile = new File([blob], file.name, { type: file.type });
    } catch (e) {
      console.warn("Failed to compress image locally", e);
    }
  }

  const formData = new FormData();
  formData.append('file', finalFile);
  
  const res = await fetch('/api/upload', {
    method: 'POST',
    body: formData
  });
  
  if (!res.ok) {
    let errorMsg = "Failed to upload image";
    try { 
       const text = await res.text();
       if (res.status === 413) {
         errorMsg = "Image is too large (max 1MB). Compression failed. Please use a smaller image.";
       } else {
         const errorObj = JSON.parse(text);
         errorMsg = errorObj.error || errorMsg;
       }
    } catch(e: any) {
       // Ignore JSON parse errors for HTML responses
    }
    throw new Error(errorMsg);
  }
  
  const data = await res.json();
  return data.url;
};`;

const newUploadImage = `export const uploadImage = async (file: File): Promise<string> => {
  if (file.type === 'image/svg+xml' || file.type === 'image/gif') {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = event => resolve(event.target?.result as string);
      reader.onerror = error => reject(error);
    });
  }
  
  try {
    const dataUrl = await compressImage(file);
    return dataUrl;
  } catch (e) {
    console.error(e);
    throw new Error("Failed to compress and encode image locally.");
  }
};`;

if (content.includes("export const uploadImage = async")) {
  // Regex to replace the whole function
  content = content.replace(/export const uploadImage = async[\s\S]*?return data.url;\n};/, newUploadImage);
  fs.writeFileSync('src/components/AdminView.tsx', content);
} else {
  console.log("Could not find uploadImage function");
}
