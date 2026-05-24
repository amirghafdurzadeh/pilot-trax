import { getQuiz } from "@/actions/quizzes";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getDictionary } from "@/lib/dictionaries";

export default async function Page(
  props: PageProps<"/[lang]/app/quizzes/[quizId]">
) {
  const { lang, quizId } = (await props.params) as {
    lang: string;
    quizId: string;
  };
  const dict = await getDictionary(lang as "fa" | "en");
  const quiz = await getQuiz(quizId);

  if (!quiz) {
    return <div>{dict.app.quizzes.quiz_not_found}</div>;
  }

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>{quiz.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p>
            {dict.app.quizzes.duration}: {quiz.duration}{" "}
            {dict.app.quizzes.minutes}
          </p>
          <p>
            {dict.app.quizzes.questions}: {quiz.questionCount}
          </p>
          <p>
            {dict.app.quizzes.selection_mode}: {quiz.selectionMode}
          </p>
          <p>
            {dict.app.quizzes.public}:{" "}
            {quiz.isPublic
              ? dict.app.quizzes.public_yes
              : dict.app.quizzes.public_no}
          </p>
          <h3 className="font-bold mt-4">{dict.app.quizzes.lessons_label}</h3>
          <ul>
            {quiz.lessons.map((lesson) => (
              <li key={lesson.lessonId}>{lesson.lessonTitle}</li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
