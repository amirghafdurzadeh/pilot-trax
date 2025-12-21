import { getCourses } from "@/actions/courses";
import CoursesPageClient from "@/components/admin/client-courses";
import { getDictionary } from "@/lib/dictionaries";
import { Locale } from "@/lib/locales";

export default async function CoursesPage(
  props: PageProps<"/[lang]/app/courses">
) {
  const lang = (await props.params).lang as Locale;
  const dict = await getDictionary(lang);
  const courses = await getCourses();
  return (
    <CoursesPageClient
      initialCourses={courses as any}
      lang={lang}
      dict={dict.app}
    />
  );
}
