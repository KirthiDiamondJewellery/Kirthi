const fs = require('fs');
let s = fs.readFileSync('cloudbuild.yaml', 'utf8');
const validateLocal = `  - id: pre-validate
    name: node:22-alpine
    entrypoint: sh
    args:
      - -c
      - |
        apk add --no-cache bash
        ./pre-deploy.sh\n`;
s = s.replace(/  - id: push/, validateLocal + '  - id: push');
fs.writeFileSync('cloudbuild.yaml', s);
