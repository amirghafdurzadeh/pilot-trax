import { cn } from "@/lib/utils";

type Feature = {
  title: string;
  text: string;
  icon: React.ComponentType<any>;
  gradient: string;
};

type FeatureCardProps = {
  feature: Feature;
};

export function FeatureCard(props: FeatureCardProps) {
  const Icon = props.feature.icon;
  return (
    <article className="group p-8 bg-linear-to-br from-white to-neutral-50 dark:from-neutral-800 dark:to-neutral-900 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-neutral-100 dark:border-neutral-700 hover:border-blue-400 dark:hover:border-blue-500">
      <div
        className={cn(
          "w-14 h-14 rounded-xl bg-linear-to-br flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform",
          props.feature.gradient
        )}
      >
        <Icon />
      </div>
      <h3 className="font-bold text-lg">{props.feature.title}</h3>
      <p className="mt-3 text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
        {props.feature.text}
      </p>
    </article>
  );
}
