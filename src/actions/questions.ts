"use server";

import { revalidatePath } from "next/cache";

import { getDictionary } from "@/lib/dictionaries";
import { Locale } from "@/lib/locales";
import prisma from "@/lib/prisma";
import * as XLSX from "xlsx";

export type AnswerInput = {
  id: string;
  title: string;
  isCorrect: boolean;
  order?: number;
};

export type QuestionInput = {
  id?: string;
  index?: number;
  title: string;
  description: string;
  lessonId: string;
  answers: AnswerInput[];
};

export type QuestionWithDetails = {
  id: string;
  index?: number;
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
  courseId: string;
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
      courseId: lesson.courseId,
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
  page?: number;
  limit?: number;
  lessonId?: string;
  courseId?: string;
  search?: string;
}): Promise<{
  questions: QuestionWithDetails[];
  totalPages: number;
  totalCount: number;
}> {
  const { page = 1, limit = 10, lessonId, courseId, search } = params;
  const skip = (page - 1) * limit;

  try {
    const where: any = {};

    if (lessonId) {
      where.lessonId = lessonId;
    } else if (courseId) {
      where.lesson = {
        courseId: courseId,
      };
    }

    if (search && search.trim()) {
      where.title = {
        contains: search.trim(),
        mode: "insensitive",
      };
    }

    const [questions, totalCount] = await Promise.all([
      prisma.question.findMany({
        where,
        take: limit,
        skip,
        orderBy: [{ index: "asc" }, { createdAt: "desc" }],
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
      }),
      prisma.question.count({ where }),
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    const formattedQuestions: QuestionWithDetails[] = questions.map(
      (q: any) => ({
        id: q.id,
        index: q.index,
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
      totalPages,
      totalCount,
    };
  } catch (error) {
    console.error("Failed to get questions", error);
    return { questions: [], totalPages: 0, totalCount: 0 };
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
            ...(question.index !== undefined && { index: question.index }),
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
            index: question.index,
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

export async function importQuestionsFromExcel(lang: Locale, formData: FormData) {
  const dictionary = await getDictionary(lang);
  const questionsDict = dictionary.app.admin.questions;
  const file = formData.get("file") as File;

  if (!file) {
    return { success: false, error: questionsDict.no_file_selected_error };
  }

  const fileName = file.name;
  const parts = fileName.split(".");
  if (parts.length < 3) {
    return { success: false, error: questionsDict.invalid_filename_error };
  }

  const courseTitle = parts[0];
  const lessonTitle = parts[1].replace(/_/g, " ");

  try {
    const buffer = await file.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: "buffer" });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as any[][];

    await prisma.$transaction(async (tx) => {
      const course = await tx.course.findFirst({
        where: { title: { equals: courseTitle, mode: "insensitive" } },
      });

      if (!course) {
        throw new Error(questionsDict.course_not_found_error.replace("{course}", courseTitle));
      }

      const lesson = await tx.lesson.findFirst({
        where: {
          title: { equals: lessonTitle, mode: "insensitive" },
          courseId: course.id,
        },
      });

      if (!lesson) {
        throw new Error(
          questionsDict.lesson_not_found_error
            .replace("{lesson}", lessonTitle)
            .replace("{course}", courseTitle)
        );
      }

      for (const row of rows) {
        if (!row || row.length < 2) continue;

        const firstCol = String(row[0] || "");
        if (!firstCol.trim()) continue;

        // Column 1: index and title (e.g., "1- Where can you find...")
        const dashIndex = firstCol.indexOf("-");
        let qIndex: number | null = null;
        let qTitle = firstCol;

        if (dashIndex !== -1) {
          const indexPart = firstCol.substring(0, dashIndex).trim();
          if (!isNaN(Number(indexPart))) {
            qIndex = Number(indexPart);
            qTitle = firstCol.substring(dashIndex + 1).trim();
          }
        }

        // Answers are column 2 to 5 (index 1 to 4)
        const answers = [];
        for (let i = 1; i <= 4; i++) {
          let answerText = String(row[i] || "").trim();
          if (answerText) {
            // Remove prefix like "A) ", "B) ", etc.
            answerText = answerText.replace(/^[A-D]\)\s*/i, "");

            answers.push({
              title: answerText,
              isCorrect: answers.length === 0, // First answer is always correct
              order: answers.length,
            });
          }
        }

        if (answers.length < 2) continue;

        await tx.question.create({
          data: {
            title: qTitle,
            description: "",
            index: qIndex,
            lessonId: lesson.id,
            answers: {
              create: answers,
            },
          },
        });
      }
    });

    revalidatePath("/app/questions");
    return { success: true };
  } catch (error: any) {
    console.error("Excel import failed", error);
    return { success: false, error: error.message || dictionary.e_db_error };
  }
}
