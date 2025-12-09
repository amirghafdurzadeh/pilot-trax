import Link from "next/link";

import { Button } from "@/components/ui/button";

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
        <Button asChild size="xl" className="text-lg font-semibold shadow-lg">
          <Link href="#contact">شروع رایگان</Link>
        </Button>
        <Button
          asChild
          variant="outline"
          size="xl"
          className="text-lg font-normal"
        >
          <Link href="#how">مشاهده دموی محصول</Link>
        </Button>
      </div>

      <p className="mt-5 text-xs text-neutral-400">
        مناسب برای خلبانان داخل کشور و مهاجر.
      </p>
    </div>
  );
}
