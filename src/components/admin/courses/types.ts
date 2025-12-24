
import { getDictionary } from "@/lib/dictionaries";

export type AppDict = Awaited<ReturnType<typeof getDictionary>>["app"];
export type CoursesDict = AppDict["admin"]["courses"];

export type Lesson = {
  id: string;
  title: string;
  order: number;
  children: Lesson[];
};

export type Course = {
  id: string;
  title: string;
  description: string;
  questions: number;
  lessons: Lesson[];
};
