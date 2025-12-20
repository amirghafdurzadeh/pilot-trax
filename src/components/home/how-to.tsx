import {
  BookOpenTextIcon,
  CrosshairIcon,
  UserIcon,
  ZapIcon,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

type HighlightText = {
  title: string;
  subtitle: string;
};

type Highlight = HighlightText & {
  gradient: string;
};

type StepText = {
  title: string;
  duration: string;
  description: string;
};

type Step = StepText & {
  icon: React.ComponentType<any>;
  number: number;
  gradient: string;
};

const highlightVisuals = [
  {
    gradient: "from-blue-600 to-blue-500",
  },
  {
    gradient: "from-emerald-500 to-emerald-400",
  },
  {
    gradient: "from-amber-500 to-amber-400",
  },
];

const stepVisuals = [
  {
    icon: BookOpenTextIcon,
    gradient: "from-blue-500 to-blue-700",
  },
  {
    icon: CrosshairIcon,
    gradient: "from-emerald-500 to-emerald-400",
  },
  {
    icon: ZapIcon,
    gradient: "from-amber-500 to-amber-400",
  },
  {
    icon: UserIcon,
    gradient: "from-indigo-600 to-indigo-400",
  },
];

interface HowToProps {
  highlights: HighlightText[];
  steps: StepText[];
  dict: {
    title: string;
    description: string;
    cta1: string;
    cta2: string;
    quality_assurance: string;
    steps_title: string;
    steps_description: string;
    image_alt: string;
  };
}

export function HowTo({ highlights, steps, dict }: HowToProps) {
  const highlightsWithVisuals = highlights.map((highlight, index) => ({
    ...highlight,
    ...highlightVisuals[index],
  }));

  const stepsWithVisuals = steps.map((step, index) => ({
    ...step,
    ...stepVisuals[index],
    number: index + 1,
  }));

  return (
    <section
      id="how"
      className="mt-24 px-6 md:px-8 max-w-7xl mx-auto text-neutral-900"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        <div className="flex flex-col gap-12">
          <Card className="rounded-3xl bg-linear-to-br from-white/70 to-neutral-50 dark:from-neutral-900/60 dark:to-neutral-950/60 border border-neutral-100 dark:border-neutral-800 shadow-xl">
            <CardHeader>
              <CardTitle className="text-neutral-900 dark:text-neutral-200 text-2xl md:text-3xl font-extrabold mb-4">
                {dict.title}
              </CardTitle>
              <CardDescription className="text-neutral-600 dark:text-neutral-300 mb-6 leading-relaxed">
                {dict.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                {highlightsWithVisuals.map((highlight, index) => (
                  <HighlightCard key={index} highlight={highlight} />
                ))}
              </div>
            </CardContent>
            <CardFooter className="flex flex-col items-start gap-4">
              <div className="flex items-center gap-4">
                <Button asChild size="lg" className="font-semibold shadow-lg">
                  <Link href="#contact">{dict.cta1}</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="#pricing">{dict.cta2}</Link>
                </Button>
              </div>
              <p className="mt-4 text-xs text-neutral-500 dark:text-neutral-400">
                {dict.quality_assurance}
              </p>
            </CardFooter>
          </Card>
          <Image
            alt={dict.image_alt}
            src="/logo-full.svg"
            width={500}
            height={300}
            className="mx-auto w-64 lg:w-96 drop-shadow-xl drop-shadow-blue-600/30"
          />
        </div>

        <div className="space-y-4">
          <Card className="bg-linear-to-br from-amber-600 to-amber-400 shadow-lg text-white border-none">
            <CardHeader>
              <CardTitle className="font-extrabold text-lg">
                {dict.steps_title}
              </CardTitle>
              <CardDescription className="mt-2 text-sm opacity-95 text-white">
                {dict.steps_description}
              </CardDescription>
            </CardHeader>
          </Card>

          <div className="grid gap-4">
            {stepsWithVisuals.map((step) => (
              <StepCard key={step.number} step={step} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

interface HighlightCardProps {
  highlight: Highlight;
}

export function HighlightCard(props: HighlightCardProps) {
  return (
    <Card
      className={cn(
        "bg-linear-to-br text-white shadow-md border-none",
        props.highlight.gradient
      )}
    >
      <CardHeader className="p-3">
        <CardTitle className="text-xs font-semibold">
          {props.highlight.title}
        </CardTitle>
        <CardDescription className="mt-1 text-sm text-white/90">
          {props.highlight.subtitle}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}

interface StepCardProps {
  step: Step;
}

export function StepCard(props: StepCardProps) {
  const Icon = props.step.icon;
  return (
    <Card className="hover:shadow-xl transition">
      <CardHeader className="flex flex-row gap-3 items-center space-y-0">
        <div
          className={cn(
            "w-12 h-12 rounded-lg flex items-center justify-center bg-linear-to-br text-white text-2xl shrink-0",
            props.step.gradient
          )}
        >
          <Icon className="size-6" />
        </div>
        <div className="flex flex-col items-start gap-0.5">
          <CardTitle className="text-neutral-700 dark:text-neutral-200 font-bold text-base">
            {props.step.number}. {props.step.title}
          </CardTitle>
          <CardDescription className="text-xs text-neutral-500 dark:text-neutral-400">
            ({props.step.duration})
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed text-justify">
          {props.step.description}
        </p>
      </CardContent>
    </Card>
  );
}
