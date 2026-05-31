import { getQuiz, getActiveQuizAttempt, getQuizAttempts, getQuizAttempt } from "@/actions/quizzes";
import { getDictionary } from "@/lib/dictionaries";
import { QuizSession } from "@/components/consumer/quizzes/quiz-session";
import { Locale } from "@/lib/locales";
import { readSession, getUserRole } from "@/lib/session";

export default async function Page(
  props: PageProps<"/[lang]/app/quizzes/[quizId]">
) {
  const { lang, quizId } = await props.params;
  const searchParams = await props.searchParams;
  const attemptId = searchParams.attemptId as string | undefined;

  const user = await readSession();
  const role = user ? await getUserRole(user.id) : null;
  const isPremium = role === "admin" || role === "system_user" || role === "premium";

  const dict = await getDictionary(lang as "fa" | "en");
  const quiz = await getQuiz(quizId);
  const activeAttempt = await getActiveQuizAttempt(quizId);
  const pastAttempts = await getQuizAttempts(quizId);

  let viewingAttempt = activeAttempt;
  if (attemptId) {
    viewingAttempt = await getQuizAttempt(attemptId);
  }

  if (!quiz) {
    return <div className="p-4">{dict.app.quizzes.quiz_not_found}</div>;
  }

  // Pre-fill quiz fields on the mock attempt if no active attempt exists so the card can show metadata
  const initialAttempt = viewingAttempt ? viewingAttempt : {
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
        pastAttempts={pastAttempts}
        isPremium={isPremium}
      />
    </div>
  );
}
