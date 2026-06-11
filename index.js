addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const uuid = "fb3b1c65-9c8f-4ef0-88bc-68cad2e927c2";
  const expireTimestamp = 1783545599; 
  const workerDomain = "vpn1.vpnkey.workers.dev";
  
  const url = new URL(request.url);
  if (url.pathname !== "/VIPMidas") {
    return new Response(null, { status: 404 });
  }

  // لیست ۵ پیکربندی متنوع برای عبور از فیلترینگ
  const configs = [
    { name: "VLESS-Google-SNI", addr: workerDomain, port: 443, sni: "play.google.com" },
    { name: "VLESS-Soft98-P8080", addr: "8.6.112.86", port: 8080, sni: "soft98.ir" },
    { name: "VLESS-Snapp-P2096", addr: "8.6.112.252", port: 2096, sni: "snapp.ir" },
    { name: "VLESS-Direct-TLS", addr: workerDomain, port: 443, sni: workerDomain },
    { name: "VMESS-Cloudflare", addr: "8.6.112.95", port: 80, sni: "speed.cloudflare.com" }
  ];

  let result = "";
  configs.forEach(c => {
    if (c.name.includes("VMESS")) {
      const vmessObj = { v: "2", ps: c.name, add: c.addr, port: c.port, id: uuid, aid: "0", net: "ws", type: "none", host: workerDomain, path: "/", tls: "tls", sni: c.sni };
      result += `vmess://${btoa(JSON.stringify(vmessObj))}\n`;
    } else {
      result += `vless://${uuid}@${c.addr}:${c.port}?encryption=none&security=tls&type=ws&host=${workerDomain}&path=/&sni=${c.sni}#${c.name}\n`;
    }
  });

  return new Response(result.trim(), {
    headers: { 
      'content-type': 'text/plain; charset=utf-8',
      'subscription-userinfo': `upload=0; download=0; total=107374182400; expire=${expireTimestamp}`
    }
  });
}
