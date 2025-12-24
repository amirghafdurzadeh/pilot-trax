"use client";

import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import { useMemo, useState } from "react";

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
import { getDictionary } from "@/lib/dictionaries";
import { cn } from "@/lib/utils";

type QuestionsDict = Awaited<
  ReturnType<typeof getDictionary>
>["app"]["admin"]["questions"];
type LessonComboboxDict = QuestionsDict["lesson_combobox"];

export type LessonOption = {
  id: string;
  title: string;
  courseName: string;
  depth: number;
  order?: number;
  parentId?: string | null;
};

interface LessonComboboxProps {
  lessons: LessonOption[];
  value: string;
  onValueChange: (value: string) => void;
  dict: LessonComboboxDict;
  className?: string;
  triggerClassName?: string;
  icon?: React.ReactNode;
}

export function LessonCombobox({
  lessons,
  value,
  onValueChange,
  dict,
  className,
  triggerClassName,
  icon,
}: LessonComboboxProps) {
  const [open, setOpen] = useState(false);

  // Group lessons by course
  const lessonsByCourse = useMemo(() => {
    const grouped = lessons.reduce((acc, lesson) => {
      if (!acc[lesson.courseName]) {
        acc[lesson.courseName] = [];
      }
      acc[lesson.courseName].push(lesson);
      return acc;
    }, {} as Record<string, LessonOption[]>);

    // For each course, build a parent-child tree using parentId and then
    // produce a depth-first flattened list that respects `order` fields.
    Object.keys(grouped).forEach((courseName) => {
      const items = grouped[courseName];

      // Build map of nodes
      const nodeMap = new Map<string, LessonOption & { children: any[] }>();
      items.forEach((it) => nodeMap.set(it.id, { ...it, children: [] } as any));

      const roots: (LessonOption & { children: any[] })[] = [];

      items.forEach((it) => {
        const node = nodeMap.get(it.id)!;
        const parentId = (it as any).parentId;
        if (parentId && nodeMap.has(parentId)) {
          nodeMap.get(parentId)!.children.push(node);
        } else {
          roots.push(node);
        }
      });

      const sortNodes = (nodes: any[]) => {
        nodes.sort((a, b) => {
          const ao = a.order ?? 0;
          const bo = b.order ?? 0;
          if (ao !== bo) return ao - bo;
          return a.title.localeCompare(b.title);
        });
        nodes.forEach((n) => n.children && sortNodes(n.children));
      };

      sortNodes(roots);

      const flattened: LessonOption[] = [];
      const dfs = (n: any, depth: number) => {
        flattened.push({
          id: n.id,
          title: n.title,
          courseName: n.courseName,
          depth,
          order: n.order,
          parentId: n.parentId ?? null,
        });
        (n.children || []).forEach((c: any) => dfs(c, depth + 1));
      };

      roots.forEach((r) => dfs(r, 0));

      grouped[courseName] = flattened;
    });

    return grouped;
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
              <span className="text-muted-foreground">
                {dict.select_lesson_placeholder}
              </span>
            )}
          </span>
          <ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn("p-0", className)} align="start">
        <Command>
          <CommandInput placeholder={dict.search_placeholder} />
          <CommandList>
            <CommandEmpty>{dict.no_lesson_found_message}</CommandEmpty>
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
