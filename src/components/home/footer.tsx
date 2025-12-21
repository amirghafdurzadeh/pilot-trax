import Link from "next/link";

import { AppBrand } from "@/components/core/app-brand";
import { LanguageSwitcher } from "@/components/core/language-switcher";
import { ThemeSwitcher } from "@/components/core/theme-switcher";
import { Separator } from "@/components/ui/separator";
import { Dictionary } from "@/lib/dictionaries";
import { Locale } from "@/lib/locales";

type Props = {
  lang: Locale;
  dict: Dictionary;
};

export function Footer({ lang, dict }: Props) {
  return (
    <footer className="border-t border-neutral-200 dark:border-neutral-800 mt-20">
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-col items-center md:items-start gap-4">
            <AppBrand
              lang={lang}
              title={dict.home.header.brand.title}
              description={dict.home.header.brand.description}
              imageProps={{
                alt: dict.home.header.brand.alt,
                src: "/logo.svg",
                width: 32,
                height: 32,
              }}
              titleProps={{
                className: "text-md font-bold",
              }}
            />
            <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-sm text-center md:text-start">
              {dict.home.footer.copyright.replace(
                "{year}",
                new Date().getFullYear().toString()
              )}
            </p>
          </div>
          <div className="flex gap-12 text-sm">
            <div className="flex flex-col gap-4">
              <p className="font-semibold text-neutral-800 dark:text-neutral-200">
                {dict.home.footer.nav.pilot_trax}
              </p>
              <Link href="#" className="hover:text-blue-600 transition">
                {dict.home.footer.nav.about_us}
              </Link>
              <Link href="#faq" className="hover:text-blue-600 transition">
                {dict.home.footer.nav.faq}
              </Link>
            </div>
            <div className="flex flex-col gap-4">
              <p className="font-semibold text-neutral-800 dark:text-neutral-200">
                {dict.home.footer.nav.legal}
              </p>
              <Link href="#" className="hover:text-blue-600 transition">
                {dict.home.footer.nav.terms}
              </Link>
              <Link href="#" className="hover:text-blue-600 transition">
                {dict.home.footer.nav.privacy_policy}
              </Link>
            </div>
          </div>
        </div>
        <Separator className="my-8" />
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-neutral-500 dark:text-neutral-500">
            {dict.home.footer.support.text}{" "}
            <Link
              href="https://dibanam.com"
              className="transition text-neutral-700 hover:text-blue-500/80"
            >
              {dict.home.footer.support.name}
            </Link>
          </p>
          <div className="flex items-center gap-2">
            <LanguageSwitcher lang={lang} />
            <ThemeSwitcher dict={dict.app.theme_switcher} />
          </div>
        </div>
      </div>
    </footer>
  );
}