"use client";

import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import { useState } from "react";

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

export type CourseOption = {
  id: string;
  title: string;
};

interface CourseComboboxProps {
  courses: CourseOption[];
  value: string;
  onValueChange: (value: string) => void;
  dict: {
    select_course_placeholder: string;
    search_placeholder: string;
    no_course_found_message: string;
  };
  className?: string;
  triggerClassName?: string;
  icon?: React.ReactNode;
}

export function CourseCombobox({
  courses,
  value,
  onValueChange,
  dict,
  className,
  triggerClassName,
  icon,
}: CourseComboboxProps) {
  const [open, setOpen] = useState(false);

  const selectedCourse = courses.find((course) => course.id === value);

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
            {selectedCourse ? (
              <span className="truncate">{selectedCourse.title}</span>
            ) : (
              <span className="text-muted-foreground">
                {dict.select_course_placeholder}
              </span>
            )}
          </span>
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn("p-0 w-80", className)} align="start">
        <Command>
          <CommandInput placeholder={dict.search_placeholder} />
          <CommandList>
            <CommandEmpty>{dict.no_course_found_message}</CommandEmpty>
            <CommandGroup>
              {courses.map((course) => (
                <CommandItem
                  key={course.id}
                  value={course.title}
                  onSelect={() => {
                    onValueChange(course.id === value ? "" : course.id);
                    setOpen(false);
                  }}
                >
                  <CheckIcon
                    className={cn(
                      "ml-2 h-4 w-4 shrink-0",
                      value === course.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <span className="truncate">{course.title}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
