import { HeroCard } from "./hero-card";
import { HeroContent } from "./hero-content";

type Props = {
  dict: {
    title_1: string;
    title_2: string;
    description: string;
    cta1: string;
    cta2: string;
    subtitle: string;
    card: {
      title: string;
      description: string;
      badges: {
        green: string;
        yellow: string;
        red: string;
      };
    };
  };
};

export function Hero({ dict }: Props) {
  return (
    <section className="max-w-7xl mx-auto px-6 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center pt-12 pb-12">
      <HeroContent dict={dict} />
      <HeroCard dict={dict.card} />
    </section>
  );
}
