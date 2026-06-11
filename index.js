addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const uuid = "fb3b1c65-9c8f-4ef0-88bc-68cad2e927c2";
  const expireDate = new Date("2026-07-08T23:59:59Z");
  const expireTimestamp = Math.floor(expireDate.getTime() / 1000);
  
  if (Math.floor(Date.now() / 1000) > expireTimestamp) {
    return new Response("Subscription Expired", { status: 403 });
  }

  const url = new URL(request.url);
  if (url.pathname !== "/VIPMidas") {
    return new Response(null, { status: 404 });
  }

  const vlessLink = `vless://${uuid}@vpn1.vpnkey.workers.dev:443?encryption=none&security=tls&type=ws&host=vpn1.vpnkey.workers.dev&path=/&sni=vpn1.vpnkey.workers.dev#VIPMidas-VLESS`;

  return new Response(vlessLink, {
    headers: { 
      'content-type': 'text/plain; charset=utf-8',
      'subscription-userinfo': `upload=0; download=0; total=107374182400; expire=${expireTimestamp}`
    }
  });
}
