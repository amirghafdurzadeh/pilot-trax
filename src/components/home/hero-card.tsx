import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export function HeroCard() {
  return (
    <div className="order-first lg:order-last">
      <div className="w-full aspect-4/3 bg-white dark:bg-neutral-800 rounded-3xl shadow-2xl shadow-blue-500/10 flex items-center justify-center p-6">
        <Card className="w-full border-none shadow-none bg-transparent">
          <CardHeader className="text-center p-0">
            <CardTitle className="font-extrabold text-2xl">
              شبیه‌ساز آزمون
            </CardTitle>
            <CardDescription className="mt-3 text-neutral-600 dark:text-neutral-300 leading-relaxed max-w-sm mx-auto">
              محیطی با توضیح کامل هر سوال + سه سطح ارزیابی — برای یادگیری
              سریع‌تر و مرور هدفمند.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 mt-2 flex justify-center gap-3">
            <Badge
              variant="outline"
              className="text-green-800 border-green-800"
            >
              سبز
            </Badge>
            <Badge
              variant="outline"
              className="text-yellow-800 border-yellow-800"
            >
              زرد
            </Badge>
            <Badge variant="outline" className="text-red-800 border-red-800">
              قرمز
            </Badge>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
