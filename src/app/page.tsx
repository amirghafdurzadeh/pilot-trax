import {
  FeatureCard,
  HighlightCard,
  PlanCard,
  StepCard,
  TestimonialCard,
} from "@/components/home";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  BookOpenTextIcon,
  CrosshairIcon,
  UserIcon,
  ZapIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const features = [
  {
    title: "توضیح سوال",
    text: "هر سوال با تحلیل کامل گزینه‌ها و دلایل درست/نادرست بودن آن‌ها همراه است.",
    icon: BookOpenTextIcon,
    gradient: "from-blue-500 to-blue-700",
  },
  {
    title: "ارزیابی شخصی رنگی",
    text: "انتخاب سبز/زرد/قرمز باعث می‌شود سیستم سطح یادگیری شما را بشناسد.",
    icon: CrosshairIcon,
    gradient: "from-blue-500 to-blue-700",
  },
  {
    title: "برنامه مرور هوشمند",
    text: "تمرکز بر سوالات بحرانی برای صرفه‌جویی در زمان و افزایش شانس قبولی.",
    icon: ZapIcon,
    gradient: "from-blue-500 to-blue-700",
  },
];

const steps = [
  {
    icon: BookOpenTextIcon,
    number: 1,
    title: "شبیه‌ساز با سوالات واقعی",
    duration: "۵–۱۵ دقیقه",
    description:
      "تست‌زدن در محیطی شبیه آزمون اصلی با توضیحات مرحله‌به‌مرحله برای هر گزینه تا فهم دقیق‌تر مفاهیم.",
    gradient: "from-blue-500 to-blue-700",
  },
  {
    icon: CrosshairIcon,
    number: 2,
    title: "ارزیابی رنگی شخصی",
    duration: "سبز/زرد/قرمز",
    description:
      "با تگ‌گذاری ساده، سیستم نقاط قوت و ضعف را شناسایی می‌کند و خروجی بصری برای تمرکز روی مباحث حساس ارائه می‌دهد.",
    gradient: "from-emerald-500 to-emerald-400",
  },
  {
    icon: ZapIcon,
    number: 3,
    title: "برنامه مرور هوشمند",
    duration: "هفته‌ای با تمرکز پویا",
    description:
      "الگوریتم ما با توجه به ارزیابی شما، جلسات مرور اولویت‌بندی‌شده می‌سازد تا بیشترین پیشرفت در کوتاه‌ترین زمان حاصل شود.",
    gradient: "from-amber-500 to-amber-400",
  },
  {
    icon: UserIcon,
    number: 4,
    title: "دنبال‌کردن پیشرفت و گزارش‌ها",
    duration: "آنالیز و پیشنهاد",
    description:
      "گزارش‌های تحلیلی، نمودار پیشرفت و پیشنهاد‌های عملی به شما نشان می‌دهند کجا بیشترین زمان را قرار دهید تا نتیجه قطعی حاصل شود.",
    gradient: "from-indigo-600 to-indigo-400",
  },
];

const highlights = [
  {
    title: "سوالات واقعی",
    subtitle: "بوکلت‌های امتحانی",
    gradient: "from-blue-600 to-blue-500",
  },
  {
    title: "تحلیل دقیق",
    subtitle: "دلایل درست/نادرست",
    gradient: "from-emerald-500 to-emerald-400",
  },
  {
    title: "مرور هوشمند",
    subtitle: "برنامه هدفمند",
    gradient: "from-amber-500 to-amber-400",
  },
];

const plans = [
  {
    title: "رایگان",
    description:
      "مناسب برای مبتدیان و کسانی که می‌خواهند با پلتفرم آشنا شوند. امکانات پایه برای ارزیابی اولیه و تست آشنایی.",
    features: [
      "دسترسی محدود به سوالات منتخب",
      "شبیه‌ساز تست (نسخه دمو)",
      "مشاهده نمونه توضیحات برای چند سوال",
      "پروفایل و ذخیره پیشرفت پایه",
    ],
    price: "رایگان",
    priceLabel: "بدون هزینه",
    buttonText: "شروع رایگان",
    buttonVariant: "primary" as const,
    featured: false,
  },
  {
    title: "استاندارد",
    description:
      "مناسب برای دانشجویانی که نیاز به دسترسی کامل به بانک سوال و مرور هوشمند دارند. تعادل قیمت و امکانات برای مطالعه جدی.",
    features: [
      "دسترسی کامل به بانک سوالات",
      "توضیحات نامحدود برای سوالات",
      "برنامه مرور هوشمند",
      "گزارش‌گیری پایه از عملکرد",
      "اولویت پشتیبانی معمولی",
    ],
    price: "۴۹,۰۰۰ تومان",
    priceLabel: "در ماه",
    buttonText: "خرید استاندارد",
    buttonVariant: "secondary" as const,
    featured: true,
  },
  {
    title: "حرفه‌ای",
    description:
      "مناسب برای حرفه‌ای‌ها و مراکزی که نیاز به گزارش‌های پیشرفته، دوره‌های آفلاین و پشتیبانی اولویت‌دار دارند.",
    features: [
      "همه امکانات استاندارد + امکانات پیشرفته",
      "گزارش‌گیری تحلیلی و خروجی گزارش",
      "دوره‌ها و جزوات آفلاین برای دانلود",
      "اولویت پشتیبانی و راهنمایی اختصاصی",
    ],
    price: "۱۹۹,۰۰۰ تومان",
    priceLabel: "در ماه",
    buttonText: "به زودی",
    buttonVariant: "disabled" as const,
    featured: false,
  },
];

const faqs = [
  {
    question: "آیا سوالات واقعی و بروز هستند؟",
    answer:
      "بله، سوالات از بوکلت‌های واقعی جمع‌آوری شده و به‌طور مداوم بروزرسانی می‌شوند.",
  },
  {
    question: "چطور مرور هوشمند کار می‌کند؟",
    answer:
      "با انتخاب وضعیت سبز/زرد/قرمز، سیستم برنامه مرور مخصوص شما را می‌سازد تا روی نقاط ضعف تمرکز کنید.",
  },
  {
    question: "آیا امکان تست رایگان وجود دارد؟",
    answer:
      "بله، پس از ثبت‌نام یک تست رایگان برای آشنایی با عملکرد پلتفرم دریافت می‌کنید.",
  },
  {
    question: "آیا می‌توانم پیشرفتم را پیگیری کنم؟",
    answer:
      "بله، گزارش‌های تفصیلی و نمودارهای پیشرفت به شما کمک می‌کند تا عملکرد خود را بررسی کنید.",
  },
  {
    question: "چه پشتیبانی آموزشی وجود دارد؟",
    answer:
      "تیم پشتیبانی ما آماده پاسخ به سؤالات و راهنمایی برای بهتر استفاده از پلتفرم است.",
  },
  {
    question: "آیا برای مهاجر‌ها مناسب است؟",
    answer: "بله، منبع‌های ما برای هم داخل کشور و هم مهاجرین طراحی شده است.",
  },
  {
    question: "آیا می‌توانم اشتراک را لغو کنم؟",
    answer:
      "بله، می‌توانید هر زمان اشتراک خود را لغو کنید بدون هیچ پنالتی اضافی.",
  },
  {
    question: "چقدر زمان برای نتیجه گیری نیاز است؟",
    answer:
      "به میزان تلاش و سطح اولیه شما بستگی دارد، اما بیشتر دانشجویان در ۲-۳ ماه نتایج قابل‌توجهی می‌بینند.",
  },
];

const testimonials = [
  {
    name: "رضا .م",
    role: "دانشجوی خلبانی",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    testimonial:
      "«با پایلت ترکس تونستم ظرف دو ماه برای آزمون سازمان آماده بشم. توضیح سوالات عالی بود و هر گزینه به تفصیل توضیح داده شده بود.»",
    rating: 5,
  },
  {
    name: "سارا .ک",
    role: "دانشجوی دیسپچ",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    testimonial:
      "«سیستم مرور رنگی دقیقاً چیزی بود که لازم داشتم. باعث شد سریع نقاط ضعفم رو پیدا کنم و فقط روی مباحث حساس تمرکز کنم.»",
    rating: 5,
  },
  {
    name: "آرین .د",
    role: "مهندسی هوافضا",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
    testimonial:
      "«بانک سوالات کامل و واقعی بود. تجربه تست‌زدن دقیقاً مثل آزمون اصلی بود و من با اعتماد به امتحان رفتم.»",
    rating: 5,
  },
];

export default function Page() {
  return (
    <main className="w-full">
      <div className="mx-auto min-h-screen">
        {/* Header */}
        <header className="max-w-7xl mx-auto px-6 md:px-8 py-6 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-4">
            <Image
              alt="Pilot Trax - پایلت ترکس"
              src="/logo.svg"
              width={48}
              height={48}
              className="w-12 h-12 drop-shadow-xl drop-shadow-blue-600/30"
            />
            <div>
              <h1 className="text-lg font-extrabold tracking-tight">
                پایلت ترکس
              </h1>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                منبع اصلی آماده‌سازی آزمون‌های خلبانی و هوانوردی
              </p>
            </div>
          </Link>

          <nav className="flex gap-4 items-center text-sm font-medium">
            <div className="hidden md:flex gap-6 items-center">
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
                className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow"
              >
                شروع رایگان
              </Link>
            </div>
            <Link
              href="/login"
              className="p-2 text-white border-white hover:text-blue-600 hover:border-blue-600 border rounded-full transition shadow-lg shadow-blue-600/30"
            >
              <UserIcon className="size-5" />
            </Link>
          </nav>
        </header>

        {/* Hero */}
        <section className="max-w-7xl mx-auto px-6 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center pt-12 pb-12">
          <div>
            <h2 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight">
              آماده‌سازی آزمون‌های خلبانی با
              <br />
              <span className="text-blue-600">رویکردی هوشمندانه و هدفمند</span>
            </h2>

            <p className="mt-6 text-neutral-600 dark:text-neutral-300 text-lg leading-relaxed max-w-xl">
              سوالات واقعی بوکلت‌ها را با <strong>توضیح دقیق</strong>،
              <strong> ارزیابی شخصی</strong> و
              <strong> برنامه‌ریزی مرور هوشمند </strong> تجربه کنید. همه‌چیز
              برای قبولی حتمی در آزمون‌های مدرسه و سازمان در یک پلتفرم.
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
        <section id="features" className="max-w-7xl mx-auto px-6 md:px-8 mt-12">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold">
              ویژگی‌های منحصر به فرد
            </h2>
            <p className="mt-2 text-neutral-600 dark:text-neutral-300">
              تجربه یادگیری بهتر با ابزارهای هوشمند و طراحی مدرن
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <FeatureCard key={index} feature={feature} />
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section
          id="how"
          className="mt-24 px-6 md:px-8 max-w-7xl mx-auto text-neutral-900"
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Left: Visual / Highlight */}
            <div className="flex flex-col gap-12">
              <article className="p-8 rounded-3xl bg-linear-to-br from-white/70 to-neutral-50 dark:from-neutral-900/60 dark:to-neutral-950/60 border border-neutral-100 dark:border-neutral-800 shadow-xl">
                <h3 className="text-neutral-900 dark:text-neutral-200 text-2xl md:text-3xl font-extrabold mb-4">
                  پایلت ترکس چگونه کار می‌کند؟ — سریع، هوشمند و هدفمند
                </h3>
                <p className="text-neutral-600 dark:text-neutral-300 mb-6 leading-relaxed">
                  ترکیبی از سوالات واقعی، توضیحات تحلیلی و برنامه مرور
                  شخصی‌سازی‌شده برای رسیدن به بیشترین بازدهی در کمترین زمان. هر
                  مرحله طوری طراحی شده که یادگیری شما را سیستماتیک و قابل
                  اندازه‌گیری کند.
                </p>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                  {highlights.map((highlight, index) => (
                    <HighlightCard key={index} highlight={highlight} />
                  ))}
                </div>

                <div className="mt-6 flex items-center gap-4">
                  <Link
                    href="#contact"
                    className="px-5 py-3 bg-blue-600 text-white rounded-lg font-semibold shadow-lg"
                  >
                    شروع رایگان
                  </Link>
                  <Link
                    href="#pricing"
                    className="px-5 py-3 text-sm border border-neutral-300 dark:border-neutral-600 rounded-lg text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition"
                  >
                    مشاهده پلن‌ها
                  </Link>
                </div>

                <p className="mt-4 text-xs text-neutral-500 dark:text-neutral-400">
                  تضمین کیفیت: بروزرسانی مستمر سوالات و پشتیبانی آموزشی برای
                  بهبود نمره شما.
                </p>
              </article>
              <Image
                alt="Pilot Trax - پایلت ترکس"
                src="/logo-full.svg"
                width={500}
                height={300}
                className="mx-auto w-64 lg:w-96 drop-shadow-xl drop-shadow-blue-600/30"
              />
            </div>

            {/* Right: Steps */}
            <div className="space-y-4">
              <article className="p-6 bg-linear-to-br from-amber-600 to-amber-400 rounded-2xl shadow-lg text-white">
                <h4 className="font-extrabold text-lg">مراحل سریع و واضح</h4>
                <p className="mt-2 text-sm opacity-95">
                  هر قدم همراه با نکات عملی و انتظارات زمانی تا رسیدن به هدف.
                </p>
              </article>

              <div className="grid gap-4">
                {steps.map((step) => (
                  <StepCard key={step.number} {...step} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="max-w-7xl mx-auto px-6 md:px-8 mt-20">
          <h3 className="text-3xl font-extrabold">پلن‌ها</h3>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {plans.map((plan, index) => (
              <PlanCard key={index} {...plan} />
            ))}
          </div>
        </section>

        {/* Testimonials */}
        <section
          id="testimonials"
          className="max-w-7xl mx-auto px-6 md:px-8 mt-20"
        >
          <h3 className="text-3xl font-extrabold mb-8">اعتماد دانشجویان</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} testimonial={testimonial} />
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="max-w-7xl mx-auto px-6 md:px-8 mt-20">
          <h3 className="text-3xl font-extrabold mb-8">سوالات متداول</h3>
          <Accordion type="single" collapsible>
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={"item-" + index}>
                <AccordionTrigger>
                  <h4 className="font-bold text-lg">{faq.question}</h4>
                </AccordionTrigger>
                <AccordionContent>
                  <p className="mt-2 text-neutral-600 dark:text-neutral-300 text-sm">
                    {faq.answer}
                  </p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
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
            <div className="mt-4 flex gap-3">
              <Link
                href="#contact"
                className="px-4 py-2 bg-blue-600 text-white rounded-md whitespace-nowrap"
              >
                شروع رایگان
              </Link>
              <input
                type="tel"
                placeholder="09123456789"
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>
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
              <Link href="#faq" className="hover:text-blue-600 transition">
                سوالات متداول
              </Link>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
