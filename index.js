// گوش دادن به درخواست‌هایی که به سمت ورکر میاد
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url);
  
  // ۱. بررسی لینک: اگر کلمه VIPMidas توی لینک نباشه، ارور ۴۰۴ میده
  if (!url.pathname.includes("VIPMidas")) {
    return new Response("Not Found", { status: 404 });
  }

  // ۲. تاریخ انقضا: تنظیم شده روی تاریخ ۲۰۲۶/۰۷/۰۸
  const expireDate = new Date("2026-07-08T23:59:59Z");
  if (new Date() > expireDate) {
    return new Response("Expired", { status: 403 });
  }

  // ۳. دریافت کانفیگ‌ها: دانلود مستقیم فایل متنی آی‌پی‌ها از گیت‌هاب شما
  const response = await fetch("https://raw.githubusercontent.com/Panelmb80/vpn1/refs/heads/main/config.txt");
  const content = await response.text();

  // ۴. ارسال خروجی: تحویل کانفیگ‌ها به هیدیفای همراه با مشخصات حجم (بدون KV و حجم تصادفی)
  return new Response(content, {
    status: 200,
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      // در این خط مقدار download روی 0 تنظیم شده و ترافیک کل هم 100 گیگابایته
      'subscription-userinfo': `upload=0; download=0; total=${100 * 1024 * 1024 * 1024}; expire=${Math.floor(expireDate.getTime() / 1000)}`,
      'Cache-Control': 'no-store' // جلوگیری از ذخیره شدن آی‌پی‌های قدیمی در مرورگر یا کلاینت
    }
  });
}
