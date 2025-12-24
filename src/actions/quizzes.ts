import prisma from "@/lib/prisma";

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
