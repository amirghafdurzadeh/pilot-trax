import type { Metadata } from "next";
import { Inter, Vazirmatn } from "next/font/google";

import "@/assets/styles/globals.css";
import { Providers } from "@/components/core/providers";
import { getDictionary, hasLocale, Locale } from "@/lib/dictionaries";

const vazirmatn = Vazirmatn({
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["arabic"],
  display: "swap",
  variable: "--font-vazirmatn",
});

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export async function generateStaticParams() {
  return [{ lang: "en" }, { lang: "fa" }];
}

export async function generateMetadata({
  params,
}: {
  params: { lang: Locale };
}): Promise<Metadata> {
  const lang = params.lang;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);
  return {
    title: dict.home.metadata.title,
    description: dict.home.metadata.description,
    keywords: dict.home.metadata.keywords,
    openGraph: {
      title: dict.home.metadata.openGraph.title,
      description: dict.home.metadata.openGraph.description,
      url: "https://yourdomain.com",
      siteName: "Pilot Trax",
      locale: lang === "fa" ? "fa_IR" : "en_US",
      type: "website",
    },
    alternates: {
      canonical: "https://yourdomain.com",
    },
  };
}

export default async function Layout(props: LayoutProps<"/[lang]">) {
  const lang = (await props.params).lang;
  return (
    <html
      dir={lang === "fa" ? "rtl" : "ltr"}
      lang={lang}
      suppressHydrationWarning
      className={`${vazirmatn.variable} ${inter.variable}`}
    >
      <body>
        <Providers dir={lang === "fa" ? "rtl" : "ltr"}>
          {props.children}
        </Providers>
      </body>
    </html>
  );
}
