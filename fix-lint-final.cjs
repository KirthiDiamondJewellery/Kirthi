const fs = require('fs');

let adminBlog = fs.readFileSync('src/components/AdminBlogPosts.tsx', 'utf8');
const useEffectBlock = `  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);`;

adminBlog = adminBlog.replace(useEffectBlock, '');
adminBlog = adminBlog.replace(
  'const fetchPosts = useCallback(async () => {',
  `const fetchPosts = useCallback(async () => {`
);
adminBlog = adminBlog.replace(
  '  const next = async () => {',
  `  useEffect(() => {\n    fetchPosts();\n  }, [fetchPosts]);\n\n  const next = async () => {`
);
adminBlog = adminBlog.replace('} catch (err) {}', '} catch (err) { console.error(err); }');
fs.writeFileSync('src/components/AdminBlogPosts.tsx', adminBlog, 'utf8');

let adminView = fs.readFileSync('src/components/AdminView.tsx', 'utf8');
adminView = adminView.replace(
  'fetchPage(0);',
  '// eslint-disable-next-line react-hooks/set-state-in-effect\n    fetchPage(0);'
);
fs.writeFileSync('src/components/AdminView.tsx', adminView, 'utf8');
