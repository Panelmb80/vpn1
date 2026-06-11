addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url);
  if (url.pathname !== "/VIPMidas") {
    return new Response(null, { status: 404 });
  }

  const uuid = "fb3b1c65-9c8f-4ef0-88bc-68cad2e927c2";
  const workerDomain = "vpn1.vpnkey.workers.dev";
  const githubSubUrl = "https://raw.githubusercontent.com/Panelmb80/vpn1/refs/heads/main/config.txt";
  const expireTimestamp = 1783545599;
  const totalBytes = 107374182400;

  const myCleanIps = [
    "8.6.112.5:2506",
    "8.6.112.250:1002",
    "8.6.112.52:8319",
    "8.6.112.163:2408",
    "8.6.112.170:903",
    "8.6.112.126:8742",
    "8.6.112.160:1387"
  ];

  try {
    let content = "";
    try {
      const response = await fetch(githubSubUrl);
      content = await response.text();
    } catch (e) {}

    let warpConfigs = "";
    myCleanIps.forEach((item, index) => {
      const [ip, port] = item.split(':');
      warpConfigs += `vless://${uuid}@${ip}:${port}?encryption=none&security=tls&type=ws&host=${workerDomain}&path=/&sni=${workerDomain}&fp=chrome#Warp-CleanIP-${index + 1}\n`;
    });

    return new Response(content + "\n" + warpConfigs, {
      status: 200,
      headers: {
        'content-type': 'text/plain; charset=utf-8',
        'subscription-userinfo': `upload=0; download=0; total=${totalBytes}; expire=${expireTimestamp}`,
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate'
      }
    });
  } catch (error) {
    return new Response(null, { status: 500 });
  }
}
