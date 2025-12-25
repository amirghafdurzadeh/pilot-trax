"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripIcon, Trash2Icon } from "lucide-react";

import { type QuizLessonInput } from "@/actions/quizzes";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { type Dictionary } from "@/lib/dictionaries";

type QuizzesDict = Dictionary["app"]["admin"]["quizzes"];

export function SortableQuizLessonItem({
  lesson,
  onChange,
  onDelete,
  dict,
}: {
  lesson: QuizLessonInput;
  onChange: (updated: QuizLessonInput) => void;
  onDelete: () => void;
  dict: QuizzesDict;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: lesson.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-2 bg-muted p-2 rounded-md"
    >
      <Button
        variant="ghost"
        size="icon"
        className="cursor-grab"
        {...attributes}
        {...listeners}
      >
        <GripIcon className="w-5 h-5" />
      </Button>
      <div className="flex-1">{lesson.lessonTitle}</div>
      <Input
        type="number"
        className="w-24"
        placeholder={dict.quiz_lesson_question_count_placeholder}
        value={lesson.questionsCount ?? ""}
        onChange={(e) =>
          onChange({
            ...lesson,
            questionsCount: e.target.value
              ? parseInt(e.target.value)
              : undefined,
          })
        }
      />
      <Button variant="ghost" size="icon" onClick={onDelete}>
        <Trash2Icon className="w-5 h-5 text-destructive" />
      </Button>
    </div>
  );
}
