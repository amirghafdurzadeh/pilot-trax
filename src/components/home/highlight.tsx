import { cn } from "@/lib/utils";

interface Highlight {
  title: string;
  subtitle: string;
  gradient: string;
}

interface HighlightCardProps {
  highlight: Highlight;
}

export function HighlightCard(props: HighlightCardProps) {
  return (
    <div
      className={cn(
        "p-3 rounded-xl bg-linear-to-br text-white shadow-md",
        props.highlight.gradient
      )}
    >
      <div className="text-xs font-semibold">{props.highlight.title}</div>
      <div className="mt-1 text-sm">{props.highlight.subtitle}</div>
    </div>
  );
}
