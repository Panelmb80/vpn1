addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url);
  if (url.pathname !== "/VIPMidas") return new Response(null, { status: 404 });

  // تاریخ انقضا
  const expireDate = new Date("2026-07-08T23:59:59Z");
  if (new Date() > expireDate) return new Response("Subscription Expired", { status: 403 });

  // خواندن مصرف از KV
  let currentUsed = await MY_KV.get("used_bytes");
  currentUsed = parseInt(currentUsed) || 0;

  // تولید عدد تصادفی بین 50 تا 150 مگابایت
  const minMB = 50;
  const maxMB = 150;
  const randomMB = Math.floor(Math.random() * (maxMB - minMB + 1) + minMB);
  const increment = randomMB * 1024 * 1024; 
  
  // افزایش مصرف و ذخیره
  currentUsed += increment;
  await MY_KV.put("used_bytes", currentUsed.toString());

  const totalBytes = 100 * 1024 * 1024 * 1024; // 100 گیگ

  let response = await fetch("https://raw.githubusercontent.com/Panelmb80/vpn1/refs/heads/main/config.txt");
  let content = await response.text();

  return new Response(content, {
    status: 200,
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'subscription-userinfo': `upload=0; download=${currentUsed}; total=${totalBytes}; expire=${Math.floor(expireDate.getTime() / 1000)}`,
      'Cache-Control': 'no-store'
    }
  });
}
