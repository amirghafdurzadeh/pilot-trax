"use client";

import React, { useState, useMemo } from "react";
import { toast } from "sonner";
import {
  ShieldCheck,
  Check,
  X,
  AlertTriangle,
  Eye,
  FilterIcon,
  XIcon,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { saveQuestionInteraction } from "@/actions/quizzes";
import { Locale } from "@/lib/locales";
import { AppContent } from "@/components/core/app-content";
import { AppHeader } from "@/components/core/app-header";
import { AppSearch } from "@/components/core/app-search";
import { CourseCombobox } from "@/components/core/course-combobox";
import { LessonCombobox } from "@/components/core/lesson-combobox";
import { StatusCombobox } from "@/components/core/status-combobox";

interface ClientWeaknessesProps {
  lang: Locale;
  dict: any;
  initialQuestions: any[];
  isPremium: boolean;
}

export function ClientWeaknesses({
  lang,
  dict,
  initialQuestions,
  isPremium,
}: ClientWeaknessesProps) {
  const [questions, setQuestions] = useState(initialQuestions);
  const [search, setSearch] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [selectedLessonId, setSelectedLessonId] = useState<string>("");
  const [hardnessFilter, setHardnessFilter] = useState("all");
  const [showDescriptions, setShowDescriptions] = useState<{
    [qId: string]: boolean;
  }>({});

  const questionsDict = dict.app.admin.questions;
  const isFa = lang === "fa";
  
  const t = {
    showDescription: isFa ? "مشاهده توضیح" : "Show Description",
    premiumOnly: isFa ? "مخصوص کاربران ویژه" : "Premium Only",
    viewDetails: isFa ? "مشاهده جزئیات" : "View Details",
    incorrect: isFa ? "نادرست: " : "Incorrect: ",
    totalAttempts: isFa ? "کل پاسخ‌ها: " : "Total Attempts: ",
    mastered: isFa ? "تسلط کامل" : "Mastered",
    unsure: isFa ? "شک دارم" : "Unsure",
    confused: isFa ? "نیاز به بررسی" : "Confused",
    searchPlaceholder: isFa ? "جستجو در سوالات..." : "Search questions...",
    allCourses: isFa ? "همه دوره‌ها" : "All Courses",
    allLessons: isFa ? "همه دروس" : "All Lessons",
    statusFilter: isFa ? "فیلتر وضعیت" : "Status Filter",
    allStatuses: isFa ? "همه وضعیت‌ها" : "All Statuses",
    noQuestionsFound: isFa
      ? "هیچ سوالی با این مشخصات یافت نشد."
      : "No questions found matching your filters.",
    questionDetails: isFa ? "جزئیات سوال" : "Question Details",
    saved: isFa ? "ذخیره شد" : "Saved",
    failedToSave: isFa ? "خطا در ذخیره وضعیت" : "Failed to save state",
    clearFiltersTooltip: isFa ? "پاک کردن فیلترها" : "Clear Filters",
    title: isFa ? "نقاط ضعف و سوالات دشوار" : "Weaknesses & Hard Questions",
    description: isFa ? "مرور سوالاتی که در آن‌ها چالش داشتید" : "Review questions you've struggled with",
    noStatusFound: isFa ? "وضعیتی یافت نشد." : "No status found.",
    searchStatusPlaceholder: isFa ? "جستجوی وضعیت..." : "Search status...",
  };

  const coursesData = useMemo(() => {
    const courseMap = new Map<string, { id: string; title: string }>();
    initialQuestions.forEach((q) => {
      const course = q.lesson?.course;
      if (course && !courseMap.has(course.id)) {
        courseMap.set(course.id, { id: course.id, title: course.title });
      }
    });
    return Array.from(courseMap.values());
  }, [initialQuestions]);

  const lessonsData = useMemo(() => {
    const lessonMap = new Map<string, any>();
    initialQuestions.forEach((q) => {
      const lesson = q.lesson;
      if (lesson && !lessonMap.has(lesson.id)) {
        lessonMap.set(lesson.id, {
          id: lesson.id,
          title: lesson.title,
          courseId: lesson.courseId,
          courseName: lesson.course?.title || "",
          depth: 0,
        });
      }
    });
    return Array.from(lessonMap.values());
  }, [initialQuestions]);

  const filteredLessons = useMemo(() => {
    if (!selectedCourseId) {
      return lessonsData;
    }
    return lessonsData.filter((lesson) => lesson.courseId === selectedCourseId);
  }, [selectedCourseId, lessonsData]);

  const statusesData = useMemo(() => [
    { 
      id: "MASTERED", 
      title: t.mastered, 
      icon: <ShieldCheck className="w-4 h-4 text-green-600" />,
      className: "text-green-600 dark:text-green-400"
    },
    { 
      id: "UNSURE", 
      title: t.unsure, 
      icon: <AlertTriangle className="w-4 h-4 text-yellow-500" />,
      className: "text-yellow-600 dark:text-yellow-400"
    },
    { 
      id: "CONFUSED", 
      title: t.confused, 
      icon: <X className="w-4 h-4 text-red-600" />,
      className: "text-red-600 dark:text-red-400"
    },
  ], [t.mastered, t.unsure, t.confused]);

  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      const matchesSearch = q.title
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesCourse =
        !selectedCourseId || q.lesson?.course?.id === selectedCourseId;
      const matchesLesson =
        !selectedLessonId || q.lesson?.id === selectedLessonId;
      const matchesHardness =
        hardnessFilter === "all" || q.interactionState === hardnessFilter;
      return matchesSearch && matchesCourse && matchesLesson && matchesHardness;
    });
  }, [questions, search, selectedCourseId, selectedLessonId, hardnessFilter]);

  const handleSaveInteraction = async (questionId: string, state: string) => {
    setQuestions((prev) =>
      prev.map((q) =>
        q.id === questionId ? { ...q, interactionState: state } : q,
      ),
    );
    try {
      await saveQuestionInteraction(questionId, state);
      toast.success(t.saved);
    } catch (err) {
      console.error(err);
      toast.error(t.failedToSave);
    }
  };

  const toggleDescription = (qId: string) => {
    if (!isPremium) {
      toast.info(t.premiumOnly);
      return;
    }
    setShowDescriptions((prev) => ({ ...prev, [qId]: !prev[qId] }));
  };

  const clearFilters = () => {
    setSearch("");
    setSelectedCourseId("");
    setSelectedLessonId("");
    setHardnessFilter("all");
  };

  const hasActiveFilters =
    search !== "" || selectedCourseId !== "" || selectedLessonId !== "" || hardnessFilter !== "all";

  return (
    <>
      <AppHeader lang={lang} dict={dict.app}>
        <div className="flex items-center gap-2 flex-1">
          <AppSearch
              placeholder={t.searchPlaceholder}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </AppHeader>
      <AppContent>
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            {t.title}
          </h1>
          <p className="text-muted-foreground text-lg">
            {t.description}
          </p>
        </div>

        <div className="w-full flex flex-col xl:flex-row gap-2 items-center justify-between mb-6">
          <div className="flex flex-col md:flex-row gap-2 w-full xl:w-fit items-center">
            <CourseCombobox
              courses={coursesData}
              value={selectedCourseId}
              onValueChange={(v) => {
                setSelectedCourseId(v);
                setSelectedLessonId("");
              }}
              dict={questionsDict.course_combobox}
              icon={<FilterIcon className="w-4 h-4 text-muted-foreground" />}
              triggerClassName="w-full md:w-fit"
            />
            <LessonCombobox
              lessons={filteredLessons}
              value={selectedLessonId}
              onValueChange={setSelectedLessonId}
              dict={questionsDict.lesson_combobox}
              icon={<FilterIcon className="w-4 h-4 text-muted-foreground" />}
              triggerClassName="w-full md:w-fit md:min-w-[200px]"
              disabled={!selectedCourseId && filteredLessons.length === 0}
            />
            <StatusCombobox
              statuses={statusesData}
              value={hardnessFilter}
              onValueChange={setHardnessFilter}
              dict={{
                select_status_placeholder: t.allStatuses,
                search_placeholder: t.searchStatusPlaceholder,
                no_status_found_message: t.noStatusFound,
              }}
              icon={<FilterIcon className="w-4 h-4 text-muted-foreground" />}
              triggerClassName="w-full md:w-fit md:min-w-[150px]"
            />
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="icon"
                onClick={clearFilters}
                title={t.clearFiltersTooltip}
              >
                <XIcon className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {filteredQuestions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground border-2 border-dashed rounded-xl">
            <p className="text-lg">{t.noQuestionsFound}</p>
            {hasActiveFilters && (
              <Button variant="link" onClick={clearFilters}>
                {questionsDict.clear_filters_button}
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredQuestions.map((q) => {
              const state = q.interactionState || null;
              return (
                <Card
                  key={q.id}
                  className="border border-border/40 shadow-sm flex flex-col bg-card hover:border-border transition-all"
                >
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
                        title={t.mastered}
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
                        title={t.unsure}
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
                        title={t.confused}
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4 flex-1 space-y-4">
                    <div className="font-semibold text-base leading-relaxed text-foreground select-none">
                      {q.title}
                    </div>

                    <div className="flex justify-between items-center">
                      <div className="flex gap-4 text-xs font-medium text-muted-foreground pt-2">
                        <span>
                          {t.incorrect}
                          <strong className="text-red-500 font-mono">
                            {q.incorrectCount}
                          </strong>
                        </span>
                        <span>
                          {t.totalAttempts}
                          <strong className="font-mono">
                            {q.totalAttempts}
                          </strong>
                        </span>
                      </div>

                      <Dialog
                        onOpenChange={(open) => {
                          if (!open)
                            setShowDescriptions((prev) => ({
                              ...prev,
                              [q.id]: false,
                            }));
                        }}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="gap-1.5 h-8 text-xs"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            {t.viewDetails}
                          </Button>
                        </DialogTrigger>
                        <DialogContent
                          className="max-w-2xl max-h-[90vh] overflow-y-auto text-start"
                          dir={lang === "fa" ? "rtl" : "ltr"}
                        >
                          <DialogHeader>
                            <DialogTitle className="flex items-center justify-between gap-2">
                              <span>{t.questionDetails}</span>
                              {q.description && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => toggleDescription(q.id)}
                                  className="text-xs text-muted-foreground gap-1"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  {t.showDescription}
                                </Button>
                              )}
                            </DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4 pt-4">
                            <div className="text-lg font-semibold leading-relaxed">
                              {q.title}
                            </div>

                            {showDescriptions[q.id] && q.description && (
                              <div className="p-4 bg-blue-50/50 dark:bg-blue-900/10 rounded-lg text-sm text-blue-900 dark:text-blue-100 border border-blue-100 dark:border-blue-900/30 leading-relaxed animate-in fade-in slide-in-from-top-2 duration-300">
                                {q.description}
                              </div>
                            )}

                            <div className="grid gap-2">
                              {q.answers.map((answer: any) => (
                                <div
                                  key={answer.id}
                                  className={`flex items-center p-3 rounded-lg border text-sm font-medium ${
                                    answer.isCorrect
                                      ? "border-green-600 bg-green-50/20 text-green-900 dark:text-green-100 ring-1 ring-green-500/30"
                                      : "border-border/60"
                                  }`}
                                >
                                  <span>{answer.title}</span>
                                  {answer.isCorrect && (
                                    <Check className="ms-auto w-4 h-4 text-green-600 shrink-0" />
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </AppContent>
    </>
  );
}
