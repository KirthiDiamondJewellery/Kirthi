const fs = require('fs');

// Fix AdminVideos.tsx
let videos = fs.readFileSync('src/components/AdminVideos.tsx', 'utf8');
videos = videos.replace(/const { uploadImage } = await import\('\.\/AdminView'\);/, 'const { uploadImage } = await import(\'../utils/imageUpload\');');
fs.writeFileSync('src/components/AdminVideos.tsx', videos);

// Fix AdminView.tsx
let view = fs.readFileSync('src/components/AdminView.tsx', 'utf8');
const startIdx = view.indexOf('export const compressImage');
const endIdx = view.indexOf('export default function AdminView()');
if (startIdx !== -1 && endIdx !== -1) {
  let newView = view.substring(0, startIdx) + 
    "import { compressImage, uploadImage } from '../utils/imageUpload';\n" + 
    view.substring(endIdx);
  fs.writeFileSync('src/components/AdminView.tsx', newView);
}
