import { cn } from "@/lib/utils";
import Link from "next/link";

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

const buttonStyles = {
  primary: "px-4 py-2 bg-blue-600 text-white rounded-md shadow font-semibold",
  secondary: "px-4 py-2 bg-white text-blue-600 rounded-md shadow font-semibold",
  disabled:
    "px-4 py-2 bg-neutral-700 text-white rounded-md shadow font-semibold",
};

export function PlanCard(props: PlanCardProps) {
  const Button = props.buttonVariant === "disabled" ? "button" : Link;

  return (
    <div
      className={cn("p-6 rounded-2xl shadow flex flex-col", {
        "bg-blue-600 text-white shadow-xl": props.featured,
        "bg-white dark:bg-neutral-800": !props.featured,
      })}
    >
      <h4 className="font-bold text-xl">{props.title}</h4>
      <p
        className={cn("mt-2 text-sm leading-relaxed", {
          "opacity-90": props.featured,
          "text-neutral-600 dark:text-neutral-300": !props.featured,
        })}
      >
        {props.description}
      </p>
      <ul
        className={cn("mt-4 space-y-2 text-sm", {
          "opacity-95": props.featured,
          "text-neutral-600 dark:text-neutral-300": !props.featured,
        })}
      >
        {props.features.map((feature, i) => (
          <li key={i} className="flex items-start gap-3">
            <span
              className={cn({
                "text-white mt-0.5": props.featured,
                "text-green-600 mt-0.5": !props.featured,
              })}
            >
              ✓
            </span>
            <span>{feature}</span>
          </li>
        ))}
      </ul>
      <div className="mt-auto pt-6 flex items-center justify-between">
        <div>
          <div className="text-2xl font-extrabold">{props.price}</div>
          <div
            className={cn("text-xs", {
              "opacity-90": props.featured,
              "text-neutral-500 dark:text-neutral-400": !props.featured,
            })}
          >
            {props.priceLabel}
          </div>
        </div>
        <Button
          href={"#signup"}
          className={buttonStyles[props.buttonVariant || "primary"]}
        >
          {props.buttonText}
        </Button>
      </div>
    </div>
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