import { UserIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

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
  );
}
