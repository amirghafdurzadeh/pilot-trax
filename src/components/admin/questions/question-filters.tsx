"use client";

import { FilterIcon, XIcon } from "lucide-react";

import { type CourseOption } from "@/actions/courses";
import { type LessonOption } from "@/actions/questions";
import { CourseCombobox } from "@/components/admin/course-combobox";
import { LessonCombobox } from "@/components/admin/lesson-combobox";
import { Button } from "@/components/ui/button";
import { getDictionary } from "@/lib/dictionaries";

type AppDict = Awaited<ReturnType<typeof getDictionary>>["app"];
type QuestionsDict = AppDict["admin"]["questions"];

export function QuestionFilters({
  courses,
  lessons,
  selectedCourseId,
  onCourseChange,
  selectedLessonId,
  onLessonChange,
  hasActiveFilters,
  onClearFilters,
  dict,
}: {
  courses: CourseOption[];
  lessons: LessonOption[];
  selectedCourseId: string;
  onCourseChange: (courseId: string) => void;
  selectedLessonId: string;
  onLessonChange: (lessonId: string) => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  dict: QuestionsDict;
}) {
  return (
    <>
      <CourseCombobox
        courses={courses}
        value={selectedCourseId}
        onValueChange={onCourseChange}
        dict={{
          select_course_placeholder:
            dict.course_combobox.select_course_placeholder,
          search_placeholder: dict.course_combobox.search_placeholder,
          no_course_found_message: dict.course_combobox.no_course_found_message,
        }}
        icon={<FilterIcon className="w-4 h-4 text-muted-foreground" />}
        triggerClassName="w-full md:w-fit"
      />
      <LessonCombobox
        lessons={lessons}
        value={selectedLessonId}
        onValueChange={onLessonChange}
        dict={dict.lesson_combobox}
        icon={<FilterIcon className="w-4 h-4 text-muted-foreground" />}
        triggerClassName="w-full md:w-fit"
      />
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onClearFilters}
          title={dict.clear_filters_tooltip}
        >
          <XIcon className="w-4 h-4" />
        </Button>
      )}
    </>
  );
}
