interface Testimonial {
  name: string;
  role: string;
  avatar: string;
  testimonial: string;
  rating: number;
}

interface TestimonialCardProps {
  testimonial: Testimonial;
}

export function TestimonialCard(props: TestimonialCardProps) {
  return (
    <div className="p-6 bg-linear-to-br from-white to-neutral-50 dark:from-neutral-800 dark:to-neutral-900 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-neutral-100 dark:border-neutral-700 hover:border-blue-400 dark:hover:border-blue-500">
      <div className="flex items-center gap-4 mb-4">
        <img
          src={props.testimonial.avatar}
          alt={props.testimonial.name}
          className="w-12 h-12 rounded-full object-cover border-2 border-blue-500"
        />
        <div>
          <h4 className="font-bold text-neutral-900 dark:text-white">
            {props.testimonial.name}
          </h4>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            {props.testimonial.role}
          </p>
        </div>
      </div>
      <div className="flex gap-1 mb-3">
        {[...Array(props.testimonial.rating)].map((_, j) => (
          <span key={j} className="text-yellow-500">
            ★
          </span>
        ))}
      </div>
      <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed italic">
        {props.testimonial.testimonial}
      </p>
    </div>
  );
}
