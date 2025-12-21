import { UserIcon } from "lucide-react";
import Link from "next/link";

import { AppBrand } from "@/components/core/app-brand";
import { Button } from "@/components/ui/button";
import { Locale } from "@/lib/locales";
import { Dictionary } from "@/lib/dictionaries";

type Props = {
  lang: Locale;
  dict: Dictionary;
};

export function Header({ lang, dict }: Props) {
  return (
    <header className="max-w-7xl mx-auto px-6 md:px-8 py-6 flex items-center justify-between gap-4">
      <AppBrand
        lang={lang}
        title={dict.home.header.brand.title}
        description={dict.home.header.brand.description}
        imageProps={{
          alt: dict.home.header.brand.alt,
          src: "/logo.svg",
          width: 48,
          height: 48,
          className: "w-12 h12",
        }}
        titleProps={{
          className: "text-lg font-extrabold",
        }}
      />
      <nav className="flex gap-4 items-center text-sm font-medium">
        <div className="hidden md:flex gap-2 items-center">
          <Button asChild variant="ghost">
            <Link href="#features">{dict.home.header.nav.features}</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="#how">{dict.home.header.nav.how_it_works}</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="#pricing">{dict.home.header.nav.plans}</Link>
          </Button>
          <Button asChild className="shadow-lg">
            <Link href="#contact">{dict.home.header.nav.start_free}</Link>
          </Button>
        </div>
        <Button
          asChild
          variant="outline"
          size="icon"
          className="rounded-full shadow-lg shadow-blue-600/30"
        >
          <Link href={`/${lang}/app`}>
            <UserIcon className="size-5" />
          </Link>
        </Button>
      </nav>
    </header>
  );
}
