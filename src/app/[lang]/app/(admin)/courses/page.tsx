import { getCourses } from "@/actions/courses";
import CoursesPageClient from "@/components/admin/client-courses";
import { getDictionary } from "@/lib/dictionaries";

export default async function Page(props: PageProps<"/[lang]/app/courses">) {
  const lang = (await props.params).lang;
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
