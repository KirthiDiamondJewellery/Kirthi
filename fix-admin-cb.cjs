const fs = require('fs');
let adminBlog = fs.readFileSync('src/components/AdminBlogPosts.tsx', 'utf8');
adminBlog = adminBlog.replace("import React, { useState, useEffect } from 'react';", "import React, { useState, useEffect, useCallback } from 'react';");
fs.writeFileSync('src/components/AdminBlogPosts.tsx', adminBlog, 'utf8');
