import { SidebarTrigger } from "@/components/ui/sidebar";
import { getDictionary } from "@/lib/dictionaries";
import { Locale } from "@/lib/locales";
import { LanguageSwitcher } from "@/components/core/language-switcher";

type Dict = Awaited<ReturnType<typeof getDictionary>>["app"];

type Props = Readonly<{
  children?: React.ReactNode;
  lang: Locale;
  dict: Dict;
}>;

export function AppHeader(props: Props) {
  return (
    <header className="flex w-full h-16 shrink-0 items-center gap-2 border-b px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <SidebarTrigger className="-ml-1" />
      <div className="mr-2 h-4 w-px bg-border" />
      <div className="flex-1 flex items-center">{props.children}</div>
      <div className="flex items-center">
        <LanguageSwitcher lang={props.lang} />
      </div>
    </header>
  );
}
