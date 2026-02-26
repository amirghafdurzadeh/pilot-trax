import { getDictionary } from "@/lib/dictionaries";
import { Locale } from "@/lib/locales";

export default async function ExcelPage(props: PageProps<"/[lang]/app/excel">) {
  const lang = (await props.params).lang as Locale;
  const dict = await getDictionary(lang);
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <h1 className="text-4xl font-bold">Excel I/O</h1>
      <p className="text-lg text-muted-foreground">
        This page is under construction.
      </p>
    </div>
  );
}
