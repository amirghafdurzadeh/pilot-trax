import { getCourseOptions } from "@/actions/courses";
import { getLessonsForFilter, getQuestions } from "@/actions/questions";
import QuestionsPageClient from "@/components/admin/client-questions";
import { getDictionary } from "@/lib/dictionaries";

export default async function Page(props: PageProps<"/[lang]/app/questions">) {
  const lang = (await props.params).lang;
  const dict = await getDictionary(lang);
  const [questionsResult, lessons, courses] = await Promise.all([
    getQuestions({}),
    getLessonsForFilter(),
    getCourseOptions(),
  ]);

  return (
    <QuestionsPageClient
      initialQuestions={questionsResult.questions}
      initialNextCursor={questionsResult.nextCursor}
      initialLessons={lessons}
      initialCourses={courses}
      lang={lang}
      dict={dict.app}
    />
  );
}
