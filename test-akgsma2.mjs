async function test() {
  try {
    const fetchReq = await fetch("https://akgsma.com/", {
      headers: { "User-Agent": "Mozilla/5.0" }
    });
    const html = await fetchReq.text();
    console.log("Got response length:", html.length);
    const match22 = html.match(/22K916.*?(\d{3,6})/is);
    console.log(match22 ? match22[1] : "not found");
  } catch (e) {
    console.error("fetch failed", e);
  }
}
test();
