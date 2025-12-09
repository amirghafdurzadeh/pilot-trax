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
import { homeData } from "@/constants/home";

export default function Page() {
  return (
    <main className="w-full">
      <div className="mx-auto min-h-screen">
        <Header />
        <Hero />
        <Features
          features={homeData.features}
          title="ویژگی‌های منحصر به فرد"
          description="تجربه یادگیری بهتر با ابزارهای هوشمند و طراحی مدرن"
        />
        <HowTo highlights={homeData.highlights} steps={homeData.steps} />
        <Plans plans={homeData.plans} />
        <Testimonials testimonials={homeData.testimonials} />
        <FAQ faqs={homeData.faqs} />
        <Contact />
        <Footer />
      </div>
    </main>
  );
}
