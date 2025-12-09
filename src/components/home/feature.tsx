import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
    <Card className="group hover:shadow-2xl transition-all duration-300 hover:border-blue-400 dark:hover:border-blue-500">
      <CardHeader>
        <div
          className={cn(
            "w-14 h-14 rounded-xl bg-linear-to-br flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform",
            props.feature.gradient
          )}
        >
          <Icon />
        </div>
        <CardTitle>{props.feature.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="leading-relaxed">
          {props.feature.text}
        </CardDescription>
      </CardContent>
    </Card>
  );
}

type FeaturesProps = {
  features: Feature[];
  title: string;
  description: string;
};

export function Features(props: FeaturesProps) {
  return (
    <section id="features" className="max-w-7xl mx-auto px-6 md:px-8 mt-12">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-extrabold">{props.title}</h2>
        <p className="mt-2 text-neutral-600 dark:text-neutral-300">
          {props.description}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {props.features.map((feature, index) => (
          <FeatureCard key={index} feature={feature} />
        ))}
      </div>
    </section>
  );
}
