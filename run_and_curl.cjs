const { exec } = require('child_process');

const devServer = exec('npx tsx server.ts');
let errLog = '';
devServer.stderr.on('data', (data) => { errLog += data; });

setTimeout(() => {
  exec('curl -s -v http://localhost:3000/journal/gia-vs-igi-certified-diamonds-which-should-you-choose-when-buying-in-india', (error, stdout, stderr) => {
    console.log('CURL HTTP CODE:', stderr.match(/HTTP\/1\.1 \d{3}/)?.[0]);
    console.log('DEV STDERR:', errLog);
    devServer.kill();
    process.exit(0);
  });
}, 8000);
