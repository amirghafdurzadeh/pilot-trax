import { getQuizzes } from "@/actions/quizzes";
import { ClientQuizzes } from "@/components/consumer/quizzes/client-quizzes";
import { getDictionary } from "@/lib/dictionaries";
import { readSession, getUserRole } from "@/lib/session";

export default async function Page(props: PageProps<"/[lang]/app/quizzes">) {
  const lang = (await props.params).lang;
  const dict = await getDictionary(lang);
  const quizzes = await getQuizzes();
  const user = await readSession();
  const userId = user?.id ?? "";
  const role = user ? await getUserRole(user.id) : null;
  const isAdmin = role === "admin";

  return (
    <ClientQuizzes
      lang={lang}
      quizzes={quizzes}
      dict={dict}
      userId={userId}
      isAdmin={isAdmin}
    />
  );
}

