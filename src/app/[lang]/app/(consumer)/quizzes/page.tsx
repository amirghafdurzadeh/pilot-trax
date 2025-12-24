import { getQuizzes } from "@/actions/quizzes";
import { ClientQuizzes } from "@/components/consumer/quizzes/client-quizzes";
import { getDictionary } from "@/lib/dictionaries";

export default async function Page(props: PageProps<"/[lang]/app/quizzes">) {
  const lang = (await props.params).lang;
  const dict = await getDictionary(lang);
  const quizzes = await getQuizzes();

  return <ClientQuizzes lang={lang} quizzes={quizzes} dict={dict} />;
}
