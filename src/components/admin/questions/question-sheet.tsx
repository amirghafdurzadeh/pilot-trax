"use client";

import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { type AnswerInput, type LessonOption, type QuestionInput } from "@/actions/questions";
import { LessonCombobox } from "@/components/admin/lesson-combobox";
import { RichTextEditor } from "@/components/admin/rich-text";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { getDictionary } from "@/lib/dictionaries";
import { Locale } from "@/lib/locales";
import { SortableAnswerItem } from "./answer-item";

type AppDict = Awaited<ReturnType<typeof getDictionary>>["app"];
type QuestionsDict = AppDict["admin"]["questions"];

export function QuestionSheet({
  open,
  onOpenChange,
  question,
  onSave,
  isSaving,
  lessons,
  lang,
  dict,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  question: QuestionInput | null;
  onSave: (question: QuestionInput) => void;
  isSaving: boolean;
  lessons: LessonOption[];
  lang: Locale;
  dict: AppDict;
}) {
  const [editingQuestion, setEditingQuestion] = useState<QuestionInput | null>(
    question
  );
  const questionsDict = dict.admin.questions;

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    setEditingQuestion(question);
  }, [question, open]);

  const handleReset = () => {
    if (!editingQuestion) return;
    setEditingQuestion({
      lessonId: editingQuestion.lessonId,
      title: "",
      description: "",
      answers: [],
    });
  };

  const handleSave = () => {
    if (editingQuestion) {
      onSave(editingQuestion);
    }
  };

  const addAnswer = () => {
    if (!editingQuestion) return;
    const newAnswer: AnswerInput = {
      id: crypto.randomUUID(),
      title: "",
      isCorrect: false,
      order: editingQuestion.answers.length,
    };
    setEditingQuestion({
      ...editingQuestion,
      answers: [...editingQuestion.answers, newAnswer],
    });
  };

  const updateAnswer = (index: number, updated: AnswerInput) => {
    if (!editingQuestion) return;
    const newAnswers = [...editingQuestion.answers];
    newAnswers[index] = updated;
    setEditingQuestion({ ...editingQuestion, answers: newAnswers });
  };

  const deleteAnswer = (index: number) => {
    if (!editingQuestion) return;
    const newAnswers = [...editingQuestion.answers];
    newAnswers.splice(index, 1);
    setEditingQuestion({ ...editingQuestion, answers: newAnswers });
  };

  const toggleAnswerCorrect = (index: number) => {
    if (!editingQuestion) return;
    const newAnswers = [...editingQuestion.answers];
    newAnswers[index] = {
      ...newAnswers[index],
      isCorrect: !newAnswers[index].isCorrect,
    };
    setEditingQuestion({ ...editingQuestion, answers: newAnswers });
  };

  const handleAnswerDragEnd = (event: DragEndEvent) => {
    if (!editingQuestion) return;
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = editingQuestion.answers.findIndex(
      (a) => a.id === active.id
    );
    const newIndex = editingQuestion.answers.findIndex((a) => a.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      let newAnswers = arrayMove(editingQuestion.answers, oldIndex, newIndex);
      newAnswers = newAnswers.map((a, idx) => ({ ...a, order: idx }));
      setEditingQuestion({ ...editingQuestion, answers: newAnswers });
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        className="sm:max-w-2xl flex flex-col h-full w-full"
        side={lang === "fa" ? "left" : "right"}
      >
        {editingQuestion && (
          <>
            <SheetHeader>
              <SheetTitle>
                {editingQuestion?.id
                  ? questionsDict.edit_question_sheet_title
                  : questionsDict.new_question_sheet_title}
              </SheetTitle>
              <SheetDescription>
                {questionsDict.sheet_description}
              </SheetDescription>
            </SheetHeader>

            <div className="flex-1 overflow-y-auto p-4">
              <div className="flex flex-col gap-6">
                <div className="space-y-2">
                  <Label>{questionsDict.related_lesson_label}</Label>
                  <LessonCombobox
                    lessons={lessons}
                    value={editingQuestion.lessonId}
                    onValueChange={(value) =>
                      setEditingQuestion({
                        ...editingQuestion,
                        lessonId: value,
                      })
                    }
                    dict={questionsDict.lesson_combobox}
                    triggerClassName="w-full"
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label>{questionsDict.question_index_label}</Label>
                  <input
                    type="number"
                    value={editingQuestion.index ?? ""}
                    onChange={(e) =>
                      setEditingQuestion({
                        ...editingQuestion,
                        index: e.target.value
                          ? parseInt(e.target.value)
                          : undefined,
                      })
                    }
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    placeholder={questionsDict.question_index_placeholder}
                  />
                </div>

                <div className="space-y-2">
                  <Label>{questionsDict.question_text_label}</Label>
                  <RichTextEditor
                    value={editingQuestion.title}
                    onChange={(value) =>
                      setEditingQuestion({ ...editingQuestion, title: value })
                    }
                    placeholder={questionsDict.question_text_placeholder}
                    minHeight="120px"
                  />
                </div>

                <div className="space-y-2">
                  <Label>{questionsDict.question_description_label}</Label>
                  <RichTextEditor
                    value={editingQuestion.description}
                    onChange={(value) =>
                      setEditingQuestion({
                        ...editingQuestion,
                        description: value,
                      })
                    }
                    placeholder={
                      questionsDict.question_description_placeholder
                    }
                    minHeight="200px"
                  />
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-semibold">
                      {questionsDict.answers_label}
                    </Label>
                    <Button size="sm" variant="outline" onClick={addAnswer}>
                      <PlusIcon className="w-4 h-4" />
                      {questionsDict.add_answer_button}
                    </Button>
                  </div>

                  <div className="flex flex-col gap-3">
                    {editingQuestion.answers.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground border border-dashed rounded-md">
                        {questionsDict.no_answers_message}
                      </div>
                    ) : (
                      <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleAnswerDragEnd}
                      >
                        <SortableContext
                          items={editingQuestion.answers.map((a) => a.id)}
                          strategy={verticalListSortingStrategy}
                        >
                          <div className="flex flex-col gap-3">
                            {editingQuestion.answers.map((answer, idx) => (
                              <SortableAnswerItem
                                key={answer.id}
                                answer={answer}
                                onChange={(updated) =>
                                  updateAnswer(idx, updated)
                                }
                                onDelete={() => deleteAnswer(idx)}
                                onToggleCorrect={() =>
                                  toggleAnswerCorrect(idx)
                                }
                                dict={questionsDict}
                              />
                            ))}
                          </div>
                        </SortableContext>
                      </DndContext>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <SheetFooter className="mt-auto border-t pt-4 flex-row-reverse sm:justify-start gap-2">
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving
                  ? questionsDict.saving_button
                  : questionsDict.save_changes_button}
              </Button>
              <SheetClose asChild>
                <Button variant="outline">
                  {questionsDict.cancel_button}
                </Button>
              </SheetClose>
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                disabled={isSaving}
              >
                {questionsDict.reset_button}
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
