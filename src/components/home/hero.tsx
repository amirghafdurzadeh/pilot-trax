import { HeroCard } from "./hero-card";
import { HeroContent } from "./hero-content";

export function Hero() {
  return (
    <section className="max-w-7xl mx-auto px-6 md:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center pt-12 pb-12">
      <HeroContent />
      <HeroCard />
    </section>
  );
}
