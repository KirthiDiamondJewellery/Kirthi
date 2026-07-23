const https = require('https');

https.get('https://api.allorigins.win/get?url=https://akgsma.com/', (res) => {
  let data = '';
  res.on('data', (c) => data += c);
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      const html = json.contents;
      console.log("M22:", html.match(/22K916([^0-9]{1,50})([0-9,]+)/i)?.[0]);
      console.log("M18:", html.match(/18K750([^0-9]{1,50})([0-9,]+)/i)?.[0]);
      console.log(html.substring(html.indexOf('22K916'), html.indexOf('22K916') + 100));
    } catch(e) {
      console.error(e);
    }
  });
});
