async function test() {
  const res = await fetch('https://corsproxy.io/?url=https://akgsma.com/');
  const html = await res.text();
  console.log("M22:", html.match(/22K916.*?(\d{3,6})/is)?.[0]);
}
test();
