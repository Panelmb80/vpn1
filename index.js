// ثبت کلاینت برای گوش دادن به درخواست‌های ورودی
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const url = new URL(request.url);
  
  // امنیت: چک کردن اینکه آدرس دقیقا شامل مسیر مخفی شما باشد
  if (url.pathname !== "/VIPMidas") {
    return new Response(null, { status: 404 });
  }

  // آدرس گیت‌هاب که کانفیگ‌ها در آن ذخیره شده‌اند
  const githubSubUrl = "https://raw.githubusercontent.com/Panelmb80/vpn1/refs/heads/main/config.txt";
  
  // تاریخ انقضای اکانت ساب‌سکریپشن
  const expireDate = new Date("2026-07-08T23:59:59Z");
  
  // میزان حجم کل اختصاص داده شده به گیگابایت
  const totalGigabytes = 100;
  
  // تبدیل تاریخ و حجم به بایت و ثانیه برای فهم کلاینت‌ها
  const expireTimestamp = Math.floor(expireDate.getTime() / 1000);
  const nowTimestamp = Math.floor(Date.now() / 1000);
  const totalBytes = totalGigabytes * 1024 * 1024 * 1024;

  // بررسی اینکه آیا اکانت منقضی شده است یا خیر
  if (nowTimestamp > expireTimestamp) {
    return new Response("Subscription Expired", { status: 403 });
  }

  try {
    // دریافت اطلاعات کانفیگ‌ها از ریپازیتوری گیت‌هاب شما
    let response = await fetch(githubSubUrl);
    let content = await response.text();
    let newResponse = new Response(content, response);

    // فرمت‌بندی ساختار حجم و زمان برای نمایش در نوار وضعیت برنامه‌ها
    const userInfoValue = `upload=0; download=0; total=${totalBytes}; expire=${expireTimestamp}`;

    // ست کردن هدرهای نمایش حجم در هیدیفای، نکوباکس و سینگ‌باکس
    newResponse.headers.set('subscription-userinfo', userInfoValue);
    newResponse.headers.set('profile-userinfo', userInfoValue);

    // ست کردن نام ساب‌سکریپشن به صورت بیس۶۴ برای نمایش عبارت VIP Midas 👑
    newResponse.headers.set('profile-title', 'base64:VklQIE1pZGFzIPCfkJE=');
    
    // تنظیم مدت زمان آپدیت خودکار برنامه روی هر ۲۴ ساعت یکبار
    newResponse.headers.set('profile-update-interval', '24');

    // تنظیم نوع محتوا و هدرهای عدم ذخیره کش برای آپدیت آنی تغییرات
    newResponse.headers.set('content-type', 'text/plain; charset=utf-8');
    newResponse.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');

    return newResponse;
  } catch (error) {
    // خطای داخلی سرور در صورت عدم دسترسی یا مشکل در لینک گیت‌هاب
    return new Response(null, { status: 500 });
  }
}
