import { getLessonsForFilter, getQuestions } from "@/actions/questions";
import QuestionsPageClient from "@/components/admin/client-questions";
import { getDictionary } from "@/lib/dictionaries";
import { Locale } from "@/lib/locales";

export default async function QuestionsPage(
  props: PageProps<"/[lang]/app/questions">
) {
  const lang = (await props.params).lang as Locale;
  const dict = await getDictionary(lang);
  const [questionsResult, lessons] = await Promise.all([
    getQuestions({}),
    getLessonsForFilter(),
  ]);

  return (
    <QuestionsPageClient
      initialQuestions={questionsResult.questions}
      initialNextCursor={questionsResult.nextCursor}
      initialLessons={lessons}
      lang={lang}
      dict={dict.app}
    />
  );
}
