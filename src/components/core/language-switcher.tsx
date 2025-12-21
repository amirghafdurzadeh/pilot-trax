"use client";

import { usePathname } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Languages } from "@/components/core/language-icon";
import { Locale, hasLocale } from "@/lib/locales";
import Link from "next/link";
import { useEffect, useState } from "react";

export const LanguageSwitcher = ({ lang }: { lang: Locale }) => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const getLanguageLink = (locale: Locale) => {
    if (!pathname) return "/";
    const segments = pathname.split("/");
    if (hasLocale(segments[1])) {
      segments[1] = locale;
      return segments.join("/");
    }
    return `/${locale}${pathname}`;
  };

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  return (
    <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Languages />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Link href={getLanguageLink("fa")}>فارسی</Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={getLanguageLink("en")}>English</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
