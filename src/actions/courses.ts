"use server";

import { revalidatePath } from "next/cache";

import { getDictionary } from "@/lib/dictionaries";
import { Locale } from "@/lib/locales";
import prisma from "@/lib/prisma";

type LessonFlat = {
  id: string;
  title: string;
  order: number;
  parentId: string | null;
  courseId: string;
};

type LessonNode = {
  id: string;
  title: string;
  order: number;
  children: LessonNode[];
};

type CourseInput = {
  id?: string;
  title: string;
  description?: string;
  lessons: LessonNode[];
};

export async function getCourses() {
  try {
    const courses = await prisma.course.findMany({
      orderBy: { createdAt: "desc" },
    });

    const courseIds = courses.map((c: any) => c.id);

    const allLessons = await prisma.lesson.findMany({
      where: { courseId: { in: courseIds } },
      orderBy: { order: "asc" },
      include: {
        _count: {
          select: { questions: true },
        },
      },
    });

    const coursesWithLessons = courses.map((course: any) => {
      const courseLessons = allLessons.filter(
        (l: any) => l.courseId === course.id
      );

      const questionsCount = courseLessons.reduce(
        (total, l) => total + (l._count?.questions || 0),
        0
      );

      const buildTree = (parentId: string | null): LessonNode[] => {
        return courseLessons
          .filter((l: any) => l.parentId === parentId)
          .sort((a: any, b: any) => a.order - b.order)
          .map((l: any) => ({
            id: l.id,
            title: l.title,
            order: l.order,
            children: buildTree(l.id),
          }));
      };

      return {
        ...course,
        lessons: buildTree(null),
        questions: questionsCount,
      };
    });

    return coursesWithLessons;
  } catch (error) {
    console.error("Failed to get courses", error);
    return [];
  }
}

export async function saveCourse(lang: Locale, course: CourseInput) {
  const dictionary = await getDictionary(lang);
  if (!course.id) return { success: false, error: dictionary.e_course_id_missing };

  try {
    await prisma.$transaction(async (tx: any) => {
      await tx.course.upsert({
        where: { id: course.id },
        update: {
          title: course.title,
          description: course.description,
        },
        create: {
          id: course.id,
          title: course.title,
          description: course.description,
        },
      });

      const existingLessons = await tx.lesson.findMany({
        where: { courseId: course.id },
        select: { id: true },
      });
      const existingIds = new Set(existingLessons.map((l: any) => l.id));

      const incomingLessonsMap = new Map<
        string,
        {
          id: string;
          title: string;
          order: number;
          parentId: string | null;
          courseId: string;
        }
      >();

      let layers: LessonFlat[][] = [];

      const processLayer = (
        nodes: LessonNode[],
        parentId: string | null,
        depth: number
      ) => {
        if (!layers[depth]) layers[depth] = [];

        for (let i = 0; i < nodes.length; i++) {
          const node = nodes[i];
          const lessonData = {
            id: node.id,
            title: node.title,
            order: i,
            parentId: parentId,
            courseId: course.id!,
          };

          incomingLessonsMap.set(node.id, lessonData);
          layers[depth].push(lessonData);

          processLayer(node.children, node.id, depth + 1);
        }
      };

      processLayer(course.lessons, null, 0);

      const incomingIds = new Set(incomingLessonsMap.keys());

      const idsToDelete = [...existingIds].filter(
        (id) => !incomingIds.has(id as string)
      );
      if (idsToDelete.length > 0) {
        await tx.lesson.deleteMany({
          where: { id: { in: idsToDelete as string[] } },
        });
      }

      for (const layer of layers) {
        const toCreate: LessonFlat[] = [];
        const toUpdate: LessonFlat[] = [];

        for (const node of layer) {
          if (existingIds.has(node.id)) {
            toUpdate.push(node);
          } else {
            toCreate.push(node);
          }
        }

        if (toCreate.length > 0) {
          await tx.lesson.createMany({
            data: toCreate,
          });
        }

        if (toUpdate.length > 0) {
          await Promise.all(
            toUpdate.map((node) =>
              tx.lesson.update({
                where: { id: node.id },
                data: {
                  title: node.title,
                  parentId: node.parentId,
                  order: node.order,
                },
              })
            )
          );
        }
      }
    });

    revalidatePath("/app/courses");
    return { success: true };
  } catch (error) {
    console.error("Save course failed", error);
    return { success: false, error: dictionary.e_db_error };
  }
}

export async function deleteCourseAction(lang: Locale, id: string) {
  const dictionary = await getDictionary(lang);
  try {
    await prisma.course.delete({ where: { id } });
    revalidatePath("/app/courses");
    return { success: true };
  } catch (error) {
    console.error("Delete course failed", error);
    return { success: false, error: dictionary.e_db_error };
  }
}
