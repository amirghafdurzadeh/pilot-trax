import { getDictionary } from "@/lib/dictionaries";
import { readSession, getUserRole } from "@/lib/session";
import { getHardestQuestions } from "@/actions/quizzes";
import { ClientWeaknesses } from "@/components/consumer/quizzes/client-weaknesses";
import { Locale } from "@/lib/locales";

export default async function Page(props: PageProps<"/[lang]/app/weaknesses">) {
  const { lang } = await props.params;
  const user = await readSession();
  if (!user) return null;

  const role = await getUserRole(user.id);
  const isPremium =
    role === "admin" || role === "system_user" || role === "premium";
  const dict = await getDictionary(lang as Locale);
  const hardestQuestions = await getHardestQuestions();

  return (
    <ClientWeaknesses
      lang={lang as Locale}
      dict={dict}
      initialQuestions={hardestQuestions}
      isPremium={isPremium}
    />
  );
}
