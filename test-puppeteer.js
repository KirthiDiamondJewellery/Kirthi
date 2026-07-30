import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  
  await page.goto('https://kirthidiamonds.com', { waitUntil: 'networkidle2' });
  const h1 = await page.evaluate(() => document.querySelector('h1')?.innerText);
  console.log('H1:', h1);
  await browser.close();
})();
