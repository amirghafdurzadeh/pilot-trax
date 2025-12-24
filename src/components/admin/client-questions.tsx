"use client";

import {
  CheckCircle2Icon,
  ChevronsUpDownIcon,
  CircleIcon,
  EllipsisVerticalIcon,
  FilterIcon,
  PencilIcon,
  PlusIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
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
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useInView } from "react-intersection-observer";
import { toast } from "sonner";

import { type CourseOption } from "@/actions/courses";
import {
  deleteQuestion,
  getQuestions,
  saveQuestion,
  type AnswerInput,
  type LessonOption,
  type QuestionInput,
  type QuestionWithDetails,
} from "@/actions/questions";
import { CourseCombobox } from "@/components/admin/course-combobox";
import { LessonCombobox } from "@/components/admin/lesson-combobox";
import { RichTextEditor } from "@/components/admin/rich-text";
import { AppContent } from "@/components/core/app-content";
import { AppHeader } from "@/components/core/app-header";
import { AppSearch } from "@/components/core/app-search";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { Skeleton } from "@/components/ui/skeleton";

type AppDict = Awaited<ReturnType<typeof getDictionary>>["app"];
type QuestionsDict = AppDict["admin"]["questions"];

function AnswerItem({
  answer,
  onChange,
  onDelete,
  onToggleCorrect,
  dict,
}: {
  answer: AnswerInput;
  onChange: (updated: AnswerInput) => void;
  onDelete: () => void;
  onToggleCorrect: () => void;
  dict: QuestionsDict;
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
      />
    </div>
  );
}

function SortableAnswerItem({
  answer,
  onChange,
  onDelete,
  onToggleCorrect,
  dict,
}: {
  answer: AnswerInput;
  onChange: (updated: AnswerInput) => void;
  onDelete: () => void;
  onToggleCorrect: () => void;
  dict: QuestionsDict;
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
          className="cursor-grab shrink-0 text-muted-foreground hover:text-foreground touch-none h-8 w-8"
          {...attributes}
          {...listeners}
        >
          <ChevronsUpDownIcon className="h-4 w-4" />
        </button>
        <div className="flex-1">
          <AnswerItem
            answer={answer}
            onChange={onChange}
            onDelete={onDelete}
            onToggleCorrect={onToggleCorrect}
            dict={dict}
          />
        </div>
      </div>
    </div>
  );
}

function QuestionCard({
  question,
  onEdit,
  onDelete,
  dict,
}: {
  question: QuestionWithDetails;
  onEdit: () => void;
  onDelete: () => void;
  dict: QuestionsDict;
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

        {question.description && (
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

function QuestionSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardContent className="flex flex-col gap-3 p-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex items-center gap-2 border-t pt-3">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-20" />
          <div className="flex-1" />
          <Skeleton className="h-5 w-12" />
        </div>
      </CardContent>
    </Card>
  );
}

export default function QuestionsPageClient({
  initialQuestions,
  initialNextCursor,
  initialLessons,
  initialCourses,
  lang,
  dict,
}: {
  initialQuestions: QuestionWithDetails[];
  initialNextCursor: string | null;
  initialLessons: LessonOption[];
  initialCourses: CourseOption[];
  lang: Locale;
  dict: AppDict;
}) {
  const [questions, setQuestions] = useState(initialQuestions);
  const [nextCursor, setNextCursor] = useState(initialNextCursor);
  const [isLoading, setIsLoading] = useState(false);
  const [lessons] = useState(initialLessons);
  const [courses] = useState(initialCourses);
  const questionsDict = dict.admin.questions;

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [selectedLessonId, setSelectedLessonId] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<QuestionInput | null>(
    null
  );
  const [isSaving, setIsSaving] = useState(false);

  const [questionToDelete, setQuestionToDelete] = useState<string | null>(null);

  const { ref: loadMoreRef, inView } = useInView();

  const filteredLessons = useMemo(() => {
    if (!selectedCourseId) {
      return lessons;
    }
    return lessons.filter((lesson) => lesson.courseId === selectedCourseId);
  }, [selectedCourseId, lessons]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    const loadFiltered = async () => {
      setIsLoading(true);
      const result = await getQuestions({
        courseId: selectedCourseId || undefined,
        lessonId: selectedLessonId || undefined,
        search: debouncedSearch || undefined,
      });
      setQuestions(result.questions);
      setNextCursor(result.nextCursor);
      setIsLoading(false);
    };

    if (debouncedSearch || selectedLessonId || selectedCourseId) {
      loadFiltered();
    } else if (
      debouncedSearch === "" &&
      selectedLessonId === "" &&
      selectedCourseId === ""
    ) {
      setQuestions(initialQuestions);
      setNextCursor(initialNextCursor);
    }
  }, [
    debouncedSearch,
    selectedLessonId,
    selectedCourseId,
    initialQuestions,
    initialNextCursor,
  ]);

  const loadMore = useCallback(async () => {
    if (!nextCursor || isLoading) return;

    setIsLoading(true);
    const result = await getQuestions({
      cursor: nextCursor,
      courseId: selectedCourseId || undefined,
      lessonId: selectedLessonId || undefined,
      search: debouncedSearch || undefined,
    });
    setQuestions((prev) => [...prev, ...result.questions]);
    setNextCursor(result.nextCursor);
    setIsLoading(false);
  }, [
    nextCursor,
    isLoading,
    selectedCourseId,
    selectedLessonId,
    debouncedSearch,
  ]);

  useEffect(() => {
    if (inView) {
      loadMore();
    }
  }, [inView, loadMore]);

  const handleAddNew = () => {
    setEditingQuestion({
      title: "",
      description: "",
      lessonId: selectedLessonId,
      answers: [],
    });
    setIsSheetOpen(true);
  };

  const handleReset = () => {
    if (!editingQuestion) return;
    setEditingQuestion({
      lessonId: editingQuestion.lessonId,
      title: "",
      description: "",
      answers: [],
    });
  };

  const handleEdit = (question: QuestionWithDetails) => {
    setEditingQuestion({
      id: question.id,
      title: question.title,
      description: question.description,
      lessonId: question.lessonId,
      index: question.index,
      answers: question.answers.map((a) => ({
        id: a.id,
        title: a.title,
        isCorrect: a.isCorrect,
      })),
    });
    setIsSheetOpen(true);
  };

  const handleDelete = (id: string) => {
    setQuestionToDelete(id);
  };

  const executeDelete = async () => {
    if (questionToDelete) {
      const result = await deleteQuestion(lang, questionToDelete);
      if (result.success) {
        setQuestions((prev) => prev.filter((q) => q.id !== questionToDelete));
        toast.success(questionsDict.delete_success_toast);
      } else {
        toast.error(questionsDict.delete_error_toast);
      }
      setQuestionToDelete(null);
    }
  };

  const handleSave = async () => {
    if (!editingQuestion) return;

    if (!editingQuestion.title.trim()) {
      toast.error(questionsDict.title_required_toast);
      return;
    }

    if (!editingQuestion.lessonId) {
      toast.error(questionsDict.lesson_required_toast);
      return;
    }

    if (editingQuestion.answers.length === 0) {
      toast.error(questionsDict.one_answer_required_toast);
      return;
    }

    const hasCorrectAnswer = editingQuestion.answers.some((a) => a.isCorrect);
    if (!hasCorrectAnswer) {
      toast.error(questionsDict.one_correct_answer_required_toast);
      return;
    }

    setIsSaving(true);
    const result = await saveQuestion(lang, editingQuestion);
    setIsSaving(false);

    if (result.success) {
      if (result.newQuestionId) {
        setEditingQuestion((prev) =>
          prev ? { ...prev, id: result.newQuestionId } : null
        );
      }
      const reloadResult = await getQuestions({
        courseId: selectedCourseId || undefined,
        lessonId: selectedLessonId || undefined,
        search: debouncedSearch || undefined,
      });
      setQuestions(reloadResult.questions);
      setNextCursor(reloadResult.nextCursor);
      toast.success(questionsDict.save_success_toast);
    } else {
      toast.error(
        questionsDict.save_error_toast + (result.error || "")
      );
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

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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
      // update order fields
      newAnswers = newAnswers.map((a, idx) => ({ ...a, order: idx }));
      setEditingQuestion({ ...editingQuestion, answers: newAnswers });
    }
  };

  const handleCourseChange = (courseId: string) => {
    setSelectedCourseId(courseId);
    setSelectedLessonId("");
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCourseId("");
    setSelectedLessonId("");
  };

  const hasActiveFilters =
    searchQuery || selectedCourseId || selectedLessonId;

  return (
    <>
      <AppHeader lang={lang} dict={dict}>
        <div className="flex items-center gap-2 flex-1">
          <AppSearch
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={questionsDict.search_placeholder}
          />
        </div>
      </AppHeader>

      <AppContent>
        <div className="w-full flex flex-col md:flex-row gap-2">
          <Button onClick={handleAddNew} className="w-full md:w-fit gap-2">
            <PlusIcon className="w-4 h-4" />
            {questionsDict.add_question_button}
          </Button>
          <div className="w-full md:w-fit flex gap-2">
            <CourseCombobox
              courses={courses}
              value={selectedCourseId}
              onValueChange={handleCourseChange}
              dict={{
                select_course_placeholder:
                  questionsDict.course_combobox.select_course_placeholder,
                search_placeholder:
                  questionsDict.course_combobox.search_placeholder,
                no_course_found_message:
                  questionsDict.course_combobox.no_course_found_message,
              }}
              icon={<FilterIcon className="w-4 h-4 text-muted-foreground" />}
              triggerClassName="flex-1 w-fit"
            />
            <LessonCombobox
              lessons={filteredLessons}
              value={selectedLessonId}
              onValueChange={setSelectedLessonId}
              dict={questionsDict.lesson_combobox}
              icon={<FilterIcon className="w-4 h-4 text-muted-foreground" />}
              triggerClassName="flex-1 w-fit"
            />
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="icon"
                onClick={clearFilters}
                title={questionsDict.clear_filters_tooltip}
              >
                <XIcon className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {questions.map((question) => (
            <QuestionCard
              key={question.id}
              question={question}
              onEdit={() => handleEdit(question)}
              onDelete={() => handleDelete(question.id)}
              dict={questionsDict}
            />
          ))}

          {isLoading && (
            <>
              <QuestionSkeleton />
              <QuestionSkeleton />
              <QuestionSkeleton />
              <QuestionSkeleton />
            </>
          )}
        </div>

        {!isLoading && questions.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <p className="text-lg">{questionsDict.no_questions_found}</p>
            {hasActiveFilters && (
              <Button variant="link" onClick={clearFilters}>
                {questionsDict.clear_filters_button}
              </Button>
            )}
          </div>
        )}

        {nextCursor && !isLoading && <div ref={loadMoreRef} className="h-10" />}
      </AppContent>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent
          className="sm:max-w-2xl flex flex-col h-full w-full"
          side={lang === "fa" ? "left" : "right"}
        >
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
            {editingQuestion && (
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
                        index: e.target.value ? parseInt(e.target.value) : undefined,
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
                    placeholder={questionsDict.question_description_placeholder}
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
                      <PlusIcon className="w-4 h-4 ml-2" />
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
                                onToggleCorrect={() => toggleAnswerCorrect(idx)}
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
            )}
          </div>

          <SheetFooter className="mt-auto border-t pt-4 flex-row-reverse sm:justify-start gap-2">
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving
                ? questionsDict.saving_button
                : questionsDict.save_changes_button}
            </Button>
            <SheetClose asChild>
              <Button variant="outline">{questionsDict.cancel_button}</Button>
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
        </SheetContent>
      </Sheet>

      <AlertDialog
        open={!!questionToDelete}
        onOpenChange={(open) => !open && setQuestionToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {questionsDict.delete_dialog_title}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {questionsDict.delete_dialog_description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel>
              {questionsDict.delete_dialog_cancel}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={executeDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {questionsDict.delete_dialog_confirm}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
