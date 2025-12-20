import { SellingChart } from "@/components/admin/charts/selling-chart";
import { UserChart } from "@/components/admin/charts/user-chart";
import { AppContent } from "@/components/core/app-content";
import { AppHeader } from "@/components/core/app-header";
import { getDictionary, Locale } from "@/lib/dictionaries";

export default async function Page(props: PageProps<"/[lang]/login">) {
  const lang = (await props.params).lang as Locale;
  const dict = await getDictionary(lang);
  return (
    <>
      <AppHeader lang={lang} />
      <AppContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <UserChart
            title="رشد کاربران"
            description="نمایش رشد کاربران در 12 ماه گذشته"
          />
          <SellingChart
            title="رشد فروش"
            description="نمایش رشد فروش در 12 ماه گذشته"
          />
        </div>
      </AppContent>
    </>
  );
}
