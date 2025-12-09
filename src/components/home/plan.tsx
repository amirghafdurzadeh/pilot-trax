import { CheckIcon } from "lucide-react";
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

interface PlanCardProps {
  title: string;
  description: string;
  features: string[];
  price: string;
  priceLabel: string;
  buttonText: string;
  buttonVariant?: "primary" | "secondary" | "disabled";
  featured?: boolean;
}

export function PlanCard(props: PlanCardProps) {
  const isFeatured = props.featured;

  return (
    <Card
      className={cn("flex flex-col shadow-md", {
        "bg-blue-600 text-white shadow-xl border-blue-600": isFeatured,
        "bg-white dark:bg-neutral-800": !isFeatured,
      })}
    >
      <CardHeader>
        <CardTitle className="font-bold text-xl">{props.title}</CardTitle>
        <CardDescription
          className={cn("mt-2 text-sm leading-relaxed", {
            "text-white/90": isFeatured,
            "text-neutral-600 dark:text-neutral-300": !isFeatured,
          })}
        >
          {props.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <ul
          className={cn("space-y-2 text-sm", {
            "text-white/95": isFeatured,
            "text-neutral-600 dark:text-neutral-300": !isFeatured,
          })}
        >
          {props.features.map((feature, i) => (
            <li key={i} className="flex items-start gap-3">
              <CheckIcon
                className={cn("size-4 mt-0.5 shrink-0", {
                  "text-white": isFeatured,
                  "text-green-600": !isFeatured,
                })}
              />
              <span>{feature}</span>
            </li>
          ))}
        </ul>
      </CardContent>
      <CardFooter className="flex items-center justify-between pt-6 mt-auto">
        <div>
          <div className="text-2xl font-extrabold">{props.price}</div>
          <div
            className={cn("text-xs", {
              "text-white/90": isFeatured,
              "text-neutral-500 dark:text-neutral-400": !isFeatured,
            })}
          >
            {props.priceLabel}
          </div>
        </div>
        {props.buttonVariant === "disabled" ? (
          <Button disabled variant="secondary">
            {props.buttonText}
          </Button>
        ) : (
          <Button
            asChild
            variant={isFeatured ? "secondary" : "default"}
            className={cn("font-semibold", {
              "bg-white text-blue-600 hover:bg-white/90": isFeatured,
            })}
          >
            <Link href="#signup">{props.buttonText}</Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

interface PlansProps {
  plans: PlanCardProps[];
}

export function Plans(props: PlansProps) {
  return (
    <section id="pricing" className="max-w-7xl mx-auto px-6 md:px-8 mt-20">
      <h3 className="text-3xl font-extrabold">پلن‌ها</h3>
      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {props.plans.map((plan, index) => (
          <PlanCard key={index} {...plan} />
        ))}
      </div>
    </section>
  );
}
