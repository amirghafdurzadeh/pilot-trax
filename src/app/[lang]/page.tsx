import {
  Contact,
  FAQ,
  Features,
  Footer,
  Header,
  Hero,
  HowTo,
  Plans,
  Testimonials,
} from "@/components/home";
import { getDictionary } from "@/lib/dictionaries";

export default async function Page(props: PageProps<"/[lang]">) {
  const lang = (await props.params).lang;
  const dict = await getDictionary(lang);

  return (
    <main className="w-full">
      <div className="mx-auto min-h-screen">
        <Header lang={lang} dict={dict} />
        <Hero dict={dict.home.hero} />
        <Features
          features={dict.home.features.items}
          title={dict.home.features.title}
          description={dict.home.features.description}
        />
        <HowTo
          highlights={dict.home.howTo.highlights}
          steps={dict.home.howTo.steps}
          dict={dict.home.howTo}
        />
        <Plans plans={dict.home.plans.items} dict={dict.home.plans} />
        <Testimonials
          testimonials={dict.home.testimonials.items}
          dict={dict.home.testimonials}
        />
        <FAQ faqs={dict.home.faq.items} dict={dict.home.faq} />
        <Contact dict={dict.home.contact} />
        <Footer lang={lang} dict={dict} />
      </div>
    </main>
  );
}
