"use client";

import {
  EllipsisVerticalIcon,
  PencilIcon,
  Trash2Icon,
} from "lucide-react";

import { type QuestionWithDetails } from "@/actions/questions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getDictionary } from "@/lib/dictionaries";

type AppDict = Awaited<ReturnType<typeof getDictionary>>["app"];
type QuestionsDict = AppDict["admin"]["questions"];

export function QuestionCard({
  question,
  onEdit,
  onDelete,
  dict,
  showDescription = true,
}: {
  question: QuestionWithDetails;
  onEdit: () => void;
  onDelete: () => void;
  dict: QuestionsDict;
  showDescription?: boolean;
}) {
  const correctAnswersCount = question.answers.filter(
    (a) => a.isCorrect
  ).length;

  return (
    <Card className="relative group overflow-hidden transition-all hover:shadow-md">
      <div className="absolute top-2 end-2 z-10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 bg-background/50 backdrop-blur-sm opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
            >
              <EllipsisVerticalIcon className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onEdit}>
              <PencilIcon className="w-4 h-4" />
              {dict.edit_button}
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={onDelete}
            >
              <Trash2Icon className="w-4 h-4 text-inherit" />
              {dict.delete_button}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <CardContent className="flex flex-col gap-3 p-4">
        {question.index !== null && question.index !== undefined && (
          <span className="text-sm font-semibold text-muted-foreground">
            {question.index}.
          </span>
        )}
        <div
          className="prose prose-sm max-w-none dark:prose-invert line-clamp-3 min-h-[3em]"
          dangerouslySetInnerHTML={{ __html: question.title }}
        />

        {showDescription && question.description && (
          <div
            className="prose prose-sm max-w-none dark:prose-invert text-muted-foreground line-clamp-2"
            dangerouslySetInnerHTML={{ __html: question.description }}
          />
        )}

        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground border-t pt-3">
          <Badge variant="secondary" className="text-xs">
            {question.courseName}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {question.lessonTitle}
          </Badge>
          <div className="flex-1" />
          <span className="bg-secondary px-2 py-0.5 rounded">
            {dict.answers_count.replace(
              "{count}",
              String(question.answers.length)
            )}
          </span>
          {correctAnswersCount > 0 && (
            <span className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-0.5 rounded">
              {dict.correct_answers_count.replace(
                "{count}",
                String(correctAnswersCount)
              )}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
