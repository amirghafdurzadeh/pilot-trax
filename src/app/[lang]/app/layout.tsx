import { authentication } from "@/actions/auth";
import { AppSidebar } from "@/components/core/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getDictionary } from "@/lib/dictionaries";
import { Locale } from "@/lib/locales";

export default async function Layout(props: LayoutProps<"/[lang]/app">) {
  const lang = (await props.params).lang as Locale;
  await authentication(lang);
  const dict = await getDictionary(lang);
  return (
    <SidebarProvider>
      <AppSidebar lang={lang} dict={dict.app.sidebar} />
      <SidebarInset>{props.children}</SidebarInset>
    </SidebarProvider>
  );
}
