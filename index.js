addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  
  const githubSubUrl = "https://raw.githubusercontent.com/Panelmb80/vpn1/refs/heads/main/config.txt"; 

  
  const expireDate = new Date("2026-07-08T23:59:59Z"); 

  
  const totalGigabytes = 50; 

  

  const expireTimestamp = Math.floor(expireDate.getTime() / 1000);
  const totalBytes = totalGigabytes * 1024 * 1024 * 1024;

  try {
    let response = await fetch(githubSubUrl);
    let content = await response.text();

    let newResponse = new Response(content, response);
    
    newResponse.headers.set(
      'subscription-userinfo', 
      upload=0; download=0; total=${totalBytes}; expire=${expireTimestamp}
    );
    
    newResponse.headers.set('content-type', 'text/plain; charset=utf-8');
    newResponse.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');

    return newResponse;

  } catch (error) {
    return new Response("Error", { status: 500 });
  }
}
