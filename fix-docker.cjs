const fs = require('fs');
let content = fs.readFileSync('Dockerfile', 'utf8');

content = content.replace(/FROM node:20\.10-alpine AS builder/g, 'FROM node:22-alpine AS builder');
content = content.replace(/FROM node:20\.10-alpine AS runner/g, 'FROM node:22-alpine AS runner');

// Remove unnecessary COPY statements
content = content.replace(/COPY --from=builder --chown=kirthi:nodejs \/app\/server\.ts \.\/server\.ts\n/g, '');
content = content.replace(/COPY --from=builder --chown=kirthi:nodejs \/app\/tsconfig\.json \.\/tsconfig\.json\n/g, '');
content = content.replace(/COPY --from=builder --chown=kirthi:nodejs \/app\/src \.\/src\n/g, '');

// Remove HEALTHCHECK
content = content.replace(/HEALTHCHECK --interval=30s --timeout=5s --start-period=15s --retries=3 \\\n  CMD wget -qO- http:\/\/localhost:\$\{PORT\}\/healthz \|\| exit 1\n/g, '');

// Change CMD
content = content.replace(/CMD \["npx", "tsx", "server\.ts"\]/g, 'CMD ["node", "dist/server.cjs"]');

fs.writeFileSync('Dockerfile', content);
