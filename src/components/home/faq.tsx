import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  faqs: FAQItem[];
  dict: {
    title: string;
  };
}

export function FAQ({ faqs, dict }: FAQProps) {
  return (
    <section id="faq" className="max-w-7xl mx-auto px-6 md:px-8 mt-20">
      <h3 className="text-3xl font-extrabold mb-8">{dict.title}</h3>
      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger>
              <h4 className="font-bold text-lg text-right">{faq.question}</h4>
            </AccordionTrigger>
            <AccordionContent>
              <p className="mt-2 text-neutral-600 dark:text-neutral-300 text-sm text-start">
                {faq.answer}
              </p>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </section>
  );
}