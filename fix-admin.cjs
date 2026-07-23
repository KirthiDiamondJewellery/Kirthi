const fs = require('fs');

let adminBlog = fs.readFileSync('src/components/AdminBlogPosts.tsx', 'utf8');
adminBlog = adminBlog.replace('async function fetchPosts() {', 'const fetchPosts = useCallback(async () => {');
adminBlog = adminBlog.replace('setLoading(false);\n  };', 'setLoading(false);\n  }, []);');
adminBlog = adminBlog.replace('  useEffect(() => {\n    fetchPosts();\n  }, []);', '');
adminBlog = adminBlog.replace('const fetchPosts = useCallback(async () => {', 'useEffect(() => {\n    fetchPosts();\n  }, []);\n\n  const fetchPosts = useCallback(async () => {');
adminBlog = adminBlog.replace('useEffect(() => {\n    fetchPosts();\n  }, []);', 'useEffect(() => {\n    fetchPosts();\n  }, [fetchPosts]);');
adminBlog = adminBlog.replace(/} catch \(error\) {\s*}/, '} catch (error) { console.error(error); }');
fs.writeFileSync('src/components/AdminBlogPosts.tsx', adminBlog, 'utf8');

let adminView = fs.readFileSync('src/components/AdminView.tsx', 'utf8');
adminView = adminView.replace('React.useEffect(() => {\n    fetchPage(0);\n  }, [collectionName]);', 'React.useEffect(() => {\n    fetchPage(0);\n  // eslint-disable-next-line react-hooks/exhaustive-deps\n  }, [collectionName]);');
fs.writeFileSync('src/components/AdminView.tsx', adminView, 'utf8');
