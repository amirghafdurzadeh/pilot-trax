import { notFound } from "next/navigation";
import { getDictionary, hasLocale } from "@/lib/dictionaries";

export default async function Page({ params }: PageProps<"/[lang]/test">) {
  const { lang } = await params;

  if (!hasLocale(lang)) notFound();

  const dict = await getDictionary(lang);
  return <button>{dict.test}</button>;
}
