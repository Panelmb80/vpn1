// شروع پردازش درخواست
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url);
  
  // بررسی مسیر (فقط اگر آدرس VIPMidas باشد)
  if (url.pathname !== "/VIPMidas") {
    return new Response(null, { status: 404 });
  }

  // تنظیمات پایه
  const githubSubUrl = "https://raw.githubusercontent.com/Panelmb80/vpn1/refs/heads/main/config.txt";
  const expireDate = new Date("2026-07-08T23:59:59Z"); // تاریخ انقضا
  const totalGigabytes = 100; // حجم کل به گیگ
  
  const expireTimestamp = Math.floor(expireDate.getTime() / 1000); // تبدیل تاریخ به فرمت عددی
  const nowTimestamp = Math.floor(Date.now() / 1000); // زمان حال
  const totalBytes = totalGigabytes * 1024 * 1024 * 1024; // محاسبه حجم به بایت

  // بررسی اعتبار تاریخ انقضا
  if (nowTimestamp > expireTimestamp) {
    return new Response("Subscription Expired", { status: 403 });
  }

  try {
    // دریافت کانفیگ‌ها از گیت‌هاب
    let response = await fetch(githubSubUrl);
    let content = await response.text();
    
    // بازگرداندن پاسخ نهایی با هدرهای کنترلی
    return new Response(content, {
      status: 200,
      headers: {
        'content-type': 'text/plain; charset=utf-8',
        'subscription-userinfo': `upload=0; download=30; total=${totalBytes}; expire=${expireTimestamp}`, // هدر نمایش حجم و تاریخ در برنامه
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate' // جلوگیری از کش شدن فایل
      }
    });
  } catch (error) {
    // در صورت بروز خطا در دریافت از گیت‌هاب
    return new Response(null, { status: 500 });
  }
}
