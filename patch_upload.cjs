const fs = require('fs');
let content = fs.readFileSync('server.ts', 'utf8');

const uploadLogic = `
const uploadDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + '_' + file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_'))
});
const upload = multer({ storage });

app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }
  res.json({ url: '/uploads/' + req.file.filename });
});
app.use('/uploads', express.static(uploadDir));
`;

content = content.replace('app.set("trust proxy", 1);', 'app.set("trust proxy", 1);\n' + uploadLogic);

fs.writeFileSync('server.ts', content);
