const fs = require('fs');
let content = fs.readFileSync('src/components/AdminView.tsx', 'utf8');

const replacement = `
export const ImageUpload = (props: any) => <div>ImageUpload Stub</div>;
export const FaviconUpload = (props: any) => <div>FaviconUpload Stub</div>;
export const ArrayEditor = (props: any) => <div>ArrayEditor Stub</div>;
export const PaginatedArrayEditor = (props: any) => <div>PaginatedArrayEditor Stub</div>;
`;

const lines = content.split('\\n');
const startIdx = lines.findIndex(l => l.startsWith('export const ImageUpload ='));
if (startIdx !== -1) {
  lines.splice(startIdx, lines.length - startIdx, replacement);
  fs.writeFileSync('src/components/AdminView.tsx', lines.join('\\n'));
}
