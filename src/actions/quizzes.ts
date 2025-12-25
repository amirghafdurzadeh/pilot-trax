"use server";

import { QuizSelectionMode } from "@/generated/prisma/enums";
import prisma from "@/lib/prisma";

export type QuizLessonInput = {
  id: string; // for dnd
  lessonId: string;
  lessonTitle: string;
  questionsCount?: number;
  order?: number;
  startIndex?: number;
  endIndex?: number;
};

export type QuizInput = {
  id?: string;
  title: string;
  duration: number;
  questionCount: number;
  selectionMode: QuizSelectionMode;
  courseId: string;
  lessons: QuizLessonInput[];
};

export async function getQuizzes() {
  const quizzes = await prisma.quiz.findMany({
    include: {
      creator: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
      course: {
        select: {
          title: true,
        },
      },
      _count: {
        select: {
          quizAttempts: true,
        },
      },
    },
  });

  return quizzes;
}
