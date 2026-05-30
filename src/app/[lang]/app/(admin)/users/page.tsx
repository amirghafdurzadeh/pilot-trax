import { authentication } from "@/actions/auth";
import { getAllUsersAction } from "@/actions/users";
import UsersPageClient from "@/components/admin/client-users";
import { getDictionary } from "@/lib/dictionaries";
import { Locale } from "@/lib/locales";
import { getUserRole } from "@/lib/session";

export default async function Page(props: PageProps<"/[lang]/app/users">) {
  const lang = (await props.params).lang as Locale;
  const dict = await getDictionary(lang);
  const users = await getAllUsersAction();
  const session = await authentication(lang);
  const currentRole = await getUserRole(session.id);

  return (
    <UsersPageClient
      initialUsers={users as any}
      lang={lang}
      dict={dict}
      currentRole={currentRole}
    />
  );
}
