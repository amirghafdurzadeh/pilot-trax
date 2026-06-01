"use client";

import {
  Check,
  X,
  AlertTriangle,
  Eye,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  XIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Locale } from "@/lib/locales";

interface QuestionDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  lang: Locale;
  t: {
    questionDetails: string;
    question: string;
    of: string;
    next: string;
    previous: string;
    mastered: string;
    unsure: string;
    confused: string;
    showDescription: string;
    incorrect: string;
    totalAttempts: string;
    yourAnswer?: string;
    correctAnswer?: string;
  };
  currentQuestion: any;
  currentIndex: number;
  totalCount: number;
  onNext: () => void;
  onPrev: () => void;
  onSaveInteraction: (questionId: string, state: string) => void;
  showDescription: boolean;
  onToggleDescription: (questionId: string) => void;
  selectedAnswerId?: string | null;
}

export function QuestionDetailsDialog({
  open,
  onOpenChange,
  lang,
  t,
  currentQuestion,
  currentIndex,
  totalCount,
  onNext,
  onPrev,
  onSaveInteraction,
  showDescription,
  onToggleDescription,
  selectedAnswerId,
}: QuestionDetailsDialogProps) {
  const isFa = lang === "fa";

  if (!currentQuestion) return null;

  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >
      <DialogContent
        className="max-w-none! w-screen h-screen flex flex-col p-0 gap-0 border-none rounded-none outline-none"
        dir={isFa ? "rtl" : "ltr"}
        showCloseButton={false}
      >
        <div className="flex items-center justify-between p-4 border-b bg-card shrink-0">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onOpenChange(false)}
            >
              <XIcon className="w-5 h-5" />
            </Button>
            <div className="flex flex-col">
              <DialogTitle className="text-lg font-bold">
                {t.questionDetails}
              </DialogTitle>
              <span className="text-xs text-muted-foreground">
                {t.question} {currentIndex + 1} {t.of} {totalCount}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <button
                onClick={() => onSaveInteraction(currentQuestion.id, "MASTERED")}
                className={`p-2 rounded-lg text-xs font-semibold border flex items-center transition-all ${currentQuestion.interactionState === "MASTERED" || currentQuestion.state === "MASTERED"
                  ? "bg-green-600 border-green-600 text-white shadow-sm"
                  : "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900/30 text-green-700 dark:text-green-400 hover:bg-green-100"
                  }`}
                title={t.mastered}
              >
                <ShieldCheck className="w-4 h-4" />
              </button>
              <button
                onClick={() => onSaveInteraction(currentQuestion.id, "UNSURE")}
                className={`p-2 rounded-lg text-xs font-semibold border flex items-center transition-all ${currentQuestion.interactionState === "UNSURE" || currentQuestion.state === "UNSURE"
                  ? "bg-yellow-500 border-yellow-500 text-white shadow-sm"
                  : "bg-yellow-50 dark:bg-yellow-950/20 border-green-200 dark:border-green-900/30 text-yellow-700 dark:text-yellow-400 hover:bg-yellow-100"
                  }`}
                title={t.unsure}
              >
                <AlertTriangle className="w-4 h-4" />
              </button>
              <button
                onClick={() => onSaveInteraction(currentQuestion.id, "CONFUSED")}
                className={`p-2 rounded-lg text-xs font-semibold border flex items-center transition-all ${currentQuestion.interactionState === "CONFUSED" || currentQuestion.state === "CONFUSED"
                  ? "bg-red-600 border-red-600 text-white shadow-sm"
                  : "bg-red-50 dark:bg-red-950/20 border-green-200 dark:border-green-900/30 text-red-700 dark:text-red-400 hover:bg-red-100"
                  }`}
                title={t.confused}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {currentQuestion.description && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => onToggleDescription(currentQuestion.id)}
                className="text-xs gap-1.5"
              >
                <Eye className="w-3.5 h-3.5" />
                {t.showDescription}
              </Button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8 max-w-4xl mx-auto w-full">
          <div className="space-y-4">
            <div className="text-[10px] uppercase font-bold text-primary/70 tracking-wider">
              {currentQuestion.lesson?.course?.title} / {currentQuestion.lesson?.title}
            </div>
            <h3
              className="text-2xl md:text-3xl font-bold leading-tight"
              dangerouslySetInnerHTML={{ __html: currentQuestion.title }}
            />

            {showDescription && currentQuestion.description && (
              <div
                className="p-6 bg-blue-50/50 dark:bg-blue-900/10 rounded-xl text-base text-blue-900 dark:text-blue-100 border border-blue-100 dark:border-blue-900/30 leading-relaxed animate-in fade-in slide-in-from-top-2 duration-300"
                dangerouslySetInnerHTML={{ __html: currentQuestion.description }}
              />
            )}
          </div>

          <div className="grid gap-3">
            {currentQuestion.answers.map((answer: any) => {
              const isCorrect = answer.isCorrect;
              const isSelected = selectedAnswerId === answer.id;
              
              let variantClasses = "border-border/60 bg-card";
              if (isCorrect) {
                variantClasses = "border-green-600 bg-green-50/20 text-green-900 dark:text-green-100 ring-4 ring-green-500/10";
              } else if (isSelected) {
                variantClasses = "border-red-600 bg-red-50/20 text-red-900 dark:text-red-100 ring-4 ring-red-500/10";
              }

              return (
                <div
                  key={answer.id}
                  className={`flex items-center p-4 rounded-xl border-2 text-lg font-medium transition-all ${variantClasses}`}
                >
                  <span className="flex-1" dangerouslySetInnerHTML={{ __html: answer.title }} />
                  {isCorrect && (
                    <div className="flex items-center gap-2">
                      {t.correctAnswer && (
                        <span className="text-xs font-bold uppercase text-green-600 dark:text-green-400">
                          {t.correctAnswer}
                        </span>
                      )}
                      <div className="bg-green-600 text-white p-1 rounded-full">
                        <Check className="w-5 h-5 shrink-0" />
                      </div>
                    </div>
                  )}
                  {isSelected && !isCorrect && (
                    <div className="flex items-center gap-2">
                       {t.yourAnswer && (
                        <span className="text-xs font-bold uppercase text-red-600 dark:text-red-400">
                          {t.yourAnswer}
                        </span>
                      )}
                      <div className="bg-red-600 text-white p-1 rounded-full">
                        <X className="w-5 h-5 shrink-0" />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {(currentQuestion.incorrectCount !== undefined || currentQuestion.totalAttempts !== undefined) && (
            <div className="flex gap-6 text-sm font-medium text-muted-foreground pt-4 border-t">
              {currentQuestion.incorrectCount !== undefined && (
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase text-muted-foreground/60">{t.incorrect}</span>
                  <strong className="text-red-500 text-xl font-mono">
                    {currentQuestion.incorrectCount}
                  </strong>
                </div>
              )}
              {currentQuestion.totalAttempts !== undefined && (
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase text-muted-foreground/60">{t.totalAttempts}</span>
                  <strong className="text-foreground text-xl font-mono">
                    {currentQuestion.totalAttempts}
                  </strong>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="p-4 border-t bg-card shrink-0">
          <div className="max-w-4xl mx-auto w-full flex items-center justify-between">
            <Button
              variant="outline"
              onClick={onPrev}
              disabled={currentIndex === 0}
              className="gap-2 px-6"
            >
              {isFa ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
              {t.previous}
            </Button>
            <Button
              variant="outline"
              onClick={onNext}
              disabled={currentIndex === totalCount - 1}
              className="gap-2 px-6"
            >
              {t.next}
              {isFa ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
