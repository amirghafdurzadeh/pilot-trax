import { getCourses } from "@/actions/courses";
import CoursesPageClient from "@/components/admin/client-courses";

export default async function CoursesPage(
  props: PageProps<"/[lang]/app/courses">
) {
  const lang = (await props.params).lang;
  const courses = await getCourses();
  return <CoursesPageClient initialCourses={courses as any} lang={lang} />;
}
