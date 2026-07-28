const fs = require('fs');
let server = fs.readFileSync('server.ts', 'utf8');

// Replace standard 404 logic with 410 Gone for non-existent pages (to help GSC)
server = server.replace(
  `            return res.status(404).set({ "Content-Type": "text/html" }).send(notFoundHtml);`,
  `            return res.status(410).set({ "Content-Type": "text/html" }).send(notFoundHtml);`
);

server = server.replace(
  `          res.status(404).set({ "Content-Type": "text/html" }).end(template);`,
  `          res.status(410).set({ "Content-Type": "text/html" }).end(template);`
);

// For unmapped routes entirely
server = server.replace(
  `        res.status(404).sendFile(indexPath);`,
  `        const notFoundHtml = fs.readFileSync(indexPath, "utf8").replace('</head>', '\\n<meta name="robots" content="noindex" />\\n</head>');
        res.status(410).set({ "Content-Type": "text/html" }).send(notFoundHtml);`
);

fs.writeFileSync('server.ts', server);
