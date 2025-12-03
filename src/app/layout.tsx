import type { Metadata } from "next";
import { Vazirmatn } from "next/font/google";

import "@/assets/styles/globals.css";
import { Providers } from "@/components/core/providers";

const vazirmatn = Vazirmatn({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["arabic"],
});

export const metadata = {
  title: "پایلت ترکس | آمادگی آزمون‌های خلبانی و هوانوردی",
  description:
    "پایلت ترکس پلتفرمی هوشمند برای آمادگی آزمون‌های خلبانی با توضیح کامل سوالات، مرور هوشمند و برنامه‌ریزی شخصی‌سازی شده.",
  keywords: [
    "آزمون خلبانی",
    "هواپیمایی",
    "بوکلت هوانوردی",
    "تست خلبانی",
    "دیسپچ",
    "آزمون سازمان",
    "Pilot Exam",
    "Flight Training",
  ],
  openGraph: {
    title: "پایلت ترکس | شبیه‌ساز هوشمند آزمون‌های خلبانی",
    description:
      "با شبیه‌ساز پرسش‌های واقعی، مرور رنگی و تحلیل حرفه‌ای سوالات، سریع‌تر برای آزمون‌های خلبانی آماده شوید.",
    url: "https://yourdomain.com",
    siteName: "Pilot Trax",
    locale: "fa_IR",
    type: "website",
  },
  alternates: {
    canonical: "https://yourdomain.com",
  },
};

type Props = Readonly<{
  children: React.ReactNode;
}>;

export default function Layout(props: Props) {
  return (
    <html dir="rtl" lang="fa" suppressHydrationWarning>
      <body className={`${vazirmatn.className}`}>
        <Providers>{props.children}</Providers>
      </body>
    </html>
  );
}
