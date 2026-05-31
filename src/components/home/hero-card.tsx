import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type Props = {
  dict: {
    title: string;
    description: string;
    badges: {
      green: string;
      yellow: string;
      red: string;
    };
  };
};

export function HeroCard({ dict }: Props) {
  return (
    <div className="order-first lg:order-last">
      <div className="relative w-full aspect-4/3 bg-white dark:bg-neutral-800 rounded-3xl shadow-2xl shadow-blue-500/10 flex items-center justify-center p-6 overflow-hidden">
        <Card className="w-full border-none shadow-none bg-transparent z-20">
          <CardHeader className="text-center p-0">
            <CardTitle className="font-extrabold text-2xl">
              {dict.title}
            </CardTitle>
            <CardDescription className="mt-3 text-neutral-600 dark:text-neutral-300 leading-relaxed max-w-sm mx-auto">
              {dict.description}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 mt-2 flex justify-center gap-3">
            <Badge
              variant="outline"
              className="text-green-800 border-green-800"
            >
              {dict.badges.green}
            </Badge>
            <Badge
              variant="outline"
              className="text-yellow-800 border-yellow-800"
            >
              {dict.badges.yellow}
            </Badge>
            <Badge variant="outline" className="text-red-800 border-red-800">
              {dict.badges.red}
            </Badge>
          </CardContent>
        </Card>
        <div className="absolute inset-0 z-10 bg-linear-to-t from-white/80 to-white/60 dark:from-neutral-950/92 dark:to-neutral-950/80" />
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ borderRadius: "calc(1.5rem + 1px)" }}
        >
          <source src="/videos/hero.mp4" type="video/mp4" />
        </video>
      </div>
    </div>
  );
}
