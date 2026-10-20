const fs = require('fs');
let content = fs.readFileSync('src/components/ContactView.tsx', 'utf8');
content = content.replace(
  /body: JSON\.stringify\(\{\s*name: formData\.name,\s*email: formData\.email,\s*phone: formData\.phone,\s*message: formData\.message\s*\}\)/,
  'body: JSON.stringify(formData)'
);
content = content.replace(
  /setFormData\(\{ name: "", email: "", phone: "", message: "" \}\);/,
  'setFormData({ name: "", phone: "", boutique: "kochi", date: "", message: "" });'
);
fs.writeFileSync('src/components/ContactView.tsx', content);
