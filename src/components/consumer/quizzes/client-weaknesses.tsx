"use client";

import {
  getHardestQuestions,
  saveQuestionInteraction,
} from "@/actions/quizzes";
import { AppContent } from "@/components/core/app-content";
import { AppHeader } from "@/components/core/app-header";
import { AppSearch } from "@/components/core/app-search";
import { CourseCombobox } from "@/components/core/course-combobox";
import { LessonCombobox } from "@/components/core/lesson-combobox";
import { StatusCombobox } from "@/components/core/status-combobox";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Dictionary } from "@/lib/dictionaries";
import { Locale } from "@/lib/locales";
import {
  AlertTriangle,
  Eye,
  FilterIcon,
  ShieldCheck,
  X,
  XIcon,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { QuestionDetailsDialog } from "./question-details-dialog";

interface ClientWeaknessesProps {
  lang: Locale;
  dict: Dictionary;
  initialQuestions: Awaited<ReturnType<typeof getHardestQuestions>>;
  isPremium: boolean;
}

export function ClientWeaknesses({
  lang,
  dict,
  initialQuestions,
  isPremium,
}: ClientWeaknessesProps) {
  const [search, setSearch] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [selectedLessonId, setSelectedLessonId] = useState<string>("");
  const [hardnessFilter, setHardnessFilter] = useState("all");
  const [showDescriptions, setShowDescriptions] = useState<{
    [qId: string]: boolean;
  }>({});
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState<
    number | null
  >(null);

  const questionsDict = dict.app.admin.questions;
  const t = dict.app.admin.weaknesses;

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

  const statusesData = useMemo(
    () => [
      {
        id: "MASTERED",
        title: t.mastered,
        icon: <ShieldCheck className="w-4 h-4 text-green-600" />,
        className: "text-green-600 dark:text-green-400",
      },
      {
        id: "UNSURE",
        title: t.unsure,
        icon: <AlertTriangle className="w-4 h-4 text-yellow-500" />,
        className: "text-yellow-600 dark:text-yellow-400",
      },
      {
        id: "CONFUSED",
        title: t.confused,
        icon: <X className="w-4 h-4 text-red-600" />,
        className: "text-red-600 dark:text-red-400",
      },
    ],
    [t.mastered, t.unsure, t.confused],
  );

  const filteredQuestions = useMemo(() => {
    return initialQuestions.filter((q) => {
      const matchesSearch = q.title
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesCourse =
        !selectedCourseId || q.lesson?.course?.id === selectedCourseId;
      const matchesLesson =
        !selectedLessonId || q.lesson?.id === selectedLessonId;
      const matchesHardness =
        hardnessFilter === "all" || q.questionInteractions[0]?.state === hardnessFilter;
      return matchesSearch && matchesCourse && matchesLesson && matchesHardness;
    });
  }, [
    initialQuestions,
    search,
    selectedCourseId,
    selectedLessonId,
    hardnessFilter,
  ]);

  const handleSaveInteraction = async (questionId: string, state: string) => {
    try {
      await saveQuestionInteraction(questionId, state);
      toast.success(t.saved);
    } catch (err) {
      console.error(err);
      toast.error(t.failed_to_save);
    }
  };

  const toggleDescription = (qId: string) => {
    if (!isPremium) {
      toast.info(t.premium_only);
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

  const handleNext = () => {
    if (
      selectedQuestionIndex !== null &&
      selectedQuestionIndex < filteredQuestions.length - 1
    ) {
      setSelectedQuestionIndex(selectedQuestionIndex + 1);
    }
  };

  const handlePrev = () => {
    if (selectedQuestionIndex !== null && selectedQuestionIndex > 0) {
      setSelectedQuestionIndex(selectedQuestionIndex - 1);
    }
  };

  const currentQuestion =
    selectedQuestionIndex !== null
      ? filteredQuestions[selectedQuestionIndex]
      : null;

  const hasActiveFilters =
    search !== "" ||
    selectedCourseId !== "" ||
    selectedLessonId !== "" ||
    hardnessFilter !== "all";

  return (
    <>
      <AppHeader lang={lang} dict={dict.app}>
        <div className="flex items-center gap-2 flex-1">
          <AppSearch
            placeholder={t.search_placeholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </AppHeader>
      <AppContent>
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">{t.title}</h1>
          <p className="text-muted-foreground text-lg">{t.description}</p>
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
                select_status_placeholder: t.all_statuses,
                search_placeholder: t.search_status_placeholder,
                no_status_found_message: t.no_status_found,
              }}
              icon={<FilterIcon className="w-4 h-4 text-muted-foreground" />}
              triggerClassName="w-full md:w-fit md:min-w-[150px]"
            />
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="icon"
                onClick={clearFilters}
                title={t.clear_filters_tooltip}
              >
                <XIcon className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        {filteredQuestions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground border-2 border-dashed rounded-xl">
            <p className="text-lg">{t.no_questions_found}</p>
            {hasActiveFilters && (
              <Button variant="link" onClick={clearFilters}>
                {questionsDict.clear_filters_button}
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredQuestions.map((q, index) => {
              const state = q.questionInteractions[0]?.state || null;
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
                            : "bg-yellow-50 dark:bg-yellow-950/20 border-green-200 dark:border-green-900/30 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-100"
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
                            : "bg-red-50 dark:bg-red-950/20 border-green-200 dark:border-green-900/30 text-red-700 dark:text-red-400 hover:bg-red-100"
                        }`}
                        title={t.confused}
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-4 flex-1 space-y-4">
                    <div
                      className="font-semibold text-base leading-relaxed text-foreground select-none"
                      dangerouslySetInnerHTML={{ __html: q.title }}
                    />

                    <div className="flex justify-between items-center">
                      <div className="flex gap-4 text-xs font-medium text-muted-foreground pt-2">
                        <span>
                          {t.incorrect}
                          <strong className="text-red-500 font-mono">
                            {q.incorrectCount}
                          </strong>
                        </span>
                        <span>
                          {t.total_attempts}
                          <strong className="font-mono">
                            {q.totalAttempts}
                          </strong>
                        </span>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="gap-1.5 h-8 text-xs"
                        onClick={() => setSelectedQuestionIndex(index)}
                      >
                        <Eye className="w-3.5 h-3.5" />
                        {t.view_details}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        <QuestionDetailsDialog
          open={selectedQuestionIndex !== null}
          onOpenChange={(open) => {
            if (!open) {
              setSelectedQuestionIndex(null);
              setShowDescriptions({});
            }
          }}
          lang={lang}
          dict={dict}
          currentQuestion={currentQuestion}
          currentIndex={selectedQuestionIndex ?? 0}
          totalCount={filteredQuestions.length}
          onNext={handleNext}
          onPrev={handlePrev}
          onSaveInteraction={handleSaveInteraction}
          showDescription={
            selectedQuestionIndex !== null
              ? showDescriptions[currentQuestion?.id ?? ""]
              : false
          }
          onToggleDescription={toggleDescription}
        />
      </AppContent>
    </>
  );
}
