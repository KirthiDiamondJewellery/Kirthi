const fs = require('fs');
const app = fs.readFileSync('src/App.tsx', 'utf8');
const lines = app.split('\n');
for(let i=0; i<lines.length; i++) {
  if (lines[i].includes('sectionId') || lines[i].includes('useParams')) {
    console.log(`${i+1}: ${lines[i]}`);
  }
}
