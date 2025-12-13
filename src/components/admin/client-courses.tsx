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
import { useState } from "react";
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
import { cn } from "@/lib/utils";

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
}: {
  lesson: Lesson;
  onChange: (updated: Lesson) => void;
  onDelete: () => void;
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
      title: "درس جدید",
      order: lesson.children.length,
      children: [],
    };
    onChange({ ...lesson, children: [...lesson.children, newChild] });
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
          placeholder="عنوان درس"
        />
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 shrink-0 text-muted-foreground hover:text-foreground"
          onClick={handleAddChild}
          title="افزودن زیرمجموعه"
        >
          <PlusIcon className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 shrink-0 text-destructive hover:text-destructive/80"
          onClick={onDelete}
          title="حذف درس"
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
                  onChange={(updated) => handleUpdateChild(idx, updated)}
                  onDelete={() => handleDeleteChild(idx)}
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
}: {
  initialCourses: Course[];
}) {
  const courses = initialCourses;
  const [searchQuery, setSearchQuery] = useState("");

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
      lessons: [...course.lessons].sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
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
        toast.success("دوره با موفقیت حذف شد");
      } else {
        toast.error("خطا در حذف دوره");
      }
      setCourseToDelete(null);
    }
  };

  const handleSave = async () => {
    if (!editingCourse) return;

    if (!editingCourse.title.trim()) {
      toast.error("عنوان الزامی است");
      return;
    }

    setIsSaving(true);
    const result = await saveCourse(editingCourse);
    setIsSaving(false);

    if (result.success) {
      setIsSheetOpen(false);
      toast.success("دوره با موفقیت ذخیره شد");
    } else {
      toast.error("خطا در ذخیره سازی: " + (result.error || "Unknown error"));
    }
  };

  const addRootLesson = () => {
    if (!editingCourse) return;
    const newLesson: Lesson = {
      id: crypto.randomUUID(),
      title: "ماژول جدید",
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
      // Update order fields to reflect new positions
      newLessons = newLessons.map((l, idx) => ({ ...l, order: idx }));
      setEditingCourse({ ...editingCourse, lessons: newLessons });
    }
  };

  return (
    <>
      <AppHeader>
        <div className="flex items-center gap-2 flex-1">
          <AppSearch
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="جستجوی دوره"
          />
          
        </div>
      </AppHeader>

      <AppContent>
        <div className="w-full flex flex-col">
          <Button onClick={handleAddNew} className="w-full md:w-fit gap-2">
            <PlusIcon className="w-4 h-4" />
            افزودن دوره
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredCourses.map((course) => (
            <Card
              key={course.id}
              className="relative group overflow-hidden transition-all hover:shadow-md"
            >
              <div className="absolute top-2 left-2 z-10">
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
                      ویرایش
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-destructive focus:text-destructive"
                      onClick={() => handleDelete(course.id)}
                    >
                      <Trash2Icon className="w-4 h-4 text-inherit" />
                      حذف
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              <CardContent className="flex flex-col gap-4 p-6">
                <div>
                  <CardTitle className="line-clamp-1 text-lg">
                    {course.title}
                  </CardTitle>
                </div>
                <div className="flex flex-col gap-2">
                  <CardDescription className="line-clamp-3 min-h-[4.5em]">
                    {course.description || "توضیحی ارائه نشده است."}
                  </CardDescription>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
                    <span className="bg-secondary px-2 py-0.5 rounded text-xs">
                      {course.questions} سوال
                    </span>
                    <span className="bg-secondary px-2 py-0.5 rounded text-xs">
                      {course.lessons.length} ماژول
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
          side="left"
        >
          <SheetHeader>
            <SheetTitle>
              {editingCourse?.id ? "ویرایش دوره" : "دوره جدید"}
            </SheetTitle>
            <SheetDescription>جزئیات دوره و ساختار دروس آن.</SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto p-4">
            {editingCourse && (
              <div className="flex flex-col gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>عنوان</Label>
                    <Input
                      value={editingCourse.title}
                      onChange={(e) =>
                        setEditingCourse({
                          ...editingCourse,
                          title: e.target.value,
                        })
                      }
                      placeholder="عنوان دوره"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>توضیحات</Label>
                    <Textarea
                      value={editingCourse.description || ""}
                      onChange={(e) =>
                        setEditingCourse({
                          ...editingCourse,
                          description: e.target.value,
                        })
                      }
                      placeholder="توضیح مختصر..."
                      rows={3}
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-semibold">
                      ساختار دروس
                    </Label>
                    <Button size="sm" variant="outline" onClick={addRootLesson}>
                      <PlusIcon className="w-4 h-4 ml-2" />
                      افزودن ماژول
                    </Button>
                  </div>

                  <div className="flex flex-col gap-2">
                    {editingCourse.lessons.length === 0 ? (
                      <div className="text-center py-8 text-muted-foreground border border-dashed rounded-md">
                        هنوز درسی اضافه نشده است.
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
                                onChange={(updated) =>
                                  updateRootLesson(idx, updated)
                                }
                                onDelete={() => deleteRootLesson(idx)}
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
              {isSaving ? "در حال ذخیره..." : "ذخیره تغییرات"}
            </Button>
            <SheetClose asChild>
              <Button variant="outline">لغو</Button>
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
              آیا از حذف این دوره اطمینان دارید؟
            </AlertDialogTitle>
            <AlertDialogDescription>
              این عملیات غیرقابل بازگشت است و تمام اطلاعات مربوط به این دوره حذف
              خواهد شد.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2">
            <AlertDialogCancel>انصراف</AlertDialogCancel>
            <AlertDialogAction
              onClick={executeDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              حذف
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
