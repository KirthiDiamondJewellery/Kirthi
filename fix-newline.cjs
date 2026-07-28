const fs = require('fs');
let fileContent = fs.readFileSync('src/components/BridesShowcase.tsx', 'utf8');
fileContent = fileContent.replace("import React, { useState, useEffect } from 'react';\\nimport { Link } from 'react-router-dom';\\n// { useState, useEffect } from 'react';", "import React, { useState, useEffect } from 'react';\nimport { Link } from 'react-router-dom';");
fs.writeFileSync('src/components/BridesShowcase.tsx', fileContent);
