"use client";

import { EllipsisVerticalIcon, PencilIcon, Trash2Icon } from "lucide-react";

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

import { Course, CoursesDict } from "./types";

export function CourseCard({
  course,
  onEdit,
  onDelete,
  dict,
}: {
  course: Course;
  onEdit: () => void;
  onDelete: () => void;
  dict: CoursesDict;
}) {
  return (
    <Card className="relative group overflow-hidden transition-all hover:shadow-md">
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
            <DropdownMenuItem onClick={onEdit}>
              <PencilIcon className="w-4 h-4" />
              {dict.edit_button}
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={onDelete}
            >
              <Trash2Icon className="w-4 h-4 text-inherit" />
              {dict.delete_button}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <CardContent className="flex flex-col gap-3 p-4">
        <div>
          <CardTitle className="line-clamp-1 text-lg">{course.title}</CardTitle>
        </div>
        <div className="flex flex-col gap-2">
          <CardDescription className="line-clamp-3 min-h-[4.5em]">
            {course.description || dict.no_description}
          </CardDescription>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mt-2">
            <span className="bg-secondary px-2 py-0.5 rounded text-xs">
              {dict.questions_count.replace("{count}", String(course.questions))}
            </span>
            <span className="bg-secondary px-2 py-0.5 rounded text-xs">
              {dict.modules_count.replace(
                "{count}",
                String(course.lessons.length)
              )}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
