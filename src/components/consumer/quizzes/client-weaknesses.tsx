"use client";

import React, { useState, useMemo } from "react";
import { toast } from "sonner";
import {
  ShieldCheck,
  Check,
  X,
  AlertTriangle,
  Eye,
  Search,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  const [courseFilter, setCourseFilter] = useState("all");
  const [lessonFilter, setLessonFilter] = useState("all");
  const [hardnessFilter, setHardnessFilter] = useState("all");
  const [showDescriptions, setShowDescriptions] = useState<{
    [qId: string]: boolean;
  }>({});

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
  };

  const courses = useMemo(() => {
    const cMap = new Map<string, Set<string>>();
    initialQuestions.forEach((q) => {
      const cTitle = q.lesson?.course?.title;
      const lTitle = q.lesson?.title;
      if (cTitle && lTitle) {
        if (!cMap.has(cTitle)) {
          cMap.set(cTitle, new Set());
        }
        cMap.get(cTitle)!.add(lTitle);
      }
    });
    return cMap;
  }, [initialQuestions]);

  const availableLessons = useMemo(() => {
    if (courseFilter === "all") return [];
    return Array.from(courses.get(courseFilter) || []);
  }, [courses, courseFilter]);

  const filteredQuestions = useMemo(() => {
    return questions.filter((q) => {
      const matchesSearch = q.title
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesCourse =
        courseFilter === "all" || q.lesson?.course?.title === courseFilter;
      const matchesLesson =
        lessonFilter === "all" || q.lesson?.title === lessonFilter;
      const matchesHardness =
        hardnessFilter === "all" || q.interactionState === hardnessFilter;
      return matchesSearch && matchesCourse && matchesLesson && matchesHardness;
    });
  }, [questions, search, courseFilter, lessonFilter, hardnessFilter]);

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
            {isFa ? "نقاط ضعف و سوالات دشوار" : "Weaknesses & Hard Questions"}
          </h1>
          <p className="text-muted-foreground text-lg">
            {isFa
              ? "مرور سوالاتی که در آن‌ها چالش داشتید"
              : "Review questions you've struggled with"}
          </p>
        </div>
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <Select
            value={courseFilter}
            onValueChange={(v) => {
              setCourseFilter(v);
              setLessonFilter("all");
            }}
          >
            <SelectTrigger className="w-full md:w-60">
              <SelectValue placeholder={t.allCourses} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.allCourses}</SelectItem>
              {Array.from(courses.keys()).map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select
            value={lessonFilter}
            onValueChange={setLessonFilter}
            disabled={courseFilter === "all"}
          >
            <SelectTrigger className="w-full md:w-120">
              <SelectValue placeholder={t.allLessons} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.allLessons}</SelectItem>
              {availableLessons.map((l) => (
                <SelectItem key={l} value={l}>
                  {l}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={hardnessFilter} onValueChange={setHardnessFilter}>
            <SelectTrigger className="w-full md:w-60">
              <SelectValue placeholder={t.statusFilter} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.allStatuses}</SelectItem>
              <SelectItem value="MASTERED">{t.mastered}</SelectItem>
              <SelectItem value="UNSURE">{t.unsure}</SelectItem>
              <SelectItem value="CONFUSED">{t.confused}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {filteredQuestions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground border-2 border-dashed rounded-xl">
            <p className="text-lg">{t.noQuestionsFound}</p>
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
