"use client";

import { useState } from "react";

import { getQuizzes } from "@/actions/quizzes";
import { AppContent } from "@/components/core/app-content";
import { AppHeader } from "@/components/core/app-header";
import { AppSearch } from "@/components/core/app-search";
import { Dictionary } from "@/lib/dictionaries";
import { Locale } from "@/lib/locales";
import { QuizCard } from "./quiz-card";

type Quizzes = Awaited<ReturnType<typeof getQuizzes>>;

interface ClientQuizzesProps {
  lang: Locale;
  quizzes: Quizzes;
  dict: Dictionary;
}

export function ClientQuizzes({ lang, quizzes, dict }: ClientQuizzesProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredQuizzes = quizzes.filter((quiz) =>
    quiz.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <AppHeader lang={lang} dict={dict.app}>
        <div className="flex items-center gap-2 flex-1">
          <AppSearch
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={dict.app.quizzes.search_placeholder}
          />
        </div>
      </AppHeader>

      <AppContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredQuizzes.map((quiz) => (
            <QuizCard key={quiz.id} quiz={quiz} dict={dict} lang={lang} />
          ))}
        </div>
      </AppContent>
    </>
  );
}
