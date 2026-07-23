const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle0' });
  const meta = await page.evaluate(() => {
    return document.querySelector('meta[name="description"]')?.content;
  });
  console.log("META DESC LENGTH:", meta ? meta.length : 0);
  console.log("META DESC:", meta);
  await browser.close();
})();
