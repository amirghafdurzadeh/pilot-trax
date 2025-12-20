import { authentication } from "@/actions/auth";
import { AppSidebar } from "@/components/core/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getDictionary, Locale } from "@/lib/dictionaries";

export default async function Layout(props: LayoutProps<"/[lang]/app">) {
  await authentication();
  const lang = (await props.params).lang as Locale;
  const dict = await getDictionary(lang);
  return (
    <SidebarProvider>
      <AppSidebar lang={lang} dict={dict.app.sidebar} />
      <SidebarInset>{props.children}</SidebarInset>
    </SidebarProvider>
  );
}
