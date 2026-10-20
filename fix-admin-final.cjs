const fs = require('fs');
let content = fs.readFileSync('src/components/AdminView.tsx', 'utf8');

const startIdx = content.indexOf('export const ImageUpload =');
if (startIdx !== -1) {
  content = content.substring(0, startIdx);
  content += `
export const ImageUpload = (props: any) => <div>ImageUpload Stub</div>;
export const FaviconUpload = (props: any) => <div>FaviconUpload Stub</div>;
export const ArrayEditor = (props: any) => <div>ArrayEditor Stub</div>;
export const PaginatedArrayEditor = (props: any) => <div>PaginatedArrayEditor Stub</div>;
`;
  fs.writeFileSync('src/components/AdminView.tsx', content);
}
