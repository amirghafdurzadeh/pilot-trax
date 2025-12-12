import { getCourses } from "@/actions/courses";
import CoursesPageClient from "@/components/admin/client-courses";

export default async function CoursesPage() {
  const courses = await getCourses();
  return <CoursesPageClient initialCourses={courses as any} />;
}
