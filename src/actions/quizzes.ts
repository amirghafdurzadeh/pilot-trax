"use server";

import { QuizSelectionMode } from "@/generated/prisma/enums";
import prisma from "@/lib/prisma";
import { readSession, getUserRole } from "@/lib/session";
import { revalidatePath } from "next/cache";


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
  isPublic: boolean;
};

export async function getQuizzes() {
  const user = await readSession();
  const quizzes = await prisma.quiz.findMany({
    where: {
      ...(user?.id
        ? { OR: [{ isPublic: true }, { creatorId: user.id }] }
        : { isPublic: true }),
    },
    select: {
      id: true,
      title: true,
      duration: true,
      questionCount: true,
      selectionMode: true,
      isPublic: true,
      createdAt: true,
      courseId: true,
      creator: {
        select: {
          id: true,
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

export async function getQuiz(id: string) {
  const quiz = await prisma.quiz.findUnique({
    where: { id },
    include: {
      quizLessons: {
        include: {
          lesson: {
            select: {
              title: true,
              order: true,
            },
          },
        },
      },
    },
  });

  if (!quiz) {
    return null;
  }

  const { quizLessons, ...rest } = quiz;

  const lessons: QuizLessonInput[] = quizLessons.map((ql) => ({
    id: ql.lessonId,
    lessonId: ql.lessonId,
    lessonTitle: ql.lesson.title,
    order: ql.lesson.order ?? undefined,
    questionsCount: ql.questionsCount ?? undefined,
    startIndex: ql.questionsStartIndex ?? undefined,
  }));

  return {
    ...rest,
    lessons,
  };
}

export async function saveQuiz(quiz: QuizInput, lang: string) {
  const user = await readSession();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const role = await getUserRole(user.id);
  if (quiz.isPublic && role !== "admin" && role !== "system_user") {
    throw new Error("Only admin users can define public quizzes");
  }


  const { id, lessons, ...data } = quiz;

  const quizData = {
    ...data,
    creatorId: user.id,
  };

  const savedQuiz = await prisma.$transaction(async (tx) => {
    const q = await tx.quiz.upsert({
      where: { id: id || "" },
      create: quizData,
      update: quizData,
    });

    await tx.quizLesson.deleteMany({
      where: {
        quizId: q.id,
        lessonId: {
          notIn: lessons.map((l) => l.lessonId),
        },
      },
    });

    for (const lesson of lessons) {
      await tx.quizLesson.upsert({
        where: {
          quizId_lessonId: {
            quizId: q.id,
            lessonId: lesson.lessonId,
          },
        },
        create: {
          quizId: q.id,
          lessonId: lesson.lessonId,
        },
        update: {},
      });
    }

    return q;
  });

  revalidatePath(`/${lang}/app/quizzes`);

  return savedQuiz;
}

export async function deleteQuiz(quizId: string, lang: string) {
  const deletedQuiz = await prisma.quiz.delete({
    where: {
      id: quizId,
    },
  });

  revalidatePath(`/${lang}/app/quizzes`);
  return deletedQuiz;
}
