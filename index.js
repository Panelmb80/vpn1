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

  // لیست SNI های مختلف برای تست
  const snis = [
    { name: "Google", host: "play.google.com" },
    { name: "Soft98", host: "soft98.ir" },
    { name: "Irancell", host: "irancell.ir" },
    { name: "Snapp", host: "snapp.ir" },
    { name: "Cloudflare", host: "speed.cloudflare.com" }
  ];

  let configs = "";
  
  // ساخت ۵ کانفیگ متفاوت
  snis.forEach(item => {
    const vless = `vless://${uuid}@${domain}:443?encryption=none&security=tls&type=ws&host=${domain}&path=/&sni=${item.host}#VLESS-${item.name}`;
    configs += vless + "\n";
  });

  return new Response(configs.trim(), {
    headers: { 
      'content-type': 'text/plain; charset=utf-8',
      'subscription-userinfo': `upload=0; download=0; total=107374182400; expire=${expireTimestamp}`
    }
  });
}
