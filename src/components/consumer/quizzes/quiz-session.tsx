"use client";

import {
  finishQuizAttempt,
  saveQuestionInteraction,
  startQuizAttempt,
  submitQuizAnswer,
} from "@/actions/quizzes";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dictionary } from "@/lib/dictionaries";
import { Locale } from "@/lib/locales";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Check,
  Clock,
  Eye,
  HelpCircle,
  History,
  RotateCcw,
  ShieldCheck,
  X,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { QuestionDetailsDialog } from "./question-details-dialog";

interface QuizSessionProps {
  quizId: string;
  lang: Locale;
  dict: Dictionary;
  initialAttempt: any;
  pastAttempts?: any[];
  isPremium?: boolean;
}

export function QuizSession({
  quizId,
  lang,
  dict,
  initialAttempt,
  pastAttempts = [],
  isPremium = false,
}: QuizSessionProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [attempt, setAttempt] = useState<any>(initialAttempt);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [remainingTime, setRemainingTime] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [showDescriptions, setShowDescriptions] = useState<{
    [qId: string]: boolean;
  }>({});
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState<
    number | null
  >(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Synchronize state with props when switching attempts via URL
  useEffect(() => {
    setAttempt(initialAttempt);
    // Reset viewing index when switching attempts
    setCurrentQuestionIndex(0);
  }, [initialAttempt]);

  const isFa = lang === "fa";
  const t = dict.app.admin.quizzes.session;

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
          if (timerRef.current) clearInterval(timerRef.current);
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
      await finishQuizAttempt(attempt.id);
      router.push(`${pathname}?attemptId=${attempt.id}`);
      router.refresh();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    if (!attempt) return;

    const unansweredCount = attempt.quizAttemptQuestions.filter(
      (aq: any) => !aq.selectedAnswerId,
    ).length;
    if (unansweredCount > 0) {
      if (!confirm(t.unanswered_warning)) {
        return;
      }
    }

    setIsSubmitting(true);
    try {
      await finishQuizAttempt(attempt.id);
      toast.success(t.quiz_completed);
      router.push(`${pathname}?attemptId=${attempt.id}`);
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error(isFa ? "خطا در ثبت آزمون" : "Failed to submit quiz");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSaveInteraction = async (questionId: string, state: string) => {
    try {
      await saveQuestionInteraction(questionId, state);
      toast.success(isFa ? "ذخیره شد" : "Saved");
    } catch (err) {
      console.error(err);
      toast.error(
        isFa ? "خطا در ذخیره وضعیت" : "Failed to save interaction state",
      );
    }
  };

  const toggleDescription = (qId: string) => {
    if (!isPremium) {
      toast.info(t.premium_only);
      return;
    }
    setShowDescriptions((prev) => ({ ...prev, [qId]: !prev[qId] }));
  };

  const formatTime = (ms: number) => {
    const totalSecs = Math.floor(ms / 1000);
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const renderHistory = () => {
    if (pastAttempts.length === 0) return null;

    return (
      <div className="space-y-4 mt-8 pt-8 border-t border-border/20">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <History className="w-5 h-5" />
          {t.history}
        </h3>
        <div className="grid gap-3">
          {pastAttempts.map((pa) => {
            const paCorrect = pa.quizAttemptQuestions.filter(
              (aq: any) => aq.selectedAnswer?.isCorrect,
            ).length;
            const paTotal = pa.quizAttemptQuestions.length;
            const paScore = Math.round((paCorrect / paTotal) * 100);
            return (
              <Card
                key={pa.id}
                className="hover:border-primary/50 transition-colors cursor-pointer group"
                onClick={() => router.push(`${pathname}?attemptId=${pa.id}`)}
              >
                <CardContent className="p-4 flex items-center justify-between">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold">
                      {new Date(pa.startedAt).toLocaleString(
                        isFa ? "fa-IR" : "en-US",
                      )}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {paTotal} {isFa ? "سوال" : "questions"}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex flex-col items-end">
                      <span
                        className={`text-sm font-bold ${paScore >= 70 ? "text-green-600" : paScore >= 40 ? "text-yellow-600" : "text-red-600"}`}
                      >
                        {paScore}%
                      </span>
                      <span className="text-[10px] text-muted-foreground uppercase">
                        {t.score}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1.5 text-xs group-hover:bg-primary/10 transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      {t.view_result}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    );
  };

  if (!attempt || !attempt.id) {
    return (
      <div className="max-w-4xl mx-auto py-8 px-4 space-y-8">
        <Card className="border border-border/40 shadow-xl bg-card/60 backdrop-blur-md">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-3xl font-extrabold tracking-tight bg-linear-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400">
              {initialAttempt?.quiz?.title || "Quiz"}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-4 text-center">
            <div className="flex justify-center gap-8 py-4">
              <div className="flex flex-col items-center bg-muted/40 p-4 rounded-xl border border-border/20 min-w-32">
                <Clock className="w-8 h-8 text-blue-500 mb-2" />
                <span className="text-xs text-muted-foreground">
                  {t.duration}
                </span>
                <span className="text-lg font-bold mt-1">
                  {initialAttempt?.quiz?.duration} {t.minutes}
                </span>
              </div>
              <div className="flex flex-col items-center bg-muted/40 p-4 rounded-xl border border-border/20 min-w-32">
                <HelpCircle className="w-8 h-8 text-indigo-500 mb-2" />
                <span className="text-xs text-muted-foreground">
                  {t.total_questions}
                </span>
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
              className="px-12 py-6 text-lg font-semibold bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md transition-all hover:scale-105"
              onClick={handleStart}
              disabled={isStarting}
            >
              {isStarting ? t.saving : t.start_quiz}
            </Button>
          </CardFooter>
        </Card>

        {renderHistory()}
      </div>
    );
  }

  // Active quiz playing interface
  if (!attempt.endedAt) {
    const aqList = attempt.quizAttemptQuestions;
    const currentAq = aqList[currentQuestionIndex];
    const totalQuestions = aqList.length;

    if (!currentAq) return <div>No questions loaded.</div>;

    const answeredCount = aqList.filter(
      (aq: any) => aq.selectedAnswerId,
    ).length;
    const progressPercent = (answeredCount / totalQuestions) * 100;

    return (
      <div className="max-w-4xl mx-auto py-6 px-4">
        {/* Top bar with progress and timer */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center mb-6">
          <div className="flex items-center gap-3 bg-card p-3 rounded-xl border border-border/40 shadow-sm">
            <Clock className="w-5 h-5 text-red-500 animate-pulse" />
            <div>
              <div className="text-[10px] text-muted-foreground font-semibold uppercase">
                {t.timer}
              </div>
              <div className="text-xl font-mono font-bold text-red-500">
                {remainingTime !== null ? formatTime(remainingTime) : "--:--"}
              </div>
            </div>
          </div>

          <div className="md:col-span-2 bg-card p-3 rounded-xl border border-border/40 shadow-sm">
            <div className="flex justify-between items-center mb-1 text-xs font-semibold text-muted-foreground">
              <span>{isFa ? "پیشرفت پاسخ‌دهی" : "Answer Progress"}</span>
              <span>
                {answeredCount} / {totalQuestions}
              </span>
            </div>
            <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
              <div
                className="bg-blue-600 h-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
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
            {currentAq.question.description && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => toggleDescription(currentAq.questionId)}
                className="text-xs text-muted-foreground gap-1"
              >
                <Eye className="w-3.5 h-3.5" />
                {t.show_description}
              </Button>
            )}
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div
              className="text-xl font-semibold leading-relaxed text-foreground select-none"
              dangerouslySetInnerHTML={{ __html: currentAq.question.title }}
            />

            {showDescriptions[currentAq.questionId] &&
              currentAq.question.description && (
                <div
                  className="p-4 bg-blue-50/50 dark:bg-blue-900/10 rounded-lg text-sm text-blue-900 dark:text-blue-100 border border-blue-100 dark:border-blue-900/30 leading-relaxed animate-in fade-in slide-in-from-top-2 duration-300"
                  dangerouslySetInnerHTML={{
                    __html: currentAq.question.description,
                  }}
                />
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
                    <span
                      className={`w-5 h-5 rounded-full border flex items-center justify-center me-3 mt-0.5 shrink-0 ${
                        isSelected
                          ? "border-blue-600 bg-blue-600 text-white"
                          : "border-muted-foreground/40"
                      }`}
                    >
                      {isSelected && (
                        <span className="w-2 h-2 bg-white rounded-full" />
                      )}
                    </span>
                    <span
                      className="font-medium"
                      dangerouslySetInnerHTML={{ __html: answer.title }}
                    />
                  </button>
                );
              })}
            </div>
          </CardContent>

          <CardFooter className="border-t border-border/20 py-4 flex justify-between items-center bg-muted/10">
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() =>
                  setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))
                }
                disabled={currentQuestionIndex === 0}
              >
                {isFa ? (
                  <ArrowRight className="w-4 h-4 me-2" />
                ) : (
                  <ArrowLeft className="w-4 h-4 me-2" />
                )}
                {t.previous}
              </Button>
              <Button
                variant="outline"
                onClick={() =>
                  setCurrentQuestionIndex((prev) =>
                    Math.min(totalQuestions - 1, prev + 1),
                  )
                }
                disabled={currentQuestionIndex === totalQuestions - 1}
              >
                {t.next}
                {isFa ? (
                  <ArrowLeft className="w-4 h-4 ms-2" />
                ) : (
                  <ArrowRight className="w-4 h-4 ms-2" />
                )}
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
  const correctCount = aqList.filter(
    (aq: any) => aq.selectedAnswer && aq.selectedAnswer.isCorrect,
  ).length;
  const incorrectCount = aqList.filter(
    (aq: any) => aq.selectedAnswer && !aq.selectedAnswer.isCorrect,
  ).length;
  const unansweredCount = aqList.filter(
    (aq: any) => !aq.selectedAnswerId,
  ).length;
  const scorePercent =
    totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto py-6 px-4 space-y-6">
      <Card className="border border-border/40 shadow-2xl bg-card overflow-hidden py-0">
        <div className="bg-linear-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700 p-8 text-white text-center space-y-3 relative">
          <div className="absolute top-4 left-4">
            <Button
              variant="secondary"
              size="sm"
              onClick={() => router.push(`/${lang}/app/quizzes`)}
              className="bg-white/10 hover:bg-white/20 text-white border-0"
            >
              <ArrowLeft className="w-4 h-4 me-2" />
              {t.back_to_quizzes}
            </Button>
          </div>

          <CardTitle className="text-3xl font-extrabold">{t.result}</CardTitle>
          <p className="text-blue-100 font-medium">{attempt.quiz.title}</p>

          <div className="pt-4 flex justify-center items-center">
            <div className="w-32 h-32 rounded-full border-4 border-white/30 flex flex-col items-center justify-center bg-white/10 shadow-inner">
              <span className="text-4xl font-bold font-mono">
                {scorePercent}%
              </span>
              <span className="text-[10px] text-blue-100 font-semibold tracking-wider uppercase mt-1">
                {t.score}
              </span>
            </div>
          </div>
        </div>

        <CardContent className="grid grid-cols-3 divide-x divide-border/20 text-center py-6 bg-muted/20">
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-1.5 text-green-600 dark:text-green-400 font-semibold">
              <Check className="w-4 h-4" />
              <span>{t.correct_answers}</span>
            </div>
            <div className="text-2xl font-bold font-mono">{correctCount}</div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-1.5 text-red-600 dark:text-red-400 font-semibold">
              <X className="w-4 h-4" />
              <span>{t.incorrect_answers}</span>
            </div>
            <div className="text-2xl font-bold font-mono">{incorrectCount}</div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-1.5 text-muted-foreground font-semibold">
              <AlertTriangle className="w-4 h-4" />
              <span>{t.unanswered}</span>
            </div>
            <div className="text-2xl font-bold font-mono">
              {unansweredCount}
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex justify-center py-4 bg-muted/40 border-t border-border/10 gap-4">
          <Button
            onClick={handleStart}
            disabled={isStarting}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-sm"
          >
            <RotateCcw className="w-4 h-4 me-2" />
            {t.start_new_attempt}
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              router.push(`${pathname}`);
              setAttempt(null);
            }}
          >
            <History className="w-4 h-4 me-2" />
            {t.history}
          </Button>
        </CardFooter>
      </Card>

      <div className="space-y-4">
        <h3 className="text-xl font-bold text-foreground ps-1">
          {isFa ? "مرور سوالات و وضعیت تسلط" : "Questions Review & Mastery"}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {aqList.map((aq: any, idx: number) => {
            const state = aq.question.questionInteractions[0]?.state || null;

            return (
              <Card
                key={aq.id}
                className="border border-border/40 shadow-sm bg-card hover:border-border transition-all flex flex-col"
              >
                <CardHeader className="py-4 border-b border-border/10 flex flex-row items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="bg-muted text-muted-foreground px-2.5 py-1 rounded-lg text-xs font-semibold font-mono">
                      {t.question} {idx + 1}
                    </span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() =>
                        handleSaveInteraction(aq.questionId, "MASTERED")
                      }
                      className={`p-1.5 rounded-lg text-xs font-semibold border flex items-center transition-all ${
                        state === "MASTERED"
                          ? "bg-green-600 border-green-600 text-white shadow-sm"
                          : "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-100"
                      }`}
                      title={t.mastered}
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() =>
                        handleSaveInteraction(aq.questionId, "UNSURE")
                      }
                      className={`p-1.5 rounded-lg text-xs font-semibold border flex items-center transition-all ${
                        state === "UNSURE"
                          ? "bg-yellow-500 border-yellow-500 text-white shadow-sm"
                          : "bg-yellow-50 dark:bg-yellow-950/20 border-green-200 dark:border-green-900/30 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-100"
                      }`}
                      title={t.unsure}
                    >
                      <AlertTriangle className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() =>
                        handleSaveInteraction(aq.questionId, "CONFUSED")
                      }
                      className={`p-1.5 rounded-lg text-xs font-semibold border flex items-center transition-all ${
                        state === "CONFUSED"
                          ? "bg-red-600 border-red-600 text-white shadow-sm"
                          : "bg-red-50 dark:bg-red-950/20 border-green-200 dark:border-green-900/30 text-red-700 dark:text-red-400 hover:bg-green-100"
                      }`}
                      title={t.confused}
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </CardHeader>

                <CardContent className="pt-4 flex-1 flex flex-col justify-between space-y-4">
                  <div
                    className="font-semibold text-base leading-relaxed text-foreground select-none line-clamp-3"
                    dangerouslySetInnerHTML={{ __html: aq.question.title }}
                  />

                  <div className="flex justify-end">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="gap-1.5 h-8 text-xs"
                      onClick={() => setSelectedQuestionIndex(idx)}
                    >
                      <Eye className="w-3.5 h-3.5" />
                      {t.view_result}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <QuestionDetailsDialog
        open={selectedQuestionIndex !== null}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedQuestionIndex(null);
          }
        }}
        lang={lang}
        dict={dict}
        currentQuestion={
          selectedQuestionIndex !== null
            ? aqList[selectedQuestionIndex].question
            : null
        }
        currentIndex={selectedQuestionIndex ?? 0}
        totalCount={aqList.length}
        onNext={() =>
          selectedQuestionIndex !== null &&
          selectedQuestionIndex < aqList.length - 1 &&
          setSelectedQuestionIndex(selectedQuestionIndex + 1)
        }
        onPrev={() =>
          selectedQuestionIndex !== null &&
          selectedQuestionIndex > 0 &&
          setSelectedQuestionIndex(selectedQuestionIndex - 1)
        }
        onSaveInteraction={handleSaveInteraction}
        showDescription={
          selectedQuestionIndex !== null
            ? showDescriptions[aqList[selectedQuestionIndex].questionId]
            : false
        }
        onToggleDescription={(qId) => toggleDescription(qId)}
        selectedAnswerId={
          selectedQuestionIndex !== null
            ? aqList[selectedQuestionIndex].selectedAnswerId
            : null
        }
      />

      {renderHistory()}
    </div>
  );
}
