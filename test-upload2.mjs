import fs from 'fs';

async function test() {
  const form = new FormData();
  const file = new File([fs.readFileSync('public/og-cover.jpg')], 'og-cover.jpg', { type: 'image/jpeg' });
  form.append('file', file);
  
  const res = await fetch('http://localhost:3000/api/upload', {
    method: 'POST',
    body: form
  });
  
  const text = await res.text();
  console.log("Status:", res.status);
  console.log("Response:", text);
}
test();
