addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const domain = "vpn1.vpnkey.workers.dev";
  const uuid = "fb3b1c65-9c8f-4ef0-88bc-68cad2e927c2";
  const expireTimestamp = 1783545599; 
  
  const url = new URL(request.url);
  if (url.pathname !== "/VIPMidas") {
    return new Response(null, { status: 404 });
  }

  // 1. VLESS Standard
  const vless1 = `vless://${uuid}@${domain}:443?encryption=none&security=tls&type=ws&host=${domain}&path=/&sni=${domain}#VLESS-Standard`;
  
  // 2. VLESS with Google SNI
  const vless2 = `vless://${uuid}@${domain}:443?encryption=none&security=tls&type=ws&host=${domain}&path=/&sni=play.google.com#VLESS-Google-SNI`;
  
  // 3. VMESS WS
  const vmessObj = { v: "2", ps: "VMESS-WS", add: domain, port: 443, id: uuid, aid: "0", net: "ws", type: "none", host: domain, path: "/", tls: "tls", sni: domain };
  const vmess = `vmess://${btoa(JSON.stringify(vmessObj))}`;

  const result = `${vless1}\n${vless2}\n${vmess}`;

  return new Response(result, {
    headers: { 
      'content-type': 'text/plain; charset=utf-8',
      'subscription-userinfo': `upload=0; download=0; total=107374182400; expire=${expireTimestamp}`
    }
  });
}
