import { UserIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export function Header() {
  return (
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
          <h1 className="text-lg font-extrabold tracking-tight">پایلت ترکس</h1>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            منبع اصلی آماده‌سازی آزمون‌های خلبانی و هوانوردی
          </p>
        </div>
      </Link>

      <nav className="flex gap-4 items-center text-sm font-medium">
        <div className="hidden md:flex gap-2 items-center">
          <Button asChild variant="ghost">
            <Link href="#features">ویژگی‌ها</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="#how">روش کار</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="#pricing">پلن‌ها</Link>
          </Button>
          <Button asChild className="shadow-lg">
            <Link href="#contact">شروع رایگان</Link>
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
