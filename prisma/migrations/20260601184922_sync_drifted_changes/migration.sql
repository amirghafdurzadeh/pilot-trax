-- CreateTable
CREATE TABLE "question_interactions" (
    "user_id" TEXT NOT NULL,
    "question_id" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "question_interactions_pkey" PRIMARY KEY ("user_id","question_id")
);

-- AddForeignKey
ALTER TABLE "question_interactions" ADD CONSTRAINT "question_interactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_interactions" ADD CONSTRAINT "question_interactions_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
