const fs = require('fs');
let code = fs.readFileSync('src/components/AdminView.tsx', 'utf8');

// Patch compressImage
code = code.replace(/const MAX_WIDTH = 1200;\s*const MAX_HEIGHT = 1200;/g, 'const MAX_WIDTH = 2500;\n        const MAX_HEIGHT = 2500;');

code = code.replace(/let base64 = tryCompress\(width, height, quality\);\s*const targetSize = 500000;[\s\S]*?resolve\(base64\);/,
`let base64 = tryCompress(width, height, quality);
        
        // Remove aggressive downscaling since this goes to Firebase Storage
        resolve(base64);`);

// Patch recompressBase64 (which will now upload)
code = code.replace(/const recompressBase64 = \(base64Str: string\): Promise<string> => \{[\s\S]*?img\.onerror = \(\) => resolve\(base64Str\);\s*\}\);\s*\};/,
`const recompressBase64 = async (base64Str: string): Promise<string> => {
    if (!base64Str.startsWith('data:image/') || base64Str.length < 5000) {
      return base64Str;
    }

    try {
      const mimeType = base64Str.substring(base64Str.indexOf(':') + 1, base64Str.indexOf(';'));
      const extMatch = mimeType.match(/\\/(png|jpeg|jpg|webp|gif|svg)/);
      const ext = extMatch ? extMatch[1].replace('jpeg', 'jpg') : 'webp';
      const filename = \`inline_uploads/\${Date.now()}_\${Math.random().toString(36).substring(2, 9)}.\${ext}\`;
      const storageRef = ref(storage, filename);
      await uploadString(storageRef, base64Str, 'data_url');
      return await getDownloadURL(storageRef);
    } catch (e) {
      console.warn("Failed to upload inline base64 image", e);
      return base64Str;
    }
  };`);

fs.writeFileSync('src/components/AdminView.tsx', code);
