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
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronsUpDownIcon,
  EllipsisVerticalIcon,
  PencilIcon,
  PlusIcon,
  Trash2Icon,
} from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

import { deleteCourseAction, saveCourse } from "@/actions/courses";
import { AppContent } from "@/components/core/app-content";
import { AppHeader } from "@/components/core/app-header";
import { AppSearch } from "@/components/core/app-search";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { getDictionary } from "@/lib/dictionaries";
import { Locale } from "@/lib/locales";
import { cn } from "@/lib/utils";

type AppDict = Awaited<ReturnType<typeof getDictionary>>["app"];
type CoursesDict = AppDict["admin"]["courses"];

type Lesson = {
  id: string;
  title: string;
  order: number;
  children: Lesson[];
};

type Course = {
  id: string;
  title: string;
  description: string;
  questions: number;
  lessons: Lesson[];
};

function SortableLessonItem({
  lesson,
  onChange,
  onDelete,
  collapseSignal,
  dict,
}: {
  lesson: Lesson;
  onChange: (updated: Lesson) => void;
  onDelete: () => void;
  collapseSignal?: number;
  dict: CoursesDict;
}) {
  const [isExpanded, setIsExpanded] = useState(true);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: lesson.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({ ...lesson, title: e.target.value });
  };

  const handleAddChild = () => {
    const newChild: Lesson = {
      id: crypto.randomUUID(),
      title: dict.new_lesson,
      order: lesson.children.length,
      children: [],
    };
    onChange({ ...lesson, children: [...lesson.children, newChild] });
    setIsExpanded(true);
  };

  const handleUpdateChild = (index: number, updatedChild: Lesson) => {
    const newChildren = [...lesson.children];
    newChildren[index] = updatedChild;
    onChange({ ...lesson, children: newChildren });
  };

  const handleDeleteChild = (index: number) => {
    const newChildren = [...lesson.children];
    newChildren.splice(index, 1);
    onChange({ ...lesson, children: newChildren });
  };

  const handleChildDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = lesson.children.findIndex((c) => c.id === active.id);
    const newIndex = lesson.children.findIndex((c) => c.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      const newChildren = arrayMove(lesson.children, oldIndex, newIndex);
      onChange({ ...lesson, children: newChildren });
    }
  };

  useEffect(() => {
    if (collapseSignal && collapseSignal > 0) {
      setIsExpanded(false);
    }
  }, [collapseSignal]);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex flex-col gap-2 border-s ps-3",
        isDragging && "opacity-50"
      )}
    >
      <div className="flex items-center gap-2">
        <button
          type="button"
          className="cursor-grab shrink-0 text-muted-foreground hover:text-foreground touch-none"
          {...attributes}
          {...listeners}
        >
          <ChevronsUpDownIcon className="h-4 w-4" />
        </button>
        {lesson.children.length > 0 ? (
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 shrink-0"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? (
              <ChevronDownIcon className="h-4 w-4" />
            ) : (
              <ChevronLeftIcon className="h-4 w-4" />
            )}
          </Button>
        ) : (
          <div className="shrink-0 w-6 h-6" />
        )}
        <Input
          value={lesson.title}
          onChange={handleTitleChange}
          className="h-8 text-sm"
          placeholder={dict.lesson_title_placeholder}
        />
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 shrink-0 text-muted-foreground hover:text-foreground"
          onClick={handleAddChild}
          title={dict.add_sub_lesson_tooltip}
        >
          <PlusIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 shrink-0 text-destructive hover:text-destructive/80"
          onClick={onDelete}
          title={dict.delete_lesson_tooltip}
        >
          <Trash2Icon className="h-4 w-4" />
        </Button>
      </div>
      {isExpanded && lesson.children.length > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleChildDragEnd}
        >
          <SortableContext
            items={lesson.children.map((c) => c.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="flex flex-col gap-2">
              {lesson.children.map((child, idx) => (
                <SortableLessonItem
                  key={child.id}
                  lesson={child}
                  collapseSignal={collapseSignal}
                  onChange={(updated) => handleUpdateChild(idx, updated)}
                  onDelete={() => handleDeleteChild(idx)}
                  dict={dict}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
}

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
  const [collapseAllSignal, setCollapseAllSignal] = useState(0);

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
      const result = await deleteCourseAction(courseToDelete);
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
    const result = await saveCourse(editingCourse);
    setIsSaving(false);

    if (result.success) {
      setIsSheetOpen(false);
      toast.success(coursesDict.save_course_success);
    } else {
      toast.error(coursesDict.save_course_error + (result.error || ""));
    }
  };

  const addRootLesson = () => {
    if (!editingCourse) return;
    const newLesson: Lesson = {
      id: crypto.randomUUID(),
      title: coursesDict.new_module,
      order: editingCourse.lessons.length,
      children: [],
    };
    setEditingCourse({
      ...editingCourse,
      lessons: [...editingCourse.lessons, newLesson],
    });
  };

  const updateRootLesson = (index: number, updated: Lesson) => {
    if (!editingCourse) return;
    const newLessons = [...editingCourse.lessons];
    newLessons[index] = updated;
    setEditingCourse({ ...editingCourse, lessons: newLessons });
  };

  const deleteRootLesson = (index: number) => {
    if (!editingCourse) return;
    const newLessons = [...editingCourse.lessons];
    newLessons.splice(index, 1);
    setEditingCourse({ ...editingCourse, lessons: newLessons });
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleRootLessonDragEnd = (event: DragEndEvent) => {
    if (!editingCourse) return;
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = editingCourse.lessons.findIndex((l) => l.id === active.id);
    const newIndex = editingCourse.lessons.findIndex((l) => l.id === over.id);

    if (oldIndex !== -1 && newIndex !== -1) {
      let newLessons = arrayMove(editingCourse.lessons, oldIndex, newIndex);
      newLessons = newLessons.map((l, idx) => ({ ...l, order: idx }));
      setEditingCourse({ ...editingCourse, lessons: newLessons });
    }
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredCourses.map((course) => (
            <Card
              key={course.id}
              className="relative group overflow-hidden transition-all hover:shadow-md"
            >
              <div className="absolute top-2 end-2 z-10">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 bg-background/50 backdrop-blur-sm opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity"
                    >
                      <EllipsisVerticalIcon className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit(course)}>
                      <PencilIcon className="w-4 h-4" />
                      {coursesDict.edit_button}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => handleDelete(course.id)}
                    >
                      <Trash2Icon className="w-4 h-4 text-inherit" />
                      {coursesDict.delete_button}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <CardContent className="flex flex-col gap-3 p-4">
                <div>
                  <CardTitle className="line-clamp-1 text-lg">
                    {course.title}
                  </CardTitle>
                </div>
                <div className="flex flex-col gap-2">
                  <CardDescription className="line-clamp-3 min-h-[4.5em]">
                    {course.description || coursesDict.no_description}
                  </CardDescription>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                    <span className="bg-secondary px-2 py-0.5 rounded text-xs">
                      {coursesDict.questions_count.replace(
                        "{count}",
                        String(course.questions)
                      )}
                    </span>
                    <span className="bg-secondary px-2 py-0.5 rounded text-xs">
                      {coursesDict.modules_count.replace(
                        "{count}",
                        String(course.lessons.length)
                      )}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </AppContent>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetContent
          className="sm:max-w-2xl flex flex-col h-full w-full"
          side={lang === "fa" ? "left" : "right"}
        >
          <SheetHeader>
            <SheetTitle>
              {editingCourse?.id
                ? coursesDict.edit_course_sheet_title
                : coursesDict.new_course_sheet_title}
            </SheetTitle>
            <SheetDescription>{coursesDict.sheet_description}</SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto p-4">
            {editingCourse && (
              <div className="flex flex-col gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>{coursesDict.title_label}</Label>
                    <Input
                      value={editingCourse.title}
                      onChange={(e) =>
                        setEditingCourse({
                          ...editingCourse,
                          title: e.target.value,
                        })
                      }
                      placeholder={coursesDict.course_title_placeholder}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>{coursesDict.description_label}</Label>
                    <Textarea
                      value={editingCourse.description || ""}
                      onChange={(e) =>
                        setEditingCourse({
                          ...editingCourse,
                          description: e.target.value,
                        })
                      }
                      placeholder={coursesDict.description_placeholder}
                      rows={3}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-semibold">
                      {coursesDict.lesson_structure_label}
                    </Label>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={addRootLesson}
                      >
                        <PlusIcon className="w-4 h-4 ml-2" />
                        {coursesDict.add_module_button}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setCollapseAllSignal((s) => s + 1)}
                        title={coursesDict.collapse_all_tooltip}
                      >
                        {coursesDict.close_all_button}
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    {editingCourse.lessons.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground border border-dashed rounded-md">
                        {coursesDict.no_lessons_message}
                      </div>
                    ) : (
                      <DndContext
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleRootLessonDragEnd}
                      >
                        <SortableContext
                          items={editingCourse.lessons.map((l) => l.id)}
                          strategy={verticalListSortingStrategy}
                        >
                          <div className="flex flex-col gap-2">
                            {editingCourse.lessons.map((lesson, idx) => (
                              <SortableLessonItem
                                key={lesson.id}
                                lesson={lesson}
                                collapseSignal={collapseAllSignal}
                                onChange={(updated) =>
                                  updateRootLesson(idx, updated)
                                }
                                onDelete={() => deleteRootLesson(idx)}
                                dict={coursesDict}
                              />
                            ))}
                          </div>
                        </SortableContext>
                      </DndContext>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          <SheetFooter className="mt-auto border-t pt-4 flex-row-reverse sm:justify-start gap-2">
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving
                ? coursesDict.saving_button
                : coursesDict.save_changes_button}
            </Button>
            <SheetClose asChild>
              <Button variant="outline">{coursesDict.cancel_button}</Button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>

      <AlertDialog
        open={!!courseToDelete}
        onOpenChange={(open) => !open && setCourseToDelete(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {coursesDict.delete_dialog_title}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {coursesDict.delete_dialog_description}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel>
              {coursesDict.delete_dialog_cancel}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={executeDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {coursesDict.delete_dialog_confirm}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
