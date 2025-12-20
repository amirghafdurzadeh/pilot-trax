import { StarIcon } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type TestimonialText = {
  name: string;
  role: string;
  testimonial: string;
};

type Testimonial = TestimonialText & {
  avatar: string;
  rating: number;
};

interface TestimonialCardProps {
  testimonial: Testimonial;
}

const testimonialVisuals = [
  {
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
    rating: 5,
  },
  {
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
    rating: 5,
  },
  {
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
    rating: 5,
  },
];

export function TestimonialCard(props: TestimonialCardProps) {
  return (
    <Card className="bg-linear-to-br from-white to-neutral-50 dark:from-neutral-800 dark:to-neutral-900 hover:shadow-2xl transition-all duration-300 hover:border-blue-400 dark:hover:border-blue-500">
      <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
        <Avatar className="w-12 h-12 border-2 border-blue-500">
          <AvatarImage
            src={props.testimonial.avatar}
            alt={props.testimonial.name}
            className="object-cover"
          />
          <AvatarFallback>{props.testimonial.name[0]}</AvatarFallback>
        </Avatar>
        <div>
          <CardTitle className="text-base font-bold text-neutral-900 dark:text-white">
            {props.testimonial.name}
          </CardTitle>
          <CardDescription className="text-xs text-neutral-500 dark:text-neutral-400">
            {props.testimonial.role}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-1 mb-3">
          {[...Array(props.testimonial.rating)].map((_, j) => (
            <StarIcon
              key={j}
              className="size-4 text-yellow-500 fill-yellow-500"
            />
          ))}
        </div>
        <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed italic">
          {props.testimonial.testimonial}
        </p>
      </CardContent>
    </Card>
  );
}

interface TestimonialsProps {
  testimonials: TestimonialText[];
  dict: {
    title: string;
  };
}

export function Testimonials({ testimonials, dict }: TestimonialsProps) {
  const testimonialsWithVisuals = testimonials.map((testimonial, index) => ({
    ...testimonial,
    ...testimonialVisuals[index],
  }));

  return (
    <section id="testimonials" className="max-w-7xl mx-auto px-6 md:px-8 mt-20">
      <h3 className="text-3xl font-extrabold mb-8">{dict.title}</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {testimonialsWithVisuals.map((testimonial, index) => (
          <TestimonialCard key={index} testimonial={testimonial} />
        ))}
      </div>
    </section>
  );
}