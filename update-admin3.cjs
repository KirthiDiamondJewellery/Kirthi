const fs = require('fs');
let code = fs.readFileSync('src/components/AdminView.tsx', 'utf8');

code = code.replace(/} catch\(err\) \{\n\s*alert\("Error processing image\."\);\n\s*\}/g, `} catch(err: any) {\n      alert(err.message || "Error processing image.");\n    }`);
code = code.replace(/} catch\(err\) \{\n\s*alert\("Error processing images\."\);\n\s*\}/g, `} catch(err: any) {\n      alert(err.message || "Error processing images.");\n    }`);
fs.writeFileSync('src/components/AdminView.tsx', code);
