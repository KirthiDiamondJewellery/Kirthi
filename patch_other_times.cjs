const fs = require('fs');

let pageView = fs.readFileSync('src/components/PageView.tsx', 'utf8');
pageView = pageView.replace(/10:00 AM – 7:30 PM/g, '10:00 AM – 8:00 PM (Sun 10:30 AM - 1:00 PM)');
fs.writeFileSync('src/components/PageView.tsx', pageView);

let storeLocator = fs.readFileSync('src/components/StoreLocatorView.tsx', 'utf8');
storeLocator = storeLocator.replace(/10:00 AM - 7:30 PM/g, '10:00 AM - 8:00 PM (Sun 10:30 AM - 1:00 PM)');
fs.writeFileSync('src/components/StoreLocatorView.tsx', storeLocator);

let sharedFooter = fs.readFileSync('src/components/SharedFooter.tsx', 'utf8');
sharedFooter = sharedFooter.replace(/Mon–Sat 10:00 AM – 7:30 PM<br\/>Closed on Sundays/g, 'Mon–Sat 10:00 AM – 8:00 PM<br/>Sun: 10:30 AM – 1:00 PM');
fs.writeFileSync('src/components/SharedFooter.tsx', sharedFooter);

console.log('Patched hardcoded times');
