import Link from "next/link";

export function HeroContent() {
  return (
    <div>
      <h2 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight">
        آماده‌سازی آزمون‌های خلبانی با
        <br />
        <span className="text-blue-600">رویکردی هوشمندانه و هدفمند</span>
      </h2>

      <p className="mt-6 text-neutral-600 dark:text-neutral-300 text-lg leading-relaxed max-w-xl">
        سوالات واقعی بوکلت‌ها را با <strong>توضیح دقیق</strong>،
        <strong> ارزیابی شخصی</strong> و
        <strong> برنامه‌ریزی مرور هوشمند </strong> تجربه کنید. همه‌چیز برای
        قبولی حتمی در آزمون‌های مدرسه و سازمان در یک پلتفرم.
      </p>

      <div className="mt-8 flex flex-col sm:flex-row gap-4">
        <Link
          href="#contact"
          className="px-8 py-3 bg-blue-600 text-white rounded-xl text-lg font-semibold shadow-lg"
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
  );
}
