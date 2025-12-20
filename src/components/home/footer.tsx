import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-neutral-200 dark:border-neutral-700 mt-10">
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
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
      <div className="flex justify-center gap-1 p-2">
        <p className="text-sm text-neutral-500 dark:text-neutral-500">
          مفتخرانه تحت پشتیبانی <Link href="https://dibanam.com" className="transition text-neutral-7 00 hover:text-blue-500/80">دیبانام</Link>
        </p>
      </div>
    </footer>
  );
}
