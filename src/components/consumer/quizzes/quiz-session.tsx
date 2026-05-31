"use client";

import React, { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Check, X, AlertTriangle, ArrowLeft, ArrowRight, RotateCcw, Clock, ShieldCheck, HelpCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { startQuizAttempt, getActiveQuizAttempt, submitQuizAnswer, finishQuizAttempt, saveQuestionInteraction } from "@/actions/quizzes";
import { Locale } from "@/lib/locales";

interface QuizSessionProps {
  quizId: string;
  lang: Locale;
  initialAttempt: any;
}

export function QuizSession({ quizId, lang, initialAttempt }: QuizSessionProps) {
  const router = useRouter();
  const [attempt, setAttempt] = useState<any>(initialAttempt);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [remainingTime, setRemainingTime] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [interactions, setInteractions] = useState<{ [qId: string]: string }>({});
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const isFa = lang === "fa";
  const t = {
    startQuiz: isFa ? "شروع آزمون" : "Start Quiz",
    resumeQuiz: isFa ? "ادامه آزمون" : "Resume Quiz",
    timer: isFa ? "زمان باقی‌مانده" : "Time Remaining",
    question: isFa ? "سوال" : "Question",
    next: isFa ? "بعدی" : "Next",
    previous: isFa ? "قبلی" : "Previous",
    submit: isFa ? "ثبت نهایی" : "Submit Quiz",
    result: isFa ? "نتیجه آزمون" : "Quiz Result",
    score: isFa ? "نمره" : "Score",
    correctAnswers: isFa ? "پاسخ‌های صحیح" : "Correct Answers",
    incorrectAnswers: isFa ? "پاسخ‌های نادرست" : "Incorrect Answers",
    unanswered: isFa ? "بدون پاسخ" : "Unanswered",
    backToQuizzes: isFa ? "بازگشت به آزمون‌ها" : "Back to Quizzes",
    mastered: isFa ? "تسلط کامل" : "Mastered",
    unsure: isFa ? "شک دارم" : "Unsure",
    confused: isFa ? "نیاز به بررسی" : "Confused",
    yourAnswer: isFa ? "پاسخ شما" : "Your Answer",
    correctAnswer: isFa ? "پاسخ صحیح" : "Correct Answer",
    startNewAttempt: isFa ? "شرکت مجدد در آزمون" : "Start New Attempt",
    duration: isFa ? "مدت زمان" : "Duration",
    minutes: isFa ? "دقیقه" : "minutes",
    totalQuestions: isFa ? "تعداد کل سوالات" : "Total Questions",
    unansweredWarning: isFa ? "برخی از سوالات بی‌پاسخ هستند. آیا مطمئنید؟" : "Some questions are unanswered. Are you sure?",
    saving: isFa ? "در حال ثبت..." : "Saving...",
    quizCompleted: isFa ? "آزمون به پایان رسید" : "Quiz finished",
  };

  // Start countdown if attempt is active
  useEffect(() => {
    if (attempt && !attempt.endedAt && attempt.startedAt && attempt.quiz) {
      const startedTime = new Date(attempt.startedAt).getTime();
      const durationMs = attempt.quiz.duration * 60 * 1000;

      const updateTimer = () => {
        const elapsed = Date.now() - startedTime;
        const remaining = Math.max(0, durationMs - elapsed);
        setRemainingTime(remaining);

        if (remaining <= 0) {
          clearInterval(timerRef.current!);
          handleAutoSubmit();
        }
      };

      updateTimer();
      timerRef.current = setInterval(updateTimer, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      setRemainingTime(null);
    }

    // Load initial interactions if we are viewing results
    if (attempt && attempt.endedAt) {
      const initialInteractions: { [qId: string]: string } = {};
      attempt.quizAttemptQuestions.forEach((aq: any) => {
        const userInter = aq.question.questionInteractions?.[0];
        if (userInter) {
          initialInteractions[aq.questionId] = userInter.state;
        }
      });
      setInteractions(initialInteractions);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [attempt]);

  const handleStart = async () => {
    setIsStarting(true);
    try {
      const newAttempt = await startQuizAttempt(quizId);
      setAttempt(newAttempt);
      setCurrentQuestionIndex(0);
      toast.success(isFa ? "آزمون شروع شد" : "Quiz started");
    } catch (err: any) {
      console.error(err);
      toast.error(isFa ? "خطا در شروع آزمون" : "Failed to start quiz");
    } finally {
      setIsStarting(false);
    }
  };

  const handleSelectAnswer = async (aqId: string, answerId: string) => {
    // Optimistic update
    const updatedQuestions = attempt.quizAttemptQuestions.map((aq: any) => {
      if (aq.id === aqId) {
        return { ...aq, selectedAnswerId: answerId };
      }
      return aq;
    });
    setAttempt({ ...attempt, quizAttemptQuestions: updatedQuestions });

    try {
      await submitQuizAnswer(aqId, answerId);
    } catch (err) {
      console.error(err);
      toast.error(isFa ? "خطا در ثبت پاسخ" : "Failed to save answer");
    }
  };

  const handleAutoSubmit = async () => {
    if (!attempt) return;
    setIsSubmitting(true);
    try {
      const finished = await finishQuizAttempt(attempt.id);
      // Reload attempt to show results
      window.location.reload();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    if (!attempt) return;

    const unansweredCount = attempt.quizAttemptQuestions.filter((aq: any) => !aq.selectedAnswerId).length;
    if (unansweredCount > 0) {
      if (!confirm(t.unansweredWarning)) {
        return;
      }
    }

    setIsSubmitting(true);
    try {
      await finishQuizAttempt(attempt.id);
      toast.success(t.quizCompleted);
      // Refresh to get results view
      router.refresh();
      // Fetch latest finished state
      window.location.reload();
    } catch (err) {
      console.error(err);
      toast.error(isFa ? "خطا در ثبت آزمون" : "Failed to submit quiz");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveInteraction = async (questionId: string, state: string) => {
    // Optimistically update local state
    setInteractions((prev) => ({ ...prev, [questionId]: state }));
    try {
      await saveQuestionInteraction(questionId, state);
      toast.success(isFa ? "ذخیره شد" : "Saved");
    } catch (err) {
      console.error(err);
      toast.error(isFa ? "خطا در ذخیره وضعیت" : "Failed to save interaction state");
    }
  };

  // Format remaining time
  const formatTime = (ms: number) => {
    const totalSecs = Math.floor(ms / 1000);
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // If no attempt has been started yet
  if (!attempt || !attempt.id) {
    return (
      <div className="max-w-2xl mx-auto py-8 px-4">
        <Card className="border border-border/40 shadow-xl bg-card/60 backdrop-blur-md">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400">
              {initialAttempt?.quiz?.title || "Quiz"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-4 text-center">
            <div className="flex justify-center gap-8 py-4">
              <div className="flex flex-col items-center bg-muted/40 p-4 rounded-xl border border-border/20 min-w-32">
                <Clock className="w-8 h-8 text-blue-500 mb-2" />
                <span className="text-xs text-muted-foreground">{t.duration}</span>
                <span className="text-lg font-bold mt-1">
                  {initialAttempt?.quiz?.duration} {t.minutes}
                </span>
              </div>
              <div className="flex flex-col items-center bg-muted/40 p-4 rounded-xl border border-border/20 min-w-32">
                <HelpCircle className="w-8 h-8 text-indigo-500 mb-2" />
                <span className="text-xs text-muted-foreground">{t.totalQuestions}</span>
                <span className="text-lg font-bold mt-1">
                  {initialAttempt?.quiz?.questionCount}
                </span>
              </div>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              {isFa
                ? "برای شروع آزمون، روی دکمه زیر کلیک کنید. پس از شروع، زمان‌سنج فعال شده و در صورت خروج از صفحه زمان متوقف نخواهد شد."
                : "Click the button below to start the quiz. Once started, the timer will begin and will continue even if you close this page."}
            </p>
          </CardContent>
          <CardFooter className="flex justify-center pb-8">
            <Button
              size="lg"
              className="px-12 py-6 text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md transition-all hover:scale-105"
              onClick={handleStart}
              disabled={isStarting}
            >
              {isStarting ? t.saving : t.startQuiz}
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Active quiz playing interface
  if (!attempt.endedAt) {
    const aqList = attempt.quizAttemptQuestions;
    const currentAq = aqList[currentQuestionIndex];
    const totalQuestions = aqList.length;

    if (!currentAq) return <div>No questions loaded.</div>;

    const answeredCount = aqList.filter((aq: any) => aq.selectedAnswerId).length;
    const progressPercent = (answeredCount / totalQuestions) * 100;

    return (
      <div className="max-w-4xl mx-auto py-6 px-4">
        {/* Top bar with progress and timer */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center mb-6">
          <div className="flex items-center gap-3 bg-card p-3 rounded-xl border border-border/40 shadow-sm">
            <Clock className="w-5 h-5 text-red-500 animate-pulse" />
            <div>
              <div className="text-[10px] text-muted-foreground font-semibold uppercase">{t.timer}</div>
              <div className="text-xl font-mono font-bold text-red-500">
                {remainingTime !== null ? formatTime(remainingTime) : "--:--"}
              </div>
            </div>
          </div>

          <div className="md:col-span-2 bg-card p-3 rounded-xl border border-border/40 shadow-sm">
            <div className="flex justify-between items-center mb-1 text-xs font-semibold text-muted-foreground">
              <span>{isFa ? "پیشرفت پاسخ‌دهی" : "Answer Progress"}</span>
              <span>{answeredCount} / {totalQuestions}</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <div className="bg-blue-600 h-full transition-all duration-300" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>
        </div>

        {/* Question card */}
        <Card className="border border-border/40 shadow-xl bg-card">
          <CardHeader className="border-b border-border/20 py-4 flex flex-row items-center justify-between">
            <CardTitle className="text-lg font-bold flex items-center gap-2">
              <span className="bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 px-2.5 py-1 rounded-lg text-sm font-mono">
                {t.question} {currentQuestionIndex + 1}
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div className="text-xl font-semibold leading-relaxed text-foreground select-none">
              {currentAq.question.title}
            </div>

            {currentAq.question.description && (
              <div className="p-4 bg-muted/40 rounded-lg text-sm text-muted-foreground border border-border/10 leading-relaxed">
                {currentAq.question.description}
              </div>
            )}

            <div className="grid gap-3 pt-2">
              {currentAq.question.answers.map((answer: any) => {
                const isSelected = currentAq.selectedAnswerId === answer.id;
                return (
                  <button
                    key={answer.id}
                    onClick={() => handleSelectAnswer(currentAq.id, answer.id)}
                    className={`flex items-start text-start p-4 rounded-xl border transition-all ${
                      isSelected
                        ? "border-blue-600 bg-blue-50/50 dark:border-blue-500 dark:bg-blue-950/20 text-blue-900 dark:text-blue-100 shadow-sm ring-1 ring-blue-500"
                        : "border-border/60 hover:border-border hover:bg-muted/30 text-foreground"
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-full border flex items-center justify-center me-3 mt-0.5 shrink-0 ${
                      isSelected ? "border-blue-600 bg-blue-600 text-white" : "border-muted-foreground/40"
                    }`}>
                      {isSelected && <span className="w-2 h-2 bg-white rounded-full" />}
                    </span>
                    <span className="font-medium">{answer.title}</span>
                  </button>
                );
              })}
            </div>
          </CardContent>

          <CardFooter className="border-t border-border/20 py-4 flex justify-between items-center bg-muted/10">
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                disabled={currentQuestionIndex === 0}
              >
                {lang === "fa" ? <ArrowRight className="w-4 h-4 me-2" /> : <ArrowLeft className="w-4 h-4 me-2" />}
                {t.previous}
              </Button>
              <Button
                variant="outline"
                onClick={() => setCurrentQuestionIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
                disabled={currentQuestionIndex === totalQuestions - 1}
              >
                {t.next}
                {lang === "fa" ? <ArrowLeft className="w-4 h-4 ms-2" /> : <ArrowRight className="w-4 h-4 ms-2" />}
              </Button>
            </div>

            {currentQuestionIndex === totalQuestions - 1 ? (
              <Button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-green-600 hover:bg-green-700 text-white shadow-md font-semibold px-6"
              >
                {isSubmitting ? t.saving : t.submit}
              </Button>
            ) : (
              <Button
                variant="ghost"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="text-muted-foreground hover:text-foreground font-semibold"
              >
                {t.submit}
              </Button>
            )}
          </CardFooter>
        </Card>

        {/* Question grid navigator */}
        <div className="mt-6 bg-card p-4 rounded-xl border border-border/40 shadow-sm">
          <div className="text-xs font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
            {isFa ? "ناوبری سوالات" : "Questions Navigator"}
          </div>
          <div className="grid grid-cols-8 sm:grid-cols-12 md:grid-cols-16 lg:grid-cols-20 gap-2">
            {aqList.map((aq: any, idx: number) => {
              const isSelected = idx === currentQuestionIndex;
              const isAnswered = !!aq.selectedAnswerId;
              return (
                <button
                  key={aq.id}
                  onClick={() => setCurrentQuestionIndex(idx)}
                  className={`w-9 h-9 rounded-lg flex items-center justify-center font-mono text-sm font-semibold transition-all ${
                    isSelected
                      ? "bg-blue-600 text-white shadow-md scale-110 ring-2 ring-blue-400"
                      : isAnswered
                      ? "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-900/60"
                      : "bg-muted text-muted-foreground hover:bg-muted/80 border border-border/40"
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Quiz Result & Review Screen
  const aqList = attempt.quizAttemptQuestions;
  const totalCount = aqList.length;
  const correctCount = aqList.filter((aq: any) => aq.selectedAnswer && aq.selectedAnswer.isCorrect).length;
  const incorrectCount = aqList.filter((aq: any) => aq.selectedAnswer && !aq.selectedAnswer.isCorrect).length;
  const unansweredCount = aqList.filter((aq: any) => !aq.selectedAnswerId).length;
  const scorePercent = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 space-y-6">
      {/* Result score board */}
      <Card className="border border-border/40 shadow-2xl bg-card overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700 p-8 text-white text-center space-y-3 relative">
          <div className="absolute top-4 left-4">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => router.push(`/${lang}/app/quizzes`)}
              className="bg-white/10 hover:bg-white/20 text-white border-0"
            >
              <ArrowLeft className="w-4 h-4 me-2" />
              {t.backToQuizzes}
            </Button>
          </div>

          <CardTitle className="text-3xl font-extrabold">{t.result}</CardTitle>
          <p className="text-blue-100 font-medium">{attempt.quiz.title}</p>

          <div className="pt-4 flex justify-center items-center">
            <div className="w-32 h-32 rounded-full border-4 border-white/30 flex flex-col items-center justify-center bg-white/10 shadow-inner">
              <span className="text-4xl font-bold font-mono">{scorePercent}%</span>
              <span className="text-[10px] text-blue-100 font-semibold tracking-wider uppercase mt-1">{t.score}</span>
            </div>
          </div>
        </div>

        <CardContent className="grid grid-cols-3 divide-x divide-border/20 text-center py-6 bg-muted/20">
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-1.5 text-green-600 dark:text-green-400 font-semibold">
              <Check className="w-4 h-4" />
              <span>{t.correctAnswers}</span>
            </div>
            <div className="text-2xl font-bold font-mono">{correctCount}</div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-1.5 text-red-600 dark:text-red-400 font-semibold">
              <X className="w-4 h-4" />
              <span>{t.incorrectAnswers}</span>
            </div>
            <div className="text-2xl font-bold font-mono">{incorrectCount}</div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-1.5 text-muted-foreground font-semibold">
              <AlertTriangle className="w-4 h-4" />
              <span>{t.unanswered}</span>
            </div>
            <div className="text-2xl font-bold font-mono">{unansweredCount}</div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-center py-4 bg-muted/40 border-t border-border/10 gap-4">
          <Button
            onClick={handleStart}
            disabled={isStarting}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm"
          >
            <RotateCcw className="w-4 h-4 me-2" />
            {t.startNewAttempt}
          </Button>
        </CardFooter>
      </Card>

      {/* Review details */}
      <div className="space-y-4">
        <h3 className="text-xl font-bold text-foreground ps-1">
          {isFa ? "مرور سوالات و وضعیت تسلط" : "Questions Review & Mastery"}
        </h3>

        {aqList.map((aq: any, idx: number) => {
          const state = interactions[aq.questionId] || null;

          return (
            <Card key={aq.id} className="border border-border/40 shadow-sm bg-card hover:border-border transition-all">
              <CardHeader className="py-4 border-b border-border/10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="bg-muted text-muted-foreground px-2.5 py-1 rounded-lg text-sm font-semibold font-mono">
                    {t.question} {idx + 1}
                  </span>
                </div>

                {/* Mastery status selector - Green, Yellow, Red buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleSaveInteraction(aq.questionId, "MASTERED")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border flex items-center gap-1 transition-all ${
                      state === "MASTERED"
                        ? "bg-green-600 border-green-600 text-white shadow-sm"
                        : "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-100"
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {t.mastered}
                  </button>
                  <button
                    onClick={() => handleSaveInteraction(aq.questionId, "UNSURE")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border flex items-center gap-1 transition-all ${
                      state === "UNSURE"
                        ? "bg-yellow-500 border-yellow-500 text-white shadow-sm"
                        : "bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-900/30 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-100"
                    }`}
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    {t.unsure}
                  </button>
                  <button
                    onClick={() => handleSaveInteraction(aq.questionId, "CONFUSED")}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border flex items-center gap-1 transition-all ${
                      state === "CONFUSED"
                        ? "bg-red-600 border-red-600 text-white shadow-sm"
                        : "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900/30 text-red-700 dark:text-red-400 hover:bg-red-100"
                    }`}
                  >
                    <X className="w-3.5 h-3.5" />
                    {t.confused}
                  </button>
                </div>
              </CardHeader>

              <CardContent className="pt-4 space-y-4">
                <div className="font-semibold text-lg leading-relaxed text-foreground select-none">
                  {aq.question.title}
                </div>

                {aq.question.description && (
                  <div className="p-3 bg-muted/40 rounded-lg text-xs text-muted-foreground border border-border/10 leading-relaxed">
                    {aq.question.description}
                  </div>
                )}

                {/* Answers visualization */}
                <div className="grid gap-2.5">
                  {aq.question.answers.map((answer: any) => {
                    const isSelected = aq.selectedAnswerId === answer.id;
                    const isCorrect = answer.isCorrect;

                    let bgBorderClass = "border-border/60 text-foreground";
                    let badge = null;

                    if (isCorrect) {
                      bgBorderClass = "border-green-600 bg-green-50/20 text-green-900 dark:text-green-100 ring-1 ring-green-500/30";
                      badge = (
                        <span className="ms-auto flex items-center gap-1 text-xs text-green-600 dark:text-green-400 font-semibold font-sans bg-green-100 dark:bg-green-950 px-2 py-0.5 rounded-full border border-green-200 dark:border-green-900">
                          <Check className="w-3 h-3" />
                          {t.correctAnswer}
                        </span>
                      );
                    } else if (isSelected) {
                      bgBorderClass = "border-red-600 bg-red-50/20 text-red-900 dark:text-red-100 ring-1 ring-red-500/30";
                      badge = (
                        <span className="ms-auto flex items-center gap-1 text-xs text-red-600 dark:text-red-400 font-semibold font-sans bg-red-100 dark:bg-red-950 px-2 py-0.5 rounded-full border border-red-200 dark:border-red-900">
                          <X className="w-3 h-3" />
                          {t.yourAnswer}
                        </span>
                      );
                    }

                    return (
                      <div
                        key={answer.id}
                        className={`flex items-center p-3 rounded-lg border text-sm font-medium ${bgBorderClass}`}
                      >
                        <span className="me-2 text-foreground font-sans">{answer.title}</span>
                        {badge}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
