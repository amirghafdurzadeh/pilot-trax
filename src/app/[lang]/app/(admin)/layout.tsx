import { authentication } from "@/actions/auth";
import { getUserRole } from "@/lib/session";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

type Props = {
  children: ReactNode;
  params: Promise<{ lang: string }>;
};

export default async function AdminLayout({ children, params }: Props) {
  const { lang } = await params;
  const session = await authentication(lang);
  const role = await getUserRole(session.id);

  if (role !== "admin") {
    redirect(`/${lang}/app`);
  }

  return <>{children}</>;
}
