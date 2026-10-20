const fs = require('fs');
let content = fs.readFileSync('src/components/AdminView.tsx', 'utf8');

content = content.replace(
  /export const FaviconUpload = \(\{.*?\) => \{/,
  "export const FaviconUpload = (props: any) => {"
);

content = content.replace(
  /export const ArrayEditor = \(\{.*?\) => \{/,
  "export const ArrayEditor = (props: any) => {"
);

content = content.replace(
  /export const PaginatedArrayEditor = \(\{.*?\) => \{/,
  "export const PaginatedArrayEditor = (props: any) => {"
);

fs.writeFileSync('src/components/AdminView.tsx', content);
