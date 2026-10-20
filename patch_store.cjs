const fs = require('fs');
let content = fs.readFileSync('src/components/StoreLocatorView.tsx', 'utf8');
content = content.replace(/import React, \{ useState, useEffect, useRef \} from 'react';/, "import React, { useState, useEffect } from 'react';");
content = content.replace(/\(import\.meta as any\)/, "(import.meta as unknown as Record<string, any>)");
content = content.replace(/\(globalThis as any\)/, "(globalThis as unknown as Record<string, any>)");
fs.writeFileSync('src/components/StoreLocatorView.tsx', content);
