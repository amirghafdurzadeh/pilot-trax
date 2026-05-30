"use client";

import { PlusIcon } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useInView } from "react-intersection-observer";
import { toast } from "sonner";

import { type CourseOption } from "@/actions/courses";
import {
  deleteQuestion,
  getQuestions,
  saveQuestion,
  type LessonOption,
  type QuestionInput,
  type QuestionWithDetails,
} from "@/actions/questions";
import { AppContent } from "@/components/core/app-content";
import { AppHeader } from "@/components/core/app-header";
import { AppSearch } from "@/components/core/app-search";
import { Button } from "@/components/ui/button";
import { getDictionary } from "@/lib/dictionaries";
import { Locale } from "@/lib/locales";
import { DeleteQuestionDialog } from "./questions/delete-question-dialog";
import { ExcelImportButton } from "./questions/excel-import-button";
import { QuestionCard } from "./questions/question-card";
import { QuestionFilters } from "./questions/question-filters";
import { QuestionSheet } from "./questions/question-sheet";
import { QuestionSkeleton } from "./questions/question-skeleton";

type AppDict = Awaited<ReturnType<typeof getDictionary>>["app"];

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

  const reloadQuestions = useCallback(async () => {
    setIsLoading(true);
    const result = await getQuestions({
      courseId: selectedCourseId || undefined,
      lessonId: selectedLessonId || undefined,
      search: debouncedSearch || undefined,
    });
    setQuestions(result.questions);
    setNextCursor(result.nextCursor);
    setIsLoading(false);
  }, [selectedCourseId, selectedLessonId, debouncedSearch]);


  useEffect(() => {
    if (debouncedSearch || selectedLessonId || selectedCourseId) {
      reloadQuestions();
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
    reloadQuestions
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
        order: a.order,
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

  const handleSave = async (question: QuestionInput) => {
    if (!question.title.trim()) {
      toast.error(questionsDict.title_required_toast);
      return;
    }

    if (!question.lessonId) {
      toast.error(questionsDict.lesson_required_toast);
      return;
    }

    if (question.answers.length === 0) {
      toast.error(questionsDict.one_answer_required_toast);
      return;
    }

    const hasCorrectAnswer = question.answers.some((a) => a.isCorrect);
    if (!hasCorrectAnswer) {
      toast.error(questionsDict.one_correct_answer_required_toast);
      return;
    }

    setIsSaving(true);
    const result = await saveQuestion(lang, question);
    setIsSaving(false);

    if (result.success) {
      reloadQuestions();
      toast.success(questionsDict.save_success_toast);
      setIsSheetOpen(false);
    } else {
      toast.error(questionsDict.save_error_toast + (result.error || ""));
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
    searchQuery !== "" || selectedCourseId !== "" || selectedLessonId !== "";

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
          <ExcelImportButton
            lang={lang}
            dict={questionsDict}
            onSuccess={reloadQuestions}
          />
          <QuestionFilters
            courses={courses}
            lessons={filteredLessons}
            selectedCourseId={selectedCourseId}
            onCourseChange={handleCourseChange}
            selectedLessonId={selectedLessonId}
            onLessonChange={setSelectedLessonId}
            hasActiveFilters={hasActiveFilters}
            onClearFilters={clearFilters}
            dict={questionsDict}
          />
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

      <QuestionSheet
        open={isSheetOpen}
        onOpenChange={setIsSheetOpen}
        question={editingQuestion}
        onSave={handleSave}
        isSaving={isSaving}
        lessons={lessons}
        lang={lang}
        dict={dict}
      />

      <DeleteQuestionDialog
        open={!!questionToDelete}
        onOpenChange={(open) => !open && setQuestionToDelete(null)}
        onConfirm={executeDelete}
        dict={questionsDict}
      />
    </>
  );
}
