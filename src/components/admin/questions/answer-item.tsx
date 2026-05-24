"use client";

import {
  CheckCircle2Icon,
  CircleIcon,
  GripIcon,
  Trash2Icon,
} from "lucide-react";

import { type AnswerInput } from "@/actions/questions";
import { RichTextEditor } from "@/components/admin/rich-text";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getDictionary } from "@/lib/dictionaries";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ToolbarDictionary } from "../rich-text/toolbar";

type AppDict = Awaited<ReturnType<typeof getDictionary>>["app"];
type QuestionsDict = AppDict["admin"]["questions"];

function AnswerItem({
  answer,
  onChange,
  onDelete,
  onToggleCorrect,
  dict,
  toolbarDictionary,
}: {
  answer: AnswerInput;
  onChange: (updated: AnswerInput) => void;
  onDelete: () => void;
  onToggleCorrect: () => void;
  dict: QuestionsDict;
  toolbarDictionary: ToolbarDictionary;
}) {
  return (
    <div className="flex flex-col gap-2 p-3 border rounded-lg bg-card">
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className={`h-8 w-8 shrink-0 ${
            answer.isCorrect
              ? "text-green-600 hover:text-green-700"
              : "text-muted-foreground hover:text-foreground"
          }`}
          onClick={onToggleCorrect}
          title={
            answer.isCorrect
              ? dict.correct_answer_tooltip
              : dict.mark_as_correct_tooltip
          }
        >
          {answer.isCorrect ? (
            <CheckCircle2Icon className="h-5 w-5" />
          ) : (
            <CircleIcon className="h-5 w-5" />
          )}
        </Button>
        <div className="flex-1 text-sm font-medium">
          {answer.isCorrect && (
            <Badge variant="default" className="bg-green-600">
              {dict.correct_answer_badge}
            </Badge>
          )}
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0 text-destructive hover:text-destructive/80"
          onClick={onDelete}
          title={dict.delete_answer_tooltip}
        >
          <Trash2Icon className="h-4 w-4" />
        </Button>
      </div>
      <RichTextEditor
        value={answer.title}
        onChange={(value) => onChange({ ...answer, title: value })}
        placeholder={dict.answer_placeholder}
        minHeight="60px"
        dictionary={toolbarDictionary}
      />
    </div>
  );
}

export function SortableAnswerItem({
  answer,
  onChange,
  onDelete,
  onToggleCorrect,
  dict,
  toolbarDictionary,
}: {
  answer: AnswerInput;
  onChange: (updated: AnswerInput) => void;
  onDelete: () => void;
  onToggleCorrect: () => void;
  dict: QuestionsDict;
  toolbarDictionary: ToolbarDictionary;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: answer.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  } as React.CSSProperties;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={isDragging ? "opacity-50" : ""}
    >
      <div className="flex items-start gap-2">
        <button
          type="button"
          className="cursor-grab shrink-0 text-muted-foreground hover:text-foreground touch-none h-8 w-8 flex items-center justify-center"
          {...attributes}
          {...listeners}
        >
          <GripIcon className="w-4 h-4" />
        </button>
        <div className="flex-1">
          <AnswerItem
            answer={answer}
            onChange={onChange}
            onDelete={onDelete}
            onToggleCorrect={onToggleCorrect}
            dict={dict}
            toolbarDictionary={toolbarDictionary}
          />
        </div>
      </div>
    </div>
  );
}
