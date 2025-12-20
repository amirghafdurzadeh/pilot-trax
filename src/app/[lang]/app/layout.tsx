import { authentication } from "@/actions/auth";
import { AppSidebar } from "@/components/core/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Locale } from "@/lib/dictionaries";

type Props = Readonly<{
  children: React.ReactNode;
}>;

export default async function Layout(props: LayoutProps<"/[lang]/app">) {
  await authentication();
  const lang = (await props.params).lang as Locale;
  return (
    <SidebarProvider>
      <AppSidebar lang={lang} />
      <SidebarInset>{props.children}</SidebarInset>
    </SidebarProvider>
  );
}
