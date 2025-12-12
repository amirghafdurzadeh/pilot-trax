import { SidebarTrigger } from "@/components/ui/sidebar";

type Props = Readonly<{
  children?: React.ReactNode;
}>;

export function AppHeader(props: Props) {
  return (
    <header className="flex w-full h-16 shrink-0 items-center gap-2 border-b px-4 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
      <SidebarTrigger className="-ml-1" />
      <div className="mr-2 h-4 w-px bg-border" />
      <div className="flex-1 flex">{props.children}</div>
    </header>
  );
}
