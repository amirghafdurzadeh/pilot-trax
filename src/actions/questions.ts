"use server";

import { revalidatePath } from "next/cache";

import prisma from "@/lib/prisma";

export type AnswerInput = {
  id: string;
  title: string;
  isCorrect: boolean;
};

export type QuestionInput = {
  id?: string;
  title: string;
  lessonId: string;
  answers: AnswerInput[];
};

export type QuestionWithDetails = {
  id: string;
  title: string;
  lessonId: string;
  lessonTitle: string;
  courseName: string;
  answers: AnswerInput[];
  createdAt: Date;
};

export type LessonOption = {
  id: string;
  title: string;
  courseName: string;
  depth: number;
};

export async function getLessonsForFilter(): Promise<LessonOption[]> {
  try {
    const lessons = await prisma.lesson.findMany({
      include: {
        course: {
          select: { title: true },
        },
      },
      orderBy: [{ course: { title: "asc" } }, { title: "asc" }],
    });

    const lessonMap = new Map<string, { parentId: string | null }>();
    for (const lesson of lessons) {
      lessonMap.set(lesson.id, { parentId: lesson.parentId });
    }

    const getDepth = (lessonId: string): number => {
      const lesson = lessonMap.get(lessonId);
      if (!lesson || !lesson.parentId) return 0;
      return 1 + getDepth(lesson.parentId);
    };

    return lessons.map((lesson: any) => ({
      id: lesson.id,
      title: lesson.title,
      courseName: lesson.course.title,
      depth: getDepth(lesson.id),
    }));
  } catch (error) {
    console.error("Failed to get lessons for filter", error);
    return [];
  }
}

export async function getQuestions(params: {
  cursor?: string;
  limit?: number;
  lessonId?: string;
  search?: string;
}): Promise<{
  questions: QuestionWithDetails[];
  nextCursor: string | null;
}> {
  const { cursor, limit = 20, lessonId, search } = params;

  try {
    const where: any = {};

    if (lessonId) {
      where.lessonId = lessonId;
    }

    if (search && search.trim()) {
      where.title = {
        contains: search.trim(),
        mode: "insensitive",
      };
    }

    const questions = await prisma.question.findMany({
      where,
      take: limit + 1,
      ...(cursor && {
        skip: 1,
        cursor: { id: cursor },
      }),
      orderBy: { createdAt: "desc" },
      include: {
        answers: {
          orderBy: { createdAt: "asc" },
        },
        lesson: {
          include: {
            course: {
              select: { title: true },
            },
          },
        },
      },
    });

    let nextCursor: string | null = null;
    if (questions.length > limit) {
      const nextItem = questions.pop();
      nextCursor = nextItem!.id;
    }

    const formattedQuestions: QuestionWithDetails[] = questions.map(
      (q: any) => ({
        id: q.id,
        title: q.title,
        lessonId: q.lessonId,
        lessonTitle: q.lesson.title,
        courseName: q.lesson.course.title,
        answers: q.answers.map((a: any) => ({
          id: a.id,
          title: a.title,
          isCorrect: a.isCorrect,
        })),
        createdAt: q.createdAt,
      })
    );

    return {
      questions: formattedQuestions,
      nextCursor,
    };
  } catch (error) {
    console.error("Failed to get questions", error);
    return { questions: [], nextCursor: null };
  }
}

export async function saveQuestion(question: QuestionInput) {
  if (!question.lessonId) {
    return { success: false, error: "Lesson is required" };
  }

  if (!question.title.trim()) {
    return { success: false, error: "Title is required" };
  }

  if (question.answers.length === 0) {
    return { success: false, error: "At least one answer is required" };
  }

  const hasCorrectAnswer = question.answers.some((a) => a.isCorrect);
  if (!hasCorrectAnswer) {
    return { success: false, error: "At least one correct answer is required" };
  }

  try {
    await prisma.$transaction(async (tx: any) => {
      if (question.id) {
        await tx.question.update({
          where: { id: question.id },
          data: {
            title: question.title,
            lessonId: question.lessonId,
          },
        });

        const existingAnswers = await tx.answer.findMany({
          where: { questionId: question.id },
          select: { id: true },
        });
        const existingIds = new Set(existingAnswers.map((a: any) => a.id));

        const incomingIds = new Set(question.answers.map((a) => a.id));
        const idsToDelete = [...existingIds].filter(
          (id) => !incomingIds.has(id as string)
        );

        if (idsToDelete.length > 0) {
          await tx.answer.deleteMany({
            where: { id: { in: idsToDelete as string[] } },
          });
        }

        for (const answer of question.answers) {
          await tx.answer.upsert({
            where: { id: answer.id },
            update: {
              title: answer.title,
              isCorrect: answer.isCorrect,
            },
            create: {
              id: answer.id,
              title: answer.title,
              isCorrect: answer.isCorrect,
              questionId: question.id,
            },
          });
        }
      } else {
        const newQuestionId = crypto.randomUUID();
        await tx.question.create({
          data: {
            id: newQuestionId,
            title: question.title,
            lessonId: question.lessonId,
          },
        });

        await tx.answer.createMany({
          data: question.answers.map((a) => ({
            id: a.id,
            title: a.title,
            isCorrect: a.isCorrect,
            questionId: newQuestionId,
          })),
        });
      }
    });

    revalidatePath("/app/questions");
    return { success: true };
  } catch (error) {
    console.error("Save question failed", error);
    return { success: false, error: "Database error" };
  }
}

export async function deleteQuestion(id: string) {
  try {
    await prisma.question.delete({ where: { id } });
    revalidatePath("/app/questions");
    return { success: true };
  } catch (error) {
    console.error("Delete question failed", error);
    return { success: false, error: "Database error" };
  }
}
