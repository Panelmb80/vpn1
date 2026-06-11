addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url);
  
  if (url.pathname !== "/VIPMidas") {
    return new Response(null, { status: 404 });
  }

  const githubSubUrl = "https://raw.githubusercontent.com/Panelmb80/vpn1/refs/heads/main/config.txt";
  const expireDate = new Date("2026-07-08T23:59:59Z");
  const totalGigabytes = 100;
  
  const expireTimestamp = Math.floor(expireDate.getTime() / 1000);
  const nowTimestamp = Math.floor(Date.now() / 1000);
  const totalBytes = totalGigabytes * 1024 * 1024 * 1024;

  if (nowTimestamp > expireTimestamp) {
    return new Response("Subscription Expired", { status: 403 });
  }

  try {
    let response = await fetch(githubSubUrl);
    let content = await response.text();
    
    return new Response(content, {
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
