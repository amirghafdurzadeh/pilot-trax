import { cn } from "@/lib/utils";

interface StepCardProps {
  icon: React.ComponentType<any>;
  number: number;
  title: string;
  duration: string;
  description: string;
  gradient: string;
}

export function StepCard(props: StepCardProps) {
  const Icon = props.icon;
  return (
    <div className="flex flex-col gap-3 items-start p-5 bg-white dark:bg-neutral-800 rounded-2xl shadow hover:shadow-xl transition">
      <div className="flex gap-3 items-center">
        <div
          className={cn(
            "w-12 h-12 rounded-lg flex items-center justify-center bg-linear-to-br text-white text-2xl shrink-0",
            props.gradient
          )}
        >
          <Icon className="size-6" />
        </div>
        <div className="flex flex-col items-start gap-0.5">
          <h5 className="text-neutral-700 dark:text-neutral-200 font-bold">
            {props.number}. {props.title}
          </h5>
          <span className="text-xs text-neutral-500 dark:text-neutral-400">
            ({props.duration})
          </span>
        </div>
      </div>
      <div>
        <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed text-justify">
          {props.description}
        </p>
      </div>
    </div>
  );
}
