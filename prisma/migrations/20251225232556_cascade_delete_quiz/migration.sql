-- DropForeignKey
ALTER TABLE "quiz_lessons" DROP CONSTRAINT "quiz_lessons_quiz_id_fkey";

-- AddForeignKey
ALTER TABLE "quiz_lessons" ADD CONSTRAINT "quiz_lessons_quiz_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "quizzes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
