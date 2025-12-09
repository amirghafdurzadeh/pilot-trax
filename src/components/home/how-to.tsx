import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

interface Highlight {
  title: string;
  subtitle: string;
  gradient: string;
}

interface Step {
  icon: React.ComponentType<any>;
  number: number;
  title: string;
  duration: string;
  description: string;
  gradient: string;
}

interface HowToProps {
  highlights: Highlight[];
  steps: Step[];
}

export function HowTo(props: HowToProps) {
  return (
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
              ترکیبی از سوالات واقعی، توضیحات تحلیلی و برنامه مرور شخصی‌سازی‌شده
              برای رسیدن به بیشترین بازدهی در کمترین زمان. هر مرحله طوری طراحی
              شده که یادگیری شما را سیستماتیک و قابل اندازه‌گیری کند.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
              {props.highlights.map((highlight, index) => (
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
              تضمین کیفیت: بروزرسانی مستمر سوالات و پشتیبانی آموزشی برای بهبود
              نمره شما.
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
            {props.steps.map((step) => (
              <StepCard key={step.number} step={step} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

interface HighlightCardProps {
  highlight: Highlight;
}

export function HighlightCard(props: HighlightCardProps) {
  return (
    <div
      className={cn(
        "p-3 rounded-xl bg-linear-to-br text-white shadow-md",
        props.highlight.gradient
      )}
    >
      <div className="text-xs font-semibold">{props.highlight.title}</div>
      <div className="mt-1 text-sm">{props.highlight.subtitle}</div>
    </div>
  );
}

interface StepCardProps {
  step: Step;
}

export function StepCard(props: StepCardProps) {
  const Icon = props.step.icon;
  return (
    <div className="flex flex-col gap-3 items-start p-5 bg-white dark:bg-neutral-800 rounded-2xl shadow hover:shadow-xl transition">
      <div className="flex gap-3 items-center">
        <div
          className={cn(
            "w-12 h-12 rounded-lg flex items-center justify-center bg-linear-to-br text-white text-2xl shrink-0",
            props.step.gradient
          )}
        >
          <Icon className="size-6" />
        </div>
        <div className="flex flex-col items-start gap-0.5">
          <h5 className="text-neutral-700 dark:text-neutral-200 font-bold">
            {props.step.number}. {props.step.title}
          </h5>
          <span className="text-xs text-neutral-500 dark:text-neutral-400">
            ({props.step.duration})
          </span>
        </div>
      </div>
      <div>
        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed text-justify">
          {props.step.description}
        </p>
      </div>
    </div>
  );
}
