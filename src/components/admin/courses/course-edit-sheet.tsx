"use client";

import {
  closestCenter,
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { PlusIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { Textarea } from "@/components/ui/textarea";
import { Locale } from "@/lib/locales";

import { SortableLessonItem } from "./sortable-lesson-item";
import { Course, CoursesDict, Lesson } from "./types";

export function CourseEditSheet({
  open,
  onOpenChange,
  course,
  onCourseChange,
  onSave,
  isSaving,
  dict,
  lang,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  course: Course | null;
  onCourseChange: (course: Course) => void;
  onSave: () => void;
  isSaving: boolean;
  dict: CoursesDict;
  lang: Locale;
}) {
  const [collapseAllSignal, setCollapseAllSignal] = useState(0);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor)
  );

  const addRootLesson = () => {
    if (!course) return;
    const newLesson: Lesson = {
      id: crypto.randomUUID(),
      title: dict.new_module,
      order: course.lessons.length,
      children: [],
    };
    onCourseChange({
      ...course,
      lessons: [...course.lessons, newLesson],
    });
  };

  const updateRootLesson = (index: number, updated: Lesson) => {
    if (!course) return;
    const newLessons = [...course.lessons];
    newLessons[index] = updated;
    onCourseChange({ ...course, lessons: newLessons });
  };

  const deleteRootLesson = (index: number) => {
    if (!course) return;
    const newLessons = [...course.lessons];
    newLessons.splice(index, 1);
    onCourseChange({ ...course, lessons: newLessons });
  };

  const handleRootLessonDragEnd = (event: DragEndEvent) => {
    if (!course) return;
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = course.lessons.findIndex((l) => l.id === active.id);
    const newIndex = course.lessons.findIndex((l) => l.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      let newLessons = arrayMove(course.lessons, oldIndex, newIndex);
      newLessons = newLessons.map((l, idx) => ({ ...l, order: idx }));
      onCourseChange({ ...course, lessons: newLessons });
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        className="sm:max-w-2xl flex flex-col h-full w-full"
        side={lang === "fa" ? "left" : "right"}
      >
        {course && (
          <>
            <SheetHeader>
              <SheetTitle>
                {course?.id
                  ? dict.edit_course_sheet_title
                  : dict.new_course_sheet_title}
              </SheetTitle>
              <SheetDescription>{dict.sheet_description}</SheetDescription>
            </SheetHeader>

            <div className="flex-1 overflow-y-auto p-4">
              <div className="flex flex-col gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>{dict.title_label}</Label>
                    <Input
                      value={course.title}
                      onChange={(e) =>
                        onCourseChange({
                          ...course,
                          title: e.target.value,
                        })
                      }
                      placeholder={dict.course_title_placeholder}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{dict.description_label}</Label>
                    <Textarea
                      value={course.description || ""}
                      onChange={(e) =>
                        onCourseChange({
                          ...course,
                          description: e.target.value,
                        })
                      }
                      placeholder={dict.description_placeholder}
                      rows={3}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-semibold">
                      {dict.lesson_structure_label}
                    </Label>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={addRootLesson}
                      >
                        <PlusIcon className="w-4 h-4" />
                        {dict.add_module_button}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setCollapseAllSignal((s) => s + 1)}
                        title={dict.collapse_all_tooltip}
                      >
                        {dict.close_all_button}
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    {course.lessons.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground border border-dashed rounded-md">
                        {dict.no_lessons_message}
                      </div>
                    ) : (
                      <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleRootLessonDragEnd}
                      >
                        <SortableContext
                          items={course.lessons.map((l) => l.id)}
                          strategy={verticalListSortingStrategy}
                        >
                          <div className="flex flex-col gap-2">
                            {course.lessons.map((lesson, idx) => (
                              <SortableLessonItem
                                key={lesson.id}
                                lesson={lesson}
                                collapseSignal={collapseAllSignal}
                                onChange={(updated) =>
                                  updateRootLesson(idx, updated)
                                }
                                onDelete={() => deleteRootLesson(idx)}
                                dict={dict}
                              />
                            ))}
                          </div>
                        </SortableContext>
                      </DndContext>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <SheetFooter className="mt-auto border-t pt-4 flex-row-reverse sm:justify-start gap-2">
              <Button onClick={onSave} disabled={isSaving}>
                {isSaving ? dict.saving_button : dict.save_changes_button}
              </Button>
              <SheetClose asChild>
                <Button variant="outline">{dict.cancel_button}</Button>
              </SheetClose>
            </SheetFooter>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
