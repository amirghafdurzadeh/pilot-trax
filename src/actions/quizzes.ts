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
    endIndex: ql.questionsStartIndex !== null && ql.questionsStartIndex !== undefined && ql.questionsCount !== null && ql.questionsCount !== undefined
      ? (ql.questionsStartIndex + ql.questionsCount - 1)
      : undefined,
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
      const qCount = lesson.endIndex !== undefined && lesson.startIndex !== undefined
        ? (lesson.endIndex - lesson.startIndex + 1)
        : lesson.questionsCount;

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
          questionsStartIndex: lesson.startIndex,
          questionsCount: qCount,
        },
        update: {
          questionsStartIndex: lesson.startIndex,
          questionsCount: qCount,
        },
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

export async function startQuizAttempt(quizId: string) {
  const user = await readSession();
  if (!user) {
    throw new Error("User not authenticated");
  }

  // 1. Get quiz and its lessons configuration
  const quiz = await prisma.quiz.findUnique({
    where: { id: quizId },
    include: {
      quizLessons: {
        include: {
          lesson: true
        }
      }
    }
  });

  if (!quiz) {
    throw new Error("Quiz not found");
  }

  // 2. Fetch questions for each lesson
  let finalQuestions: any[] = [];

  for (const ql of quiz.quizLessons) {
    const lessonQuestions = await prisma.question.findMany({
      where: { lessonId: ql.lessonId },
      orderBy: [
        { index: "asc" },
        { createdAt: "asc" }
      ],
      include: {
        answers: {
          orderBy: { order: "asc" }
        }
      }
    });

    if (lessonQuestions.length === 0) continue;

    let selected: typeof lessonQuestions = [];

    if (quiz.selectionMode === "ORDERED") {
      const startIndex = ql.questionsStartIndex ?? 1;
      const count = ql.questionsCount;
      const startIdx = Math.max(0, startIndex - 1);
      if (count !== undefined && count !== null) {
        selected = lessonQuestions.slice(startIdx, startIdx + count);
      } else {
        selected = lessonQuestions.slice(startIdx);
      }
    } else {
      const shuffled = [...lessonQuestions].sort(() => Math.random() - 0.5);
      const count = ql.questionsCount;
      if (count !== undefined && count !== null) {
        selected = shuffled.slice(0, count);
      } else {
        selected = shuffled;
      }
    }

    finalQuestions.push(...selected);
  }

  if (quiz.selectionMode === "SHUFFLED") {
    finalQuestions = finalQuestions.sort(() => Math.random() - 0.5);
  }

  finalQuestions = finalQuestions.slice(0, quiz.questionCount);

  const attempt = await prisma.quizAttempt.create({
    data: {
      userId: user.id,
      quizId: quizId,
      startedAt: new Date(),
      quizAttemptQuestions: {
        create: finalQuestions.map((q) => ({
          questionId: q.id
        }))
      }
    },
    include: {
      quiz: true,
      quizAttemptQuestions: {
        include: {
          question: {
            include: {
              answers: true
            }
          }
        }
      }
    }
  });

  return attempt;
}

export async function getActiveQuizAttempt(quizId: string) {
  const user = await readSession();
  if (!user) return null;

  const attempt = await prisma.quizAttempt.findFirst({
    where: {
      userId: user.id,
      quizId: quizId,
      endedAt: null,
    },
    include: {
      quiz: true,
      quizAttemptQuestions: {
        include: {
          question: {
            include: {
              answers: {
                orderBy: { order: "asc" }
              }
            }
          },
          selectedAnswer: true
        }
      }
    },
    orderBy: {
      startedAt: "desc"
    }
  });

  if (!attempt) return null;

  const elapsedMs = Date.now() - new Date(attempt.startedAt).getTime();
  const elapsedMinutes = elapsedMs / (1000 * 60);
  if (elapsedMinutes >= attempt.quiz.duration) {
    await prisma.quizAttempt.update({
      where: { id: attempt.id },
      data: { endedAt: new Date(new Date(attempt.startedAt).getTime() + attempt.quiz.duration * 60 * 1000) }
    });
    return null;
  }

  return attempt;
}

export async function getQuizAttempt(attemptId: string) {
  const user = await readSession();
  if (!user) throw new Error("Not authenticated");

  const attempt = await prisma.quizAttempt.findUnique({
    where: { id: attemptId },
    include: {
      quiz: true,
      quizAttemptQuestions: {
        include: {
          question: {
            include: {
              answers: {
                orderBy: { order: "asc" }
              },
              questionInteractions: {
                where: { userId: user.id }
              }
            }
          },
          selectedAnswer: true
        }
      }
    }
  });

  return attempt;
}

export async function submitQuizAnswer(attemptQuestionId: string, answerId: string | null) {
  const user = await readSession();
  if (!user) throw new Error("Not authenticated");

  const attemptQuestion = await prisma.quizAttemptQuestion.update({
    where: { id: attemptQuestionId },
    data: {
      selectedAnswerId: answerId,
      answeredAt: answerId ? new Date() : null
    }
  });

  return attemptQuestion;
}

export async function finishQuizAttempt(attemptId: string) {
  const user = await readSession();
  if (!user) throw new Error("Not authenticated");

  const attempt = await prisma.quizAttempt.update({
    where: { id: attemptId },
    data: {
      endedAt: new Date()
    }
  });

  return attempt;
}

export async function saveQuestionInteraction(questionId: string, state: string) {
  const user = await readSession();
  if (!user) throw new Error("Not authenticated");

  const interaction = await prisma.questionInteraction.upsert({
    where: {
      userId_questionId: {
        userId: user.id,
        questionId: questionId
      }
    },
    create: {
      userId: user.id,
      questionId: questionId,
      state: state
    },
    update: {
      state: state
    }
  });

  return interaction;
}

export async function getQuizAttempts(quizId: string) {
  const user = await readSession();
  if (!user) return [];

  const attempts = await prisma.quizAttempt.findMany({
    where: {
      userId: user.id,
      quizId: quizId,
      endedAt: { not: null }
    },
    include: {
      quizAttemptQuestions: {
        include: {
          selectedAnswer: true
        }
      }
    },
    orderBy: {
      startedAt: "desc"
    }
  });

  return attempts;
}

export async function getHardestQuestions() {
  const user = await readSession();
  if (!user) return [];

  const interactions = await prisma.questionInteraction.findMany({
    where: { userId: user.id },
    include: {
      question: {
        include: {
          answers: {
            orderBy: { order: "asc" }
          },
          lesson: {
            include: {
              course: true
            }
          }
        }
      }
    }
  });

  const attemptQuestions = await prisma.quizAttemptQuestion.findMany({
    where: {
      quizAttempt: {
        userId: user.id
      }
    },
    include: {
      selectedAnswer: true,
      question: {
        include: {
          answers: {
            orderBy: { order: "asc" }
          },
          lesson: {
            include: {
              course: true
            }
          }
        }
      }
    }
  });

  const questionMap = new Map<string, {
    question: any;
    incorrectCount: number;
    totalAttempts: number;
    interactionState: string | null;
  }>();

  for (const inter of interactions) {
    questionMap.set(inter.questionId, {
      question: inter.question,
      incorrectCount: 0,
      totalAttempts: 0,
      interactionState: inter.state
    });
  }

  for (const aq of attemptQuestions) {
    const qId = aq.questionId;
    if (!questionMap.has(qId)) {
      questionMap.set(qId, {
        question: aq.question,
        incorrectCount: 0,
        totalAttempts: 0,
        interactionState: null
      });
    }

    const stats = questionMap.get(qId)!;
    stats.totalAttempts += 1;
    if (aq.selectedAnswerId && !aq.selectedAnswer?.isCorrect) {
      stats.incorrectCount += 1;
    }
  }

  const result = Array.from(questionMap.values()).map((stats) => {
    let score = 0;
    if (stats.interactionState === "CONFUSED") {
      score += 10;
    } else if (stats.interactionState === "UNSURE") {
      score += 5;
    } else if (stats.interactionState === "MASTERED") {
      score -= 5;
    }

    score += stats.incorrectCount * 3;

    return {
      ...stats.question,
      incorrectCount: stats.incorrectCount,
      totalAttempts: stats.totalAttempts,
      interactionState: stats.interactionState,
      difficultyScore: score
    };
  });

  return result.sort((a, b) => b.difficultyScore - a.difficultyScore);
}
