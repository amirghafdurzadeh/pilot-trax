import Link from "next/link";

import { Button } from "@/components/ui/button";

type Props = {
  dict: {
    title_1: string;
    title_2: string;
    description: string;
    cta1: string;
    cta2: string;
    subtitle: string;
  };
};

export function HeroContent({ dict }: Props) {
  return (
    <div>
      <h2 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight">
        {dict.title_1}
        <br />
        <span className="text-blue-600">{dict.title_2}</span>
      </h2>

      <p
        className="mt-6 text-neutral-600 dark:text-neutral-300 text-lg leading-relaxed max-w-xl"
        dangerouslySetInnerHTML={{ __html: dict.description }}
      />

      <div className="mt-8 flex flex-col sm:flex-row gap-4">
        <Button asChild size="lg" className="text-lg font-semibold shadow-lg">
          <Link href="#contact">{dict.cta1}</Link>
        </Button>
        <Button
          asChild
          variant="outline"
          size="lg"
          className="text-lg font-normal"
        >
          <Link href="#how">{dict.cta2}</Link>
        </Button>
      </div>

      <p className="mt-5 text-xs text-neutral-400">{dict.subtitle}</p>
    </div>
  );
}