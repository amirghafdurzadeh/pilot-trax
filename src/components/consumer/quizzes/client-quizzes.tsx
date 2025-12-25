"use client";

import { FilterIcon, PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { getCourseOptions, type CourseOption } from "@/actions/courses";
import { getLessonsForFilter, type LessonOption } from "@/actions/questions";
import { getQuizzes, type QuizInput } from "@/actions/quizzes";
import { CourseCombobox } from "@/components/admin/course-combobox";
import { AppContent } from "@/components/core/app-content";
import { AppHeader } from "@/components/core/app-header";
import { AppSearch } from "@/components/core/app-search";
import { Button } from "@/components/ui/button";
import { QuizSelectionMode } from "@/generated/prisma/enums";
import { Dictionary } from "@/lib/dictionaries";
import { Locale } from "@/lib/locales";
import { QuizCard } from "./quiz-card";
import { QuizSheet } from "./quiz-sheet";

type Quizzes = Awaited<ReturnType<typeof getQuizzes>>;

interface ClientQuizzesProps {
  lang: Locale;
  quizzes: Quizzes;
  dict: Dictionary;
}

export function ClientQuizzes({ lang, quizzes, dict }: ClientQuizzesProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<QuizInput | null>(null);
  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [lessons, setLessons] = useState<LessonOption[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState("");

  useEffect(() => {
    getCourseOptions().then(setCourses);
    getLessonsForFilter().then(setLessons);
  }, []);

  const filteredQuizzes = quizzes
    .filter((quiz) =>
      quiz.title.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((quiz) =>
      selectedCourse ? quiz.courseId === selectedCourse : true
    );

  const handleAddQuiz = () => {
    setSelectedQuiz({
      title: "",
      courseId: "",
      duration: 120,
      questionCount: 120,
      selectionMode: QuizSelectionMode.SHUFFLED,
      lessons: [],
    });
    setSheetOpen(true);
  };

  const handleSaveQuiz = (quiz: QuizInput) => {
    setIsSaving(true);
    console.log("Saving quiz", quiz);
    // Here you would call a server action to save the quiz
    // For now, we'll just log it and close the sheet
    setTimeout(() => {
      setIsSaving(false);
      setSheetOpen(false);
    }, 1000);
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
        <div className="w-full flex flex-col md:flex-row gap-2">
          <Button onClick={handleAddQuiz} className="w-full md:w-fit gap-2">
            <PlusIcon className="w-4 h-4" />
            {dict.app.admin.quizzes.new_quiz_sheet_title}
          </Button>
          <CourseCombobox
            courses={courses}
            value={selectedCourse}
            onValueChange={setSelectedCourse}
            dict={dict.app.admin.questions.course_combobox}
            icon={<FilterIcon className="w-4 h-4 text-muted-foreground" />}
            triggerClassName="w-full md:w-fit"
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredQuizzes.map((quiz) => (
            <QuizCard key={quiz.id} quiz={quiz} dict={dict} lang={lang} />
          ))}
        </div>
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
      />
    </>
  );
}
