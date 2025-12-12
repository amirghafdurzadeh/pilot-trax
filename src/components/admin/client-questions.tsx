"use client";

import {
  CheckCircle2Icon,
  CircleIcon,
  EllipsisVerticalIcon,
  FilterIcon,
  PencilIcon,
  PlusIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { toast } from "sonner";

import {
  deleteQuestion,
  getQuestions,
  saveQuestion,
  type AnswerInput,
  type LessonOption,
  type QuestionInput,
  type QuestionWithDetails,
} from "@/actions/questions";
import { LessonCombobox } from "@/components/admin/lesson-combobox";
import { RichTextEditor } from "@/components/admin/rich-text-editor";
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
import { Skeleton } from "@/components/ui/skeleton";

function AnswerItem({
  answer,
  onChange,
  onDelete,
  onToggleCorrect,
}: {
  answer: AnswerInput;
  onChange: (updated: AnswerInput) => void;
  onDelete: () => void;
  onToggleCorrect: () => void;
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
            answer.isCorrect ? "پاسخ صحیح" : "علامت‌گذاری به عنوان پاسخ صحیح"
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
              پاسخ صحیح
            </Badge>
          )}
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-8 w-8 shrink-0 text-destructive hover:text-destructive/80"
          onClick={onDelete}
          title="حذف پاسخ"
        >
          <Trash2Icon className="h-4 w-4" />
        </Button>
      </div>
      <RichTextEditor
        value={answer.title}
        onChange={(value) => onChange({ ...answer, title: value })}
        placeholder="متن پاسخ..."
        minHeight="60px"
      />
    </div>
  );
}

function QuestionCard({
  question,
  onEdit,
  onDelete,
}: {
  question: QuestionWithDetails;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const correctAnswersCount = question.answers.filter(
    (a) => a.isCorrect
  ).length;

  return (
    <Card className="relative group overflow-hidden transition-all hover:shadow-md">
      <div className="absolute top-2 left-2 z-10">
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
              ویرایش
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={onDelete}
            >
              <Trash2Icon className="w-4 h-4 text-inherit" />
              حذف
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <CardContent className="flex flex-col gap-3 p-4">
        <div
          className="prose prose-sm max-w-none dark:prose-invert line-clamp-3 min-h-[3em]"
          dangerouslySetInnerHTML={{ __html: question.title }}
        />

        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground border-t pt-3">
          <Badge variant="secondary" className="text-xs">
            {question.courseName}
          </Badge>
          <Badge variant="outline" className="text-xs">
            {question.lessonTitle}
          </Badge>
          <div className="flex-1" />
          <span className="bg-secondary px-2 py-0.5 rounded">
            {question.answers.length} پاسخ
          </span>
          {correctAnswersCount > 0 && (
            <span className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-0.5 rounded">
              {correctAnswersCount} صحیح
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
}: {
  initialQuestions: QuestionWithDetails[];
  initialNextCursor: string | null;
  initialLessons: LessonOption[];
}) {
  const [questions, setQuestions] = useState(initialQuestions);
  const [nextCursor, setNextCursor] = useState(initialNextCursor);
  const [isLoading, setIsLoading] = useState(false);
  const [lessons] = useState(initialLessons);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLessonId, setSelectedLessonId] = useState<string>("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<QuestionInput | null>(
    null
  );
  const [isSaving, setIsSaving] = useState(false);

  const [questionToDelete, setQuestionToDelete] = useState<string | null>(null);

  const { ref: loadMoreRef, inView } = useInView();

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
        lessonId: selectedLessonId || undefined,
        search: debouncedSearch || undefined,
      });
      setQuestions(result.questions);
      setNextCursor(result.nextCursor);
      setIsLoading(false);
    };

    if (debouncedSearch || selectedLessonId) {
      loadFiltered();
    } else if (debouncedSearch === "" && selectedLessonId === "") {
      setQuestions(initialQuestions);
      setNextCursor(initialNextCursor);
    }
  }, [debouncedSearch, selectedLessonId, initialQuestions, initialNextCursor]);

  const loadMore = useCallback(async () => {
    if (!nextCursor || isLoading) return;

    setIsLoading(true);
    const result = await getQuestions({
      cursor: nextCursor,
      lessonId: selectedLessonId || undefined,
      search: debouncedSearch || undefined,
    });
    setQuestions((prev) => [...prev, ...result.questions]);
    setNextCursor(result.nextCursor);
    setIsLoading(false);
  }, [nextCursor, isLoading, selectedLessonId, debouncedSearch]);

  useEffect(() => {
    if (inView) {
      loadMore();
    }
  }, [inView, loadMore]);

  const handleAddNew = () => {
    setEditingQuestion({
      title: "",
      lessonId: "",
      answers: [],
    });
    setIsSheetOpen(true);
  };

  const handleEdit = (question: QuestionWithDetails) => {
    setEditingQuestion({
      id: question.id,
      title: question.title,
      lessonId: question.lessonId,
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
      const result = await deleteQuestion(questionToDelete);
      if (result.success) {
        setQuestions((prev) => prev.filter((q) => q.id !== questionToDelete));
        toast.success("سوال با موفقیت حذف شد");
      } else {
        toast.error("خطا در حذف سوال");
      }
      setQuestionToDelete(null);
    }
  };

  const handleSave = async () => {
    if (!editingQuestion) return;

    if (!editingQuestion.title.trim()) {
      toast.error("عنوان سوال الزامی است");
      return;
    }

    if (!editingQuestion.lessonId) {
      toast.error("انتخاب درس الزامی است");
      return;
    }

    if (editingQuestion.answers.length === 0) {
      toast.error("حداقل یک پاسخ الزامی است");
      return;
    }

    const hasCorrectAnswer = editingQuestion.answers.some((a) => a.isCorrect);
    if (!hasCorrectAnswer) {
      toast.error("حداقل یک پاسخ صحیح الزامی است");
      return;
    }

    setIsSaving(true);
    const result = await saveQuestion(editingQuestion);
    setIsSaving(false);

    if (result.success) {
      setIsSheetOpen(false);
      const reloadResult = await getQuestions({
        lessonId: selectedLessonId || undefined,
        search: debouncedSearch || undefined,
      });
      setQuestions(reloadResult.questions);
      setNextCursor(reloadResult.nextCursor);
      toast.success("سوال با موفقیت ذخیره شد");
    } else {
      toast.error("خطا در ذخیره سازی: " + (result.error || "Unknown error"));
    }
  };

  const addAnswer = () => {
    if (!editingQuestion) return;
    const newAnswer: AnswerInput = {
      id: crypto.randomUUID(),
      title: "",
      isCorrect: false,
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

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedLessonId("");
  };

  const hasActiveFilters = searchQuery || selectedLessonId;

  return (
    <>
      <AppHeader>
        <div className="flex items-center gap-2 flex-1">
          <AppSearch
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جستجو در سوالات"
          />

          <LessonCombobox
            lessons={lessons}
            value={selectedLessonId}
            onValueChange={setSelectedLessonId}
            placeholder="فیلتر بر اساس درس"
            icon={<FilterIcon className="w-4 h-4 text-muted-foreground" />}
            triggerClassName="w-fit"
            className="w-[300px]"
          />

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="icon"
              onClick={clearFilters}
              title="پاک کردن فیلترها"
            >
              <XIcon className="w-4 h-4" />
            </Button>
          )}

          <div className="flex-1" />
          <Button onClick={handleAddNew} className="gap-2">
            <PlusIcon className="w-4 h-4" />
            افزودن سوال
          </Button>
        </div>
      </AppHeader>

      <AppContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {questions.map((question) => (
            <QuestionCard
              key={question.id}
              question={question}
              onEdit={() => handleEdit(question)}
              onDelete={() => handleDelete(question.id)}
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
            <p className="text-lg">سوالی یافت نشد</p>
            {hasActiveFilters && (
              <Button variant="link" onClick={clearFilters}>
                پاک کردن فیلترها
              </Button>
            )}
          </div>
        )}

        {nextCursor && !isLoading && <div ref={loadMoreRef} className="h-10" />}
      </AppContent>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent
          className="sm:max-w-2xl flex flex-col h-full w-full"
          side="left"
        >
          <SheetHeader>
            <SheetTitle>
              {editingQuestion?.id ? "ویرایش سوال" : "سوال جدید"}
            </SheetTitle>
            <SheetDescription>
              سوال و پاسخ‌های آن را تنظیم کنید.
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto p-4">
            {editingQuestion && (
              <div className="flex flex-col gap-6">
                <div className="space-y-2">
                  <Label>درس مربوطه</Label>
                  <LessonCombobox
                    lessons={lessons}
                    value={editingQuestion.lessonId}
                    onValueChange={(value) =>
                      setEditingQuestion({
                        ...editingQuestion,
                        lessonId: value,
                      })
                    }
                    placeholder="انتخاب درس..."
                    triggerClassName="w-full"
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label>متن سوال</Label>
                  <RichTextEditor
                    value={editingQuestion.title}
                    onChange={(value) =>
                      setEditingQuestion({ ...editingQuestion, title: value })
                    }
                    placeholder="متن سوال را وارد کنید..."
                    minHeight="120px"
                  />
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-semibold">پاسخ‌ها</Label>
                    <Button size="sm" variant="outline" onClick={addAnswer}>
                      <PlusIcon className="w-4 h-4 ml-2" />
                      افزودن پاسخ
                    </Button>
                  </div>

                  <div className="flex flex-col gap-3">
                    {editingQuestion.answers.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground border border-dashed rounded-md">
                        هنوز پاسخی اضافه نشده است.
                      </div>
                    ) : (
                      editingQuestion.answers.map((answer, idx) => (
                        <AnswerItem
                          key={answer.id}
                          answer={answer}
                          onChange={(updated) => updateAnswer(idx, updated)}
                          onDelete={() => deleteAnswer(idx)}
                          onToggleCorrect={() => toggleAnswerCorrect(idx)}
                        />
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          <SheetFooter className="mt-auto border-t pt-4 flex-row-reverse sm:justify-start gap-2">
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? "در حال ذخیره..." : "ذخیره تغییرات"}
            </Button>
            <SheetClose asChild>
              <Button variant="outline">لغو</Button>
            </SheetClose>
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
              آیا از حذف این سوال اطمینان دارید؟
            </AlertDialogTitle>
            <AlertDialogDescription>
              این عملیات غیرقابل بازگشت است و تمام پاسخ‌های مربوط به این سوال
              نیز حذف خواهد شد.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel>انصراف</AlertDialogCancel>
            <AlertDialogAction
              onClick={executeDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
