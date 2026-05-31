"use client";

import { FilterIcon, PlusIcon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { getCourseOptions, type CourseOption } from "@/actions/courses";
import { getLessonsForFilter, type LessonOption } from "@/actions/questions";
import {
  deleteQuiz,
  getQuiz,
  getQuizzes,
  saveQuiz,
  getHardestQuestions,
  saveQuestionInteraction,
  type QuizInput,
} from "@/actions/quizzes";
import { CourseCombobox } from "@/components/admin/course-combobox";
import { AppContent } from "@/components/core/app-content";
import { AppHeader } from "@/components/core/app-header";
import { AppSearch } from "@/components/core/app-search";
import { Button } from "@/components/ui/button";
import { QuizSelectionMode } from "@/generated/prisma/enums";
import { Dictionary } from "@/lib/dictionaries";
import { Locale } from "@/lib/locales";
import { DeleteQuizDialog } from "./delete-quiz-dialog";
import { QuizCard } from "./quiz-card";
import { QuizSheet } from "./quiz-sheet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ShieldCheck, Check, X, AlertTriangle } from "lucide-react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Quizzes = Awaited<ReturnType<typeof getQuizzes>>;
type Quiz = Quizzes[number];

interface ClientQuizzesProps {
  lang: Locale;
  quizzes: Quizzes;
  dict: Dictionary;
  userId: string;
  isAdmin: boolean;
}


export function ClientQuizzes({
  lang,
  quizzes,
  dict,
  userId,
  isAdmin,
}: ClientQuizzesProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<QuizInput | null>(null);
  const [quizToDelete, setQuizToDelete] = useState<Quiz | null>(null);
  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [lessons, setLessons] = useState<LessonOption[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [activeTab, setActiveTab] = useState("my");
  const [hardestQuestions, setHardestQuestions] = useState<any[]>([]);
  const [isLoadingHardest, setIsLoadingHardest] = useState(false);

  const myQuizzes = quizzes.filter((quiz) => quiz.creator?.id === userId);
  const publicQuizzes = quizzes.filter((quiz) => quiz.isPublic);

  useEffect(() => {
    getCourseOptions().then(setCourses);
    getLessonsForFilter().then(setLessons);
  }, []);

  useEffect(() => {
    if (activeTab === "hardest") {
      setIsLoadingHardest(true);
      getHardestQuestions()
        .then(setHardestQuestions)
        .finally(() => setIsLoadingHardest(false));
    }
  }, [activeTab]);

  const handleSaveInteraction = async (questionId: string, state: string) => {
    setHardestQuestions((prev) =>
      prev.map((q) => (q.id === questionId ? { ...q, interactionState: state } : q))
    );
    try {
      await saveQuestionInteraction(questionId, state);
      toast.success(lang === "fa" ? "ذخیره شد" : "Saved");
    } catch (err) {
      console.error(err);
      toast.error(lang === "fa" ? "خطا در ذخیره وضعیت" : "Failed to save state");
    }
  };

  const getFilteredQuizzes = (quizzes: Quizzes) => {
    return quizzes
      .filter((quiz) =>
        quiz.title.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .filter((quiz) =>
        selectedCourse ? quiz.courseId === selectedCourse : true
      );
  };

  const hasActiveFilters = searchQuery !== "" || selectedCourse !== "";

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCourse("");
  };

  const handleAddQuiz = () => {
    setSelectedQuiz(null);
    setSheetOpen(true);
  };

  const handleEditQuiz = async (quiz: Quiz) => {
    const quizWithLessons = await getQuiz(quiz.id);
    setSelectedQuiz(quizWithLessons);
    setSheetOpen(true);
  };

  const handleDeleteQuiz = (quiz: Quiz) => {
    setQuizToDelete(quiz);
    setDeleteDialogOpen(true);
  };

  const handleSaveQuiz = (quiz: QuizInput) => {
    setIsSaving(true);
    toast.promise(saveQuiz(quiz, lang), {
      loading: dict.app.quizzes.saving_quiz,
      success: () => {
        setIsSaving(false);
        setSheetOpen(false);
        return dict.app.quizzes.quiz_saved_successfully;
      },
      error: () => {
        setIsSaving(false);
        return dict.app.quizzes.failed_to_save_quiz;
      },
    });
  };

  const renderQuizzes = (quizzes: Quizzes) => {
    const filteredQuizzes = getFilteredQuizzes(quizzes);

    if (filteredQuizzes.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
          <p className="text-lg">{dict.app.quizzes.no_quizzes_found}</p>
          {hasActiveFilters && (
            <Button variant="link" onClick={clearFilters}>
              {dict.app.admin.questions.clear_filters_button}
            </Button>
          )}
        </div>
      );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 py-4">
        {filteredQuizzes.map((quiz) => (
          <QuizCard
            key={quiz.id}
            quiz={quiz}
            dict={dict}
            lang={lang}
            onEdit={handleEditQuiz}
            onDelete={handleDeleteQuiz}
          />
        ))}
      </div>
    );
  };

  return (
    <>
      <AppHeader lang={lang} dict={dict.app}>
        <div className="flex items-center gap-2 flex-1">
          <AppSearch
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={dict.app.quizzes.search_placeholder}
          />
        </div>
      </AppHeader>

      <AppContent>
        <Tabs
          dir={lang === "fa" ? "rtl" : "ltr"}
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <div className="w-full flex flex-col md:flex-row gap-2">
            <TabsList className="w-full md:w-fit">
              <TabsTrigger value="my" className="flex-1">
                {dict.app.quizzes.my_quizzes}
              </TabsTrigger>
              <TabsTrigger value="public" className="flex-1">
                {dict.app.quizzes.public_quizzes}
              </TabsTrigger>
              <TabsTrigger value="hardest" className="flex-1">
                {lang === "fa" ? "نقاط ضعف" : "Weaknesses"}
              </TabsTrigger>
            </TabsList>
            {activeTab === "my" && (
              <Button onClick={handleAddQuiz} className="w-full md:w-fit gap-2">
                <PlusIcon className="w-4 h-4" />
                {dict.app.admin.quizzes.new_quiz_sheet_title}
              </Button>
            )}
            <CourseCombobox
              courses={courses}
              value={selectedCourse}
              onValueChange={setSelectedCourse}
              dict={dict.app.admin.questions.course_combobox}
              icon={<FilterIcon className="w-4 h-4 text-muted-foreground" />}
              triggerClassName="w-full md:w-fit"
            />
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="icon"
                onClick={clearFilters}
                title={dict.app.admin.questions.clear_filters_tooltip}
              >
                <XIcon className="w-4 h-4" />
              </Button>
            )}
          </div>
          <TabsContent value="my">{renderQuizzes(myQuizzes)}</TabsContent>
          <TabsContent value="public">{renderQuizzes(publicQuizzes)}</TabsContent>
          <TabsContent value="hardest">
            {isLoadingHardest ? (
              <div className="flex justify-center items-center py-12">
                <span className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></span>
              </div>
            ) : hardestQuestions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                <p className="text-lg">
                  {lang === "fa"
                    ? "هنوز هیچ سوال دشواری ثبت نشده است."
                    : "No hardest questions recorded yet."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                {hardestQuestions.map((q) => {
                  const state = q.interactionState || null;
                  return (
                    <Card key={q.id} className="border border-border/40 shadow-sm flex flex-col bg-card hover:border-border transition-all">
                      <CardHeader className="py-4 border-b border-border/10 flex flex-row items-center justify-between gap-3">
                        <div className="flex flex-col">
                          <span className="text-[10px] uppercase font-semibold text-muted-foreground">
                            {q.lesson?.course?.title} / {q.lesson?.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => handleSaveInteraction(q.id, "MASTERED")}
                            className={`p-1.5 rounded-lg text-xs font-semibold border flex items-center transition-all ${
                              state === "MASTERED"
                                ? "bg-green-600 border-green-600 text-white shadow-sm"
                                : "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-100"
                            }`}
                            title={lang === "fa" ? "تسلط کامل" : "Mastered"}
                          >
                            <ShieldCheck className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleSaveInteraction(q.id, "UNSURE")}
                            className={`p-1.5 rounded-lg text-xs font-semibold border flex items-center transition-all ${
                              state === "UNSURE"
                                ? "bg-yellow-500 border-yellow-500 text-white shadow-sm"
                                : "bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-900/30 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-100"
                            }`}
                            title={lang === "fa" ? "شک دارم" : "Unsure"}
                          >
                            <AlertTriangle className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleSaveInteraction(q.id, "CONFUSED")}
                            className={`p-1.5 rounded-lg text-xs font-semibold border flex items-center transition-all ${
                              state === "CONFUSED"
                                ? "bg-red-600 border-red-600 text-white shadow-sm"
                                : "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-100"
                            }`}
                            title={lang === "fa" ? "نیاز به بررسی" : "Confused"}
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-4 flex-1 space-y-4">
                        <div className="font-semibold text-base leading-relaxed text-foreground select-none">
                          {q.title}
                        </div>
                        {q.description && (
                          <div className="p-3 bg-muted/40 rounded-lg text-xs text-muted-foreground border border-border/10 leading-relaxed">
                            {q.description}
                          </div>
                        )}
                        <div className="flex gap-4 text-xs font-medium text-muted-foreground pt-2">
                          <span>
                            {lang === "fa" ? "نادرست: " : "Incorrect: "}
                            <strong className="text-red-500 font-mono">{q.incorrectCount}</strong>
                          </span>
                          <span>
                            {lang === "fa" ? "کل پاسخ‌ها: " : "Total Attempts: "}
                            <strong className="font-mono">{q.totalAttempts}</strong>
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </AppContent>

      <QuizSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        quiz={selectedQuiz}
        onSave={handleSaveQuiz}
        isSaving={isSaving}
        courses={courses}
        lessons={lessons}
        lang={lang}
        dict={dict.app}
        isAdmin={isAdmin}
      />
      <DeleteQuizDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={() => {
          if (!quizToDelete) return;
          toast.promise(deleteQuiz(quizToDelete.id, lang), {
            loading: dict.app.quizzes.deleting_quiz,
            success: dict.app.quizzes.quiz_deleted_successfully,
            error: dict.app.quizzes.failed_to_delete_quiz,
          });
          setDeleteDialogOpen(false);
        }}
        dict={dict.app.quizzes}
      />
    </>
  );
}
