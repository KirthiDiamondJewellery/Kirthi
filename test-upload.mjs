import fs from 'fs';
import FormData from 'form-data';
import fetch from 'node-fetch';

async function test() {
  const form = new FormData();
  form.append('file', fs.createReadStream('public/og-cover.jpg'));
  
  const res = await fetch('http://localhost:3000/api/upload', {
    method: 'POST',
    body: form
  });
  
  const text = await res.text();
  console.log("Status:", res.status);
  console.log("Response:", text);
}
test();
