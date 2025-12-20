import { getLessonsForFilter, getQuestions } from "@/actions/questions";
import QuestionsPageClient from "@/components/admin/client-questions";

export default async function QuestionsPage(props: PageProps<"/[lang]/app/questions">) {
  const lang = (await props.params).lang;
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
    />
  );
}
