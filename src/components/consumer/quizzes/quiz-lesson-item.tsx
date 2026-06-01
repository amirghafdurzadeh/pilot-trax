"use client";

import { Trash2Icon } from "lucide-react";
import { useState } from "react";

import { type QuizLessonInput } from "@/actions/quizzes";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { QuizSelectionMode } from "@/generated/prisma/enums";
import { type Dictionary } from "@/lib/dictionaries";

type QuizzesDict = Dictionary["app"]["admin"]["quizzes"];

export function QuizLessonItem({
  lesson,
  onChange,
  onDelete,
  dict,
  selectionMode,
  maxQuestions,
}: {
  lesson: QuizLessonInput;
  onChange: (updated: QuizLessonInput) => void;
  onDelete: () => void;
  dict: QuizzesDict;
  selectionMode: QuizSelectionMode;
  maxQuestions?: number;
}) {
  const [useCustomCount, setUseCustomCount] = useState(
    lesson.questionsCount !== undefined
  );

  const handleCheckedChange = (checked: boolean) => {
    setUseCustomCount(checked);
    if (!checked) {
      onChange({ ...lesson, questionsCount: undefined });
    }
  };

  const isShuffled = selectionMode === QuizSelectionMode.SHUFFLED;
  const isOrdered = selectionMode === QuizSelectionMode.ORDERED;

  return (
    <div className="flex items-center gap-2 bg-muted ps-4 p-2 rounded-md">
      <div className="flex-1 font-medium">
        {lesson.totalQuestionsCount !== undefined &&
          `(${lesson.totalQuestionsCount}) `}
        {lesson.lessonTitle}
      </div>

      {isShuffled && (
        <div className="flex items-center gap-2">
          <Checkbox
            id={`use-custom-count-${lesson.id}`}
            checked={useCustomCount}
            onCheckedChange={handleCheckedChange}
          />
          <Label htmlFor={`use-custom-count-${lesson.id}`}>
            {dict.quiz_lesson_use_custom_question_count_label}
          </Label>
          <Input
            type="number"
            className="w-24"
            placeholder={dict.quiz_lesson_question_count_placeholder}
            value={lesson.questionsCount ?? ""}
            onChange={(e) => {
              let count = e.target.value ? parseInt(e.target.value) : undefined;
              if (
                count !== undefined &&
                maxQuestions !== undefined &&
                count > maxQuestions
              ) {
                count = maxQuestions;
              }
              onChange({
                ...lesson,
                questionsCount: count,
              });
            }}
            disabled={!useCustomCount}
            max={maxQuestions}
          />
        </div>
      )}

      {isOrdered && (
        <div className="flex items-center gap-2">
          <Input
            type="number"
            className="w-24"
            placeholder={dict.quiz_lesson_start_index_placeholder}
            value={lesson.startIndex ?? ""}
            onChange={(e) =>
              onChange({
                ...lesson,
                startIndex: e.target.value
                  ? parseInt(e.target.value)
                  : undefined,
              })
            }
          />
          <Input
            type="number"
            className="w-24"
            placeholder={dict.quiz_lesson_end_index_placeholder}
            value={lesson.endIndex ?? ""}
            onChange={(e) =>
              onChange({
                ...lesson,
                endIndex: e.target.value
                  ? parseInt(e.target.value)
                  : undefined,
              })
            }
          />
        </div>
      )}

      <Button variant="ghost" size="icon" onClick={onDelete}>
        <Trash2Icon className="w-5 h-5 text-destructive" />
      </Button>
    </div>
  );
}
