"use server";

import { revalidatePath } from "next/cache";

import { getDictionary } from "@/lib/dictionaries";
import { Locale } from "@/lib/locales";
import prisma from "@/lib/prisma";

export type AnswerInput = {
  id: string;
  title: string;
  isCorrect: boolean;
  order?: number;
};

export type QuestionInput = {
  id?: string;
  title: string;
  description: string;
  lessonId: string;
  answers: AnswerInput[];
};

export type QuestionWithDetails = {
  id: string;
  title: string;
  description: string;
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
  order?: number;
  parentId?: string | null;
};

export async function getLessonsForFilter(): Promise<LessonOption[]> {
  try {
    const lessons = await prisma.lesson.findMany({
      include: {
        course: {
          select: { title: true },
        },
      },
      // order by course title then lesson.order then lesson title
      orderBy: [
        { course: { title: "asc" } },
        { order: "asc" },
        { title: "asc" },
      ],
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
      order: lesson.order,
      parentId: lesson.parentId ?? null,
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
          orderBy: { order: "asc" },
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
        description: q.description,
        lessonId: q.lessonId,
        lessonTitle: q.lesson.title,
        courseName: q.lesson.course.title,
        answers: q.answers.map((a: any) => ({
          id: a.id,
          title: a.title,
          isCorrect: a.isCorrect,
          order: a.order,
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

export async function saveQuestion(lang: Locale, question: QuestionInput) {
  const dictionary = await getDictionary(lang);
  if (!question.lessonId) {
    return { success: false, error: dictionary.e_lesson_required };
  }

  if (!question.title.trim()) {
    return { success: false, error: dictionary.e_title_required };
  }

  if (question.answers.length === 0) {
    return { success: false, error: dictionary.e_at_least_one_answer };
  }

  const hasCorrectAnswer = question.answers.some((a) => a.isCorrect);
  if (!hasCorrectAnswer) {
    return { success: false, error: dictionary.e_at_least_one_correct_answer };
  }

  try {
    const result = await prisma.$transaction(async (tx: any) => {
      if (question.id) {
        await tx.question.update({
          where: { id: question.id },
          data: {
            title: question.title,
            description: question.description || "",
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
              order: answer.order ?? 0,
            },
            create: {
              id: answer.id,
              title: answer.title,
              isCorrect: answer.isCorrect,
              order: answer.order ?? 0,
              questionId: question.id,
            },
          });
        }
        return { newQuestionId: null };
      } else {
        const newQuestion = await tx.question.create({
          data: {
            title: question.title,
            description: question.description || "",
            lessonId: question.lessonId,
            answers: {
              create: question.answers.map((a) => ({
                id: a.id,
                title: a.title,
                isCorrect: a.isCorrect,
                order: a.order ?? 0,
              })),
            },
          },
          select: { id: true },
        });
        return { newQuestionId: newQuestion.id };
      }
    });

    revalidatePath("/app/questions");

    if (result.newQuestionId) {
      return { success: true, newQuestionId: result.newQuestionId };
    }

    return { success: true };
  } catch (error) {
    console.error("Save question failed", error);
    return { success: false, error: dictionary.e_db_error };
  }
}

export async function deleteQuestion(lang: Locale, id: string) {
  const dictionary = await getDictionary(lang);
  try {
    await prisma.question.delete({ where: { id } });
    revalidatePath("/app/questions");
    return { success: true };
  } catch (error) {
    console.error("Delete question failed", error);
    return { success: false, error: dictionary.e_db_error };
  }
}
