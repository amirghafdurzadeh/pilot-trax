import { formatDistanceToNow } from "date-fns";
import { enUS, faIR } from "date-fns/locale";

import { getQuizzes } from "@/actions/quizzes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dictionary } from "@/lib/dictionaries";
import { Locale } from "@/lib/locales";

type Quizzes = Awaited<ReturnType<typeof getQuizzes>>;

interface QuizCardProps {
  quiz: Quizzes[number];
  dict: Dictionary;
  lang: Locale;
}

export function QuizCard({ quiz, dict, lang }: QuizCardProps) {
  const locales = { en: enUS, fa: faIR };
  const locale = locales[lang as keyof typeof locales];

  return (
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
          {dict.app.quizzes.attempts}: {quiz._count.quizAttempts}
        </p>
        <p className="text-sm text-muted-foreground">
          {dict.app.quizzes.created_at}:{" "}
          {formatDistanceToNow(new Date(quiz.createdAt), {
            addSuffix: true,
            locale,
          })}
        </p>
      </CardContent>
    </Card>
  );
}
