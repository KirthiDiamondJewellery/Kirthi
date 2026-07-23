const fs = require('fs');
let code = fs.readFileSync('src/components/StoreLocatorView.tsx', 'utf8');

// Replace APIProvider tag with one that has an onError prop and state handling
// But wait, it's easier to just do it via sed or manual replace.
