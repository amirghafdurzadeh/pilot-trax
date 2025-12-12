import { authentication } from "@/actions/auth";
import { AppSidebar } from "@/components/core/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

type Props = Readonly<{
  children: React.ReactNode;
}>;

export default async function Layout(props: Props) {
  await authentication();
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>{props.children}</SidebarInset>
    </SidebarProvider>
  );
}
