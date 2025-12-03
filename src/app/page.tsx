import { BookOpenTextIcon, CompassIcon, CrosshairIcon } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="w-full bg-linear-to-b from-white to-neutral-50 dark:from-neutral-900 dark:to-neutral-950">
      <div className="mx-auto min-h-screen">
        {/* Header */}
        <header className="max-w-7xl mx-auto px-6 md:px-8 py-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-extrabold shadow-xl shadow-blue-500/30">
              PT
            </div>
            <div>
              <h1 className="text-lg font-extrabold tracking-tight">
                پایلت ترکس
              </h1>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                منبع اصلی آماده‌سازی آزمون‌های خلبانی و هوانوردی
              </p>
            </div>
          </div>

          <nav className="hidden md:flex gap-6 items-center text-sm font-medium">
            <Link href="#features" className="hover:text-blue-600 transition">
              ویژگی‌ها
            </Link>
            <Link href="#how" className="hover:text-blue-600 transition">
              روش کار
            </Link>
            <Link href="#pricing" className="hover:text-blue-600 transition">
              پلن‌ها
            </Link>
            <Link
              href="#contact"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:opacity-95 transition"
            >
              شروع رایگان
            </Link>
          </nav>
        </header>

        {/* Hero */}
        <section className="max-w-7xl mx-auto px-6 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center pt-12 pb-20">
          <div>
            <h2 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight">
              آماده‌سازی آزمون‌های خلبانی با
              <br />
              <span className="text-blue-600">
                {" "}
                رویکردی هوشمندانه و هدفمند{" "}
              </span>
            </h2>

            <p className="mt-6 text-neutral-600 dark:text-neutral-300 text-lg leading-relaxed max-w-xl">
              سوالات واقعی بوکلت‌ها را با <strong>توضیح دقیق</strong>،
              <strong> ارزیابی شخصی</strong> و{" "}
              <strong> برنامه‌ریزی مرور هوشمند </strong> تجربه کنید. همه‌چیز
              برای قبولی حتمی در آزمون‌های مدرسه و سازمان در یک پلتفرم.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link
                href="#signup"
                className="px-8 py-3 bg-blue-600 text-white rounded-xl text-lg font-semibold shadow-lg hover:scale-105 transition-transform"
              >
                شروع رایگان
              </Link>
              <Link
                href="#how"
                className="px-8 py-3 border border-neutral-300 dark:border-neutral-600 rounded-xl text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
              >
                مشاهده دموی محصول
              </Link>
            </div>

            <p className="mt-5 text-xs text-neutral-400">
              مناسب برای خلبانان داخل کشور و مهاجر.
            </p>
          </div>

          {/* Hero Card */}
          <div className="order-first lg:order-last">
            <div className="w-full aspect-4/3 bg-white dark:bg-neutral-800 rounded-3xl shadow-2xl shadow-blue-500/10 flex items-center justify-center p-6">
              <div className="p-6 text-center">
                <h4 className="font-extrabold text-2xl">شبیه‌ساز آزمون</h4>
                <p className="mt-3 text-neutral-600 dark:text-neutral-300 leading-relaxed max-w-sm mx-auto">
                  محیطی با توضیح کامل هر سوال + سه سطح ارزیابی — برای یادگیری
                  سریع‌تر و مرور هدفمند.
                </p>

                <div className="mt-6 inline-flex gap-3">
                  <span className="px-3 py-1 rounded-full text-green-800 border border-green-800 text-xs">
                    سبز
                  </span>
                  <span className="px-3 py-1 rounded-full text-yellow-800 border border-yellow-800 text-xs">
                    زرد
                  </span>
                  <span className="px-3 py-1 rounded-full text-red-800 border border-red-800 text-xs">
                    قرمز
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section
          id="features"
          className="max-w-7xl mx-auto px-6 md:px-8 mt-10 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {[
            {
              title: "توضیح سوال",
              text: "هر سوال با تحلیل کامل گزینه‌ها و دلایل درست/نادرست بودن آن‌ها همراه است.",
            },
            {
              title: "ارزیابی شخصی رنگی",
              text: "انتخاب سبز/زرد/قرمز باعث می‌شود سیستم سطح یادگیری شما را بشناسد.",
            },
            {
              title: "برنامه مرور هوشمند",
              text: "تمرکز بر سوالات بحرانی برای صرفه‌جویی در زمان و افزایش شانس قبولی.",
            },
          ].map((f, i) => (
            <article
              key={i}
              className="p-6 bg-white dark:bg-neutral-800 rounded-2xl shadow hover:shadow-xl transition"
            >
              <h3 className="font-bold text-lg">{f.title}</h3>
              <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
                {f.text}
              </p>
            </article>
          ))}
        </section>

        {/* How It Works */}
        <section
          id="how"
          className="mt-20 px-6 md:px-8 max-w-7xl mx-auto text-neutral-900"
        >
          <article className="p-6 bg-linear-to-r from-amber-600 to-amber-400 rounded-2xl">
            <h3 className="text-2xl font-extrabold">
              پایلت ترکس چگونه کار می‌کند؟
            </h3>
            <ol className="md:ms-8 ms-5 mt-6 space-y-4 list-decimal text-base font-medium">
              <li>دوره و آزمون مورد نظر خود را انتخاب کنید.</li>
              <li>برای هر سوال، توضیح یا وضعیت رنگی را ثبت کنید.</li>
              <li>
                سیستم، برنامه مرور هوشمند و کارنامه شخصی شما را تولید می‌کند.
              </li>
            </ol>
          </article>
        </section>

        {/* Pricing */}
        <section id="pricing" className="max-w-7xl mx-auto px-6 md:px-8 mt-20">
          <h3 className="text-3xl font-extrabold">پلن‌ها</h3>

          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {/* Free */}
            <div className="p-6 bg-white dark:bg-neutral-800 rounded-2xl shadow">
              <h4 className="font-bold text-xl">رایگان</h4>
              <p className="mt-2 text-neutral-600 dark:text-neutral-300 text-sm leading-relaxed">
                دسترسی محدود به سوالات + امکان تست و مشاهده چند توضیح.
              </p>
            </div>

            {/* Standard */}
            <div className="p-6 bg-blue-600 text-white rounded-2xl shadow-xl">
              <h4 className="font-bold text-xl">استاندارد</h4>
              <p className="mt-2 opacity-90 text-sm leading-relaxed">
                دسترسی کامل به بانک سوال + توضیحات نامحدود + مرور هوشمند.
              </p>
            </div>

            {/* Pro */}
            <div className="p-6 bg-white dark:bg-neutral-800 rounded-2xl shadow">
              <h4 className="font-bold text-xl">حرفه‌ای</h4>
              <p className="mt-2 text-neutral-600 dark:text-neutral-300 text-sm leading-relaxed">
                امکانات پیشرفته + گزارش‌گیری + دوره‌های آفلاین و جزوات.
              </p>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section
          id="testimonials"
          className="max-w-7xl mx-auto px-6 md:px-8 mt-20"
        >
          <h3 className="text-3xl font-extrabold mb-8">اعتماد دانشجویان</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 bg-white dark:bg-neutral-800 rounded-2xl shadow hover:shadow-xl transition">
              <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
                «با پایلت ترکس تونستم ظرف دو ماه برای آزمون سازمان آماده بشم.
                توضیح سوالات عالی بود.»
              </p>
              <h4 className="mt-4 font-bold">— رضا .م، دانشجوی خلبانی</h4>
            </div>
            <div className="p-6 bg-white dark:bg-neutral-800 rounded-2xl shadow hover:shadow-xl transition">
              <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
                «سیستم مرور رنگی دقیقاً چیزی بود که لازم داشتم. باعث شد سریع
                نقاط ضعفم رو پیدا کنم.»
              </p>
              <h4 className="mt-4 font-bold">— سارا .ک، دانشجوی دیسپچ</h4>
            </div>
            <div className="p-6 bg-white dark:bg-neutral-800 rounded-2xl shadow hover:shadow-xl transition">
              <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
                «بانک سوالات کامل و واقعی بود. تجربه تست‌زدن دقیقاً مثل آزمون
                اصلی بود.»
              </p>
              <h4 className="mt-4 font-bold">— آرین .د، مهندسی هوافضا</h4>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="max-w-7xl mx-auto px-6 md:px-8 mt-20">
          <h3 className="text-3xl font-extrabold mb-8">سوالات متداول</h3>
          <div className="space-y-6">
            <div className="p-5 bg-white dark:bg-neutral-800 rounded-xl shadow">
              <h4 className="font-bold text-lg">
                آیا سوالات واقعی و بروز هستند؟
              </h4>
              <p className="mt-2 text-neutral-600 dark:text-neutral-300 text-sm">
                بله، سوالات از بوکلت‌های واقعی جمع‌آوری شده و به‌طور مداوم
                بروزرسانی می‌شوند.
              </p>
            </div>

            <div className="p-5 bg-white dark:bg-neutral-800 rounded-xl shadow">
              <h4 className="font-bold text-lg">
                چطور مرور هوشمند کار می‌کند؟
              </h4>
              <p className="mt-2 text-neutral-600 dark:text-neutral-300 text-sm">
                با انتخاب وضعیت سبز/زرد/قرمز، سیستم برنامه مرور مخصوص شما را
                می‌سازد تا روی نقاط ضعف تمرکز کنید.
              </p>
            </div>

            <div className="p-5 bg-white dark:bg-neutral-800 rounded-xl shadow">
              <h4 className="font-bold text-lg">
                آیا امکان تست رایگان وجود دارد؟
              </h4>
              <p className="mt-2 text-neutral-600 dark:text-neutral-300 text-sm">
                بله، پس از ثبت‌نام یک تست رایگان برای آشنایی با عملکرد پلتفرم
                دریافت می‌کنید.
              </p>
            </div>
          </div>
        </section>

        {/* Contact */}
        <section
          id="contact"
          className="max-w-7xl mx-auto px-6 md:px-8 mt-20 mb-20 grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="p-6 bg-white dark:bg-neutral-800 rounded-2xl shadow">
            <h4 className="font-bold text-xl">می‌خواهید شروع کنید؟</h4>
            <p className="mt-2 text-neutral-600 dark:text-neutral-300">
              همین حالا ثبت‌نام کنید و اولین تست رایگان خود را شروع کنید.
            </p>
            <form className="mt-4 grid gap-3">
              <input
                type="tel"
                placeholder="09123456789"
                className="w-full px-3 py-2 border rounded-md"
              />
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md">
                ثبت‌نام و شروع
              </button>
            </form>
          </div>

          <div className="p-6 bg-white dark:bg-neutral-800 rounded-2xl shadow">
            <h4 className="font-bold text-xl">تماس با ما</h4>
            <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-300">
              ایمیل: support@yourdomain.com
            </p>
            <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300">
              آدرس: تهران
            </p>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-neutral-200 dark:border-neutral-700 py-6 mt-10">
          <div className="max-w-7xl mx-auto px-6 md:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              © {new Date().getFullYear()} Pilot Trax — همه حقوق محفوظ است.
            </p>
            <div className="flex gap-6 text-sm">
              <Link href="#" className="hover:text-blue-600 transition">
                قوانین و مقررات
              </Link>
              <Link href="#" className="hover:text-blue-600 transition">
                سوالات متداول
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
