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

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Quizzes = Awaited<ReturnType<typeof getQuizzes>>;
type Quiz = Quizzes[number];

interface ClientQuizzesProps {
  lang: Locale;
  quizzes: Quizzes;
  dict: Dictionary;
  userId: string;
}

export function ClientQuizzes({
  lang,
  quizzes,
  dict,
  userId,
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

  const myQuizzes = quizzes.filter((quiz) => quiz.creator?.id === userId);
  const publicQuizzes = quizzes.filter((quiz) => quiz.isPublic);

  useEffect(() => {
    getCourseOptions().then(setCourses);
    getLessonsForFilter().then(setLessons);
  }, []);

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
