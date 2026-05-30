-- DropForeignKey
ALTER TABLE "lessons" DROP CONSTRAINT "lessons_parent_id_fkey";

-- DropForeignKey
ALTER TABLE "questions" DROP CONSTRAINT "questions_lesson_id_fkey";

-- DropForeignKey
ALTER TABLE "quiz_lessons" DROP CONSTRAINT "quiz_lessons_lesson_id_fkey";

-- AddForeignKey
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_lessons" ADD CONSTRAINT "quiz_lessons_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "lessons"("id") ON DELETE CASCADE ON UPDATE CASCADE;
