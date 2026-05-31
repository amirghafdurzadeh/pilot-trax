import { getQuiz, getActiveQuizAttempt } from "@/actions/quizzes";
import { getDictionary } from "@/lib/dictionaries";
import { QuizSession } from "@/components/consumer/quizzes/quiz-session";
import { Locale } from "@/lib/locales";

export default async function Page(
  props: PageProps<"/[lang]/app/quizzes/[quizId]">
) {
  const { lang, quizId } = (await props.params) as {
    lang: string;
    quizId: string;
  };
  const dict = await getDictionary(lang as "fa" | "en");
  const quiz = await getQuiz(quizId);
  const activeAttempt = await getActiveQuizAttempt(quizId);

  if (!quiz) {
    return <div className="p-4">{dict.app.quizzes.quiz_not_found}</div>;
  }

  // Pre-fill quiz fields on the mock attempt if no active attempt exists so the card can show metadata
  const initialAttempt = activeAttempt ? activeAttempt : {
    quiz: {
      title: quiz.title,
      duration: quiz.duration,
      questionCount: quiz.questionCount,
    }
  };

  return (
    <div className="p-4">
      <QuizSession
        quizId={quizId}
        lang={lang as Locale}
        initialAttempt={initialAttempt}
      />
    </div>
  );
}
