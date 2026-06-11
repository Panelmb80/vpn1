addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url);
  
  if (!url.pathname.includes("VIPMidas")) {
    return new Response("Not Found", { status: 404 });
  }

  const expireDate = new Date("2026-07-08T23:59:59Z");
  if (new Date() > expireDate) {
    return new Response("Expired", { status: 403 });
  }

  let currentUsed = await MY_KV.get("used_bytes") || "0";
  let val = parseInt(currentUsed) + (Math.floor(Math.random() * 101) + 50) * 1024 * 1024;
  await MY_KV.put("used_bytes", val.toString());

  const response = await fetch("https://raw.githubusercontent.com/Panelmb80/vpn1/refs/heads/main/config.txt");
  const content = await response.text();

  return new Response(content, {
    status: 200,
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'subscription-userinfo': `upload=0; download=${val}; total=${100 * 1024 * 1024 * 1024}; expire=${Math.floor(expireDate.getTime() / 1000)}`,
      'Cache-Control': 'no-store'
    }
  });
}
