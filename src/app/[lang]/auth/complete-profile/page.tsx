import { redirect } from "next/navigation";

import { CompleteProfileForm } from "@/components/auth/complete-profile-form";
import { getDictionary } from "@/lib/dictionaries";
import { readSession } from "@/lib/session";

export default async function Page(props: PageProps<"/[lang]/login">) {
  const lang = (await props.params).lang;
  const user = await readSession();
  if (!user) {
    redirect(`/${lang}/auth/login`);
  }

  if (user.firstName && user.lastName) {
    redirect(`/${lang}/app`);
  }

  const dict = await getDictionary(lang);
  return (
    <main className="flex-1 flex p-4 pb-20">
      <CompleteProfileForm lang={lang} dict={dict.complete_profile} />
    </main>
  );
}
