// گوش دادن به درخواست‌هایی که به سمت ورکر میاد
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  
  // ۱. تاریخ انقضا: تنظیم شده روی تاریخ ۲۰۲۷/۰۷/۰۸ (تمدید تا سال آینده)
  // اگر خواستید باز هم تمدید کنید، عدد 2027 را تغییر دهید.
  const expireDate = new Date("2027-07-08T23:59:59Z");
  if (new Date() > expireDate) {
    return new Response("Expired", { status: 403 }); // اگر تاریخ بگذره، کانفیگ برای کاربر کار نمیکنه
  }

  // ۲. دریافت کانفیگ‌ها: دانلود مستقیم فایل کانفیگ‌های وارپ از گیت‌هاب شما
  const response = await fetch("https://raw.githubusercontent.com/Panelmb80/vpn1/refs/heads/main/config.txt");
  const content = await response.text();

  // ۳. ارسال خروجی به هیدیفای: نمایش حجم و تاریخ انقضا به کاربر
  return new Response(content, {
    status: 200,
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      // نمایش حجم کل ۱۰۰ گیگابایت (Total) و حجم مصرفی صفر (Download) و تاریخ انقضا به هیدیفای
      'subscription-userinfo': `upload=0; download=0; total=${100 * 1024 * 1024 * 1024}; expire=${Math.floor(expireDate.getTime() / 1000)}`,
      'Cache-Control': 'no-store'
    }
  });
}
