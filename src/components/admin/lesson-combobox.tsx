"use client";

import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

export type LessonOption = {
  id: string;
  title: string;
  courseName: string;
  depth: number;
};

interface LessonComboboxProps {
  lessons: LessonOption[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  emptyText?: string;
  searchPlaceholder?: string;
  className?: string;
  triggerClassName?: string;
  icon?: React.ReactNode;
}

export function LessonCombobox({
  lessons,
  value,
  onValueChange,
  placeholder = "انتخاب درس...",
  emptyText = "درسی یافت نشد",
  searchPlaceholder = "جستجو در دروس...",
  className,
  triggerClassName,
  icon,
}: LessonComboboxProps) {
  const [open, setOpen] = React.useState(false);

  // Group lessons by course
  const lessonsByCourse = React.useMemo(() => {
    return lessons.reduce((acc, lesson) => {
      if (!acc[lesson.courseName]) {
        acc[lesson.courseName] = [];
      }
      acc[lesson.courseName].push(lesson);
      return acc;
    }, {} as Record<string, LessonOption[]>);
  }, [lessons]);

  // Get selected lesson label
  const selectedLesson = lessons.find((lesson) => lesson.id === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("justify-between font-normal", triggerClassName)}
        >
          <span className="flex items-center gap-2 truncate">
            {icon}
            {selectedLesson ? (
              <span className="truncate">{selectedLesson.title}</span>
            ) : (
              <span className="text-muted-foreground">{placeholder}</span>
            )}
          </span>
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn("p-0", className)} align="start">
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptyText}</CommandEmpty>
            {Object.entries(lessonsByCourse).map(
              ([courseName, courseLessons]) => (
                <CommandGroup key={courseName} heading={courseName}>
                  {courseLessons.map((lesson) => (
                    <CommandItem
                      key={lesson.id}
                      value={`${lesson.title} ${courseName}`}
                      onSelect={() => {
                        onValueChange(lesson.id === value ? "" : lesson.id);
                        setOpen(false);
                      }}
                    >
                      <CheckIcon
                        className={cn(
                          "ml-2 h-4 w-4 shrink-0",
                          value === lesson.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <span
                        style={{ paddingRight: `${lesson.depth * 12}px` }}
                        className="truncate"
                      >
                        {lesson.title}
                      </span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
