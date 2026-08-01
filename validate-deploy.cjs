const http = require('http');
const https = require('https');

const candidateUrl = process.argv[2] || 'http://localhost:3000';
const isHttps = candidateUrl.startsWith('https');
const client = isHttps ? https : http;

async function fetchUrl(path) {
  return new Promise((resolve, reject) => {
    client.get(candidateUrl + path, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data }));
    }).on('error', reject);
  });
}

async function validate() {
  console.log(`Starting validation for ${candidateUrl}`);
  let hasError = false;

  const pathsToTest = [
    '/',
    '/maison',
    '/brides',
    '/shop',
    '/contact',
    '/methodology',
    '/heritage'
  ];

  for (const p of pathsToTest) {
    try {
      const { status, data } = await fetchUrl(p);
      console.log(`[${status}] ${p}`);
      if (status !== 200) {
        console.error(`Error: Path ${p} returned ${status}`);
        hasError = true;
      }
      
      if (data.includes('919847086998')) {
         console.error(`Error: Typo phone number found on ${p}`);
         hasError = true;
      }
      if (data.includes('Closed Sundays') === false && data.includes('Closed on Sundays') === false && data.includes('00:00') === false) {
         console.warn(`Warn: Sunday closure might not be explicit on ${p}`);
      }
    } catch (e) {
      console.error(`Failed to fetch ${p}:`, e.message);
      hasError = true;
    }
  }

  if (hasError) {
    console.error('Validation failed.');
    process.exit(1);
  }
  console.log('Validation passed successfully.');
}

validate();
