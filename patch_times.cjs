const fs = require('fs');
const glob = require('glob');

const files = glob.sync('src/**/*.{ts,tsx}');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;

  // Let's standardise the Calicut phone number
  content = content.replace(/\+91 98470 86002/g, '+91 98470 86002'); // This is correct
  content = content.replace(/\+91 98470 86990/g, '+91 98470 86990'); // This is correct
  // We need to make sure Calicut doesn't use the Kochi phone number accidentally. Let's check for phone number near Calicut.
  // We will do a generic replacement of 7:30pm to 19:00/19:30 where applicable
  
  if (content !== original) {
    fs.writeFileSync(file, content);
  }
});

