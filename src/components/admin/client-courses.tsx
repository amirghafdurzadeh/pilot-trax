"use client";

import { PlusIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { deleteCourseAction, saveCourse } from "@/actions/courses";
import { AppContent } from "@/components/core/app-content";
import { AppHeader } from "@/components/core/app-header";
import { AppSearch } from "@/components/core/app-search";
import { Button } from "@/components/ui/button";
import { getDictionary } from "@/lib/dictionaries";
import { Locale } from "@/lib/locales";

import { CourseEditSheet } from "./courses/course-edit-sheet";
import { CourseList } from "./courses/course-list";
import { DeleteCourseDialog } from "./courses/delete-course-dialog";
import { Course } from "./courses/types";

type AppDict = Awaited<ReturnType<typeof getDictionary>>["app"];

export default function CoursesPageClient({
  initialCourses,
  lang,
  dict,
}: {
  initialCourses: Course[];
  lang: Locale;
  dict: AppDict;
}) {
  const courses = initialCourses;
  const [searchQuery, setSearchQuery] = useState("");
  const coursesDict = dict.admin.courses;

  const filteredCourses = courses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (course.description &&
        course.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [courseToDelete, setCourseToDelete] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleAddNew = () => {
    setEditingCourse({
      id: crypto.randomUUID(),
      title: "",
      description: "",
      questions: 0,
      lessons: [],
    });
    setIsSheetOpen(true);
  };

  const handleEdit = (course: Course) => {
    setEditingCourse({
      ...course,
      lessons: [...course.lessons].sort(
        (a, b) => (a.order ?? 0) - (b.order ?? 0)
      ),
    });
    setIsSheetOpen(true);
  };

  const handleDelete = (id: string) => {
    setCourseToDelete(id);
  };

  const executeDelete = async () => {
    if (courseToDelete) {
      const result = await deleteCourseAction(lang, courseToDelete);
      if (result.success) {
        toast.success(coursesDict.delete_course_success);
      } else {
        toast.error(coursesDict.delete_course_error);
      }
      setCourseToDelete(null);
    }
  };

  const handleSave = async () => {
    if (!editingCourse) return;

    if (!editingCourse.title.trim()) {
      toast.error(coursesDict.title_required);
      return;
    }

    setIsSaving(true);
    const result = await saveCourse(lang, editingCourse);
    setIsSaving(false);

    if (result.success) {
      setIsSheetOpen(false);
      setEditingCourse(null);
      toast.success(coursesDict.save_course_success);
    } else {
      toast.error(coursesDict.save_course_error + (result.error || ""));
    }
  };

  const handleCourseChange = (updatedCourse: Course) => {
    setEditingCourse(updatedCourse);
  };

  return (
    <>
      <AppHeader lang={lang} dict={dict}>
        <div className="flex items-center gap-2 flex-1">
          <AppSearch
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={coursesDict.search_placeholder}
          />
        </div>
      </AppHeader>

      <AppContent>
        <div className="w-full flex flex-col">
          <Button onClick={handleAddNew} className="w-full md:w-fit gap-2">
            <PlusIcon className="w-4 h-4" />
            {coursesDict.add_course_button}
          </Button>
        </div>
        <CourseList
          courses={filteredCourses}
          onEdit={handleEdit}
          onDelete={handleDelete}
          dict={coursesDict}
        />
      </AppContent>

      <CourseEditSheet
        open={isSheetOpen}
        onOpenChange={(isOpen) => {
          setIsSheetOpen(isOpen);
          if (!isOpen) {
            setEditingCourse(null);
          }
        }}
        course={editingCourse}
        onCourseChange={handleCourseChange}
        onSave={handleSave}
        isSaving={isSaving}
        dict={coursesDict}
        lang={lang}
      />

      <DeleteCourseDialog
        open={!!courseToDelete}
        onOpenChange={(open) => !open && setCourseToDelete(null)}
        onConfirm={executeDelete}
        dict={coursesDict}
      />
    </>
  );
}
