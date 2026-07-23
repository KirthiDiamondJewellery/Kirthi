const fs = require('fs');

let serverTs = fs.readFileSync('server.ts', 'utf8');

// Just to be safe, restore from git? We don't have git.
