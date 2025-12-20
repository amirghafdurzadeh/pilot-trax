import Link from "next/link";

type Props = {
  dict: {
    copyright: string;
    nav: {
      terms: string;
      faq: string;
    };
    support: {
      text: string;
      name: string;
    };
  };
};

export function Footer({ dict }: Props) {
  return (
    <footer className="border-t border-neutral-200 dark:border-neutral-700 mt-10">
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          {dict.copyright.replace("{year}", new Date().getFullYear().toString())}
        </p>
        <div className="flex gap-6 text-sm">
          <Link href="#" className="hover:text-blue-600 transition">
            {dict.nav.terms}
          </Link>
          <Link href="#faq" className="hover:text-blue-600 transition">
            {dict.nav.faq}
          </Link>
        </div>
      </div>
      <div className="flex justify-center gap-1 p-2">
        <p className="text-sm text-neutral-500 dark:text-neutral-500">
          {dict.support.text}{" "}
          <Link
            href="https://dibanam.com"
            className="transition text-neutral-700 hover:text-blue-500/80"
          >
            {dict.support.name}
          </Link>
        </p>
      </div>
    </footer>
  );
}