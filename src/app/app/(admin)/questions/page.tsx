import { getQuestions, getLessonsForFilter } from "@/actions/questions";
import QuestionsPageClient from "./client";

export default async function QuestionsPage() {
  const [questionsResult, lessons] = await Promise.all([
    getQuestions({}),
    getLessonsForFilter(),
  ]);

  return (
    <QuestionsPageClient
      initialQuestions={questionsResult.questions}
      initialNextCursor={questionsResult.nextCursor}
      initialLessons={lessons}
    />
  );
}
