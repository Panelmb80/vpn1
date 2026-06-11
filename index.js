addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url);
  if (url.pathname !== "/VIPMidas") {
    return new Response(null, { status: 404 });
  }

  const uuid = "fb3b1c65-9c8f-4ef0-88bc-68cad2e927c2";
  const expireTimestamp = 1783545599; 
  const workerDomain = "vpn1.vpnkey.workers.dev";
  const githubSubUrl = "https://raw.githubusercontent.com/Panelmb80/vpn1/refs/heads/main/config.txt";
  const totalBytes = 107374182400;
  const nowTimestamp = Math.floor(Date.now() / 1000);

  if (nowTimestamp > expireTimestamp) {
    return new Response("Subscription Expired", { status: 403 });
  }

  const cleanIps = ["8.6.112.46", "8.6.112.86", "8.6.112.252"];
  
  try {
    let content = "";
    try {
      const response = await fetch(githubSubUrl);
      content = await response.text();
    } catch (e) {}

    let warpConfigs = "";
    cleanIps.forEach((ip, index) => {
      warpConfigs += `vless://${uuid}@${ip}:443?encryption=none&security=tls&type=ws&host=${workerDomain}&path=/&sni=${workerDomain}#Warp-CleanIP-${index + 1}\n`;
    });

    return new Response(content + "\n" + warpConfigs, {
      status: 200,
      headers: {
        'content-type': 'text/plain; charset=utf-8',
        'subscription-userinfo': `upload=0; download=0; total=${totalBytes}; expire=${expireTimestamp}`,
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate'
      }
