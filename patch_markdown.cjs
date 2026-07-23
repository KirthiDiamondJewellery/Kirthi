const fs = require('fs');
const files = ['src/components/BlogPostView.tsx', 'src/components/PageView.tsx', 'src/components/FAQView.tsx'];

for (const file of files) {
  if (!fs.existsSync(file)) continue;
  let code = fs.readFileSync(file, 'utf8');
  
  if (code.includes('ReactMarkdown')) {
    code = code.replace(/import ReactMarkdown from 'react-markdown';\s*/g, '');
    code = code.replace(/import remarkGfm from 'remark-gfm';\s*/g, '');
    code = code.replace(/import rehypeRaw from 'rehype-raw';\s*/g, '');
    code = code.replace(/import \{ marked \} from 'marked';\s*/g, '');
    code = `import { marked } from 'marked';\n` + code;
    
    // In BlogPostView
    if (file.includes('BlogPostView')) {
      code = code.replace(/<ReactMarkdown[^>]*>[\s\S]*?\{weaveLinks\([^)]+\)\}[\s\S]*?<\/ReactMarkdown>/g, (match) => {
        return `<div dangerouslySetInnerHTML={{ __html: marked.parse(weaveLinks(post.content || '', post.id || '')) as string }} />`;
      });
    }
    
    // In PageView
    if (file.includes('PageView')) {
      code = code.replace(/<ReactMarkdown[^>]*>[\s\S]*?\{page\.content\}[\s\S]*?<\/ReactMarkdown>/g, (match) => {
        return `<div dangerouslySetInnerHTML={{ __html: marked.parse(page.content || '') as string }} />`;
      });
    }

    // In FAQView
    if (file.includes('FAQView')) {
       code = code.replace(/<ReactMarkdown[^>]*>[\s\S]*?\{faq\.answer\}[\s\S]*?<\/ReactMarkdown>/g, (match) => {
        return `<div dangerouslySetInnerHTML={{ __html: marked.parse(faq.answer || '') as string }} />`;
      });
    }

    fs.writeFileSync(file, code);
    console.log('Patched', file);
  }
}
