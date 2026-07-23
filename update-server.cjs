const fs = require('fs');
let code = fs.readFileSync('server.ts', 'utf8');

const imports = `import multer from "multer";
import sharp from "sharp";
`;
code = imports + code;

const uploadEndpoint = `
  const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });
  
  app.post("/api/upload", upload.single("file"), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      let format = req.file.mimetype === 'image/jpeg' ? 'jpeg' : 'webp';
      let buffer = req.file.buffer;
      const originalExt = req.file.originalname.split('.').pop()?.toLowerCase();
      if (originalExt === 'svg' || req.file.mimetype === 'image/svg+xml') {
        // Keep SVGs as is
        format = 'svg';
      } else {
        const image = sharp(buffer);
        const metadata = await image.metadata();
        const info = await image.resize({
          width: 1200,
          height: 630,
          fit: 'inside',
          withoutEnlargement: true
        }).withMetadata().webp({ quality: 80 }).toBuffer({ resolveWithObject: true });
        
        buffer = info.data;
        format = 'webp';
        
        if (buffer.length > 300 * 1024) {
           return res.status(400).json({ error: "Image too large after compression (> 300KB). Please upload a smaller image." });
        }
      }

      const filename = \`\${Date.now()}_\${Math.random().toString(36).substring(2, 9)}.\${format}\`;
      const publicDir = path.join(process.cwd(), 'public', 'images', 'uploads');
      const distDir = path.join(process.cwd(), 'dist', 'images', 'uploads');
      
      if (!fs.existsSync(publicDir)) fs.mkdirSync(publicDir, { recursive: true });
      if (!fs.existsSync(distDir)) fs.mkdirSync(distDir, { recursive: true });

      fs.writeFileSync(path.join(publicDir, filename), buffer);
      fs.writeFileSync(path.join(distDir, filename), buffer);

      const url = \`https://kirthidiamonds.com/images/uploads/\${filename}\`;
      res.json({ url });
    } catch (e: any) {
      console.error("Upload error:", e);
      res.status(500).json({ error: e.message || "Failed to process image" });
    }
  });
`;

code = code.replace('app.post("/api/verify-payment",', uploadEndpoint + '\n  app.post("/api/verify-payment",');
fs.writeFileSync('server.ts', code);
