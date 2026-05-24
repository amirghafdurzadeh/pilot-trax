-- CreateEnum
CREATE TYPE "QuizSelectionMode" AS ENUM ('SHUFFLED', 'ORDERED');

-- CreateEnum
CREATE TYPE "QuizLessonSelectionMode" AS ENUM ('SHUFFLED', 'SHUFFLED_CUSTOM_COUNT', 'ORDERED');

-- CreateTable
CREATE TABLE "quizzes" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "duration" INTEGER NOT NULL,
    "question_count" INTEGER NOT NULL,
    "selection_mode" "QuizSelectionMode" NOT NULL DEFAULT 'SHUFFLED',
    "creator_id" TEXT NOT NULL,
    "course_id" TEXT NOT NULL,

    CONSTRAINT "quizzes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quiz_lessons" (
    "quiz_id" TEXT NOT NULL,
    "lesson_id" TEXT NOT NULL,
    "questions_start_index" INTEGER,
    "questions_count" INTEGER,
    "selection_mode" "QuizLessonSelectionMode",

    CONSTRAINT "quiz_lessons_pkey" PRIMARY KEY ("quiz_id","lesson_id")
);

-- CreateTable
CREATE TABLE "quiz_attempts" (
    "id" TEXT NOT NULL,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ended_at" TIMESTAMP(3),
    "user_id" TEXT NOT NULL,
    "quiz_id" TEXT NOT NULL,

    CONSTRAINT "quiz_attempts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quiz_attempt_questions" (
    "id" TEXT NOT NULL,
    "answered_at" TIMESTAMP(3),
    "selected_answer_id" TEXT,
    "quiz_attempt_id" TEXT NOT NULL,
    "question_id" TEXT NOT NULL,

    CONSTRAINT "quiz_attempt_questions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "quizzes" ADD CONSTRAINT "quizzes_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quizzes" ADD CONSTRAINT "quizzes_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_lessons" ADD CONSTRAINT "quiz_lessons_quiz_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "quizzes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_lessons" ADD CONSTRAINT "quiz_lessons_lesson_id_fkey" FOREIGN KEY ("lesson_id") REFERENCES "lessons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_attempts" ADD CONSTRAINT "quiz_attempts_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_attempts" ADD CONSTRAINT "quiz_attempts_quiz_id_fkey" FOREIGN KEY ("quiz_id") REFERENCES "quizzes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_attempt_questions" ADD CONSTRAINT "quiz_attempt_questions_selected_answer_id_fkey" FOREIGN KEY ("selected_answer_id") REFERENCES "answers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_attempt_questions" ADD CONSTRAINT "quiz_attempt_questions_quiz_attempt_id_fkey" FOREIGN KEY ("quiz_attempt_id") REFERENCES "quiz_attempts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quiz_attempt_questions" ADD CONSTRAINT "quiz_attempt_questions_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
