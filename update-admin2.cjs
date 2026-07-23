const fs = require('fs');
let code = fs.readFileSync('src/components/AdminView.tsx', 'utf8');

const newRecompress = `const recompressBase64 = async (base64Str: string): Promise<string> => {
    if (!base64Str.startsWith('data:image/') || base64Str.length < 5000) {
      return base64Str;
    }

    try {
      // Convert base64 string to a File object
      const res = await fetch(base64Str);
      const blob = await res.blob();
      const extMatch = blob.type.match(/\\/(png|jpeg|jpg|webp|gif|svg)/);
      const ext = extMatch ? extMatch[1].replace('jpeg', 'jpg') : 'webp';
      const file = new File([blob], \`inline.\${ext}\`, { type: blob.type });

      return await uploadImage(file);
    } catch (e) {
      console.warn("Failed to upload inline base64 image", e);
      return base64Str;
    }
  };`;

code = code.replace(/const recompressBase64 = async \(base64Str: string\): Promise<string> => \{[\s\S]*?\n  \};\n/m, newRecompress + '\n');
fs.writeFileSync('src/components/AdminView.tsx', code);
