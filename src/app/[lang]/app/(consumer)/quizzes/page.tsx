import { getCourses } from "@/actions/courses";
import { getDictionary } from "@/lib/dictionaries";

export default async function Page(props: PageProps<"/[lang]/app/quizzes">) {
  const lang = (await props.params).lang;
  const dict = await getDictionary(lang);
  const courses = await getCourses();
}
