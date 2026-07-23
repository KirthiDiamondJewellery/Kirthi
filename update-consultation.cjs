const fs = require('fs');
let code = fs.readFileSync('src/components/ConsultationModal.tsx', 'utf8');

// Replace reader.readAsDataURL with uploadImage
const newImport = `import { uploadImage } from './AdminView';\n`;
code = newImport + code;

const newFileHandler = `
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      alert("File size exceeds 10MB limit.");
      return;
    }
    try {
      const url = await uploadImage(file);
      updateForm("attachment", url);
    } catch(err: any) {
      alert(err.message || "Failed to upload image");
    }
  };
`;

code = code.replace(/const handleFileChange = \(e: React\.ChangeEvent<HTMLInputElement>\) => \{[\s\S]*?\n  \};\n/m, newFileHandler);
fs.writeFileSync('src/components/ConsultationModal.tsx', code);
