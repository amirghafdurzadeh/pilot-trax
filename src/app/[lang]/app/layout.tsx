import { authentication } from "@/actions/auth";
import { AppSidebar } from "@/components/core/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getDictionary } from "@/lib/dictionaries";
import { getUserRole } from "@/lib/session";

export default async function Layout(props: LayoutProps<"/[lang]/app">) {
  const lang = (await props.params).lang;
  const session = await authentication(lang);
  const role = await getUserRole(session.id);
  const dict = await getDictionary(lang);
  return (
    <SidebarProvider>
      <AppSidebar lang={lang} dict={dict} session={session} role={role} />
      <SidebarInset>{props.children}</SidebarInset>
    </SidebarProvider>
  );
}

