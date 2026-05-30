import { getAllUsersAction } from "@/actions/users";
import UsersPageClient from "@/components/admin/client-users";
import { getDictionary } from "@/lib/dictionaries";
import { Locale } from "@/lib/locales";

export default async function Page(props: PageProps<"/[lang]/app/users">) {
  const lang = (await props.params).lang as Locale;
  const dict = await getDictionary(lang);
  const users = await getAllUsersAction();

  return (
    <UsersPageClient
      initialUsers={users as any}
      lang={lang}
      dict={dict}
    />
  );
}
