import { UserIcon } from "lucide-react";
import Link from "next/link";

import { AppBrand } from "@/components/core/app-brand";
import { Button } from "@/components/ui/button";

type Props = {
  dict: {
    brand: {
      title: string;
      description: string;
      alt: string;
    };
    nav: {
      features: string;
      how_it_works: string;
      plans: string;
      start_free: string;
    };
  };
};

export function Header({ dict }: Props) {
  return (
    <header className="max-w-7xl mx-auto px-6 md:px-8 py-6 flex items-center justify-between gap-4">
      <AppBrand
        title={dict.brand.title}
        description={dict.brand.description}
        imageProps={{
          alt: dict.brand.alt,
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
            <Link href="#features">{dict.nav.features}</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="#how">{dict.nav.how_it_works}</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="#pricing">{dict.nav.plans}</Link>
          </Button>
          <Button asChild className="shadow-lg">
            <Link href="#contact">{dict.nav.start_free}</Link>
          </Button>
        </div>
        <Button
          asChild
          variant="outline"
          size="icon"
          className="rounded-full shadow-lg shadow-blue-600/30"
        >
          <Link href="/app">
            <UserIcon className="size-5" />
          </Link>
        </Button>
      </nav>
    </header>
  );
}