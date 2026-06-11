// شروع پردازش درخواست ورودی
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url);
  
  // محدود کردن دسترسی فقط به مسیر خاص
  if (url.pathname !== "/VIPMidas") {
    return new Response(null, { status: 404 });
  }

  // لینک فایل کانفیگ‌های اصلی شما در گیت‌هاب
  const githubSubUrl = "https://raw.githubusercontent.com/Panelmb80/vpn1/refs/heads/main/config.txt";
  
  // تاریخ انقضای اشتراک
  const expireDate = new Date("2026-07-08T23:59:59Z");
  
  // تعریف حجم کل و حجم مصرف شده به گیگابایت
  const totalGigabytes = 100;
  const usedGigabytes = 30;
  
  // محاسبات تبدیل زمان و حجم به فرمت مورد نیاز سیستم
  const expireTimestamp = Math.floor(expireDate.getTime() / 1000);
  const totalBytes = totalGigabytes * 1024 * 1024 * 1024;
  const usedBytes = usedGigabytes * 1024 * 1024 * 1024;
  
  // بررسی تاریخ انقضا
  const nowTimestamp = Math.floor(Date.now() / 1000);
  if (nowTimestamp > expireTimestamp) {
    return new Response("Subscription Expired", { status: 403 });
  }

  try {
    // دریافت محتوای کانفیگ‌ها از گیت‌هاب
    let response = await fetch(githubSubUrl);
    let content = await response.text();
    
    // ارسال پاسخ نهایی به کلاینت (مثل هیدیفای) با هدرهای اختصاصی
    return new Response(content, {
      status: 200,
      headers: {
        'content-type': 'text/plain; charset=utf-8',
        // تنظیمات نمایش حجم مصرفی و کل در هیدیفای
        'subscription-userinfo': `upload=0; download=${usedBytes}; total=${totalBytes}; expire=${expireTimestamp}`,
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate'
      }
    });
  } catch (error) {
    // بازگرداندن خطای سرور در صورت بروز مشکل
    return new Response(null, { status: 500 });
  }
}
