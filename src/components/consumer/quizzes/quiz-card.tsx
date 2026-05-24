import { formatDistanceToNow } from "date-fns";
import { enUS, faIR } from "date-fns/locale";
import { MoreVertical, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";

import { getQuizzes } from "@/actions/quizzes";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dictionary } from "@/lib/dictionaries";
import { Locale } from "@/lib/locales";
import { Button } from "@/components/ui/button";

type Quizzes = Awaited<ReturnType<typeof getQuizzes>>;

interface QuizCardProps {
  quiz: Quizzes[number];
  dict: Dictionary;
  lang: Locale;
  onEdit: (quiz: Quizzes[number]) => void;
  onDelete: (quiz: Quizzes[number]) => void;
}

export function QuizCard({
  quiz,
  dict,
  lang,
  onEdit,
  onDelete,
}: QuizCardProps) {
  const locales = { en: enUS, fa: faIR };
  const locale = locales[lang as keyof typeof locales];

  return (
    <Link href={`/${lang}/app/quizzes/${quiz.id}`}>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{quiz.title}</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger
              asChild
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onEdit(quiz);
                }}
              >
                <Pencil className="mr-2 h-4 w-4" />
                <span>{dict.app.quizzes.edit}</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  onDelete(quiz);
                }}
              >
                <Trash2 className="mr-2 h-4 w-4 text-inherit" />
                <span>{dict.app.quizzes.delete}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
          </p>{" "}
        </CardContent>
      </Card>
    </Link>
  );
}
