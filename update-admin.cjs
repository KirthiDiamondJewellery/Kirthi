const fs = require('fs');
let code = fs.readFileSync('src/components/AdminView.tsx', 'utf8');

const newUploadImage = `export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append('file', file);
  
  const res = await fetch('/api/upload', {
    method: 'POST',
    body: formData
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error || "Failed to upload image");
  }
  
  const data = await res.json();
  return data.url;
};`;

code = code.replace(/export const uploadImage = async \(file: File\): Promise<string> => \{[\s\S]*?\n\};\n/m, newUploadImage + '\n');
fs.writeFileSync('src/components/AdminView.tsx', code);
