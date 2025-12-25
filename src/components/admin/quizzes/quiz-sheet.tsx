"use client";

import { useEffect, useState } from "react";

import { type CourseOption } from "@/actions/courses";
import { type LessonOption } from "@/actions/questions";
import { type QuizInput, type QuizLessonInput } from "@/actions/quizzes";
import { LessonCombobox } from "@/components/admin/lesson-combobox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
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
import { CourseCombobox } from "../course-combobox";
import { SortableQuizLessonItem } from "./quiz-lesson-item";

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

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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

  const handleReset = () => {
    if (!editingQuiz) return;
    setEditingQuiz({
      title: "",
      duration: 120,
      questionCount: 120,
      selectionMode: QuizSelectionMode.SHUFFLED,
      courseId: "",
      lessons: [],
    });
  };

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
    };
    setEditingQuiz({
      ...editingQuiz,
      lessons: [...editingQuiz.lessons, newQuizLesson],
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

  const handleLessonDragEnd = (event: DragEndEvent) => {
    if (!editingQuiz) return;
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = editingQuiz.lessons.findIndex((l) => l.id === active.id);
    const newIndex = editingQuiz.lessons.findIndex((l) => l.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      let newLessons = arrayMove(editingQuiz.lessons, oldIndex, newIndex);
      setEditingQuiz({ ...editingQuiz, lessons: newLessons });
    }
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
                  />
                </div>

                <div className="space-y-2">
                  <Label>{quizzesDict.quiz_selection_mode_label}</Label>
                  <Select
                    value={editingQuiz.selectionMode}
                    onValueChange={(value) =>
                      setEditingQuiz({
                        ...editingQuiz,
                        selectionMode: value as QuizSelectionMode,
                      })
                    }
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
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button size="sm" variant="outline">
                          <PlusIcon className="w-4 h-4" />
                          {quizzesDict.add_lesson_button}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent>
                        <LessonCombobox
                          lessons={lessons.filter(
                            (l) =>
                              !editingQuiz.lessons.some(
                                (el) => el.lessonId === l.id
                              )
                          )}
                          value=""
                          onValueChange={addLesson}
                          dict={quizzesDict.lesson_combobox}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="flex flex-col gap-3">
                    {editingQuiz.lessons.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground border border-dashed rounded-md">
                        {quizzesDict.no_lessons_message}
                      </div>
                    ) : (
                      <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleLessonDragEnd}
                      >
                        <SortableContext
                          items={editingQuiz.lessons.map((l) => l.id)}
                          strategy={verticalListSortingStrategy}
                        >
                          <div className="flex flex-col gap-3">
                            {editingQuiz.lessons.map((lesson, idx) => (
                              <SortableQuizLessonItem
                                key={lesson.id}
                                lesson={lesson}
                                onChange={(updated) =>
                                  updateLesson(idx, updated)
                                }
                                onDelete={() => deleteLesson(idx)}
                                dict={quizzesDict}
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
                  ? quizzesDict.saving_button
                  : quizzesDict.save_changes_button}
              </Button>
              <SheetClose asChild>
                <Button variant="outline">{quizzesDict.cancel_button}</Button>
              </SheetClose>
              <Button
                type="button"
                variant="outline"
                onClick={handleReset}
                disabled={isSaving}
              >
                {quizzesDict.reset_button}
              </Button>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
