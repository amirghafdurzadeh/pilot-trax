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
  ChevronRightIcon,
  ChevronsUpDownIcon,
  PlusIcon,
  Trash2Icon,
} from "lucide-react";
import { useState, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

import type { CoursesDict, Lesson } from "./types";

export function SortableLessonItem({
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
              <>
                <ChevronLeftIcon className="ltr:hidden h-4 w-4" />
                <ChevronRightIcon className="rtl:hidden h-4 w-4" />
              </>
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
