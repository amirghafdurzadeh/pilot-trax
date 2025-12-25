"use client";

import { PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { type CourseOption } from "@/actions/courses";
import { type LessonOption } from "@/actions/questions";
import { type QuizInput, type QuizLessonInput } from "@/actions/quizzes";
import { CourseCombobox } from "@/components/admin/course-combobox";
import { LessonCombobox } from "@/components/admin/lesson-combobox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { QuizSelectionMode } from "@/generated/prisma/enums";
import { Dictionary } from "@/lib/dictionaries";
import { type Locale } from "@/lib/locales";
import { QuizLessonItem } from "./quiz-lesson-item";

export function QuizSheet({
  open,
  onOpenChange,
  quiz,
  onSave,
  isSaving,
  courses,
  lessons,
  lang,
  dict,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quiz: QuizInput | null;
  onSave: (quiz: QuizInput) => void;
  isSaving: boolean;
  courses: CourseOption[];
  lessons: LessonOption[];
  lang: Locale;
  dict: Dictionary["app"];
}) {
  const [editingQuiz, setEditingQuiz] = useState<QuizInput | null>(quiz);
  const quizzesDict = dict.admin.quizzes;

  const isOrderedMode =
    editingQuiz?.selectionMode === QuizSelectionMode.ORDERED;

  useEffect(() => {
    setEditingQuiz(
      quiz ?? {
        title: "",
        duration: 120,
        questionCount: 120,
        selectionMode: QuizSelectionMode.SHUFFLED,
        courseId: "",
        lessons: [],
      }
    );
  }, [quiz, open]);

  useEffect(() => {
    if (editingQuiz && isOrderedMode) {
      const totalQuestions = editingQuiz.lessons.reduce((sum, lesson) => {
        const start = lesson.startIndex ?? 0;
        const end = lesson.endIndex ?? 0;
        if (start > 0 && end > 0 && end >= start) {
          return sum + (end - start + 1);
        }
        return sum;
      }, 0);
      if (totalQuestions > 0) {
        setEditingQuiz((prev) => ({ ...prev!, questionCount: totalQuestions }));
      }
    }
  }, [editingQuiz?.lessons, isOrderedMode]);

  const handleSave = () => {
    if (editingQuiz) {
      onSave(editingQuiz);
    }
  };

  const addLesson = (lessonId: string) => {
    if (!editingQuiz) return;
    const lesson = lessons.find((l) => l.id === lessonId);
    if (!lesson) return;

    const newQuizLesson: QuizLessonInput = {
      id: crypto.randomUUID(),
      lessonId: lesson.id,
      lessonTitle: lesson.title,
      order: lesson.order,
    };
    setEditingQuiz({
      ...editingQuiz,
      lessons: [...editingQuiz.lessons, newQuizLesson],
    });
  };

  const addAllLessons = () => {
    if (!editingQuiz || !editingQuiz.courseId) return;

    const courseLessons = lessons.filter(
      (l) =>
        l.courseId === editingQuiz.courseId &&
        !editingQuiz.lessons.some((el) => el.lessonId === l.id)
    );

    const newQuizLessons: QuizLessonInput[] = courseLessons.map((lesson) => ({
      id: crypto.randomUUID(),
      lessonId: lesson.id,
      lessonTitle: lesson.title,
      order: lesson.order,
    }));

    setEditingQuiz({
      ...editingQuiz,
      lessons: [...editingQuiz.lessons, ...newQuizLessons],
    });
  };

  const updateLesson = (index: number, updated: QuizLessonInput) => {
    if (!editingQuiz) return;
    const newLessons = [...editingQuiz.lessons];
    newLessons[index] = updated;
    setEditingQuiz({ ...editingQuiz, lessons: newLessons });
  };

  const deleteLesson = (index: number) => {
    if (!editingQuiz) return;
    const newLessons = [...editingQuiz.lessons];
    newLessons.splice(index, 1);
    setEditingQuiz({ ...editingQuiz, lessons: newLessons });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange} modal={false}>
      <SheetContent
        className="sm:max-w-2xl flex flex-col h-full w-full"
        side={lang === "fa" ? "left" : "right"}
      >
        {editingQuiz && (
          <>
            <SheetHeader>
              <SheetTitle>
                {editingQuiz?.id
                  ? quizzesDict.edit_quiz_sheet_title
                  : quizzesDict.new_quiz_sheet_title}
              </SheetTitle>
              <SheetDescription>
                {quizzesDict.sheet_description}
              </SheetDescription>
            </SheetHeader>

            <div className="flex-1 overflow-y-auto p-4">
              <div className="flex flex-col gap-6">
                <div className="space-y-2">
                  <Label>{quizzesDict.quiz_title_label}</Label>
                  <Input
                    value={editingQuiz.title}
                    onChange={(e) =>
                      setEditingQuiz({ ...editingQuiz, title: e.target.value })
                    }
                    placeholder={quizzesDict.quiz_title_placeholder}
                  />
                </div>

                <div className="space-y-2">
                  <Label>{quizzesDict.related_course_label}</Label>
                  <CourseCombobox
                    courses={courses}
                    value={editingQuiz.courseId}
                    onValueChange={(value) =>
                      setEditingQuiz({
                        ...editingQuiz,
                        courseId: value,
                        lessons: [],
                      })
                    }
                    dict={quizzesDict.course_combobox}
                    triggerClassName="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label>{quizzesDict.quiz_duration_label}</Label>
                  <Input
                    type="number"
                    value={editingQuiz.duration}
                    onChange={(e) =>
                      setEditingQuiz({
                        ...editingQuiz,
                        duration: parseInt(e.target.value),
                      })
                    }
                    placeholder={quizzesDict.quiz_duration_placeholder}
                  />
                </div>

                <div className="space-y-2">
                  <Label>{quizzesDict.quiz_question_count_label}</Label>
                  <Input
                    type="number"
                    value={editingQuiz.questionCount}
                    onChange={(e) =>
                      setEditingQuiz({
                        ...editingQuiz,
                        questionCount: parseInt(e.target.value),
                      })
                    }
                    placeholder={quizzesDict.quiz_question_count_placeholder}
                    disabled={isOrderedMode}
                  />
                </div>

                <div className="space-y-2">
                  <Label>{quizzesDict.quiz_selection_mode_label}</Label>
                  <Select
                    value={editingQuiz.selectionMode}
                    onValueChange={(value) => {
                      if (!editingQuiz) return;
                      const newMode = value as QuizSelectionMode;
                      const newLessons = editingQuiz.lessons.map((l) => {
                        if (newMode === QuizSelectionMode.ORDERED) {
                          return { ...l, questionsCount: undefined };
                        } else if (newMode === QuizSelectionMode.SHUFFLED) {
                          return {
                            ...l,
                            startIndex: undefined,
                            endIndex: undefined,
                          };
                        }
                        return l;
                      });
                      setEditingQuiz({
                        ...editingQuiz,
                        selectionMode: newMode,
                        lessons: newLessons,
                      });
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          quizzesDict.quiz_selection_mode_placeholder
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={QuizSelectionMode.SHUFFLED}>
                        {quizzesDict.quiz_selection_mode_shuffled}
                      </SelectItem>
                      <SelectItem value={QuizSelectionMode.ORDERED}>
                        {quizzesDict.quiz_selection_mode_ordered}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-semibold">
                      {quizzesDict.lessons_label}
                    </Label>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        onClick={addAllLessons}
                        disabled={!editingQuiz.courseId}
                      >
                        {quizzesDict.add_all_lessons_button}
                      </Button>
                      <LessonCombobox
                        lessons={lessons.filter(
                          (l) =>
                            l.courseId === editingQuiz.courseId &&
                            !editingQuiz.lessons.some(
                              (el) => el.lessonId === l.id
                            )
                        )}
                        value=""
                        onValueChange={addLesson}
                        icon={<PlusIcon className="w-4 h-4" />}
                        dict={quizzesDict.lesson_combobox}
                        placeholder={quizzesDict.add_lesson_button}
                        align="end"
                        disabled={!editingQuiz.courseId}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    {editingQuiz.lessons.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground border border-dashed rounded-md">
                        {quizzesDict.no_lessons_message}
                      </div>
                    ) : (
                      <div className="flex flex-col gap-3">
                        {(() => {
                          const totalLessonsQuestions =
                            editingQuiz.lessons.reduce(
                              (sum, lesson) =>
                                sum + (lesson.questionsCount ?? 0),
                              0
                            );

                          return editingQuiz.lessons
                            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
                            .map((lesson, idx) => {
                              const currentLessonCount =
                                lesson.questionsCount ?? 0;
                              const otherLessonsCount =
                                totalLessonsQuestions - currentLessonCount;
                              const maxForThisLesson =
                                editingQuiz.questionCount - otherLessonsCount;

                              return (
                                <QuizLessonItem
                                  key={lesson.id}
                                  lesson={lesson}
                                  onChange={(updated) =>
                                    updateLesson(idx, updated)
                                  }
                                  onDelete={() => deleteLesson(idx)}
                                  dict={quizzesDict}
                                  selectionMode={editingQuiz.selectionMode}
                                  maxQuestions={maxForThisLesson}
                                />
                              );
                            });
                        })()}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <SheetFooter className="mt-auto border-t pt-4 flex-row-reverse sm:justify-start gap-2">
              <Button onClick={handleSave} disabled={isSaving}>
                {isSaving
                  ? quizzesDict.saving_button
                  : quizzesDict.save_changes_button}
              </Button>
              <SheetClose asChild>
                <Button variant="outline">{quizzesDict.cancel_button}</Button>
              </SheetClose>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
