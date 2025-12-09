export function HeroCard() {
  return (
    <div className="order-first lg:order-last">
      <div className="w-full aspect-4/3 bg-white dark:bg-neutral-800 rounded-3xl shadow-2xl shadow-blue-500/10 flex items-center justify-center p-6">
        <div className="p-6 text-center">
          <h4 className="font-extrabold text-2xl">شبیه‌ساز آزمون</h4>
          <p className="mt-3 text-neutral-600 dark:text-neutral-300 leading-relaxed max-w-sm mx-auto">
            محیطی با توضیح کامل هر سوال + سه سطح ارزیابی — برای یادگیری سریع‌تر
            و مرور هدفمند.
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
  );
}
