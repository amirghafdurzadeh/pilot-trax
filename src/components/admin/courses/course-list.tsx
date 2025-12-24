"use client";

import { CourseCard } from "./course-card";
import { Course, CoursesDict } from "./types";

export function CourseList({
  courses,
  onEdit,
  onDelete,
  dict,
}: {
  courses: Course[];
  onEdit: (course: Course) => void;
  onDelete: (id: string) => void;
  dict: CoursesDict;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {courses.map((course) => (
        <CourseCard
          key={course.id}
          course={course}
          onEdit={() => onEdit(course)}
          onDelete={() => onDelete(course.id)}
          dict={dict}
        />
      ))}
    </div>
  );
}
